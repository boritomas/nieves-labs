const baseUrl = process.env.CTA_BASE_URL || 'https://www.nieves-labs.com';

const publicPages = [
  '/',
  '/contact',
  '/products/answerbrief-ai',
  '/products/tax-buddy',
  '/products/tax-appeal-buddy',
  '/products/interview-coach',
  '/products/workforce-study',
  '/products/mixpilot-ai',
  '/products/nieves-ai-platform',
];

const allowedExternalOrigins = new Set([
  'https://automix-pro-nine.vercel.app',
  'https://www.answer-brief.com',
]);

const forbiddenInternalPrefixes = [
  '/admin',
  '/docs/operations',
  '/command-center',
];

const failures = [];
const checked = [];
const repositoryRoot = new URL('../', import.meta.url);

function normalizePath(path) {
  if (!path.startsWith('/')) return path;
  return new URL(path, baseUrl).toString();
}

function getAttributes(html) {
  const attributes = [];
  const re = /(?:href|action)=["']([^"']*)["']/g;
  let match;

  while ((match = re.exec(html))) {
    attributes.push(match[1]);
  }

  return [...new Set(attributes)];
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\sid=["']${escaped}["']`).test(html);
}

async function fetchHtml(pathOrUrl) {
  const url = normalizePath(pathOrUrl);
  const response = await fetch(url, { redirect: 'manual' });
  const text = await response.text().catch(() => '');

  return { response, text, url };
}

function classifyStaticIssue(href, page) {
  if (href === '' || href === '#') return 'empty or no-op href';
  if (/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(href)) return 'local development URL';
  if (/\/cdn-cgi\/l\/email-protection/.test(href)) return 'Cloudflare email-protection rewrite';
  if (/-[a-z0-9]+-boritomas-projects\.vercel\.app/.test(href)) return 'preview deployment URL';
  if (href.startsWith('/')) {
    const pathname = href.split('#')[0];
    if (forbiddenInternalPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return 'public CTA points to internal route';
    }
  }
  if (href.startsWith('mailto:')) return 'server-rendered mailto link';
  if (href.startsWith('javascript:')) return 'javascript href';
  if (href.startsWith('#') && href.length > 1 && !page.htmlHasAnchor(href.slice(1))) return `missing anchor target ${href}`;

  return undefined;
}

async function validateHref(href, page) {
  const staticIssue = classifyStaticIssue(href, page);

  if (staticIssue) {
    failures.push(`${page.path} -> ${href}: ${staticIssue}`);
    return;
  }

  if (href.startsWith('#')) {
    checked.push(`${page.path} ${href} PASS`);
    return;
  }

  if (href.startsWith('/')) {
    const [pathname, hash] = href.split('#');
    const { response, text } = await fetchHtml(pathname || '/');

    if (response.status >= 400) {
      failures.push(`${page.path} -> ${href}: internal route returned ${response.status}`);
      return;
    }

    if (hash && !hasId(text, hash)) {
      failures.push(`${page.path} -> ${href}: missing anchor target #${hash}`);
      return;
    }

    checked.push(`${page.path} ${href} PASS`);
    return;
  }

  if (/^https?:\/\//.test(href)) {
    const url = new URL(href);
    const origin = url.origin;

    if (!allowedExternalOrigins.has(origin) && origin !== new URL(baseUrl).origin) {
      failures.push(`${page.path} -> ${href}: unapproved external origin`);
      return;
    }

    const response = await fetch(href, { redirect: 'manual' });
    if (response.status >= 400) {
      failures.push(`${page.path} -> ${href}: external route returned ${response.status}`);
      return;
    }

    checked.push(`${page.path} ${href} PASS`);
  }
}

async function validateTransactionalCta() {
  const response = await fetch(new URL('/api/checkout', baseUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productKey: 'tax_buddy',
      packageId: 'organize',
      customerName: 'CTA Smoke Test',
      customerEmail: 'codex-cta-smoke@example.com',
    }),
  });

  const text = await response.text().catch(() => '');
  const leakedInternals = /ENOENT|\/var\/task|process\.cwd|orders\.json|\.data|stack/i.test(text);
  if (leakedInternals) {
    failures.push(`/api/checkout tax_buddy.organize: leaked internal storage failure (${response.status})`);
    return;
  }

  if (process.env.CTA_REQUIRE_TRANSACTION_SUCCESS === '1' && !response.ok) {
    failures.push(`/api/checkout tax_buddy.organize: expected transaction success, got ${response.status}`);
    return;
  }

  if (!response.ok && ![400, 401, 403, 503].includes(response.status)) {
    failures.push(`/api/checkout tax_buddy.organize: unexpected status ${response.status}`);
    return;
  }

  checked.push(`/api/checkout tax_buddy.organize ${response.ok ? 'PASS' : `SAFE_FAIL_${response.status}`}`);
}

async function validateStorageGuards() {
  const { readFile } = await import('node:fs/promises');
  const sourceFiles = [
    'lib/store.ts',
    'lib/durable-storage.ts',
    'app/api/checkout/route.ts',
    'app/api/intake/route.ts',
  ];

  for (const file of sourceFiles) {
    const source = await readFile(new URL(file, repositoryRoot), 'utf8');
    if (source.includes('/var/task')) {
      failures.push(`${file}: contains raw Vercel runtime path`);
    }
  }

  const storeSource = await readFile(new URL('lib/store.ts', repositoryRoot), 'utf8');
  if (!storeSource.includes("storageMode() === 'unconfigured'") || !storeSource.includes('PersistentStorageUnavailableError')) {
    failures.push('lib/store.ts: production storage must fail closed when durable storage is unavailable');
  }

  const intakeSource = await readFile(new URL('app/api/intake/route.ts', repositoryRoot), 'utf8');
  if (!intakeSource.includes("process.env.NODE_ENV === 'production'") || !intakeSource.includes('uploadBufferToDrive')) {
    failures.push('app/api/intake/route.ts: production uploads must use durable object storage');
  }

  checked.push('production storage guard PASS');
}

for (const path of publicPages) {
  const { response, text } = await fetchHtml(path);

  if (response.status >= 400) {
    failures.push(`${path}: page returned ${response.status}`);
    continue;
  }

  if (text.includes('/cdn-cgi/l/email-protection')) {
    failures.push(`${path}: contains Cloudflare email-protection rewrite`);
  }

  const page = {
    path,
    htmlHasAnchor: (id) => hasId(text, id),
  };

  for (const href of getAttributes(text)) {
    if (href.startsWith('/_next') || href === '/favicon.ico') continue;
    await validateHref(href, page);
  }
}

await validateTransactionalCta();
await validateStorageGuards();

if (failures.length > 0) {
  console.error('CTA integrity check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`CTA integrity check passed for ${publicPages.length} pages and ${checked.length} CTA/link targets.`);
