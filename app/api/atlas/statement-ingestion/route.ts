import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { parseAtlasStatement, statementContentHash } from '@/lib/atlas-statement-ingestion';
import { getAtlasData, updateAtlasDocument } from '@/lib/atlas-store';
import { env } from '@/lib/env';

const bucket = 'atlas-private-documents';
const profileSlug = 'default';

type SupabaseRequestInit = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

function authorized(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  const diagnosticsToken = process.env.ATLAS_DIAGNOSTICS_TOKEN || '';
  return Boolean((env.adminToken && token === env.adminToken) || (diagnosticsToken && token === diagnosticsToken));
}

function supabaseConfig() {
  return {
    url: process.env.ATLAS_SUPABASE_URL || '',
    secretKey: process.env.ATLAS_SUPABASE_SECRET_KEY || process.env.ATLAS_SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

function supabaseReady() {
  const config = supabaseConfig();
  return Boolean(config.url && config.secretKey);
}

async function supabaseRequest<T>(pathName: string, init: SupabaseRequestInit = {}): Promise<T> {
  const { url, secretKey } = supabaseConfig();
  if (!url || !secretKey) throw new Error('Atlas Supabase credentials are not configured.');
  const response = await fetch(`${url.replace(/\/$/, '')}${pathName}`, {
    ...init,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Atlas Supabase request failed (${response.status}): ${text.slice(0, 240)}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function getProfileId() {
  const rows = await supabaseRequest<Array<{ id: string }>>(
    `/rest/v1/atlas_profiles?profile_slug=eq.${encodeURIComponent(profileSlug)}&select=id&limit=1`,
    { method: 'GET' },
  );
  if (!rows.length) throw new Error('Atlas profile has not been initialized in Supabase.');
  return rows[0].id;
}

async function uploadPrivateObject(pathName: string, buffer: Buffer, contentType: string) {
  const { url, secretKey } = supabaseConfig();
  const uploadBody = new Uint8Array(buffer).slice().buffer;
  const response = await fetch(`${url.replace(/\/$/, '')}/storage/v1/object/${bucket}/${pathName}`, {
    method: 'POST',
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': contentType,
      'x-upsert': 'false',
    },
    body: uploadBody,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Atlas private document upload failed (${response.status}): ${text.slice(0, 240)}`);
  }
}

async function deletePrivateObjects(paths: string[]) {
  if (!paths.length) return;
  await supabaseRequest(`/storage/v1/object/${bucket}`, {
    method: 'DELETE',
    body: JSON.stringify({ prefixes: paths }),
  }).catch(() => undefined);
}

async function ingestStatementFile(input: {
  filename: string;
  contentType: string;
  buffer: Buffer;
  source: string;
  synthetic?: boolean;
}) {
  if (!supabaseReady()) {
    throw new Error('Atlas statement ingestion requires Supabase durable storage.');
  }

  const profileId = await getProfileId();
  const now = new Date().toISOString();
  const objectPath = `${input.synthetic ? 'synthetic-smoke' : 'statements'}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${input.filename.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const hash = statementContentHash(input.buffer);
  const parsed = parseAtlasStatement(input.filename, input.buffer);
  const data = await getAtlasData();
  const companyName = data.companyProfile.companyName;

  await uploadPrivateObject(objectPath, input.buffer, input.contentType || 'application/octet-stream');

  const documentRows = await supabaseRequest<Array<{ id: string }>>('/rest/v1/atlas_documents', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      profile_id: profileId,
      document_type: 'bank_statement',
      document_name: input.filename,
      category: 'financial',
      status: 'uploaded',
      storage_bucket: bucket,
      storage_path: objectPath,
      content_hash: hash,
      source_type: input.source,
      verification_status: parsed.transactions.length ? 'pending_review' : 'requires_founder_verification',
      sensitive: true,
      uploaded_by: 'atlas-founder',
      uploaded_at: now,
      metadata: {
        transactionCount: parsed.transactions.length,
        synthetic: Boolean(input.synthetic),
      },
    }),
  });
  const documentId = documentRows[0].id;

  const statementRows = await supabaseRequest<Array<{ id: string }>>('/rest/v1/atlas_bank_statements', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      profile_id: profileId,
      document_id: documentId,
      account_owner_name: companyName,
      statement_start_date: parsed.statementStartDate,
      statement_end_date: parsed.statementEndDate,
      beginning_balance: parsed.beginningBalance,
      ending_balance: parsed.endingBalance,
      total_deposits: parsed.totalDeposits,
      total_withdrawals: parsed.totalWithdrawals,
      fees: parsed.fees,
      transfers: parsed.transfers,
      founder_contributions: parsed.founderContributions,
      potential_revenue: parsed.potentialRevenue,
      potential_personal_expenses: parsed.potentialPersonalExpenses,
      source_type: input.source,
      verification_status: 'pending_founder_review',
      traceability: {
        objectPath,
        hash,
        parser: 'atlas-basic-statement-parser-v1',
      },
    }),
  });
  const statementId = statementRows[0].id;

  await supabaseRequest('/rest/v1/atlas_statement_summaries', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      profile_id: profileId,
      statement_id: statementId,
      months_available: parsed.statementStartDate && parsed.statementEndDate ? 1 : 0,
      average_monthly_deposits: parsed.totalDeposits,
      average_monthly_ending_balance: parsed.endingBalance,
      deposit_consistency: parsed.transactions.length ? 'requires_founder_review' : 'missing',
      commingling_risk: parsed.potentialPersonalExpenses > 0 ? 'needs_attention' : 'requires_founder_review',
      missing_periods: [],
      lender_statement_requirement_fit: 'requires_lender_confirmation',
      summary: 'Atlas parsed this statement for funding-readiness review. Ambiguous accounting classifications require founder confirmation.',
      verification_status: 'pending_founder_review',
    }),
  });

  if (parsed.transactions.length) {
    const transactionRows = await supabaseRequest<Array<{ id: string; external_transaction_id: string }>>('/rest/v1/atlas_transactions', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(parsed.transactions.map((transaction, index) => ({
        profile_id: profileId,
        statement_id: statementId,
        posted_date: transaction.postedDate || null,
        description: transaction.description,
        amount: transaction.amount,
        transaction_type: transaction.amount >= 0 ? 'credit' : 'debit',
        raw_category: transaction.category,
        source_type: input.source,
        source_trace: {
          index,
          parser: 'atlas-basic-statement-parser-v1',
        },
      }))),
    });

    await supabaseRequest('/rest/v1/atlas_transaction_classifications', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(parsed.transactions.map((transaction, index) => ({
        profile_id: profileId,
        transaction_id: transactionRows[index]?.id,
        classification: transaction.category,
        confidence: transaction.confidence,
        requires_founder_review: transaction.category === 'requires_founder_review' || transaction.flags.length > 0,
        flags: transaction.flags,
        reviewer: 'atlas',
        reviewed_at: now,
      })).filter((row) => row.transaction_id)),
    });
  }

  await supabaseRequest('/rest/v1/atlas_audit_events', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      event_type: input.synthetic ? 'atlas_statement_ingestion_smoke' : 'atlas_statement_ingested',
      actor: 'atlas-app',
      summary: input.synthetic ? 'Synthetic Atlas statement ingestion smoke test completed.' : 'Atlas bank statement uploaded and parsed for founder review.',
      metadata: {
        documentId,
        statementId,
        transactionCount: parsed.transactions.length,
        synthetic: Boolean(input.synthetic),
      },
    }),
  });

  if (!input.synthetic) {
    await updateAtlasDocument('bank-statements', {
      completed: true,
      notes: `Latest statement upload parsed ${parsed.transactions.length} transactions and is pending founder review.`,
      updatedAt: now,
    });
  }

  return {
    documentId,
    statementId,
    objectPath,
    transactionCount: parsed.transactions.length,
    totals: {
      deposits: parsed.totalDeposits,
      withdrawals: parsed.totalWithdrawals,
      potentialRevenue: parsed.potentialRevenue,
      potentialPersonalExpenses: parsed.potentialPersonalExpenses,
    },
    classifications: parsed.transactions.reduce<Record<string, number>>((counts, transaction) => {
      counts[transaction.category] = (counts[transaction.category] || 0) + 1;
      return counts;
    }, {}),
  };
}

async function runSmoke() {
  const csv = Buffer.from([
    'Date,Description,Amount',
    '2026-01-03,Stripe customer payment,450.00',
    '2026-01-04,Vercel cloud hosting,-42.00',
    '2026-01-08,Founder capital contribution,1000.00',
    '2026-01-11,Restaurant purchase,-31.25',
    '2026-01-20,Online transfer,-200.00',
  ].join('\n'));
  const result = await ingestStatementFile({
    filename: `codex-smoke-atlas-statement-${Date.now()}.csv`,
    contentType: 'text/csv',
    buffer: csv,
    source: 'codex_storage_smoke_test',
    synthetic: true,
  });

  const transactionIds = await transactionIdsForStatement(result.statementId);
  if (transactionIds.length) {
    await supabaseRequest(`/rest/v1/atlas_transaction_classifications?transaction_id=in.(${transactionIds.join(',')})`, {
      method: 'DELETE',
    }).catch(() => undefined);
  }
  await supabaseRequest(`/rest/v1/atlas_transactions?statement_id=eq.${result.statementId}`, { method: 'DELETE' }).catch(() => undefined);
  await supabaseRequest(`/rest/v1/atlas_statement_summaries?statement_id=eq.${result.statementId}`, { method: 'DELETE' }).catch(() => undefined);
  await supabaseRequest(`/rest/v1/atlas_bank_statements?id=eq.${result.statementId}`, { method: 'DELETE' }).catch(() => undefined);
  await supabaseRequest(`/rest/v1/atlas_documents?id=eq.${result.documentId}`, { method: 'DELETE' }).catch(() => undefined);
  await deletePrivateObjects([result.objectPath]);

  return {
    ...result,
    cleanupAttempted: true,
  };
}

async function transactionIdsForStatement(statementId: string) {
  const rows = await supabaseRequest<Array<{ id: string }>>(
    `/rest/v1/atlas_transactions?statement_id=eq.${statementId}&select=id`,
    { method: 'GET' },
  ).catch(() => []);
  return rows.map((row) => row.id);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  if (url.searchParams.get('smoke') === '1') {
    const result = await runSmoke();
    return NextResponse.json({
      ok: true,
      supabaseConfigured: supabaseReady(),
      smoke: result,
    });
  }
  return NextResponse.json({
    ok: true,
    supabaseConfigured: supabaseReady(),
    bucket,
    supportedFormats: ['csv', 'ofx', 'qfx'],
    pdfSupport: 'metadata_only_pending_ocr_parser',
  });
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A statement file is required.' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await ingestStatementFile({
    filename: file.name,
    contentType: file.type,
    buffer,
    source: 'manual_statement_upload',
  });
  return NextResponse.json({ ok: true, result });
}
