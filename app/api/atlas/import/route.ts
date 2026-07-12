import { NextResponse } from 'next/server';
import { runAtlasImport } from '@/lib/atlas-import';
import { env } from '@/lib/env';
import { getAtlasData, saveAtlasImportResult, updateAtlasImportState } from '@/lib/atlas-store';

function authorized(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || request.headers.get('x-admin-token') || '';
  return Boolean(env.adminToken && token === env.adminToken);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getAtlasData();
  return NextResponse.json({ importState: data.importState });
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action || 'scan';
  const data = await getAtlasData();

  if (['scan', 'preview', 'import'].includes(action)) {
    const importState = await runAtlasImport(data, action);
    if (action === 'import') {
      const saved = await saveAtlasImportResult(importState, true);
      return NextResponse.json({
        ok: true,
        action,
        importState: saved.importState,
        atlasData: saved,
      });
    }
    const saved = await updateAtlasImportState(importState);
    return NextResponse.json({
      ok: true,
      action,
      importState: saved,
    });
  }

  if (['approve-field', 'reject-field', 'defer-field', 'mark-assumption'].includes(action)) {
    const fieldId = String(body.fieldId || '');
    const nextStatus = action === 'approve-field'
      ? 'approved'
      : action === 'reject-field'
        ? 'rejected'
        : action === 'mark-assumption'
          ? 'assumption'
          : 'deferred';
    const updatedState = await updateAtlasImportState({
      importedFields: data.importState.importedFields.map((field) => field.id === fieldId ? {
        ...field,
        verificationStatus: nextStatus,
        founderApproved: nextStatus === 'approved',
      } : field),
      founderReviewQueue: data.importState.founderReviewQueue.map((item) => item.importedFieldId === fieldId ? {
        ...item,
        status: nextStatus,
      } : item),
    });
    return NextResponse.json({ ok: true, importState: updatedState });
  }

  return NextResponse.json({ error: 'Unsupported import action' }, { status: 400 });
}
