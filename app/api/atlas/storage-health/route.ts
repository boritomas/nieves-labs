import { NextResponse } from 'next/server';
import { getAtlasData, getAtlasStorageProvider } from '@/lib/atlas-store';
import { env } from '@/lib/env';
import { authorizeAtlasRequest } from '@/lib/atlas-auth';

async function authorized(request: Request) {
  if (await authorizeAtlasRequest(request)) return true;
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  const diagnosticsToken = process.env.ATLAS_DIAGNOSTICS_TOKEN || '';
  return Boolean(diagnosticsToken && token === diagnosticsToken);
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const provider = getAtlasStorageProvider();
  const data = await getAtlasData();

  return NextResponse.json({
    storageProvider: provider,
    supabaseConfigured: Boolean(process.env.ATLAS_SUPABASE_URL && (process.env.ATLAS_SUPABASE_SECRET_KEY || process.env.ATLAS_SUPABASE_SERVICE_ROLE_KEY)),
    jsonFallbackActive: provider === 'json',
    profileSlug: 'default',
    counts: {
      fundingOpportunities: data.fundingOpportunities.length,
      documents: data.documents.length,
      tasks: data.tasks.length,
      packageVersions: data.packageVersions.length,
    },
    timestamp: new Date().toISOString(),
  });
}
