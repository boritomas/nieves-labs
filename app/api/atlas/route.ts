import { NextResponse } from 'next/server';
import {
  getAtlasData,
  updateAtlasChapterSevenWorkflow,
  updateAtlasCompanyProfile,
  updateAtlasFinancialAssumptions,
  updateAtlasPersonalFinancialProfile,
  updateAtlasUseOfFundsPlan,
  upsertAtlasPackageVersion,
} from '@/lib/atlas-store';
import { authorizeAtlasRequest } from '@/lib/atlas-auth';

async function authorized(request: Request) {
  return authorizeAtlasRequest(request);
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(await getAtlasData());
}

export async function PATCH(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  if (body.type === 'financial_assumptions') {
    const assumptions = await updateAtlasFinancialAssumptions(body.patch || {});
    return NextResponse.json({ assumptions });
  }

  if (body.type === 'company_profile') {
    const profile = await updateAtlasCompanyProfile(body.patch || {});
    return NextResponse.json({ profile });
  }

  if (body.type === 'personal_financial_profile') {
    const profile = await updateAtlasPersonalFinancialProfile(body.patch || {});
    return NextResponse.json({ profile });
  }

  if (body.type === 'chapter_7_workflow') {
    const workflow = await updateAtlasChapterSevenWorkflow(body.patch || {});
    return NextResponse.json({ workflow });
  }

  if (body.type === 'use_of_funds_plan') {
    const plan = await updateAtlasUseOfFundsPlan(body.patch || {});
    return NextResponse.json({ plan });
  }

  if (body.type === 'package_version') {
    const packageVersion = await upsertAtlasPackageVersion(body.patch || {});
    return NextResponse.json({ packageVersion });
  }

  return NextResponse.json({ error: 'Unsupported Atlas update' }, { status: 400 });
}
