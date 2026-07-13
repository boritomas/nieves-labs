import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { authorizeAtlasRequest } from '@/lib/atlas-auth';
import { getAtlasData, recordAtlasEinConfirmation } from '@/lib/atlas-store';

async function authorized(request: Request) {
  if (await authorizeAtlasRequest(request)) return true;
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  const diagnosticsToken = process.env.ATLAS_DIAGNOSTICS_TOKEN || '';
  return Boolean(diagnosticsToken && token === diagnosticsToken);
}

function maskEin(value: string) {
  const clean = value.trim();
  if (!clean) return '';
  const digits = clean.replace(/\D/g, '');
  if (digits.length === 9) return `**-***${digits.slice(-4)}`;
  if (/^\*{2}-\*{3}\d{4}$/.test(clean) || /^\*{2}-\*{7}$/.test(clean)) return clean;
  return 'EIN masked';
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getAtlasData();
  return NextResponse.json({
    einVerificationStatus: data.companyProfile.einVerificationStatus,
    einMasked: data.companyProfile.einMasked || '',
    sourceDocumentName: data.companyProfile.einSourceDocumentName || '',
    sourceDocumentHashPresent: Boolean(data.companyProfile.einSourceDocumentHash),
    einVerifiedAt: data.companyProfile.einVerifiedAt || '',
    fullEinExposed: false,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const filename = String(body.filename || '').trim();
  const contentHash = String(body.contentHash || '').trim();
  const size = Number(body.size || 0);

  if (!filename || !contentHash || !size) {
    return NextResponse.json({ error: 'filename, contentHash, and size are required' }, { status: 400 });
  }

  const data = await recordAtlasEinConfirmation({
    filename,
    contentHash,
    size,
    noticeType: String(body.noticeType || 'IRS EIN confirmation notice'),
    noticeDate: String(body.noticeDate || ''),
    maskedEin: maskEin(String(body.maskedEin || '')),
    businessName: String(body.businessName || ''),
    mailingAddress: String(body.mailingAddress || ''),
    nameControl: String(body.nameControl || ''),
    sourcePath: body.sourcePath ? '[private-source-redacted]' : '',
  });

  return NextResponse.json({
    ok: true,
    einVerificationStatus: data.companyProfile.einVerificationStatus,
    einMasked: data.companyProfile.einMasked,
    sourceDocumentName: data.companyProfile.einSourceDocumentName,
    sourceDocumentHashPresent: Boolean(data.companyProfile.einSourceDocumentHash),
    fullEinExposed: false,
  });
}
