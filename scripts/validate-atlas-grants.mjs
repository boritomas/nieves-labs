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
  'app/atlas/grants/project-pitch/page.tsx',
  'app/atlas/grants/track/page.tsx',
];

const checks = [
  ['grant operator data model exists', atlas.includes('export type AtlasGrantOperator')],
  ['grant opportunity normalized fields exist', atlas.includes('opportunityNumber') && atlas.includes('requiredRegistrations') && atlas.includes('evaluationCriteria')],
  ['NARS classification is modeled', atlas.includes('AtlasNarsClassification')],
  ['selected package stores compliance checklist and budget', atlas.includes('AtlasGrantApplicationPackage') && atlas.includes('complianceChecklist') && atlas.includes('AtlasGrantBudgetItem')],
  ['federal submission evidence model exists', atlas.includes('AtlasGrantSubmissionEvidence') && atlas.includes('federalGrantApplicationsSubmitted')],
  ['NSF Project Pitch model exists', atlas.includes('AtlasNsfProjectPitch') && atlas.includes('fullProposalInvitationRequired')],
  ['federal grant submission evidence captured truthfully', store.includes('federalGrantApplicationsSubmitted: 1') && store.includes("confirmationNumber: '00119518'") && store.includes("validationStatus: 'confirmed'")],
  ['official NSF Project Pitch selected opportunity seeded', store.includes("selectedOpportunityId: 'nsf-sbir-project-pitch-ai'") && store.includes('https://seedfund.nsf.gov/apply/project-pitch/')],
  ['NSF 26-511 remains monitored, not selected', store.includes('nsf-26-511') && store.includes("opportunityNumber: '26-511'") && store.includes("pursueRecommendation: 'Monitor'")],
  ['Grants.gov official source recorded', store.includes('Grants.gov fetchOpportunity id 362551')],
  ['NIH monitor opportunity seeded', store.includes('nih-pa-27-100') && store.includes('PA-27-100')],
  ['PESOSE monitor opportunity seeded', store.includes('nsf-26-506') && store.includes('Pathways to Enable Secure Open-Source Ecosystems')],
  ['post-submission live grant sweep recorded', store.includes('post-submission-26-511-gate') && store.includes('post-submission-nih-not-ready') && store.includes('post-submission-pesose-not-ready')],
  ['NIH remains blocked without health concept', store.includes('Do not submit under the current Nieves Labs evidence package') && store.includes('truthful health, CDC, FDA, biomedical, or public-health R&D concept')],
  ['PESOSE remains blocked without open-source ecosystem evidence', store.includes('approved open-source product, governance plan, and partner/community evidence')],
  ['registration manager tracks founder-only gates', store.includes('SAM.gov entity registration') && store.includes('Grants.gov workspace / AOR')],
  ['application package records submitted NSF pitch', store.includes('furthestSafePoint') && store.includes("status: 'submitted'") && store.includes('NSF Project Pitch submitted')],
  ['Project Pitch founder approval phrase retained', store.includes('I approve the NSF Project Pitch for submission.')],
  ['Project Pitch evaluates at least three concepts', store.includes('evidence-provenance-ai') && store.includes('human-review-regulated-docs') && store.includes('funding-eligibility-reasoning')],
  ['Project Pitch UI exists', component.includes('AtlasNsfProjectPitchReview') && component.includes('generateAtlasNsfProjectPitchMarkdown')],
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
