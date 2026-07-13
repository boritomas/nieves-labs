import { NextResponse } from 'next/server';
import { updateAtlasDocument } from '@/lib/atlas-store';
import { env } from '@/lib/env';
import { authorizeAtlasRequest } from '@/lib/atlas-auth';

async function authorized(request: Request) {
  return authorizeAtlasRequest(request);
}

export async function PATCH(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
  }

  const document = await updateAtlasDocument(body.id, body.patch || {});
  return NextResponse.json({ document });
}

