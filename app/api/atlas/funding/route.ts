import { NextResponse } from 'next/server';
import { deleteAtlasFundingOpportunity, upsertAtlasFundingOpportunity } from '@/lib/atlas-store';
import { env } from '@/lib/env';

function authorized(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  return Boolean(env.adminToken && token === env.adminToken);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const opportunity = await upsertAtlasFundingOpportunity(body);
  return NextResponse.json({ opportunity });
}

export async function DELETE(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Funding opportunity id is required' }, { status: 400 });
  }

  await deleteAtlasFundingOpportunity(id);
  return NextResponse.json({ ok: true });
}

