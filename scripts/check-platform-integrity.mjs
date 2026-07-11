import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
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

if (failures.length) {
  console.error('Platform integrity check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Platform integrity check passed for ${requiredProducts.length} products and ${apiRoutes.length} API routes.`);
