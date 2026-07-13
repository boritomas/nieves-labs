import { NextResponse } from 'next/server';
import { getAtlasData, getAtlasStorageProvider } from '@/lib/atlas-store';
import { env } from '@/lib/env';

function authorized(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  return Boolean(env.adminToken && token === env.adminToken);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
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
