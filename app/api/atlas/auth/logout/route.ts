import { NextResponse } from 'next/server';
import { clearAtlasSessionCookie } from '@/lib/atlas-auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAtlasSessionCookie(response);
  return response;
}
