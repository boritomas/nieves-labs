import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function sha256(relativePath) {
  return createHash('sha256').update(readFileSync(join(root, relativePath))).digest('hex');
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(join(root, dir))) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue;
    const relative = join(dir, name);
    const absolute = join(root, relative);
    if (statSync(absolute).isDirectory()) entries.push(...walk(relative));
    else entries.push(relative);
  }
  return entries;
}

const products = read('lib/products.ts');
const checkoutRoute = read('app/api/checkout/route.ts');
const intakeRoute = read('app/api/intake/route.ts');
const stripeWebhookRoute = read('app/api/webhooks/stripe/route.ts');
const productPage = read('app/products/[slug]/page.tsx');
const brandLogo = read('components/BrandLogo.tsx');

const requiredProducts = [
  'answerbrief_ai',
  'tax_buddy',
  'tax_appeal_buddy',
  'interview_coach',
  'workforce_study',
  'mixpilot_ai',
  'nieves_ai_platform',
];

for (const productKey of requiredProducts) {
  assert(products.includes(`key: '${productKey}'`), `Missing registered product: ${productKey}`);
}

assert(products.includes("architecture: 'external_application'"), 'Product registry must identify external operational applications.');
assert(products.includes("baseUrl: 'https://www.answer-brief.com'"), 'AnswerBrief AI must point to the operational AnswerBrief application.');
assert(products.includes("baseUrl: 'https://automix-pro-nine.vercel.app'"), 'MixPilot AI must point to its operational application.');
assert(products.includes("publicAvailability: definition.publicAvailability || 'waitlist'"), 'Unverified products must default to waitlist.');
assert(checkoutRoute.includes('portfolio and marketplace site') && checkoutRoute.includes('status: 410'), 'Checkout route must be disabled in Nieves Labs.');
assert(intakeRoute.includes('does not collect operational product intake') && intakeRoute.includes('status: 410'), 'Intake route must be disabled in Nieves Labs.');
assert(stripeWebhookRoute.includes('handled by each operational product application') && stripeWebhookRoute.includes('status: 410'), 'Stripe webhook route must be disabled in Nieves Labs.');
assert(!productPage.includes('CheckoutForm'), 'Product pages must not render Nieves Labs checkout forms.');
assert(!productPage.includes('Purchase package'), 'Product pages must not expose purchase CTAs handled by Nieves Labs.');
assert(brandLogo.includes('/brand/master/nieves-labs-approved-monogram.png'), 'BrandLogo must import the approved locked monogram asset.');
assert(brandLogo.includes('/brand/master/nieves-labs-approved-horizontal-lockup.png'), 'BrandLogo must import the approved locked horizontal lockup asset.');
assert(!brandLogo.includes('<svg') && !brandLogo.includes('<path'), 'BrandLogo must not reconstruct the parent logo with inline SVG paths.');
assert(existsSync(join(root, 'public/brand/master/nieves-labs-approved-monogram.png')), 'Missing locked monogram asset.');
assert(existsSync(join(root, 'public/brand/master/nieves-labs-approved-horizontal-lockup.png')), 'Missing locked horizontal lockup asset.');
assert(existsSync(join(root, 'docs/brand/nieves-labs-approved-reference-board.png')), 'Missing approved reference board.');
assert(sha256('public/brand/master/nieves-labs-approved-monogram.png') === '4b1fde44ec76b12c9bf62d7a67c76d61c32285b6ef6a2f25d3d56a892bc0d967', 'Locked monogram checksum changed.');
assert(sha256('public/brand/master/nieves-labs-approved-horizontal-lockup.png') === '2bd90d0e867f54fff0a075158199b1fac0dceb466ee0b0e94ee3f5ac20581dd3', 'Locked horizontal lockup checksum changed.');
assert(sha256('docs/brand/nieves-labs-approved-reference-board.png') === 'b9a1f209cb83feca18f0354269e10db7e6f90744e44b692acc3f18725595b82f', 'Approved reference board checksum changed.');
assert(!existsSync(join(root, 'public/brand/candidate')), 'Deprecated reconstructed candidate logo directory must not exist.');
assert(!existsSync(join(root, 'app/brand-logo-review')), 'Deprecated reconstructed logo review route must not exist.');

const apiRoutes = walk('app/api').filter((file) => file.endsWith('route.ts'));
const productSpecificCheckoutRoutes = apiRoutes.filter((file) => /checkout/i.test(file) && file !== 'app/api/checkout/route.ts');
assert(productSpecificCheckoutRoutes.length === 0, `Unexpected product-specific checkout routes: ${productSpecificCheckoutRoutes.join(', ')}`);

for (const secretName of ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'GMAIL_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN', 'OPENAI_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) {
  assert(!productPage.includes(secretName), `Public product page must not depend on ${secretName}`);
}

const sourceFiles = walk('app').concat(walk('lib'), walk('components')).filter((file) => /\.(ts|tsx)$/.test(file));
const leakedInternalCopy = sourceFiles.filter((file) => {
  const content = read(file);
  return /Operations Runbook|Required Environment Variables|Credential Status/.test(content) && !file.includes('/admin/') && !file.includes('/docs/operations/');
});
assert(leakedInternalCopy.length === 0, `Internal operations copy appears outside protected/admin docs: ${leakedInternalCopy.join(', ')}`);

const reconstructedLogoCopy = sourceFiles.filter((file) => {
  if (file === 'components/ProductIdentity.tsx') return false;
  const content = read(file);
  return /nl-frame|nl-stroke|nl-cut|nl-shine|<span className="brand-mark">NL<\/span>/.test(content);
});
assert(reconstructedLogoCopy.length === 0, `Deprecated reconstructed parent logo code found: ${reconstructedLogoCopy.join(', ')}`);

if (failures.length) {
  console.error('Platform integrity check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Platform integrity check passed for ${requiredProducts.length} products and ${apiRoutes.length} API routes.`);
