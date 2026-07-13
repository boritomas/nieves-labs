import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const source = join(root, '.data', 'atlas.json');
const outDir = join(root, '..', '..', 'outputs', 'atlas-backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

if (!existsSync(source)) {
  console.log(JSON.stringify({
    status: 'skipped',
    reason: '.data/atlas.json does not exist',
  }, null, 2));
  process.exit(0);
}

const buffer = await readFile(source);
const checksum = createHash('sha256').update(buffer).digest('hex');
const data = JSON.parse(buffer.toString('utf8'));
const backupPath = join(outDir, `atlas-json-${timestamp}.json`);
const manifestPath = join(outDir, `atlas-json-${timestamp}.manifest.json`);

await mkdir(outDir, { recursive: true });
await writeFile(backupPath, buffer);
await writeFile(manifestPath, JSON.stringify({
  source,
  backupPath,
  checksumSha256: checksum,
  createdAt: new Date().toISOString(),
  counts: {
    fundingOpportunities: data.fundingOpportunities?.length || 0,
    documents: data.documents?.length || 0,
    risks: data.risks?.length || 0,
    tasks: data.tasks?.length || 0,
    applicationSections: data.applicationSections?.length || 0,
    packageVersions: data.packageVersions?.length || 0,
    importedFields: data.importState?.importedFields?.length || 0,
    evidenceGaps: data.importState?.evidenceGaps?.length || 0,
  },
}, null, 2));

console.log(JSON.stringify({
  status: 'backed_up',
  backupPath,
  manifestPath,
  checksumSha256: checksum,
}, null, 2));
