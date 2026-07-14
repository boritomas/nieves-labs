#!/usr/bin/env node

const baseUrl = (process.env.ATLAS_TEST_BASE || 'https://nieves-labs.com').replace(/\/$/, '');
const email = process.env.ATLAS_TEST_EMAIL || process.env.ATLAS_FOUNDER_EMAIL || '';
const password = process.env.ATLAS_TEST_PASSWORD || '';
const token = process.env.ATLAS_DIAGNOSTICS_TOKEN || process.env.ADMIN_TOKEN || '';

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { response, body };
}

function readCookie(setCookie) {
  if (!setCookie) return '';
  return setCookie
    .split(',')
    .map((value) => value.trim().split(';')[0])
    .filter((value) => value.startsWith('atlas_session='))
    .join('; ');
}

let cookie = '';

if (email && password) {
  const { response, body } = await request('/api/atlas/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok || !body?.ok) {
    throw new Error(`Atlas login failed with HTTP ${response.status}`);
  }

  cookie = readCookie(response.headers.get('set-cookie') || '');
}

const diagnosticsPath = token
  ? `/api/atlas/storage-health?token=${encodeURIComponent(token)}`
  : '/api/atlas/storage-health';
const { response, body } = await request(diagnosticsPath, {
  headers: cookie ? { Cookie: cookie } : {},
});

if (!response.ok) {
  throw new Error(`Atlas storage diagnostics failed with HTTP ${response.status}`);
}

if (body?.storageProvider !== 'supabase') {
  throw new Error(`Atlas storage provider is ${body?.storageProvider || 'unknown'}, expected supabase.`);
}

if (body?.jsonFallbackActive) {
  throw new Error('Atlas JSON fallback is active in the target environment.');
}

if (!body?.supabaseConfigured) {
  throw new Error('Atlas Supabase environment is not configured in the target environment.');
}

console.log('Atlas production storage validation passed.');
console.log(JSON.stringify({
  baseUrl,
  storageProvider: body.storageProvider,
  supabaseConfigured: body.supabaseConfigured,
  jsonFallbackActive: body.jsonFallbackActive,
  counts: body.counts,
  timestamp: body.timestamp,
}, null, 2));
