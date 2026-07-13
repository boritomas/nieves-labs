import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const source = join(root, '.data', 'atlas.json');
const supabaseUrl = process.env.ATLAS_SUPABASE_URL;
const secretKey = process.env.ATLAS_SUPABASE_SECRET_KEY || process.env.ATLAS_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error('ATLAS_SUPABASE_URL and ATLAS_SUPABASE_SECRET_KEY are required.');
}

const readSource = async () => {
  if (!existsSync(source)) {
    return null;
  }

  return JSON.parse(await readFile(source, 'utf8'));
};

async function supabase(pathName, init = {}) {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}${pathName}`, {
    ...init,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase migration request failed (${response.status}): ${(await response.text()).slice(0, 240)}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

const snapshot = await readSource();
const payload = snapshot || {};

await supabase('/rest/v1/atlas_profiles?on_conflict=profile_slug', {
  method: 'POST',
  headers: {
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify({
    profile_slug: 'default',
    tenant_id: 'nieves-labs',
    snapshot: payload,
    storage_version: 1,
    source_type: snapshot ? 'json_migration' : 'seed_initialization',
    verification_status: 'pending_review',
    founder_approval_status: 'pending_review',
    updated_by: 'atlas-migration',
  }),
});

await supabase('/rest/v1/atlas_audit_events', {
  method: 'POST',
  headers: { Prefer: 'return=minimal' },
  body: JSON.stringify({
    event_type: snapshot ? 'json_migration_completed' : 'seed_profile_initialized',
    actor: 'atlas-migration',
    summary: snapshot
      ? 'Existing Atlas JSON data migrated into Supabase atlas_profiles snapshot.'
      : 'Atlas Supabase profile initialized because no local JSON source existed.',
    metadata: {
      sourceExists: Boolean(snapshot),
      counts: {
        fundingOpportunities: payload.fundingOpportunities?.length || 0,
        documents: payload.documents?.length || 0,
        tasks: payload.tasks?.length || 0,
        packageVersions: payload.packageVersions?.length || 0,
      },
    },
  }),
});

const rows = await supabase('/rest/v1/atlas_profiles?profile_slug=eq.default&select=profile_slug,storage_version,source_type');

console.log(JSON.stringify({
  status: 'migrated',
  sourceExists: Boolean(snapshot),
  profileRows: rows.length,
  counts: {
    fundingOpportunities: payload.fundingOpportunities?.length || 0,
    documents: payload.documents?.length || 0,
    tasks: payload.tasks?.length || 0,
    packageVersions: payload.packageVersions?.length || 0,
  },
}, null, 2));
