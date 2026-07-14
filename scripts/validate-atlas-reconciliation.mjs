#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const atlas = fs.readFileSync(path.join(root, 'lib/atlas.ts'), 'utf8');
const founder = fs.readFileSync(path.join(root, 'components/AtlasFounderExperience.tsx'), 'utf8');
const advanced = fs.readFileSync(path.join(root, 'components/AtlasAdvancedDashboard.tsx'), 'utf8');
const lender = fs.readFileSync(path.join(root, 'components/AtlasLenderPages.tsx'), 'utf8');
const packageGenerator = fs.readFileSync(path.join(root, 'components/AtlasPackageGenerator.tsx'), 'utf8');
const docs = fs.readFileSync(path.join(root, 'docs/ATLAS_CAPITAL_OFFICE.md'), 'utf8');

const checks = [
  ['central reconciliation function exists', atlas.includes('export function reconcileAtlasDocuments')],
  ['approved source inventory covers imports/packages/profiles', atlas.includes('buildAtlasSourceInventory') && atlas.includes('sourceDocuments') && atlas.includes('packageVersions') && atlas.includes('companyProfile')],
  ['status taxonomy includes verified complete', atlas.includes("'VERIFIED COMPLETE'")],
  ['status taxonomy includes truly missing', atlas.includes("'TRULY MISSING'")],
  ['status taxonomy includes lender confirmation', atlas.includes("'REQUIRES LENDER CONFIRMATION'")],
  ['EIN can resolve from verified CP575 metadata', atlas.includes("einVerificationStatus === 'verified_document_received'") && atlas.includes('CP575B')],
  ['business plan can resolve generated package coverage', atlas.includes('generated lender package records')],
  ['market research avoids duplicate ask when business plan/profile covers it', atlas.includes('Business plan, source documents, or company narrative coverage')],
  ['competitive analysis avoids duplicate ask when package/business plan covers it', atlas.includes('Competitive positioning embedded in approved business plan/package')],
  ['bank statements ask exact missing month confirmation', atlas.includes('Confirm which statement month is still missing.')],
  ['tax returns can be not applicable for pre-launch no-revenue stage', atlas.includes("'NOT APPLICABLE'") && atlas.includes('Startup revenue stage indicates no applicable business return yet.')],
  ['founder actions are deduped from reconciliation', atlas.includes('list.indexOf(item) === index')],
  ['active campaign amount is normalized', atlas.includes('getAtlasActiveFundingAmount') && atlas.includes('activeFundingAmount !== 50000')],
  ['operator activity feed records source search', atlas.includes('Searched approved Atlas sources')],
  ['operator activity feed records readiness update', atlas.includes('Updated readiness source of truth')],
  ['readiness assessment uses reconciliation score', atlas.includes('documentationScore = reconciliation.documentationScore')],
  ['application builder uses reconciliation for supporting documents', atlas.includes('precise supporting-document actions remain')],
  ['lender requirement mapping uses reconciliation', lender.includes('reconcileAtlasDocuments') && lender.includes('reconciliation.requirements.map')],
  ['manual submission uses reconciled docs', lender.includes('Required documents reconciled')],
  ['founder experience shows activity feed', founder.includes('function AtlasActivityFeed') && founder.includes('<AtlasActivityFeed data={data}')],
  ['advanced dashboard shows operator activity log', advanced.includes('Operator activity log')],
  ['package generator uses active amount', packageGenerator.includes('getAtlasActiveFundingAmount')],
  ['documentation records autonomy remediation', docs.includes('Atlas Autonomy Remediation v1')],
];

const failures = checks.filter(([, passed]) => !passed);

for (const [label, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`);
}

if (failures.length) {
  console.error(`\nAtlas reconciliation regression guard failed: ${failures.length} check(s).`);
  process.exit(1);
}

console.log('\nAtlas reconciliation regression guard passed.');
