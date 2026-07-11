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
const workflow = read('lib/workflows.ts');
const promptRegistry = read('lib/prompt-registry.ts');

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
  assert(promptRegistry.includes(`'${productKey}'`), `Missing prompt registry record for: ${productKey}`);
}

assert(products.includes('workflow: definition.workflow || defaultWorkflow(definition)'), 'Product registry must apply default workflow definitions.');
assert(products.includes('intakeSchema: definition.intakeSchema'), 'Product registry must normalize intake schemas.');
assert(checkoutRoute.includes('startPlatformCheckout'), 'Checkout route must use the shared platform commerce entry point.');
assert(intakeRoute.includes('product.intakeSchema.questions'), 'Intake route must use product intake schema.');
assert(workflow.includes('workflowKey: product.workflow.key'), 'Workflow logs must include product workflow metadata.');
assert(workflow.includes('validateGeneratedDeliverable'), 'Workflow must run a deliverable QA check.');

const apiRoutes = walk('app/api').filter((file) => file.endsWith('route.ts'));
const productSpecificCheckoutRoutes = apiRoutes.filter((file) => /checkout/i.test(file) && file !== 'app/api/checkout/route.ts');
assert(productSpecificCheckoutRoutes.length === 0, `Unexpected product-specific checkout routes: ${productSpecificCheckoutRoutes.join(', ')}`);

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
