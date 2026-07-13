#!/usr/bin/env node
import { readFile } from 'fs/promises';

const store = await readFile(new URL('../lib/atlas-store.ts', import.meta.url), 'utf8');
const atlas = await readFile(new URL('../lib/atlas.ts', import.meta.url), 'utf8');
const founderExperience = await readFile(new URL('../components/AtlasFounderExperience.tsx', import.meta.url), 'utf8');
const campaign = await readFile(new URL('../components/AtlasFundingCampaignOS.tsx', import.meta.url), 'utf8');
const campaignRoute = await readFile(new URL('../app/atlas/funding-campaign/page.tsx', import.meta.url), 'utf8');
const source = `${store}\n${atlas}\n${founderExperience}\n${campaign}\n${campaignRoute}`;

const requiredSnippets = [
  ['50k loan amount', 'loanAmount: 50000'],
  ['50k use of funds amount', 'selectedAmount: 50000'],
  ['PeopleFund primary lender', "id: 'peoplefund-primary'"],
  ['BCL secondary lender', "id: 'bcl-of-texas-secondary'"],
  ['LiftFund paused record', "id: 'liftfund-paused'"],
  ['DreamSpring submitted path', "id: 'dreamspring-submitted'"],
  ['SBA Lender Match blocker', "id: 'sba-lender-match-blocked'"],
  ['Funding Campaign OS route', 'Funding Campaign OS'],
  ['Five-step campaign model', 'buildAtlasFundingCampaignOS'],
  ['EIN verification status field', 'einVerificationStatus'],
  ['Full EIN excluded field', 'Full EIN intentionally excluded'],
  ['Founder-only boundary', 'credit authorization must be entered only by Tomas'],
  ['Founder-only sensitive guardrail', 'SSN/ITIN'],
  ['Business readiness EIN ready state', "einStatus: AtlasBusinessReadinessStatus"],
];

const failures = requiredSnippets.filter(([, snippet]) => !source.includes(snippet));

const amounts = Array.from(store.matchAll(/amount: (\d+)/g)).map((match) => Number(match[1]));
const useOfFundsStart = store.indexOf('useOfFundsPlan:');
const useOfFundsEnd = store.indexOf('fundingOpportunities:', useOfFundsStart);
const useOfFundsBlock = store.slice(useOfFundsStart, useOfFundsEnd);
const useOfFundsTotal = Array.from(useOfFundsBlock.matchAll(/amount: (\d+)/g)).reduce((sum, match) => sum + Number(match[1]), 0);

if (useOfFundsTotal !== 50000) {
  failures.push(['use-of-funds total', `Expected $50,000, found $${useOfFundsTotal}`]);
}

if (amounts.some((amount) => Number.isNaN(amount))) {
  failures.push(['numeric amount parse', 'Found an unparsable amount in atlas-store.ts']);
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  requestedAmount: 50000,
  useOfFundsTotal,
  submittedLender: 'DreamSpring',
  preservedBlockers: ['SBA Lender Match', 'PeopleFund', 'BCL of Texas', 'LiftFund'],
  pausedLenderPreserved: 'LiftFund',
  fullEinStored: false,
}, null, 2));
