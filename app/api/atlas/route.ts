import { NextResponse } from 'next/server';
import { getAtlasData, updateAtlasFinancialAssumptions } from '@/lib/atlas-store';
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

  return NextResponse.json(await getAtlasData());
}

export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  if (body.type === 'financial_assumptions') {
    const assumptions = await updateAtlasFinancialAssumptions(body.patch || {});
    return NextResponse.json({ assumptions });
  }

  return NextResponse.json({ error: 'Unsupported Atlas update' }, { status: 400 });
}

