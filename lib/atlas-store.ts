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
    ein: '',
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
    currentStage: 'Capital package buildout',
    nextAction: 'Complete document vault and prepare lender-ready SBA microloan narrative.',
    businessSummary: 'Nieves Labs builds practical AI products and automation workflows for professionals, founders, and small teams. The Nieves AI Platform organizes product workflows, intake, fulfillment, admin visibility, and operational automation across the company portfolio.',
    fundingRequest: 'Nieves Labs is preparing a conservative $25,000 to $50,000 funding request focused on SBA Microloan and CDFI options.',
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
    timeline: 'Target lender outreach after package and documents are founder-reviewed.',
    versionHistory: ['Release 1.0 master profile seeded for SBA Microloan / CDFI preparation.'],
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
    loanAmount: 35000,
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
    selectedAmount: 35000,
    customAmount: 35000,
    items: [
      { id: 'product-development', category: 'Product Development', amount: 8500, notes: 'Production hardening and launch-ready product workflow completion.' },
      { id: 'cloud-costs', category: 'Cloud Costs', amount: 3500, notes: 'Hosting, storage, observability, and deployment infrastructure.' },
      { id: 'ai-api-costs', category: 'AI/API Costs', amount: 4500, notes: 'OpenAI/API usage for product validation and fulfillment workflows.' },
      { id: 'app-store-release', category: 'App Store Release', amount: 2500, notes: 'Mobile build, submission, compliance, and release preparation.' },
      { id: 'marketing', category: 'Marketing', amount: 6000, notes: 'Launch campaigns, content, local outreach, and customer acquisition testing.' },
      { id: 'legal', category: 'Legal', amount: 2500, notes: 'Legal, accounting, administrative, and compliance support.' },
      { id: 'contractors', category: 'Contractors', amount: 5500, notes: 'Specialized contractor support for engineering, creative, and operations.' },
      { id: 'working-capital', category: 'Working Capital', amount: 2000, notes: 'Short-term operating cushion for launch period.' },
    ],
    updatedAt: now,
  },
  fundingOpportunities: [
    {
      id: 'sba-microloan',
      fundingSource: 'SBA Microloan intermediary',
      lenderName: 'SBA Microloan intermediary placeholder',
      type: 'SBA Microloan',
      targetAmount: 35000,
      status: 'preparing',
      deadline: 'Rolling',
      contact: 'Local SBA microlender / CDFI intake',
      website: 'https://www.sba.gov/funding-programs/loans/microloans',
      applicationUrl: 'https://www.sba.gov/funding-programs/loans/lender-match',
      contactName: 'Loan intake coordinator',
      contactEmail: 'intake@example-sba-microlender.org',
      phone: 'TBD',
      fitScore: 82,
      requirements: 'Business plan, use-of-funds summary, projections, personal financial statement, recent bank statements, credit/background explanation, and supporting formation documents.',
      nextFollowUpDate: 'Next 10 days',
      lastContactedDate: '',
      statusNotes: 'Strong fit for a conservative early-stage request if documentation is complete and underwriting concerns are addressed directly.',
      notes: 'Best fit for conservative early-stage working capital request.',
      nextAction: 'Prepare business plan, projections, and document packet.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cdfi-working-capital',
      fundingSource: 'Regional CDFI working capital program',
      lenderName: 'CDFI placeholder',
      type: 'CDFI',
      targetAmount: 25000,
      status: 'targeted',
      deadline: 'Rolling',
      contact: 'CDFI loan officer',
      website: 'https://www.cdfifund.gov/',
      applicationUrl: 'TBD after lender selection',
      contactName: 'Small business lending officer',
      contactEmail: 'smallbusiness@example-cdfi.org',
      phone: 'TBD',
      fitScore: 76,
      requirements: 'Owner background, business plan, revenue model, funding purpose, formation documents, projections, and clear repayment assumptions.',
      nextFollowUpDate: 'Next 14 days',
      lastContactedDate: '',
      statusNotes: 'Useful alternative if SBA timeline is slow or if local mission-fit underwriting is more flexible.',
      notes: 'Use if SBA underwriting timeline is slow or collateral requirements are heavy.',
      nextAction: 'Confirm eligibility and required personal financial statement format.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'local-small-business-grant',
      fundingSource: 'Local small business grant program',
      lenderName: 'Local small business grant placeholder',
      type: 'Grant',
      targetAmount: 10000,
      status: 'researching',
      deadline: 'TBD',
      contact: 'Economic development office',
      website: 'TBD',
      applicationUrl: 'TBD',
      contactName: 'Program administrator',
      contactEmail: 'grants@example-local.org',
      phone: 'TBD',
      fitScore: 58,
      requirements: 'Eligibility review, business summary, use-of-funds statement, proof of location, founder background, and project narrative.',
      nextFollowUpDate: 'Next 21 days',
      lastContactedDate: '',
      statusNotes: 'Potential non-dilutive supplement, but deadlines and eligibility need confirmation.',
      notes: 'Track as a supplemental funding path, not the primary capital source.',
      nextAction: 'Identify local programs and confirm application windows.',
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
    fundingOpportunities: (data.fundingOpportunities || seedData.fundingOpportunities).map((opportunity) => ({
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

export async function getAtlasData(): Promise<AtlasData> {
  try {
    const raw = await readFile(dataFile, 'utf8');
    return withScores(JSON.parse(raw) as AtlasData);
  } catch {
    return withScores(seedData);
  }
}

async function writeAtlasData(data: AtlasData) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(withScores(data), null, 2));
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
