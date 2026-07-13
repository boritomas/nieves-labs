import { NextResponse } from 'next/server';
import { deleteAtlasFundingOpportunity, upsertAtlasFundingOpportunity } from '@/lib/atlas-store';
import { env } from '@/lib/env';
import { authorizeAtlasRequest } from '@/lib/atlas-auth';

async function authorized(request: Request) {
  return authorizeAtlasRequest(request);
}

export async function POST(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const opportunity = await upsertAtlasFundingOpportunity(body);
  return NextResponse.json({ opportunity });
}

export async function DELETE(request: Request) {
  if (!(await authorized(request))) {
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

