#!/usr/bin/env node
import { readFile } from 'fs/promises';

const audit = await readFile(new URL('../docs/ATLAS_AUTONOMOUS_FUNDING_OPERATOR_V1_AUDIT.md', import.meta.url), 'utf8');
const atlas = await readFile(new URL('../lib/atlas.ts', import.meta.url), 'utf8');
const campaign = await readFile(new URL('../components/AtlasFundingCampaignOS.tsx', import.meta.url), 'utf8');

const required = [
  ['traceability matrix', 'Requirements Traceability Matrix'],
  ['verified complete status', 'VERIFIED COMPLETE'],
  ['partial status', 'PARTIAL'],
  ['external blocker status', 'VERIFIED EXTERNAL BLOCKER'],
  ['DreamSpring adapter status', 'ADAPT-001'],
  ['PeopleFund blocker', 'ADAPT-002'],
  ['LiftFund blocker', 'ADAPT-003'],
  ['BCL blocker', 'ADAPT-004'],
  ['SBA blocker', 'ADAPT-005'],
  ['human intervention metrics doc', 'Human Intervention Budget'],
  ['current campaign state doc', 'Active lender: DreamSpring'],
  ['strict not complete conclusion', 'not yet fully mission-complete'],
  ['audit type', 'AtlasFundingOperatorAudit'],
  ['audit builder', 'buildAtlasFundingOperatorAudit'],
  ['campaign UI audit', 'Automation audit'],
  ['duplicate question metric', 'duplicateQuestionCount'],
  ['autofill metric', 'autofillPercentage'],
];

const source = `${audit}\n${atlas}\n${campaign}`;
const failures = required.filter(([, snippet]) => !source.includes(snippet));

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  matrix: 'present',
  finalStatus: 'verified_hard_blocker_for_live_lender_adapters',
  activeLender: 'DreamSpring',
}, null, 2));
