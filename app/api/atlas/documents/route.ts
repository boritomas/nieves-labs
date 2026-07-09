import { NextResponse } from 'next/server';
import { updateAtlasDocument } from '@/lib/atlas-store';
import { env } from '@/lib/env';

function authorized(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  return Boolean(env.adminToken && token === env.adminToken);
}

export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
  }

  const document = await updateAtlasDocument(body.id, body.patch || {});
  return NextResponse.json({ document });
}

