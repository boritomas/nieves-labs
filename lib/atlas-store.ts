import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  atlasApplicationSectionIds,
  type AtlasData,
  type AtlasApplicationSection,
  type AtlasChapterSevenWorkflow,
  type AtlasDocument,
  type AtlasFinancialAssumptions,
  type AtlasFundingOpportunity,
  type AtlasImportState,
  type AtlasImportedField,
  type AtlasPackageStatus,
  type AtlasPackageVersion,
  type AtlasPersonalFinancialProfile,
  type AtlasTask,
  type AtlasUseOfFundsPlan,
  calculateReadinessScores,
  generateAtlasPackage,
  getAtlasApplicationSectionTitle,
  atlasFounderApprovalKeys,
} from './atlas';

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'atlas.json');
const atlasProfileSlug = 'default';
const atlasTenantId = 'nieves-labs';

type AtlasStorageProvider = 'json' | 'supabase';
type AtlasSupabaseRequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

const now = new Date().toISOString();

export const emptyAtlasImportState: AtlasImportState = {
  sourceDocuments: [],
  extractedSections: [],
  importedFields: [],
  fieldConflicts: [],
  fieldVersions: [],
  importRuns: [],
  importErrors: [],
  founderReviewQueue: [],
  stalenessFlags: [],
  evidenceGaps: [],
  lastScanAt: '',
  lastImportAt: '',
};

const seedData: AtlasData = {
  companyProfile: {
    id: 'atlas_company_profile',
    companyName: 'Nieves Labs',
    legalBusinessName: 'Nieves Labs',
    dba: 'Nieves Labs',
    entityType: 'Requires founder or state portal verification',
    stateOfFormation: 'Texas',
    formationDate: '',
    businessStartDate: '',
    ein: '',
    einMasked: '',
    einVerificationStatus: 'missing',
    einNoticeType: '',
    einNoticeDate: '',
    einSourceDocumentName: '',
    einSourceDocumentHash: '',
    einSourceDocumentSize: 0,
    einVerifiedAt: '',
    nameControl: '',
    businessAddress: '',
    mailingAddress: '',
    naicsCode: 'Requires verification',
    businessEmail: 'info@nieves-labs.com',
    businessPhone: '',
    website: 'https://nieves-labs.com',
    state: 'Texas',
    industry: 'AI software and automation',
    timeInBusiness: 'Less than 2 years',
    currentRevenue: 0,
    currentMrr: 2500,
    customers: 0,
    businessStage: 'pre-launch / near-launch',
    productName: 'Nieves AI Platform',
    moduleName: 'Atlas Capital Office',
    fundingTargetMin: 25000,
    fundingTargetMax: 50000,
    preferredFundingTypes: ['SBA Microloan', 'CDFI'],
    revenueStage: 'pre-launch / near-launch',
    firstNinetyDayMrrEstimate: '$1,500 to $5,000',
    sixMonthMrrTarget: '$10,000 to $20,000',
    primaryUseOfFunds: [
      'Production readiness',
      'App Store launch',
      'Cloud/API costs',
      'Marketing',
      'Legal/admin',
      'Contractor support',
      'Working capital',
    ],
    currentStage: 'DreamSpring application under review',
    nextAction: 'Monitor DreamSpring response within three business days, preserve evidence, and prepare follow-up documents if requested.',
    businessSummary: 'Nieves Labs builds practical AI products and automation workflows for professionals, founders, and small teams. The Nieves AI Platform organizes product workflows, intake, fulfillment, admin visibility, and operational automation across the company portfolio.',
    fundingRequest: 'Nieves Labs is preparing a $50,000 small-business loan request focused on SBA Microloan and CDFI options.',
    useOfFunds: 'Funds will support production readiness, mobile launch preparation, cloud/API usage, marketing, legal/admin needs, contractor support, and working capital while the product portfolio reaches recurring revenue.',
    revenueAssumptions: 'Initial 90-day MRR is estimated at $1,500 to $5,000, with a six-month target range of $10,000 to $20,000 as products move from launch candidate to early traction.',
    repaymentStrategy: 'Repayment will be supported by recurring subscription and productized-service revenue, conservative burn control, disciplined use of funds, and owner oversight through Atlas.',
    founderBackground: 'Tomas Nieves is building Nieves Labs as a practical AI products company focused on real workflows, clear deliverables, and operations-first implementation.',
    riskMitigation: 'The capital request remains conservative, tied to specific production and launch activities, and supported by a recurring revenue model, professional operating background, and clear business plan.',
    chapterSevenExplanation: 'A recent Chapter 7 bankruptcy may affect underwriting. Atlas keeps this risk explicit so the package can address it directly with a conservative request, transparent explanation, stable professional background, launch traction, and disciplined fund-use plan.',
    founderName: 'Tomas Nieves',
    ownershipPercent: 100,
    founderEmployment: 'Founder / operator',
    personalCreditRange: 'To be confirmed by founder',
    bankruptcyStatus: 'Recent Chapter 7 disclosed for lender review',
    existingDebt: 0,
    stableIncome: 'Professional background and founder operating income to be documented.',
    timeline: 'DreamSpring application submitted; next action is response monitoring and document-request readiness.',
    versionHistory: [
      'Release 1.0 master profile seeded for SBA Microloan / CDFI preparation.',
      'Release 1.2 funding campaign lessons captured from DreamSpring submission and lender failover workflow.',
    ],
  },
  financialAssumptions: {
    id: 'atlas_financial_assumptions',
    startingMrr: 2500,
    monthlyCustomerGrowth: 18,
    averageSubscriptionPrice: 49,
    monthlyChurn: 4,
    cloudApiCosts: 650,
    marketingBudget: 1200,
    contractorDevSupport: 1800,
    legalAdminCosts: 450,
    loanAmount: 50000,
    loanTermMonths: 72,
    estimatedInterestRate: 10.5,
    startingCashBalance: 3000,
  },
  personalFinancialProfile: {
    id: 'atlas_personal_financial_profile',
    assets: 0,
    liabilities: 0,
    annualIncome: 0,
    monthlyExpenses: 0,
    debtObligations: 0,
    valuesHidden: true,
    updatedAt: now,
  },
  chapterSevenWorkflow: {
    id: 'atlas_chapter_7_workflow',
    filingDate: '',
    dischargeDate: '',
    status: 'Disclosed; final dates and supporting documents pending founder confirmation.',
    explanation: 'A recent Chapter 7 bankruptcy is disclosed directly so underwriters can evaluate the request with full context. The funding request remains conservative and tied to business readiness, launch, compliance, and working-capital needs.',
    supportingDocuments: ['Discharge documentation', 'Founder explanation letter', 'Updated personal financial statement'],
    founderApproved: false,
    updatedAt: now,
  },
  useOfFundsPlan: {
    id: 'atlas_use_of_funds_plan',
    selectedAmount: 50000,
    customAmount: 50000,
    items: [
      { id: 'product-development', category: 'Product Development', amount: 12000, notes: 'Production hardening and launch-ready product workflow completion.' },
      { id: 'cloud-costs', category: 'Cloud Costs', amount: 5000, notes: 'Hosting, storage, observability, and deployment infrastructure.' },
      { id: 'ai-api-costs', category: 'AI/API Costs', amount: 6000, notes: 'OpenAI/API usage for product validation and fulfillment workflows.' },
      { id: 'app-store-release', category: 'App Store Release', amount: 5000, notes: 'Mobile build, submission, compliance, and release preparation.' },
      { id: 'marketing', category: 'Marketing', amount: 9000, notes: 'Launch campaigns, content, local outreach, and customer acquisition testing.' },
      { id: 'legal', category: 'Legal', amount: 4000, notes: 'Legal, accounting, administrative, and compliance support.' },
      { id: 'contractors', category: 'Contractors', amount: 7000, notes: 'Specialized contractor support for engineering, creative, and operations.' },
      { id: 'working-capital', category: 'Working Capital', amount: 2000, notes: 'Short-term operating cushion for launch period.' },
    ],
    updatedAt: now,
  },
  fundingOpportunities: [
    {
      id: 'dreamspring-submitted',
      fundingSource: 'DreamSpring',
      lenderName: 'DreamSpring',
      type: 'CDFI',
      targetAmount: 50000,
      status: 'submitted',
      deadline: 'Rolling',
      contact: 'DreamSpring borrower portal',
      website: 'https://www.dreamspring.org/',
      applicationUrl: 'https://flare.dreamspring.org/',
      contactName: 'DreamSpring lending team',
      contactEmail: 'REQUIRES LENDER CONFIRMATION',
      phone: 'REQUIRES LENDER CONFIRMATION',
      fitScore: 94,
      requirements: 'Submitted application moved to lender review. Future requirements depend on DreamSpring underwriting requests and founder-only verification steps.',
      nextFollowUpDate: '2026-07-16',
      lastContactedDate: '2026-07-13',
      statusNotes: 'Application submitted and under review. DreamSpring displayed that it will respond within 3 business days.',
      notes: 'Production evidence captured in the workspace outputs folder. Do not delete the lender proof page or evidence until founder review is complete.',
      nextAction: 'Watch for DreamSpring response, document requests, or underwriting follow-up; prepare uploaded document list and response packet.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sba-lender-match-blocked',
      fundingSource: 'SBA Lender Match',
      lenderName: 'U.S. Small Business Administration',
      type: 'SBA Microloan',
      targetAmount: 50000,
      status: 'follow_up',
      deadline: 'Rolling',
      contact: 'SBA Lender Match / MySBA support',
      website: 'https://www.sba.gov/funding-programs/loans/lender-match',
      applicationUrl: 'https://lending.sba.gov/',
      contactName: 'SBA support',
      contactEmail: 'REQUIRES SBA ACCOUNT RESOLUTION',
      phone: 'REQUIRES SBA ACCOUNT RESOLUTION',
      fitScore: 78,
      requirements: 'SBA account registration must be resolved before Lender Match can proceed. Founder-only account/loan-number questions may be required.',
      nextFollowUpDate: 'After SBA account resolution',
      lastContactedDate: '2026-07-13',
      statusNotes: 'Registration blocked with an active-prior-loan/SBA loan number validation message.',
      notes: 'Do not retry the same registration loop. Escalate to SBA support or founder-only account review before resuming.',
      nextAction: 'Create an SBA account-resolution checklist before attempting Lender Match again.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'peoplefund-primary',
      fundingSource: 'PeopleFund',
      lenderName: 'PeopleFund',
      type: 'CDFI',
      targetAmount: 50000,
      status: 'follow_up',
      deadline: 'Rolling',
      contact: 'PeopleFund loan intake',
      website: 'https://peoplefund.org/get-a-loan/',
      applicationUrl: 'https://peoplefund.org/get-a-loan/',
      contactName: 'PeopleFund lending team',
      contactEmail: 'REQUIRES LENDER CONFIRMATION',
      phone: '1-888-222-0017',
      fitScore: 88,
      requirements: 'Official page confirms flexible loans for small businesses, start-ups, and nonprofits across Texas. Exact bank statement, bankruptcy, collateral, and document requirements require lender confirmation.',
      nextFollowUpDate: 'After DreamSpring response or if DreamSpring declines',
      lastContactedDate: '2026-07-13',
      statusNotes: 'Account creation/login path blocked because the portal indicated an account may already exist, while reset flow did not resolve cleanly.',
      notes: 'Keep as a fallback, but do not loop on account creation. Escalate to lender support/contact if DreamSpring does not proceed.',
      nextAction: 'Use account-resolution playbook before attempting another PeopleFund portal session.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bcl-of-texas-secondary',
      fundingSource: 'BCL of Texas',
      lenderName: 'BCL of Texas',
      type: 'CDFI',
      targetAmount: 50000,
      status: 'declined',
      deadline: 'Rolling',
      contact: 'BCL lending inquiry',
      website: 'https://bcloftexas.org/lending/small-businesses',
      applicationUrl: 'https://bcloftexas.org/lending/small-businesses',
      contactName: 'BCL lending specialist',
      contactEmail: 'REQUIRES LENDER CONFIRMATION',
      phone: '512-912-9884',
      fitScore: 82,
      requirements: 'Official page lists small-business loans up to $50,000, inquiry and consultation first, then application invitation. Exact eligibility requires lender confirmation.',
      nextFollowUpDate: '',
      lastContactedDate: '2026-07-13',
      statusNotes: 'Prescreen/consultation path indicated lending opportunities were not available at this time.',
      notes: 'Do not retry unless BCL changes the prescreen result or founder receives direct lender guidance.',
      nextAction: 'Keep decline reason for campaign history; do not spend additional cycles on this path right now.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'liftfund-paused',
      fundingSource: 'LiftFund',
      lenderName: 'LiftFund',
      type: 'SBA Microloan',
      targetAmount: 50000,
      status: 'follow_up',
      deadline: 'Rolling',
      contact: 'LiftFund borrower portal',
      website: 'https://www.liftfund.com/apply-now',
      applicationUrl: 'https://los.liftfund.com/v1/lf-borrower/secure/application/borrower-on-boarding/0x19995af111cf9c70',
      contactName: 'LiftFund intake',
      contactEmail: 'info@liftfund.com',
      phone: '210-226-3664',
      fitScore: 72,
      requirements: 'Prior live application indicated business/personal bank statements and additional documents for requests over $35,000. Current portal progress is paused because founder-only EIN/entity/start-date fields are required.',
      nextFollowUpDate: 'After DreamSpring response or account recovery',
      lastContactedDate: '2026-07-13',
      statusNotes: 'Paused due to login/password-reset issue and founder-only field requirements.',
      notes: 'Do not delete. Preserve completed non-sensitive fields and URL for future account recovery.',
      nextAction: 'Resume only after portal access is recovered and founder-only consent/identity fields can be completed by Tomas.',
      createdAt: now,
      updatedAt: now,
    },
  ],
  documents: [
    ['business-plan', 'Business plan', 'financial', true, true, 'Core lender narrative and operating plan.'],
    ['executive-summary', 'Executive summary', 'financial', true, true, 'One to two page lender overview.'],
    ['formation-documents', 'Formation documents', 'legal', false, true, 'Entity registration and state documents.'],
    ['ein', 'EIN', 'legal', false, true, 'Federal employer identification confirmation.'],
    ['operating-agreement', 'Operating agreement', 'legal', false, true, 'Company governance and ownership document.'],
    ['financial-projections', 'Financial projections', 'financial', true, true, '12-month model and funding assumptions.'],
    ['personal-financial-statement', 'Personal financial statement', 'financial', false, true, 'Founder financial snapshot for underwriting.'],
    ['bank-statements', 'Bank statements', 'financial', false, true, 'Recent business or personal statements if requested.'],
    ['tax-returns', 'Tax returns', 'financial', false, true, 'Most recent available returns.'],
    ['founder-resume', 'Founder resume', 'founder', true, true, 'Professional background and operating experience.'],
    ['product-screenshots', 'Product screenshots', 'product', true, true, 'Screens from live modules and launch candidates.'],
    ['market-research', 'Market research', 'market', false, true, 'Customer segments and competitive positioning.'],
    ['competitive-analysis', 'Competitive analysis', 'market', false, true, 'Alternatives and differentiation.'],
  ].map(([id, name, category, completed, required, notes]) => ({
    id: id as string,
    name: name as string,
    category: category as AtlasDocument['category'],
    completed: completed as boolean,
    required: required as boolean,
    notes: notes as string,
    updatedAt: now,
  })),
  risks: [
    {
      id: 'chapter-7-underwriting',
      title: 'Recent Chapter 7 bankruptcy may affect underwriting',
      severity: 'high',
      mitigation: 'Use a conservative funding request, provide clear explanation, show stable professional background, document launch traction, and demonstrate disciplined use of funds.',
      owner: 'Tomas Nieves',
      status: 'in_progress',
    },
    {
      id: 'prelaunch-revenue',
      title: 'Revenue is pre-launch / near-launch',
      severity: 'medium',
      mitigation: 'Tie funding to specific readiness milestones and show 90-day and six-month MRR targets with conservative assumptions.',
      owner: 'Tomas Nieves',
      status: 'in_progress',
    },
  ],
  tasks: [
    { id: 'complete-vault', title: 'Complete required document vault items', area: 'Documents', status: 'in_progress', dueDate: 'Next 14 days', owner: 'Tomas Nieves' },
    { id: 'validate-model', title: 'Validate 12-month financial model assumptions', area: 'Financial Model', status: 'in_progress', dueDate: 'Next 7 days', owner: 'Tomas Nieves' },
    { id: 'prepare-sba-package', title: 'Prepare lender-ready SBA loan package narrative', area: 'SBA Package', status: 'not_started', dueDate: 'Next 21 days', owner: 'Tomas Nieves' },
    { id: 'contact-cdfi', title: 'Contact target CDFI about eligibility and underwriting criteria', area: 'Funding Tracker', status: 'not_started', dueDate: 'Next 10 days', owner: 'Tomas Nieves' },
    { id: 'chapter-7-note', title: 'Draft Chapter 7 explanation and mitigation note', area: 'Due Diligence', status: 'in_progress', dueDate: 'Next 7 days', owner: 'Tomas Nieves' },
  ],
  applicationSections: atlasApplicationSectionIds.map((id) => ({
    id,
    title: getAtlasApplicationSectionTitle(id),
    reviewed: ['business_information', 'funding_request', 'use_of_funds'].includes(id),
    notes: '',
    updatedAt: now,
  })),
  packageVersions: [],
  importState: emptyAtlasImportState,
  readinessScores: {
    id: 'readiness_scores',
    capitalReadiness: 0,
    productReadiness: 0,
    documentationReadiness: 0,
    applicationReadiness: 0,
    overallReadiness: 0,
    breakdown: {
      requiredDocuments: 0,
      financialAssumptions: 0,
      fundingTracker: 0,
      dueDiligenceTasks: 0,
      riskMitigation: 0,
      applicationSections: 0,
    },
    updatedAt: now,
  },
};

function withScores(data: AtlasData): AtlasData {
  const normalized = normalizeAtlasData(data);
  return {
    ...normalized,
    readinessScores: calculateReadinessScores({
      companyProfile: normalized.companyProfile,
      financialAssumptions: normalized.financialAssumptions,
      personalFinancialProfile: normalized.personalFinancialProfile,
      chapterSevenWorkflow: normalized.chapterSevenWorkflow,
      useOfFundsPlan: normalized.useOfFundsPlan,
      fundingOpportunities: normalized.fundingOpportunities,
      documents: normalized.documents,
      risks: normalized.risks,
      tasks: normalized.tasks,
      applicationSections: normalized.applicationSections,
      packageVersions: normalized.packageVersions,
      importState: normalized.importState,
    }),
  };
}

function normalizeAtlasData(data: AtlasData): AtlasData {
  const timestamp = new Date().toISOString();
  const applicationSections = atlasApplicationSectionIds.map((id) => {
    const existing = data.applicationSections?.find((section) => section.id === id);
    return {
      id,
      title: existing?.title || getAtlasApplicationSectionTitle(id),
      reviewed: Boolean(existing?.reviewed),
      notes: existing?.notes || '',
      updatedAt: existing?.updatedAt || timestamp,
    };
  }) as AtlasApplicationSection[];
  const existingFundingOpportunities = data.fundingOpportunities || [];
  const existingFundingIds = new Set(existingFundingOpportunities.map((opportunity) => opportunity.id));
  const fundingOpportunities = [
    ...seedData.fundingOpportunities.filter((opportunity) => !existingFundingIds.has(opportunity.id)),
    ...existingFundingOpportunities,
  ];

  return {
    ...seedData,
    ...data,
    companyProfile: {
      ...seedData.companyProfile,
      ...data.companyProfile,
      versionHistory: data.companyProfile?.versionHistory?.length ? data.companyProfile.versionHistory : seedData.companyProfile.versionHistory,
    },
    personalFinancialProfile: {
      ...seedData.personalFinancialProfile,
      ...data.personalFinancialProfile,
    },
    chapterSevenWorkflow: {
      ...seedData.chapterSevenWorkflow,
      ...data.chapterSevenWorkflow,
      supportingDocuments: data.chapterSevenWorkflow?.supportingDocuments?.length ? data.chapterSevenWorkflow.supportingDocuments : seedData.chapterSevenWorkflow.supportingDocuments,
    },
    useOfFundsPlan: {
      ...seedData.useOfFundsPlan,
      ...data.useOfFundsPlan,
      items: data.useOfFundsPlan?.items?.length ? data.useOfFundsPlan.items : seedData.useOfFundsPlan.items,
    },
    fundingOpportunities: (fundingOpportunities.length ? fundingOpportunities : seedData.fundingOpportunities).map((opportunity) => ({
      ...opportunity,
      lenderName: opportunity.lenderName || opportunity.fundingSource,
      website: opportunity.website || '',
      applicationUrl: opportunity.applicationUrl || '',
      contactName: opportunity.contactName || opportunity.contact || '',
      contactEmail: opportunity.contactEmail || '',
      phone: opportunity.phone || '',
      fitScore: Number(opportunity.fitScore) || 50,
      requirements: opportunity.requirements || '',
      nextFollowUpDate: opportunity.nextFollowUpDate || '',
      lastContactedDate: opportunity.lastContactedDate || '',
      statusNotes: opportunity.statusNotes || '',
    })),
    applicationSections,
    packageVersions: data.packageVersions || [],
    importState: {
      ...emptyAtlasImportState,
      ...(data.importState || {}),
      sourceDocuments: data.importState?.sourceDocuments || [],
      extractedSections: data.importState?.extractedSections || [],
      importedFields: data.importState?.importedFields || [],
      fieldConflicts: data.importState?.fieldConflicts || [],
      fieldVersions: data.importState?.fieldVersions || [],
      importRuns: data.importState?.importRuns || [],
      importErrors: data.importState?.importErrors || [],
      founderReviewQueue: data.importState?.founderReviewQueue || [],
      stalenessFlags: data.importState?.stalenessFlags || [],
      evidenceGaps: data.importState?.evidenceGaps || [],
    },
  };
}

function getSupabaseConfig() {
  return {
    url: process.env.ATLAS_SUPABASE_URL || '',
    secretKey: process.env.ATLAS_SUPABASE_SECRET_KEY || process.env.ATLAS_SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

export function getAtlasStorageProvider(): AtlasStorageProvider {
  const configuredProvider = process.env.ATLAS_STORAGE_PROVIDER;
  const supabase = getSupabaseConfig();
  const hasSupabase = Boolean(supabase.url && supabase.secretKey);

  if (configuredProvider === 'supabase') {
    if (!hasSupabase) {
      throw new Error('Atlas Supabase storage is selected, but ATLAS_SUPABASE_URL and ATLAS_SUPABASE_SECRET_KEY are not configured.');
    }
    return 'supabase';
  }

  if (configuredProvider && configuredProvider !== 'json') {
    throw new Error(`Unsupported Atlas storage provider: ${configuredProvider}`);
  }

  if (process.env.VERCEL_ENV === 'production' && !hasSupabase) {
    throw new Error('Atlas production storage is not configured. Refusing to use local JSON storage on Vercel production.');
  }

  if (process.env.VERCEL_ENV && hasSupabase) {
    return 'supabase';
  }

  return 'json';
}

async function supabaseRequest<T>(pathName: string, init: AtlasSupabaseRequestInit = {}): Promise<T> {
  const { url, secretKey } = getSupabaseConfig();
  if (!url || !secretKey) {
    throw new Error('Atlas Supabase credentials are not configured.');
  }

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

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function readJsonAtlasData(): Promise<AtlasData> {
  try {
    const raw = await readFile(dataFile, 'utf8');
    return withScores(JSON.parse(raw) as AtlasData);
  } catch {
    return withScores(seedData);
  }
}

async function writeJsonAtlasData(data: AtlasData) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(withScores(data), null, 2));
}

async function readSupabaseAtlasData(): Promise<AtlasData> {
  const rows = await supabaseRequest<Array<{ snapshot: AtlasData }>>(
    `/rest/v1/atlas_profiles?profile_slug=eq.${encodeURIComponent(atlasProfileSlug)}&select=snapshot&limit=1`,
    { method: 'GET' },
  );

  if (!rows.length) {
    const seeded = withScores(seedData);
    await writeSupabaseAtlasData(seeded);
    return seeded;
  }

  return withScores(rows[0].snapshot);
}

async function writeSupabaseAtlasData(data: AtlasData) {
  const snapshot = withScores(data);
  await supabaseRequest<Array<{ id: string }>>(
    `/rest/v1/atlas_profiles?on_conflict=profile_slug`,
    {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        profile_slug: atlasProfileSlug,
        tenant_id: atlasTenantId,
        snapshot,
        storage_version: 1,
        verification_status: 'pending_review',
        founder_approval_status: 'pending_review',
        source_type: 'atlas_app',
        updated_by: 'atlas-app',
      }),
    },
  );
  await writeAtlasAuditEvent('atlas_snapshot_saved', 'Atlas profile snapshot saved to durable Supabase storage.', {
    profileSlug: atlasProfileSlug,
    storageVersion: 1,
  });
}

async function writeAtlasAuditEvent(eventType: string, summary: string, metadata: Record<string, unknown> = {}) {
  if (getAtlasStorageProvider() !== 'supabase') return;

  await supabaseRequest('/rest/v1/atlas_audit_events', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      event_type: eventType,
      actor: 'atlas-app',
      summary,
      metadata,
    }),
  });
}

export async function getAtlasData(): Promise<AtlasData> {
  return getAtlasStorageProvider() === 'supabase' ? readSupabaseAtlasData() : readJsonAtlasData();
}

async function writeAtlasData(data: AtlasData) {
  if (getAtlasStorageProvider() === 'supabase') {
    await writeSupabaseAtlasData(data);
    return;
  }

  await writeJsonAtlasData(data);
}

export async function updateAtlasFinancialAssumptions(patch: Partial<AtlasFinancialAssumptions>) {
  const data = await getAtlasData();
  data.financialAssumptions = { ...data.financialAssumptions, ...patch };
  await writeAtlasData(data);
  return data.financialAssumptions;
}

export async function updateAtlasCompanyProfile(patch: Partial<AtlasData['companyProfile']>) {
  const data = await getAtlasData();
  data.companyProfile = {
    ...data.companyProfile,
    ...patch,
    versionHistory: [
      ...(data.companyProfile.versionHistory || []),
      `Updated ${new Date().toLocaleString('en-US')} through Atlas Release 1.0.`,
    ].slice(-12),
  };
  await writeAtlasData(data);
  return data.companyProfile;
}

export async function updateAtlasPersonalFinancialProfile(patch: Partial<AtlasPersonalFinancialProfile>) {
  const data = await getAtlasData();
  data.personalFinancialProfile = { ...data.personalFinancialProfile, ...patch, updatedAt: new Date().toISOString() };
  await writeAtlasData(data);
  return data.personalFinancialProfile;
}

export async function updateAtlasChapterSevenWorkflow(patch: Partial<AtlasChapterSevenWorkflow>) {
  const data = await getAtlasData();
  data.chapterSevenWorkflow = { ...data.chapterSevenWorkflow, ...patch, updatedAt: new Date().toISOString() };
  await writeAtlasData(data);
  return data.chapterSevenWorkflow;
}

export async function updateAtlasUseOfFundsPlan(patch: Partial<AtlasUseOfFundsPlan>) {
  const data = await getAtlasData();
  data.useOfFundsPlan = { ...data.useOfFundsPlan, ...patch, updatedAt: new Date().toISOString() };
  await writeAtlasData(data);
  return data.useOfFundsPlan;
}

export async function upsertAtlasPackageVersion(input: Partial<AtlasPackageVersion>) {
  const data = await getAtlasData();
  const timestamp = new Date().toISOString();
  const latestVersion = data.packageVersions.reduce((max, item) => Math.max(max, item.versionNumber), 0);
  const existingIndex = input.id ? data.packageVersions.findIndex((item) => item.id === input.id) : -1;
  const generated = generateAtlasPackage(data);
  const approvals = atlasFounderApprovalKeys.reduce<Record<string, boolean>>((acc, key) => {
    acc[key] = Boolean(input.founderApprovals?.[key]);
    return acc;
  }, {});
  const allApproved = Object.values(approvals).every(Boolean);
  const requestedStatus: AtlasPackageStatus = input.status || 'Draft';
  const gatedStatus = ['Ready', 'Submitted'].includes(requestedStatus) && !allApproved ? 'Founder Review' : requestedStatus;
  const activeLender = data.fundingOpportunities.find((item) => item.status !== 'declined');
  const packageVersion: AtlasPackageVersion = {
    id: input.id || randomUUID(),
    packageName: input.packageName || `${data.companyProfile.companyName} SBA/CDFI Capital Package`,
    targetLender: input.targetLender || activeLender?.lenderName || activeLender?.fundingSource || 'Target lender TBD',
    fundingType: input.fundingType || activeLender?.type || data.companyProfile.preferredFundingTypes[0] || 'SBA Microloan',
    fundingAmount: Number(input.fundingAmount) || data.financialAssumptions.loanAmount,
    versionNumber: existingIndex >= 0 ? data.packageVersions[existingIndex].versionNumber : latestVersion + 1,
    status: gatedStatus,
    notes: input.notes || '',
    founderApprovals: approvals,
    generatedMarkdown: generated.markdown,
    generatedHtml: generated.html,
    createdAt: existingIndex >= 0 ? data.packageVersions[existingIndex].createdAt : timestamp,
    updatedAt: timestamp,
  };

  if (existingIndex >= 0) {
    data.packageVersions[existingIndex] = packageVersion;
  } else {
    data.packageVersions.push(packageVersion);
  }

  await writeAtlasData(data);
  return packageVersion;
}

export async function upsertAtlasFundingOpportunity(input: Partial<AtlasFundingOpportunity> & Pick<AtlasFundingOpportunity, 'fundingSource' | 'type' | 'targetAmount' | 'status'>) {
  const data = await getAtlasData();
  const timestamp = new Date().toISOString();
  const existingIndex = input.id ? data.fundingOpportunities.findIndex((item) => item.id === input.id) : -1;
  const opportunity: AtlasFundingOpportunity = {
    id: input.id || randomUUID(),
    fundingSource: input.fundingSource,
    lenderName: input.lenderName || input.fundingSource,
    type: input.type,
    targetAmount: Number(input.targetAmount) || 0,
    status: input.status,
    deadline: input.deadline || '',
    contact: input.contact || '',
    website: input.website || '',
    applicationUrl: input.applicationUrl || '',
    contactName: input.contactName || input.contact || '',
    contactEmail: input.contactEmail || '',
    phone: input.phone || '',
    fitScore: Number(input.fitScore) || 50,
    requirements: input.requirements || '',
    nextFollowUpDate: input.nextFollowUpDate || '',
    lastContactedDate: input.lastContactedDate || '',
    statusNotes: input.statusNotes || '',
    notes: input.notes || '',
    nextAction: input.nextAction || '',
    createdAt: existingIndex >= 0 ? data.fundingOpportunities[existingIndex].createdAt : timestamp,
    updatedAt: timestamp,
  };

  if (existingIndex >= 0) {
    data.fundingOpportunities[existingIndex] = opportunity;
  } else {
    data.fundingOpportunities.push(opportunity);
  }

  await writeAtlasData(data);
  return opportunity;
}

export async function deleteAtlasFundingOpportunity(id: string) {
  const data = await getAtlasData();
  data.fundingOpportunities = data.fundingOpportunities.filter((item) => item.id !== id);
  await writeAtlasData(data);
}

export async function updateAtlasDocument(id: string, patch: Partial<AtlasDocument>) {
  const data = await getAtlasData();
  data.documents = data.documents.map((document) => document.id === id ? { ...document, ...patch, updatedAt: new Date().toISOString() } : document);
  await writeAtlasData(data);
  return data.documents.find((document) => document.id === id);
}

export async function recordAtlasEinConfirmation(input: {
  filename: string;
  contentHash: string;
  size: number;
  noticeType?: string;
  noticeDate?: string;
  maskedEin?: string;
  businessName?: string;
  mailingAddress?: string;
  nameControl?: string;
  sourcePath?: string;
}) {
  const data = await getAtlasData();
  const timestamp = new Date().toISOString();
  const documentId = `ein-${input.contentHash.slice(0, 16)}`;
  const maskedEin = input.maskedEin || data.companyProfile.einMasked || 'EIN masked';

  data.companyProfile = {
    ...data.companyProfile,
    companyName: input.businessName || data.companyProfile.companyName,
    legalBusinessName: input.businessName || data.companyProfile.legalBusinessName || data.companyProfile.companyName,
    ein: '',
    einMasked: maskedEin,
    einVerificationStatus: 'verified_document_received',
    einNoticeType: input.noticeType || data.companyProfile.einNoticeType || 'IRS EIN confirmation notice',
    einNoticeDate: input.noticeDate || data.companyProfile.einNoticeDate || '',
    einSourceDocumentName: input.filename,
    einSourceDocumentHash: input.contentHash,
    einSourceDocumentSize: input.size,
    einVerifiedAt: timestamp,
    mailingAddress: input.mailingAddress || data.companyProfile.mailingAddress,
    nameControl: input.nameControl || data.companyProfile.nameControl,
    versionHistory: [
      ...(data.companyProfile.versionHistory || []),
      `Verified EIN confirmation source document on ${new Date(timestamp).toLocaleString('en-US')}. Full EIN remains masked and excluded from source control.`,
    ].slice(-12),
  };

  data.documents = data.documents.map((document) => document.id === 'ein'
    ? {
      ...document,
      completed: true,
      notes: `IRS EIN confirmation document received and source-traced. Display value: ${maskedEin}. Full EIN is not stored in source control or exposed in logs.`,
      updatedAt: timestamp,
    }
    : document);

  const sourceDocument = {
    id: documentId,
    path: input.sourcePath ? '[private-source-redacted]' : '',
    filename: input.filename,
    fileType: input.filename.split('.').pop()?.toLowerCase() || 'pdf',
    modifiedAt: timestamp,
    contentHash: input.contentHash,
    size: input.size,
    classification: 'Legal/corporate' as const,
    relevanceScore: 100,
    status: 'imported' as const,
  };
  const importedFields: AtlasImportedField[] = [
    {
      id: randomUUID(),
      fieldPath: 'companyProfile.einVerificationStatus',
      label: 'EIN confirmation status',
      sourceDocumentId: documentId,
      sourceFilename: input.filename,
      sourcePath: '[private-source-redacted]',
      sourceDocumentType: sourceDocument.fileType,
      sourceSection: `${input.filename} :: IRS EIN confirmation`,
      importTimestamp: timestamp,
      originalValue: 'IRS EIN confirmation document received; full EIN masked.',
      normalizedValue: 'verified_document_received',
      classification: 'Verified document value',
      confidence: 96,
      verificationStatus: 'verified',
      founderApproved: true,
      conflictStatus: 'none',
      sensitive: false,
    },
    {
      id: randomUUID(),
      fieldPath: 'companyProfile.ein',
      label: 'Full EIN excluded',
      sourceDocumentId: documentId,
      sourceFilename: input.filename,
      sourcePath: '[private-source-redacted]',
      sourceDocumentType: sourceDocument.fileType,
      sourceSection: `${input.filename} :: IRS EIN confirmation`,
      importTimestamp: timestamp,
      originalValue: 'Full EIN intentionally excluded from Atlas UI and logs.',
      normalizedValue: maskedEin,
      classification: 'Requires verification',
      confidence: 99,
      verificationStatus: 'deferred',
      founderApproved: false,
      conflictStatus: 'sensitive_excluded',
      sensitive: true,
    },
  ];

  data.importState = {
    ...emptyAtlasImportState,
    ...data.importState,
    sourceDocuments: [
      sourceDocument,
      ...(data.importState.sourceDocuments || []).filter((document) => document.contentHash !== input.contentHash),
    ].slice(0, 200),
    importedFields: [
      ...importedFields,
      ...(data.importState.importedFields || []),
    ].slice(0, 200),
    evidenceGaps: (data.importState.evidenceGaps || []).filter((gap) => !/ein/i.test(`${gap.label} ${gap.detail}`)),
    lastImportAt: timestamp,
    lastScanAt: data.importState.lastScanAt || timestamp,
  };

  await writeAtlasData(data);
  return withScores(data);
}

export async function updateAtlasTask(id: string, patch: Partial<AtlasTask>) {
  const data = await getAtlasData();
  data.tasks = data.tasks.map((task) => task.id === id ? { ...task, ...patch } : task);
  await writeAtlasData(data);
  return data.tasks.find((task) => task.id === id);
}

export async function updateAtlasApplicationSection(id: string, patch: Partial<AtlasApplicationSection>) {
  const data = await getAtlasData();
  data.applicationSections = data.applicationSections.map((section) => section.id === id ? { ...section, ...patch, updatedAt: new Date().toISOString() } : section);
  await writeAtlasData(data);
  return data.applicationSections.find((section) => section.id === id);
}

export async function updateAtlasImportState(patch: Partial<AtlasImportState>) {
  const data = await getAtlasData();
  data.importState = {
    ...emptyAtlasImportState,
    ...data.importState,
    ...patch,
    sourceDocuments: patch.sourceDocuments || data.importState.sourceDocuments || [],
    extractedSections: patch.extractedSections || data.importState.extractedSections || [],
    importedFields: patch.importedFields || data.importState.importedFields || [],
    fieldConflicts: patch.fieldConflicts || data.importState.fieldConflicts || [],
    fieldVersions: patch.fieldVersions || data.importState.fieldVersions || [],
    importRuns: patch.importRuns || data.importState.importRuns || [],
    importErrors: patch.importErrors || data.importState.importErrors || [],
    founderReviewQueue: patch.founderReviewQueue || data.importState.founderReviewQueue || [],
    stalenessFlags: patch.stalenessFlags || data.importState.stalenessFlags || [],
    evidenceGaps: patch.evidenceGaps || data.importState.evidenceGaps || [],
  };
  await writeAtlasData(data);
  return data.importState;
}

export async function saveAtlasImportResult(importState: AtlasImportState, shouldApply: boolean) {
  const data = await getAtlasData();
  const previousFields = data.importState.importedFields || [];
  data.importState = {
    ...emptyAtlasImportState,
    ...importState,
    fieldVersions: [...previousFields, ...(importState.importedFields || [])].slice(-200),
  };

  if (shouldApply) {
    applyImportedFields(data, importState.importedFields);
    data.importState.lastImportAt = new Date().toISOString();
    const generated = generateAtlasPackage(data);
    const latestVersion = data.packageVersions.reduce((max, item) => Math.max(max, item.versionNumber), 0);
    data.packageVersions.push({
      id: randomUUID(),
      packageName: 'Draft generated from imported source documents',
      targetLender: data.fundingOpportunities.find((item) => item.status !== 'declined')?.lenderName || 'Founder-selected lender',
      fundingType: data.companyProfile.preferredFundingTypes[0] || 'SBA Microloan',
      fundingAmount: data.financialAssumptions.loanAmount,
      versionNumber: latestVersion + 1,
      status: 'Founder Review',
      notes: 'Generated after Atlas Release 1.1 document import. Founder approval is required before external use.',
      founderApprovals: atlasFounderApprovalKeys.reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      generatedMarkdown: generated.markdown,
      generatedHtml: generated.html,
      createdAt: data.importState.lastImportAt,
      updatedAt: data.importState.lastImportAt,
    });
  }

  await writeAtlasData(data);
  return withScores(data);
}

function applyImportedFields(data: AtlasData, fields: AtlasImportedField[]) {
  const safeFields = fields.filter((field) => !field.sensitive && field.conflictStatus === 'none' && field.confidence >= 68);
  for (const field of safeFields) {
    const value = field.normalizedValue;
    switch (field.fieldPath) {
      case 'companyProfile.companyName':
        data.companyProfile.companyName = String(value);
        break;
      case 'companyProfile.productName':
        data.companyProfile.productName = String(value);
        break;
      case 'companyProfile.businessStage':
        data.companyProfile.businessStage = String(value);
        break;
      case 'companyProfile.revenueStage':
        data.companyProfile.revenueStage = String(value);
        break;
      case 'companyProfile.fundingTargetMin':
        data.companyProfile.fundingTargetMin = Number(value) || data.companyProfile.fundingTargetMin;
        break;
      case 'companyProfile.fundingTargetMax':
        data.companyProfile.fundingTargetMax = Number(value) || data.companyProfile.fundingTargetMax;
        break;
      case 'companyProfile.preferredFundingTypes':
        data.companyProfile.preferredFundingTypes = Array.isArray(value) ? value.map(String) : String(value).split('/').map((item) => item.trim()).filter(Boolean);
        break;
      case 'companyProfile.firstNinetyDayMrrEstimate':
        data.companyProfile.firstNinetyDayMrrEstimate = String(value);
        break;
      case 'companyProfile.sixMonthMrrTarget':
        data.companyProfile.sixMonthMrrTarget = String(value);
        break;
      case 'companyProfile.primaryUseOfFunds':
        data.companyProfile.primaryUseOfFunds = Array.isArray(value) ? value.map(String) : String(value).split(',').map((item) => item.trim()).filter(Boolean);
        data.companyProfile.useOfFunds = `Primary use of funds: ${data.companyProfile.primaryUseOfFunds.join(', ')}.`;
        break;
      case 'companyProfile.revenueAssumptions':
        data.companyProfile.revenueAssumptions = String(value);
        break;
      case 'companyProfile.repaymentStrategy':
        data.companyProfile.repaymentStrategy = String(value);
        break;
      case 'companyProfile.riskMitigation':
        data.companyProfile.riskMitigation = String(value);
        break;
      case 'companyProfile.chapterSevenExplanation':
        data.companyProfile.chapterSevenExplanation = String(value);
        break;
      case 'financialAssumptions.loanAmount':
        data.financialAssumptions.loanAmount = Number(value) || data.financialAssumptions.loanAmount;
        data.useOfFundsPlan.selectedAmount = data.financialAssumptions.loanAmount;
        break;
      case 'financialAssumptions.startingMrr':
        data.financialAssumptions.startingMrr = Number(value) || data.financialAssumptions.startingMrr;
        data.companyProfile.currentMrr = data.financialAssumptions.startingMrr;
        break;
      case 'financialAssumptions.averageSubscriptionPrice':
        data.financialAssumptions.averageSubscriptionPrice = Number(value) || data.financialAssumptions.averageSubscriptionPrice;
        break;
      default:
        break;
    }
  }

  const completedDocumentIds = new Set(data.documents.filter((document) => document.completed).map((document) => document.id));
  for (const field of safeFields) {
    if (field.fieldPath.startsWith('documents.')) {
      completedDocumentIds.add(String(field.normalizedValue));
    }
  }
  data.documents = data.documents.map((document) => completedDocumentIds.has(document.id)
    ? { ...document, completed: true, notes: document.notes.includes('Imported evidence') ? document.notes : `${document.notes} Imported evidence reviewed in Atlas Import Center.`, updatedAt: new Date().toISOString() }
    : document);
  data.companyProfile.versionHistory = [
    ...(data.companyProfile.versionHistory || []),
    `Imported source documents through Atlas Release 1.1 on ${new Date().toLocaleString('en-US')}.`,
  ].slice(-12);
}
