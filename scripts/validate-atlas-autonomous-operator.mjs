import { readFile } from 'node:fs/promises';

const files = {
  atlas: await readFile(new URL('../lib/atlas.ts', import.meta.url), 'utf8'),
  founder: await readFile(new URL('../components/AtlasFounderExperience.tsx', import.meta.url), 'utf8'),
  packageJson: await readFile(new URL('../package.json', import.meta.url), 'utf8'),
};

const checks = [
  ['autonomous operator state model', 'AtlasAutonomousOperatorState'],
  ['funding employee agent model', 'AtlasAutonomousAgent'],
  ['founder-only queue model', 'AtlasFounderQueueItem'],
  ['learning event model', 'AtlasLearningEvent'],
  ['FTTF KPI modeled', 'Founder Time To Funding'],
  ['operator builder exists', 'buildAtlasAutonomousOperatorState'],
  ['funding discovery agent exists', 'funding-discovery-agent'],
  ['eligibility agent exists', 'eligibility-agent'],
  ['company knowledge agent exists', 'company-knowledge-agent'],
  ['application agent exists', 'application-agent'],
  ['browser automation agent exists', 'browser-automation-agent'],
  ['follow-up agent exists', 'follow-up-agent'],
  ['self-healing agent exists', 'self-healing-agent'],
  ['founder home asks what Atlas is doing', 'What Atlas is doing'],
  ['founder home shows waiting queue', 'Waiting on founder'],
  ['founder home shows completed memory', 'What Atlas completed'],
  ['watchdog script registered', '"watchdog"'],
];

const failures = checks.filter(([, needle]) => !Object.values(files).some((content) => content.includes(needle)));

for (const [label] of checks) {
  console.log(`${failures.some(([failed]) => failed === label) ? 'FAIL' : 'PASS'} ${label}`);
}

if (failures.length) {
  console.error(`\nAtlas Autonomous Funding Operator V2 guard failed: ${failures.length} check(s).`);
  process.exit(1);
}

console.log('\nAtlas Autonomous Funding Operator V2 guard passed.');
