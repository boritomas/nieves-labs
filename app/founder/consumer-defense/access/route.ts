import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const ACCESS_KEY_HASH = '61b4eeaa987a3b70ff21ec36c0f2cc05b5d74f95c6d77c389c34f02c254e3227';
const COOKIE_NAME = 'nieves_founder_access';
const COOKIE_VALUE = 'consumer-defense-v1';

function matchesAccessKey(value: string) {
  const supplied = createHash('sha256').update(value).digest();
  const expected = Buffer.from(ACCESS_KEY_HASH, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key') || '';
  const destination = new URL('/founder/consumer-defense', request.url);

  if (!matchesAccessKey(key)) {
    destination.searchParams.set('access', 'invalid');
    return NextResponse.redirect(destination);
  }

  const response = NextResponse.redirect(destination);
  response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
