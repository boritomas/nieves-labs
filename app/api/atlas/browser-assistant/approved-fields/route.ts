import { NextResponse } from 'next/server';
import { authorizeAtlasRequest } from '@/lib/atlas-auth';
import { getAtlasData } from '@/lib/atlas-store';
import { calculateUseOfFundsTotal } from '@/lib/atlas';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await authorizeAtlasRequest(request))) {
    return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  const data = await getAtlasData();
  const profile = data.companyProfile;
  const financial = data.financialAssumptions;
  const useOfFundsTotal = calculateUseOfFundsTotal(data.useOfFundsPlan);
  const approvedFundingTarget = profile.fundingTargetMax || data.useOfFundsPlan.selectedAmount || financial.loanAmount || 50000;
  const [founderFirstName, ...founderLastParts] = profile.founderName.split(' ').filter(Boolean);

  return withCors(NextResponse.json({
    product: 'Atlas Browser Assistant',
    generatedAt: new Date().toISOString(),
    security: {
      excludesSensitiveIdentity: true,
      excludesCredentials: true,
      excludesLegalCertifications: true,
      finalSubmissionFounderOnly: true,
    },
    fields: [
      field('legalBusinessName', 'Legal business name', profile.legalBusinessName || profile.companyName, 'companyProfile.legalBusinessName'),
      field('dba', 'DBA', profile.dba || profile.companyName, 'companyProfile.dba'),
      field('businessEmail', 'Business email', profile.businessEmail, 'companyProfile.businessEmail'),
      field('businessPhone', 'Business phone', profile.businessPhone, 'companyProfile.businessPhone'),
      field('website', 'Website', 'https://nieves-labs.com', 'companyProfile.website'),
      field('businessAddress', 'Business address', profile.businessAddress || profile.mailingAddress, 'companyProfile.businessAddress'),
      field('businessZip', 'Business ZIP', extractZip(profile.businessAddress || profile.mailingAddress), 'companyProfile.businessAddress'),
      field('industry', 'Industry', profile.industry, 'companyProfile.industry'),
      field('stateOfFormation', 'State of formation', profile.stateOfFormation, 'companyProfile.stateOfFormation'),
      field('entityType', 'Entity type', profile.entityType, 'companyProfile.entityType', 'requires_confirmation'),
      field('formationDate', 'Formation date', profile.formationDate, 'companyProfile.formationDate', profile.formationDate ? 'approved' : 'missing'),
      field('businessStartDate', 'Business start date', profile.businessStartDate, 'companyProfile.businessStartDate', profile.businessStartDate ? 'approved' : 'missing'),
      field('einVerificationStatus', 'EIN verification status', profile.einVerificationStatus, 'companyProfile.einVerificationStatus'),
      field('businessDescription', 'Business description', profile.businessSummary, 'companyProfile.businessSummary'),
      field('ownershipPercentage', 'Ownership percentage', String(profile.ownershipPercent || 100), 'companyProfile.ownershipPercent'),
      field('founderFirstName', 'Founder first name', founderFirstName || 'Tomas', 'companyProfile.founderName'),
      field('founderLastName', 'Founder last name', founderLastParts.join(' ') || 'Nieves', 'companyProfile.founderName'),
      field('founderTitle', 'Founder title', profile.founderEmployment, 'companyProfile.founderEmployment'),
      field('managementExperience', 'Management experience', profile.founderBackground, 'companyProfile.founderBackground'),
      field('industryExperience', 'Industry experience', profile.founderBackground, 'companyProfile.founderBackground'),
      field('requestedAmount', 'Requested amount', String(approvedFundingTarget), 'companyProfile.fundingTargetMax'),
      field('fundingPurpose', 'Funding purpose', profile.useOfFunds, 'companyProfile.useOfFunds'),
      field('useOfFunds', 'Use of funds', data.useOfFundsPlan.items.map((item) => `${item.category}: $${item.amount} - ${item.notes}`).join('\n'), 'useOfFundsPlan.items'),
      field('repaymentNarrative', 'Repayment narrative', profile.repaymentStrategy, 'companyProfile.repaymentStrategy'),
      field('revenueStage', 'Revenue stage', profile.revenueStage, 'companyProfile.revenueStage'),
      field('planningAssumptions', 'Planning assumptions', `${profile.firstNinetyDayMrrEstimate} first 90 days; ${profile.sixMonthMrrTarget} six-month target; use-of-funds total $${useOfFundsTotal}.`, 'companyProfile + useOfFundsPlan'),
      field('chapterSevenExplanationApproved', 'Approved Chapter 7 explanation', profile.chapterSevenExplanation, 'companyProfile.chapterSevenExplanation', data.chapterSevenWorkflow.founderApproved ? 'approved' : 'requires_confirmation'),
    ].filter((item) => item.value && item.status !== 'missing'),
    documents: data.documents.filter((document) => document.completed).map((document) => ({
      id: document.id,
      label: document.name,
      category: document.category,
      status: 'approved',
      version: document.updatedAt,
      source: `atlas.documents.${document.id}`,
      fileName: `${document.id}.txt`,
      mimeType: 'text/plain',
      content: `${document.name}\n\nApproved Atlas placeholder for lender test upload.\nSource: ${document.notes}\nGenerated: ${new Date().toISOString()}\n`,
    })),
  }));
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

function field(id: string, label: string, value: string, source: string, status: 'approved' | 'requires_confirmation' | 'missing' = 'approved') {
  return { id, label, value, source, status, sensitive: false };
}

function extractZip(address: string) {
  return address.match(/\b\d{5}(?:-\d{4})?\b/)?.[0] || '';
}

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
