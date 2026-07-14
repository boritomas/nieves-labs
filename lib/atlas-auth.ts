import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { env } from './env';

export type AtlasRole = 'founder_admin' | 'internal_admin' | 'founder_user' | 'read_only';

export type AtlasSession = {
  email: string;
  name: string;
  roles: AtlasRole[];
  issuedAt: number;
  expiresAt: number;
};

const atlasSessionCookie = 'atlas_session';
const sessionTtlSeconds = 60 * 60 * 24 * 14;

export function getAtlasAuthEnv() {
  return {
    sessionSecret: process.env.ATLAS_SESSION_SECRET || '',
    founderEmail: process.env.ATLAS_FOUNDER_EMAIL || '',
    founderPasswordHash: process.env.ATLAS_FOUNDER_PASSWORD_HASH || '',
    founderName: process.env.ATLAS_FOUNDER_NAME || 'Tomas Nieves',
  };
}

export function getAtlasSessionConfigStatus() {
  const authEnv = getAtlasAuthEnv();
  return {
    sessionSecretConfigured: Boolean(authEnv.sessionSecret),
    founderEmailConfigured: Boolean(authEnv.founderEmail),
    founderPasswordConfigured: Boolean(authEnv.founderPasswordHash),
  };
}

export function isSafeAtlasReturnTo(value: string | null | undefined) {
  return Boolean(value && value.startsWith('/atlas') && !value.startsWith('//') && !value.includes('://'));
}

export function atlasLoginUrl(returnTo: string) {
  const safeReturnTo = isSafeAtlasReturnTo(returnTo) ? returnTo : '/atlas';
  return `/atlas/login?returnTo=${encodeURIComponent(safeReturnTo)}`;
}

export function redirectToAtlasLogin(returnTo: string): never {
  redirect(atlasLoginUrl(returnTo));
}

export async function getAtlasSession(): Promise<AtlasSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(atlasSessionCookie)?.value || '';
  return verifyAtlasSessionToken(raw);
}

export async function getAtlasPageAccess(token = '', requiredRoles: AtlasRole[] = ['founder_admin', 'founder_user']) {
  const session = await getAtlasSession();
  if (session && hasAtlasRole(session, requiredRoles)) {
    return { authorized: true, session, emergencyToken: '' };
  }

  if (env.adminToken && token === env.adminToken) {
    return {
      authorized: true,
      emergencyToken: token,
      session: {
        email: 'emergency-admin',
        name: 'Emergency Admin',
        roles: ['internal_admin', 'founder_admin'] as AtlasRole[],
        issuedAt: Date.now(),
        expiresAt: Date.now() + sessionTtlSeconds * 1000,
      },
    };
  }

  return { authorized: false, session: null, emergencyToken: '' };
}

export async function authorizeAtlasRequest(request: Request, requiredRoles: AtlasRole[] = ['founder_admin', 'founder_user']) {
  const session = await getAtlasSession();
  if (session && hasAtlasRole(session, requiredRoles)) return true;

  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  return Boolean(env.adminToken && token === env.adminToken);
}

export function hasAtlasRole(session: AtlasSession, requiredRoles: AtlasRole[]) {
  return session.roles.some((role) => requiredRoles.includes(role));
}

export function createAtlasSessionToken(input: Pick<AtlasSession, 'email' | 'name' | 'roles'>) {
  if (!getAtlasAuthEnv().sessionSecret) {
    throw new Error('ATLAS_SESSION_SECRET is not configured.');
  }

  const issuedAt = Date.now();
  const session: AtlasSession = {
    ...input,
    issuedAt,
    expiresAt: issuedAt + sessionTtlSeconds * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function setAtlasSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(atlasSessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionTtlSeconds,
  });
}

export function clearAtlasSessionCookie(response: NextResponse) {
  response.cookies.set(atlasSessionCookie, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function verifyAtlasPassword(password: string) {
  const configured = getAtlasAuthEnv().founderPasswordHash;
  if (!configured) return false;

  const [algorithm, salt, expected] = configured.split(':');
  if (!salt || !expected) return false;

  const actual = algorithm === 'pbkdf2-sha256'
    ? hashPassword(password, salt)
    : algorithm === 'sha256'
      ? createHmac('sha256', salt).update(password).digest('hex')
      : '';
  if (!actual) return false;
  return safeEqual(actual, expected);
}

export function createAtlasPasswordHash(password: string) {
  const salt = randomBytes(24).toString('hex');
  return `pbkdf2-sha256:${salt}:${hashPassword(password, salt)}`;
}

function verifyAtlasSessionToken(raw: string): AtlasSession | null {
  if (!raw || !getAtlasAuthEnv().sessionSecret) return null;
  const [payload, signature] = raw.split('.');
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AtlasSession;
    if (!session.email || !Array.isArray(session.roles) || Number(session.expiresAt) < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function sign(payload: string) {
  return createHmac('sha256', getAtlasAuthEnv().sessionSecret).update(payload).digest('base64url');
}

function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 210000, 32, 'sha256').toString('hex');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
