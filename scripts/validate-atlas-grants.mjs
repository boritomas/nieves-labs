#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const atlas = fs.readFileSync(path.join(root, 'lib/atlas.ts'), 'utf8');
const store = fs.readFileSync(path.join(root, 'lib/atlas-store.ts'), 'utf8');
const component = fs.readFileSync(path.join(root, 'components/AtlasGrantOperator.tsx'), 'utf8');
const nav = fs.readFileSync(path.join(root, 'components/AtlasFounderExperience.tsx'), 'utf8');
const requiredRoutes = [
  'app/atlas/grants/page.tsx',
  'app/atlas/grants/profile/page.tsx',
  'app/atlas/grants/opportunities/page.tsx',
  'app/atlas/grants/[opportunity]/page.tsx',
  'app/atlas/grants/[opportunity]/application/page.tsx',
  'app/atlas/grants/track/page.tsx',
];

const checks = [
  ['grant operator data model exists', atlas.includes('export type AtlasGrantOperator')],
  ['grant opportunity normalized fields exist', atlas.includes('opportunityNumber') && atlas.includes('requiredRegistrations') && atlas.includes('evaluationCriteria')],
  ['NARS classification is modeled', atlas.includes('AtlasNarsClassification')],
  ['selected package stores compliance checklist and budget', atlas.includes('AtlasGrantApplicationPackage') && atlas.includes('complianceChecklist') && atlas.includes('AtlasGrantBudgetItem')],
  ['official NSF selected opportunity seeded', store.includes('nsf-26-511') && store.includes("opportunityNumber: '26-511'")],
  ['Grants.gov official source recorded', store.includes('Grants.gov fetchOpportunity id 362551')],
  ['NIH monitor opportunity seeded', store.includes('nih-pa-27-100') && store.includes('PA-27-100')],
  ['PESOSE monitor opportunity seeded', store.includes('nsf-26-506') && store.includes('Pathways to Enable Secure Open-Source Ecosystems')],
  ['registration manager tracks founder-only gates', store.includes('SAM.gov entity registration') && store.includes('Grants.gov workspace / AOR')],
  ['application package stops at founder gate', store.includes('furthestSafePoint') && store.includes('founder_gate')],
  ['duplicate question count tracked as zero', store.includes('duplicateQuestionCount: 0')],
  ['human effort metrics are tracked', store.includes('founderTimeMinutes') && store.includes('reusePercentage')],
  ['competitor findings are captured', store.includes('Instrumentl') && store.includes('Grantable')],
  ['founder-facing grant component exists', component.includes('AtlasGrantHome') && component.includes('AtlasGrantApplication')],
  ['founder nav links grants', nav.includes('/atlas/grants')],
  ...requiredRoutes.map((route) => [`route exists: ${route}`, fs.existsSync(path.join(root, route))]),
];

const failures = checks.filter(([, pass]) => !pass);
for (const [label, pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'} ${label}`);
if (failures.length) {
  console.error(`\nAtlas grant regression guard failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log('\nAtlas grant regression guard passed.');
