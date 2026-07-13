import { NextResponse } from 'next/server';
import {
  createAtlasSessionToken,
  getAtlasSessionConfigStatus,
  isSafeAtlasReturnTo,
  setAtlasSessionCookie,
  verifyAtlasPassword,
} from '@/lib/atlas-auth';
import { env } from '@/lib/env';

export async function POST(request: Request) {
  const config = getAtlasSessionConfigStatus();
  if (!config.sessionSecretConfigured || !config.founderEmailConfigured || !config.founderPasswordConfigured) {
    return NextResponse.json({ error: 'Atlas login is not configured.' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const returnTo = isSafeAtlasReturnTo(String(body.returnTo || '')) ? String(body.returnTo) : '/atlas';

  if (email !== env.atlasFounderEmail.toLowerCase() || !verifyAtlasPassword(password)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = createAtlasSessionToken({
    email,
    name: env.atlasFounderName,
    roles: ['founder_admin'],
  });
  const response = NextResponse.json({ ok: true, returnTo });
  setAtlasSessionCookie(response, token);
  return response;
}
