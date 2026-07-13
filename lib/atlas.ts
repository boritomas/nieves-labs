export type AtlasFundingType = 'SBA Microloan' | 'CDFI' | 'Grant' | 'Bank Loan' | 'Investor' | 'Accelerator';
export type AtlasFundingStatus = 'researching' | 'targeted' | 'preparing' | 'submitted' | 'follow_up' | 'approved' | 'declined';
export type AtlasDocumentCategory = 'legal' | 'financial' | 'founder' | 'product' | 'market';
export type AtlasTaskStatus = 'not_started' | 'in_progress' | 'complete' | 'blocked';
export type AtlasWorkflowStageStatus = 'complete' | 'in_progress' | 'blocked' | 'not_started';
export type AtlasPackageStatus = 'Draft' | 'Founder Review' | 'Ready' | 'Submitted' | 'Archived';
export type AtlasSourceDocumentClassification =
  | 'Company profile'
  | 'Founder profile'
  | 'Business plan'
  | 'Loan package'
  | 'Financial model'
  | 'Cash-flow forecast'
  | 'Product portfolio'
  | 'Market research'
  | 'Competitive analysis'
  | 'Risk assessment'
  | 'Repayment strategy'
  | 'Due diligence'
  | 'Product roadmap'
  | 'Pricing'
  | 'Legal/corporate'
  | 'Sensitive founder document'
  | 'Unknown'
  | 'Unrelated';
export type AtlasImportedFieldClassification = 'Verified document value' | 'Founder-provided' | 'Calculated' | 'Planning assumption' | 'AI-derived summary' | 'Unknown' | 'Requires verification';
export type AtlasVerificationStatus = 'pending_review' | 'approved' | 'rejected' | 'assumption' | 'verified' | 'deferred';
export type AtlasStalenessStatus = 'Current' | 'Possibly stale' | 'Superseded' | 'Requires founder confirmation';
export type AtlasApplicationSectionId =
  | 'business_information'
  | 'founder_information'
  | 'funding_request'
  | 'use_of_funds'
  | 'business_narrative'
  | 'revenue_assumptions'
  | 'repayment_plan'
  | 'risk_mitigation'
  | 'chapter_7_explanation'
  | 'supporting_documents';

export type AtlasCompanyProfile = {
  id: string;
  companyName: string;
  legalBusinessName: string;
  dba: string;
  entityType: string;
  stateOfFormation: string;
  formationDate: string;
  businessStartDate: string;
  ein: string;
  einMasked: string;
  einVerificationStatus: 'missing' | 'verified_document_received' | 'requires_founder_review';
  einNoticeType: string;
  einNoticeDate: string;
  einSourceDocumentName: string;
  einSourceDocumentHash: string;
  einSourceDocumentSize: number;
  einVerifiedAt: string;
  nameControl: string;
  businessAddress: string;
  mailingAddress: string;
  naicsCode: string;
  businessEmail: string;
  businessPhone: string;
  website: string;
  state: string;
  industry: string;
  timeInBusiness: string;
  currentRevenue: number;
  currentMrr: number;
  customers: number;
  businessStage: string;
  productName: string;
  moduleName: string;
  fundingTargetMin: number;
  fundingTargetMax: number;
  preferredFundingTypes: string[];
  revenueStage: string;
  firstNinetyDayMrrEstimate: string;
  sixMonthMrrTarget: string;
  primaryUseOfFunds: string[];
  currentStage: string;
  nextAction: string;
  businessSummary: string;
  fundingRequest: string;
  useOfFunds: string;
  revenueAssumptions: string;
  repaymentStrategy: string;
  founderBackground: string;
  riskMitigation: string;
  chapterSevenExplanation: string;
  founderName: string;
  ownershipPercent: number;
  founderEmployment: string;
  personalCreditRange: string;
  bankruptcyStatus: string;
  existingDebt: number;
  stableIncome: string;
  timeline: string;
  versionHistory: string[];
};

export type AtlasFinancialAssumptions = {
  id: string;
  startingMrr: number;
  monthlyCustomerGrowth: number;
  averageSubscriptionPrice: number;
  monthlyChurn: number;
  cloudApiCosts: number;
  marketingBudget: number;
  contractorDevSupport: number;
  legalAdminCosts: number;
  loanAmount: number;
  loanTermMonths: number;
  estimatedInterestRate: number;
  startingCashBalance: number;
};

export type AtlasPersonalFinancialProfile = {
  id: string;
  assets: number;
  liabilities: number;
  annualIncome: number;
  monthlyExpenses: number;
  debtObligations: number;
  valuesHidden: boolean;
  updatedAt: string;
};

export type AtlasChapterSevenWorkflow = {
  id: string;
  filingDate: string;
  dischargeDate: string;
  status: string;
  explanation: string;
  supportingDocuments: string[];
  founderApproved: boolean;
  updatedAt: string;
};

export type AtlasUseOfFundsItem = {
  id: string;
  category: 'Product Development' | 'Cloud Costs' | 'AI/API Costs' | 'App Store Release' | 'Marketing' | 'Legal' | 'Contractors' | 'Working Capital' | 'Reserve';
  amount: number;
  notes: string;
};

export type AtlasUseOfFundsPlan = {
  id: string;
  selectedAmount: number;
  customAmount: number;
  items: AtlasUseOfFundsItem[];
  updatedAt: string;
};

export type AtlasFundingOpportunity = {
  id: string;
  fundingSource: string;
  lenderName: string;
  type: AtlasFundingType;
  targetAmount: number;
  status: AtlasFundingStatus;
  deadline: string;
  contact: string;
  website: string;
  applicationUrl: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  fitScore: number;
  requirements: string;
  nextFollowUpDate: string;
  lastContactedDate: string;
  statusNotes: string;
  notes: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
};

export type AtlasDocument = {
  id: string;
  name: string;
  category: AtlasDocumentCategory;
  completed: boolean;
  required: boolean;
  notes: string;
  updatedAt: string;
};

export type AtlasRisk = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string;
  owner: string;
  status: AtlasTaskStatus;
};

export type AtlasTask = {
  id: string;
  title: string;
  area: 'SBA Package' | 'Financial Model' | 'Documents' | 'Funding Tracker' | 'Due Diligence';
  status: AtlasTaskStatus;
  dueDate: string;
  owner: string;
};

export type AtlasApplicationSection = {
  id: AtlasApplicationSectionId;
  title: string;
  reviewed: boolean;
  notes: string;
  updatedAt: string;
};

export type AtlasReadinessBreakdown = {
  requiredDocuments: number;
  financialAssumptions: number;
  fundingTracker: number;
  dueDiligenceTasks: number;
  riskMitigation: number;
  applicationSections: number;
};

export type AtlasReadinessScores = {
  id: string;
  capitalReadiness: number;
  productReadiness: number;
  documentationReadiness: number;
  applicationReadiness: number;
  overallReadiness: number;
  breakdown: AtlasReadinessBreakdown;
  updatedAt: string;
};

export type AtlasWorkflowStage = {
  id: string;
  title: string;
  href: string;
  status: AtlasWorkflowStageStatus;
  description: string;
};

export type AtlasPackageVersion = {
  id: string;
  packageName: string;
  targetLender: string;
  fundingType: string;
  fundingAmount: number;
  versionNumber: number;
  status: AtlasPackageStatus;
  notes: string;
  founderApprovals: Record<string, boolean>;
  generatedMarkdown: string;
  generatedHtml: string;
  createdAt: string;
  updatedAt: string;
};

export type AtlasSourceDocument = {
  id: string;
  path: string;
  filename: string;
  fileType: string;
  modifiedAt: string;
  contentHash: string;
  size: number;
  classification: AtlasSourceDocumentClassification;
  relevanceScore: number;
  status: 'discovered' | 'imported' | 'skipped' | 'duplicate' | 'error';
  duplicateOf?: string;
  skipReason?: string;
};

export type AtlasExtractedSection = {
  id: string;
  documentId: string;
  heading: string;
  text: string;
  sourceSection: string;
  confidence: number;
};

export type AtlasImportedField = {
  id: string;
  fieldPath: string;
  label: string;
  sourceDocumentId: string;
  sourceFilename: string;
  sourcePath: string;
  sourceDocumentType: string;
  sourceSection: string;
  importTimestamp: string;
  originalValue: string;
  normalizedValue: string | number | string[];
  classification: AtlasImportedFieldClassification;
  confidence: number;
  verificationStatus: AtlasVerificationStatus;
  founderApproved: boolean;
  conflictStatus: 'none' | 'conflict' | 'stale' | 'sensitive_excluded';
  sensitive: boolean;
};

export type AtlasFieldConflict = {
  id: string;
  fieldPath: string;
  label: string;
  valueA: string;
  sourceA: string;
  valueB: string;
  sourceB: string;
  documentDates: string[];
  recommendedResolution: string;
  founderDecisionRequired: boolean;
};

export type AtlasFounderReviewItem = {
  id: string;
  importedFieldId: string;
  fieldPath: string;
  label: string;
  importedValue: string;
  source: string;
  classification: AtlasImportedFieldClassification;
  confidence: number;
  conflictStatus: AtlasImportedField['conflictStatus'];
  recommendedAction: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: AtlasVerificationStatus;
};

export type AtlasStalenessFlag = {
  id: string;
  fieldPath: string;
  value: string;
  source: string;
  status: AtlasStalenessStatus;
  reason: string;
};

export type AtlasEvidenceGap = {
  id: string;
  category: 'Missing fact' | 'Missing document' | 'Conflict' | 'Stale data' | 'Sensitive field' | 'Lender-specific unknown' | 'Founder decision';
  label: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
};

export type AtlasImportError = {
  id: string;
  path: string;
  message: string;
  createdAt: string;
};

export type AtlasImportRun = {
  id: string;
  startedAt: string;
  completedAt: string;
  mode: 'scan' | 'preview' | 'import';
  discoveredCount: number;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
  errorCount: number;
  fieldsPopulated: number;
  conflictsFound: number;
  evidenceGapsFound: number;
};

export type AtlasImportState = {
  sourceDocuments: AtlasSourceDocument[];
  extractedSections: AtlasExtractedSection[];
  importedFields: AtlasImportedField[];
  fieldConflicts: AtlasFieldConflict[];
  fieldVersions: AtlasImportedField[];
  importRuns: AtlasImportRun[];
  importErrors: AtlasImportError[];
  founderReviewQueue: AtlasFounderReviewItem[];
  stalenessFlags: AtlasStalenessFlag[];
  evidenceGaps: AtlasEvidenceGap[];
  lastScanAt: string;
  lastImportAt: string;
};

export type AtlasData = {
  companyProfile: AtlasCompanyProfile;
  financialAssumptions: AtlasFinancialAssumptions;
  personalFinancialProfile: AtlasPersonalFinancialProfile;
  chapterSevenWorkflow: AtlasChapterSevenWorkflow;
  useOfFundsPlan: AtlasUseOfFundsPlan;
  fundingOpportunities: AtlasFundingOpportunity[];
  documents: AtlasDocument[];
  risks: AtlasRisk[];
  tasks: AtlasTask[];
  applicationSections: AtlasApplicationSection[];
  packageVersions: AtlasPackageVersion[];
  importState: AtlasImportState;
  readinessScores: AtlasReadinessScores;
};

export type AtlasForecastMonth = {
  month: number;
  mrr: number;
  revenue: number;
  expenses: number;
  netCashFlow: number;
  endingCashBalance: number;
};

export type AtlasFinancialForecast = {
  monthlyLoanPayment: number;
  monthlyExpenses: number;
  repaymentCoverage: 'strong' | 'watch' | 'weak';
  months: AtlasForecastMonth[];
};

export type AtlasBusinessReadinessStatus = 'Ready' | 'Mostly ready' | 'Needs attention' | 'Missing' | 'Requires lender confirmation';

export type AtlasBusinessReadinessReport = {
  entityStatus: AtlasBusinessReadinessStatus;
  einStatus: AtlasBusinessReadinessStatus;
  bankingStatus: AtlasBusinessReadinessStatus;
  consistencyStatus: AtlasBusinessReadinessStatus;
  completed: string[];
  founderActions: string[];
  conflicts: AtlasEvidenceGap[];
  lenderRequirements: Array<{
    lender: string;
    requirement: string;
    status: string;
    source: string;
    lastVerifiedDate: string;
  }>;
};

export const atlasFundingTypes: AtlasFundingType[] = ['SBA Microloan', 'CDFI', 'Grant', 'Bank Loan', 'Investor', 'Accelerator'];
export const atlasFundingStatuses: AtlasFundingStatus[] = ['researching', 'targeted', 'preparing', 'submitted', 'follow_up', 'approved', 'declined'];
export const atlasTaskStatuses: AtlasTaskStatus[] = ['not_started', 'in_progress', 'complete', 'blocked'];
export const atlasPackageStatuses: AtlasPackageStatus[] = ['Draft', 'Founder Review', 'Ready', 'Submitted', 'Archived'];
export const atlasFounderApprovalKeys = [
  'Funding amount reviewed',
  'Use of funds reviewed',
  'Revenue assumptions reviewed',
  'Repayment strategy reviewed',
  'Chapter 7 explanation reviewed',
  'Required documents confirmed',
  'I understand Atlas prepares documents only and does NOT submit applications.',
] as const;
export const atlasApplicationSectionIds: AtlasApplicationSectionId[] = [
  'business_information',
  'founder_information',
  'funding_request',
  'use_of_funds',
  'business_narrative',
  'revenue_assumptions',
  'repayment_plan',
  'risk_mitigation',
  'chapter_7_explanation',
  'supporting_documents',
];

export function getAtlasApplicationSectionTitle(id: AtlasApplicationSectionId) {
  return id.split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

export function calculateAtlasForecast(assumptions: AtlasFinancialAssumptions): AtlasFinancialForecast {
  const monthlyRate = assumptions.estimatedInterestRate / 100 / 12;
  const monthlyLoanPayment = monthlyRate > 0
    ? assumptions.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, assumptions.loanTermMonths)) / (Math.pow(1 + monthlyRate, assumptions.loanTermMonths) - 1)
    : assumptions.loanAmount / assumptions.loanTermMonths;
  const monthlyExpenses = assumptions.cloudApiCosts + assumptions.marketingBudget + assumptions.contractorDevSupport + assumptions.legalAdminCosts;
  const months: AtlasForecastMonth[] = [];
  let mrr = assumptions.startingMrr;
  let cash = assumptions.startingCashBalance + assumptions.loanAmount;

  for (let month = 1; month <= 12; month += 1) {
    if (month > 1) {
      const addedMrr = assumptions.monthlyCustomerGrowth * assumptions.averageSubscriptionPrice;
      const retainedMrr = mrr * (1 - assumptions.monthlyChurn / 100);
      mrr = retainedMrr + addedMrr;
    }

    const revenue = mrr;
    const netCashFlow = revenue - monthlyExpenses - monthlyLoanPayment;
    cash += netCashFlow;
    months.push({
      month,
      mrr: Math.round(mrr),
      revenue: Math.round(revenue),
      expenses: Math.round(monthlyExpenses),
      netCashFlow: Math.round(netCashFlow),
      endingCashBalance: Math.round(cash),
    });
  }

  const monthTwelve = months[11];
  const coverageRatio = monthlyLoanPayment > 0 ? monthTwelve.revenue / monthlyLoanPayment : 10;
  const repaymentCoverage = coverageRatio >= 4 ? 'strong' : coverageRatio >= 2 ? 'watch' : 'weak';

  return {
    monthlyLoanPayment: Math.round(monthlyLoanPayment),
    monthlyExpenses: Math.round(monthlyExpenses),
    repaymentCoverage,
    months,
  };
}

export function calculatePersonalFinancialSummary(profile: AtlasPersonalFinancialProfile) {
  const netWorth = profile.assets - profile.liabilities;
  const monthlyIncome = profile.annualIncome / 12;
  const debtToIncome = monthlyIncome > 0 ? Math.round(((profile.monthlyExpenses + profile.debtObligations) / monthlyIncome) * 100) : 0;
  return {
    totalAssets: Math.round(profile.assets),
    totalLiabilities: Math.round(profile.liabilities),
    netWorth: Math.round(netWorth),
    debtToIncome,
  };
}

export function calculateUseOfFundsTotal(plan: AtlasUseOfFundsPlan) {
  return plan.items.reduce((total, item) => total + Number(item.amount || 0), 0);
}

export function generateAtlasBusinessReadinessReport(data: AtlasData): AtlasBusinessReadinessReport {
  const sourceFields = data.importState.importedFields || [];
  const documents = data.documents || [];
  const requiredDocs = documents.filter((document) => document.required);
  const completedRequiredDocs = requiredDocs.filter((document) => document.completed);
  const hasFormation = documents.some((document) => document.id === 'formation-documents' && document.completed);
  const hasOperatingAgreement = documents.some((document) => document.id === 'operating-agreement' && document.completed);
  const hasEinDocument = documents.some((document) => document.id === 'ein' && document.completed)
    || data.companyProfile.einVerificationStatus === 'verified_document_received';
  const hasBankStatements = documents.some((document) => document.id === 'bank-statements' && document.completed);
  const useOfFundsTotal = calculateUseOfFundsTotal(data.useOfFundsPlan);
  const completed: string[] = [];
  const founderActions: string[] = [];
  const conflicts: AtlasEvidenceGap[] = [...(data.importState.evidenceGaps || [])];

  if (data.companyProfile.companyName && data.companyProfile.state) {
    completed.push(`Matched the business profile to ${data.companyProfile.companyName} in ${data.companyProfile.state}.`);
  } else {
    founderActions.push('Confirm the legal business name and formation state.');
  }

  if (hasFormation) {
    completed.push('Found formation-document evidence in the document vault.');
  } else {
    founderActions.push('Upload or confirm formation documents before lender review.');
  }

  if (hasOperatingAgreement) {
    completed.push('Operating agreement is marked available.');
  } else {
    founderActions.push('Upload the operating agreement or mark why it is not applicable.');
  }

  if (hasEinDocument) {
    completed.push(`Located EIN confirmation documentation${data.companyProfile.einMasked ? ` (${data.companyProfile.einMasked})` : ''} and kept EIN values masked.`);
  } else {
    founderActions.push('Upload the EIN confirmation letter. EIN confirmation document missing.');
  }

  if (hasBankStatements) {
    completed.push('Bank statements are marked available for lender package review.');
  } else {
    founderActions.push('Upload recent business bank statements for statement-history review.');
  }

  if (useOfFundsTotal === data.useOfFundsPlan.selectedAmount) {
    completed.push('Use-of-funds total matches the selected funding amount.');
  } else {
    conflicts.push({
      id: 'use-of-funds-total-mismatch',
      category: 'Conflict',
      label: 'Use-of-funds total',
      detail: `Use-of-funds items total ${money(useOfFundsTotal)}, but selected amount is ${money(data.useOfFundsPlan.selectedAmount)}.`,
      severity: 'high',
    });
    founderActions.push('Adjust use-of-funds items so the total matches the selected funding amount.');
  }

  if (!sourceFields.some((field) => field.fieldPath.includes('bank') || field.sourceDocumentType.toLowerCase().includes('csv'))) {
    founderActions.push('Import bank statement PDF/CSV/OFX/QFX files when available; ambiguous transactions will require founder review.');
  }

  const entityStatus: AtlasBusinessReadinessStatus = hasFormation && data.companyProfile.companyName
    ? hasOperatingAgreement ? 'Mostly ready' : 'Needs attention'
    : 'Missing';
  const einStatus: AtlasBusinessReadinessStatus = hasEinDocument
    ? data.companyProfile.einVerificationStatus === 'verified_document_received' ? 'Ready' : 'Mostly ready'
    : 'Missing';
  const bankingStatus: AtlasBusinessReadinessStatus = hasBankStatements ? 'Needs attention' : 'Missing';
  const consistencyStatus: AtlasBusinessReadinessStatus = conflicts.length ? 'Needs attention' : 'Mostly ready';

  const lenderRequirements = data.fundingOpportunities.filter((lender) => lender.status !== 'declined').map((lender) => ({
    lender: lender.lenderName || lender.fundingSource,
    requirement: 'Bank statement months, startup exceptions, personal statement requirements, bankruptcy policy, and new-account acceptance',
    status: 'REQUIRES LENDER CONFIRMATION',
    source: lender.website || 'Official lender source not yet attached',
    lastVerifiedDate: '',
  }));

  if (completedRequiredDocs.length) {
    completed.push(`${completedRequiredDocs.length} of ${requiredDocs.length} required documents are marked ready.`);
  }

  return {
    entityStatus,
    einStatus,
    bankingStatus,
    consistencyStatus,
    completed: completed.slice(0, 6),
    founderActions: founderActions.slice(0, 8),
    conflicts,
    lenderRequirements,
  };
}

export function calculateAtlasReadinessAssessment(data: AtlasData) {
  const requiredDocuments = data.documents.filter((document) => document.required);
  const completedRequiredDocuments = requiredDocuments.filter((document) => document.completed);
  const documentationScore = requiredDocuments.length ? Math.round((completedRequiredDocuments.length / requiredDocuments.length) * 100) : 0;
  const financialInputs = [
    data.financialAssumptions.startingMrr,
    data.financialAssumptions.loanAmount,
    data.financialAssumptions.loanTermMonths,
    data.financialAssumptions.estimatedInterestRate,
    data.personalFinancialProfile.annualIncome,
    data.personalFinancialProfile.assets,
  ];
  const financialScore = Math.round((financialInputs.filter((value) => Number(value) > 0).length / financialInputs.length) * 100);
  const businessInputs = [
    data.companyProfile.companyName,
    data.companyProfile.state,
    data.companyProfile.industry,
    data.companyProfile.businessStage,
    data.companyProfile.revenueStage,
    data.companyProfile.businessSummary,
  ];
  const businessScore = Math.round((businessInputs.filter((value) => String(value || '').trim()).length / businessInputs.length) * 100);
  const chapter7Penalty = data.chapterSevenWorkflow.founderApproved ? 10 : 24;
  const debtPenalty = data.personalFinancialProfile.debtObligations > 0 ? 8 : 0;
  const riskScore = Math.max(0, 100 - chapter7Penalty - debtPenalty - data.risks.filter((risk) => risk.status !== 'complete').length * 8);
  const sbaReadiness = Math.round((documentationScore * 0.35) + (financialScore * 0.25) + (businessScore * 0.25) + (riskScore * 0.15));
  const cdfiReadiness = Math.round((documentationScore * 0.25) + (financialScore * 0.2) + (businessScore * 0.3) + (riskScore * 0.25));
  const overallReadiness = Math.round((sbaReadiness + cdfiReadiness + documentationScore + financialScore + businessScore + riskScore) / 6);
  const missingItems = [
    ...requiredDocuments.filter((document) => !document.completed).map((document) => document.name),
    ...businessInputs.map((value, index) => String(value || '').trim() ? '' : ['Company name', 'State', 'Industry', 'Business stage', 'Revenue stage', 'Business summary'][index]).filter(Boolean),
    data.chapterSevenWorkflow.founderApproved ? '' : 'Founder-approved Chapter 7 explanation',
  ].filter(Boolean) as string[];
  const recommendations = [
    documentationScore < 85 ? 'Complete the required document vault before lender submission.' : 'Document package is close to lender-ready.',
    financialScore < 85 ? 'Finish personal and business financial assumptions before lender outreach.' : 'Financial assumptions are ready for founder review.',
    data.chapterSevenWorkflow.founderApproved ? 'Use the approved Chapter 7 explanation consistently across lender materials.' : 'Review and approve Chapter 7 language before any application is submitted.',
    'Do not state or imply loan approval is guaranteed; present this as a disciplined preparation package.',
  ];

  return {
    overallReadiness,
    sbaReadiness,
    cdfiReadiness,
    documentationScore,
    financialScore,
    businessScore,
    riskScore,
    recommendations,
    missingItems,
  };
}

export function calculateReadinessScores(data: Omit<AtlasData, 'readinessScores'>): AtlasReadinessScores {
  const requiredDocuments = data.documents.filter((document) => document.required);
  const completedRequiredDocuments = requiredDocuments.filter((document) => document.completed);
  const requiredDocumentsScore = requiredDocuments.length
    ? Math.round((completedRequiredDocuments.length / requiredDocuments.length) * 100)
    : 0;

  const financialFields: Array<keyof AtlasFinancialAssumptions> = [
    'startingMrr',
    'monthlyCustomerGrowth',
    'averageSubscriptionPrice',
    'cloudApiCosts',
    'marketingBudget',
    'contractorDevSupport',
    'legalAdminCosts',
    'loanAmount',
    'loanTermMonths',
    'estimatedInterestRate',
  ];
  const financialAssumptionsScore = Math.round((financialFields.filter((field) => Number(data.financialAssumptions[field]) > 0).length / financialFields.length) * 100);

  const activeFunding = data.fundingOpportunities.filter((opportunity) => !['declined'].includes(opportunity.status));
  const advancedFunding = activeFunding.filter((opportunity) => ['preparing', 'submitted', 'follow_up', 'approved'].includes(opportunity.status));
  const fundingFieldCompleteness = activeFunding.length
    ? Math.round((activeFunding.filter((opportunity) => Boolean(opportunity.lenderName && opportunity.applicationUrl && opportunity.contactEmail && opportunity.requirements && opportunity.nextAction)).length / activeFunding.length) * 45)
    : 0;
  const fundingStatusScore = activeFunding.length ? Math.round((advancedFunding.length / activeFunding.length) * 55) : 0;
  const fundingTrackerScore = Math.min(100, fundingFieldCompleteness + fundingStatusScore);

  const dueDiligenceTasksScore = data.tasks.length
    ? Math.round((data.tasks.filter((task) => task.status === 'complete').length / data.tasks.length) * 100)
    : 0;
  const riskMitigationScore = data.risks.length
    ? Math.round((data.risks.filter((risk) => risk.mitigation.trim().length > 30 && ['in_progress', 'complete'].includes(risk.status)).length / data.risks.length) * 100)
    : 0;
  const applicationSectionsScore = data.applicationSections.length
    ? Math.round((data.applicationSections.filter((section) => section.reviewed).length / data.applicationSections.length) * 100)
    : 0;

  const breakdown: AtlasReadinessBreakdown = {
    requiredDocuments: requiredDocumentsScore,
    financialAssumptions: financialAssumptionsScore,
    fundingTracker: fundingTrackerScore,
    dueDiligenceTasks: dueDiligenceTasksScore,
    riskMitigation: riskMitigationScore,
    applicationSections: applicationSectionsScore,
  };

  const documentationReadiness = requiredDocumentsScore;
  const personalFinancialScore = data.personalFinancialProfile.assets > 0 || data.personalFinancialProfile.annualIncome > 0 ? 100 : 50;
  const chapterSevenScore = data.chapterSevenWorkflow.founderApproved ? 100 : 60;
  const useOfFundsScore = calculateUseOfFundsTotal(data.useOfFundsPlan) === data.useOfFundsPlan.selectedAmount ? 100 : 70;
  const capitalReadiness = Math.round((fundingTrackerScore * 0.25) + (requiredDocumentsScore * 0.2) + (financialAssumptionsScore * 0.15) + (riskMitigationScore * 0.15) + (personalFinancialScore * 0.1) + (chapterSevenScore * 0.1) + (useOfFundsScore * 0.05));
  const applicationReadiness = Math.round((applicationSectionsScore * 0.5) + (requiredDocumentsScore * 0.25) + (dueDiligenceTasksScore * 0.25));

  const productSignals = [
    data.companyProfile.revenueStage.includes('near-launch'),
    data.companyProfile.sixMonthMrrTarget.length > 0,
    data.documents.some((document) => document.name === 'Product screenshots' && document.completed),
    data.tasks.filter((task) => task.area === 'Financial Model' && task.status === 'complete').length > 0,
  ];
  const productReadiness = Math.round((productSignals.filter(Boolean).length / productSignals.length) * 100);

  return {
    id: 'readiness_scores',
    capitalReadiness,
    productReadiness,
    documentationReadiness,
    applicationReadiness,
    overallReadiness: Math.round((capitalReadiness + productReadiness + documentationReadiness + applicationReadiness) / 4),
    breakdown,
    updatedAt: new Date().toISOString(),
  };
}

export function buildAtlasWorkflowStages(data: AtlasData, token: string): AtlasWorkflowStage[] {
  const query = `?token=${encodeURIComponent(token)}`;
  const assessment = calculateAtlasReadinessAssessment(data);
  const hasSelectedLender = data.fundingOpportunities.some((opportunity) => ['targeted', 'preparing', 'submitted', 'follow_up', 'approved'].includes(opportunity.status));
  const requiredDocsComplete = data.documents.filter((document) => document.required).every((document) => document.completed);
  const packageVersion = getLatestAtlasPackage(data);
  const applicationReviewed = data.applicationSections.every((section) => section.reviewed);
  const importStageStatus: AtlasWorkflowStageStatus = data.importState.lastImportAt
    ? 'complete'
    : data.importState.sourceDocuments.length || data.importState.lastScanAt
      ? 'in_progress'
      : 'not_started';

  return [
    ['readiness-assessment', 'Readiness Assessment', '/atlas/readiness-assessment', assessment.overallReadiness >= 80 ? 'complete' : 'in_progress', 'SBA/CDFI readiness scoring, gaps, and recommendations.'],
    ['import-center', 'Import Center', '/atlas/import-center', importStageStatus, 'Discover, parse, trace, and founder-review source documents.'],
    ['company-profile', 'Company Profile', '/atlas/company-profile', data.companyProfile.companyName && data.companyProfile.industry ? 'complete' : 'in_progress', 'Reusable master profile for all lender materials.'],
    ['founder-profile', 'Founder Profile', '/atlas/founder-profile', data.companyProfile.founderBackground ? 'complete' : 'in_progress', 'Founder ownership, employment, background, and underwriting context.'],
    ['personal-financial-profile', 'Personal Financial Profile', '/atlas/personal-financial-profile', data.personalFinancialProfile.annualIncome > 0 ? 'complete' : 'in_progress', 'Sensitive founder financial snapshot hidden by default.'],
    ['business-financial-profile', 'Business Financial Profile', '/atlas/business-financial-profile', data.financialAssumptions.loanAmount > 0 ? 'complete' : 'in_progress', 'Business assumptions, repayment model, and cash-flow forecast.'],
    ['document-vault', 'Document Vault', '/atlas/document-vault', requiredDocsComplete ? 'complete' : 'in_progress', 'Required documents and upload placeholders.'],
    ['lender-research', 'Lender Research', '/atlas/lender-research', data.fundingOpportunities.length >= 3 ? 'complete' : 'in_progress', 'SBA, CDFI, grant, and lender opportunities.'],
    ['lender-comparison', 'Lender Comparison', '/atlas/lender-comparison', hasSelectedLender ? 'complete' : 'in_progress', 'Compare fit, amount, requirements, and follow-up timing.'],
    ['requirement-mapping', 'Requirement Mapping', '/atlas/requirement-mapping', requiredDocsComplete && hasSelectedLender ? 'complete' : 'in_progress', 'Map lender requirements to available documents.'],
    ['application-builder', 'Application Builder', '/atlas/application-builder', applicationReviewed ? 'complete' : 'in_progress', 'Guided application content and missing-field review.'],
    ['package-generator', 'Package Generator', '/atlas/package-generator', packageVersion ? 'complete' : 'not_started', 'Lender-ready package preview and copy/download tools.'],
    ['founder-review', 'Founder Review', '/atlas/founder-review', packageVersion?.status === 'Ready' || packageVersion?.status === 'Submitted' ? 'complete' : 'in_progress', 'Manual founder approval before any submission.'],
    ['manual-submission', 'Manual Submission', '/atlas/manual-submission', packageVersion?.status === 'Submitted' ? 'complete' : 'not_started', 'Submission checklist and no-auto-submit gate.'],
    ['follow-up-tracker', 'Follow-up Tracker', '/atlas/follow-up-tracker', data.fundingOpportunities.some((opportunity) => opportunity.nextFollowUpDate) ? 'in_progress' : 'not_started', 'Lender follow-up dates, notes, and next actions.'],
  ].map(([id, title, href, status, description]) => ({
    id: String(id),
    title: String(title),
    href: `${href}${query}`,
    status: status as AtlasWorkflowStageStatus,
    description: String(description),
  }));
}

export function getLatestAtlasPackage(data: AtlasData) {
  return [...(data.packageVersions || [])].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

export function generateAtlasPackage(data: AtlasData) {
  const profile = data.companyProfile;
  const assumptions = data.financialAssumptions;
  const personal = calculatePersonalFinancialSummary(data.personalFinancialProfile);
  const assessment = calculateAtlasReadinessAssessment(data);
  const useOfFundsTotal = calculateUseOfFundsTotal(data.useOfFundsPlan);
  const requiredDocs = data.documents.filter((document) => document.required);
  const activeLenders = data.fundingOpportunities.filter((opportunity) => opportunity.status !== 'declined');
  const sections = [
    ['Cover Page', `# ${profile.companyName} Capital Package\n\n**Prepared for:** SBA Microloan / CDFI lender review\n**Prepared by:** ${profile.founderName}\n**Requested range:** ${money(profile.fundingTargetMin)} to ${money(profile.fundingTargetMax)}\n**Atlas note:** Founder must review and submit manually.`],
    ['Executive Summary', profile.businessSummary],
    ['Business Overview', `${profile.companyName} operates in ${profile.industry || 'the practical AI products market'} from ${profile.state || 'its registered state'}. Current stage: ${profile.businessStage || profile.revenueStage}.`],
    ['Founder Background', profile.founderBackground],
    ['Funding Request', `${profile.fundingRequest}\n\nModeled request: ${money(assumptions.loanAmount)}. Minimum viable amount: ${money(profile.fundingTargetMin)}.`],
    ['Use of Funds', `${profile.useOfFunds}\n\nPlanned total: ${money(useOfFundsTotal)} against selected amount ${money(data.useOfFundsPlan.selectedAmount)}.`],
    ['Revenue Assumptions', `${profile.revenueAssumptions}\n\nStarting MRR: ${money(assumptions.startingMrr)}. Monthly customer growth: ${assumptions.monthlyCustomerGrowth}. Average subscription price: ${money(assumptions.averageSubscriptionPrice)}.`],
    ['Repayment Strategy', profile.repaymentStrategy],
    ['Risk Mitigation', profile.riskMitigation],
    ['Chapter 7 Explanation', generateChapterSevenExplanations(data).standard],
    ['Required Documents Checklist', requiredDocs.map((document) => `- ${document.completed ? '[x]' : '[ ]'} ${document.name}`).join('\n')],
    ['Due Diligence Status', data.tasks.map((task) => `- ${task.status.replaceAll('_', ' ')}: ${task.title}`).join('\n')],
    ['Lender Follow-Up Plan', activeLenders.map((lender) => `- ${lender.lenderName || lender.fundingSource}: ${lender.nextAction || 'Confirm next action'} (follow-up: ${lender.nextFollowUpDate || 'TBD'})`).join('\n')],
    ['Readiness Snapshot', `Overall readiness: ${assessment.overallReadiness}%\nSBA readiness: ${assessment.sbaReadiness}%\nCDFI readiness: ${assessment.cdfiReadiness}%\nPersonal net worth snapshot: ${money(personal.netWorth)}. Sensitive values are hidden by default in Atlas UI.`],
  ];
  const markdown = sections.map(([title, body]) => `## ${title}\n\n${body}`).join('\n\n');
  const html = sections.map(([title, body]) => `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body).replace(/\n/g, '<br />')}</p></section>`).join('\n');

  return { sections, markdown, html };
}

export function generateChapterSevenExplanations(data: AtlasData) {
  const workflow = data.chapterSevenWorkflow;
  const base = workflow.explanation || data.companyProfile.chapterSevenExplanation;
  return {
    short: `A prior Chapter 7 is disclosed transparently and addressed through a conservative request, disciplined fund use, and current business planning.`,
    standard: `${base} The request remains conservative and tied to specific business uses. Supporting documents and founder review are required before any lender submission.`,
    detailed: `To the lender reviewing this package:\n\n${base}\n\nFiling date: ${workflow.filingDate || 'to be confirmed'}. Discharge date: ${workflow.dischargeDate || 'to be confirmed'}. Current status: ${workflow.status || 'to be confirmed'}.\n\nNieves Labs is addressing this underwriting concern directly through a conservative funding request, recurring revenue model, documented use of funds, and founder review before submission. This letter is prepared for founder approval and should be reviewed before use.`,
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char] || char));
}

export type AtlasApplicationBuilderSection = {
  id: AtlasApplicationSectionId;
  title: string;
  reviewed: boolean;
  completionStatus: 'complete' | 'missing_fields' | 'needs_review';
  missingFields: string[];
  editHref: string;
  previewText: string;
};

export function buildAtlasApplicationSections(data: AtlasData, token: string): AtlasApplicationBuilderSection[] {
  const sectionState = new Map(data.applicationSections.map((section) => [section.id, section]));
  const documentMissing = data.documents.filter((document) => document.required && !document.completed).map((document) => document.name);
  const sections: Array<Omit<AtlasApplicationBuilderSection, 'reviewed' | 'completionStatus'>> = [
    {
      id: 'business_information',
      title: 'Business information',
      missingFields: missing([
        ['Company name', data.companyProfile.companyName],
        ['Product name', data.companyProfile.productName],
        ['Revenue stage', data.companyProfile.revenueStage],
      ]),
      editHref: `/atlas/capital-office?token=${encodeURIComponent(token)}`,
      previewText: `${data.companyProfile.companyName} is preparing ${data.companyProfile.productName} for ${data.companyProfile.revenueStage} operations through ${data.companyProfile.moduleName}.`,
    },
    {
      id: 'founder_information',
      title: 'Founder information',
      missingFields: missing([['Founder background', data.companyProfile.founderBackground]]),
      editHref: `/atlas/sba-loan-package?token=${encodeURIComponent(token)}`,
      previewText: data.companyProfile.founderBackground,
    },
    {
      id: 'funding_request',
      title: 'Funding request',
      missingFields: missing([
        ['Funding request', data.companyProfile.fundingRequest],
        ['Loan amount', String(data.financialAssumptions.loanAmount || '')],
      ]),
      editHref: `/atlas/financial-model?token=${encodeURIComponent(token)}`,
      previewText: `${data.companyProfile.fundingRequest} Current model assumes a ${money(data.financialAssumptions.loanAmount)} request.`,
    },
    {
      id: 'use_of_funds',
      title: 'Use of funds',
      missingFields: data.companyProfile.primaryUseOfFunds.length ? [] : ['Primary use of funds'],
      editHref: `/atlas/sba-loan-package?token=${encodeURIComponent(token)}`,
      previewText: data.companyProfile.useOfFunds,
    },
    {
      id: 'business_narrative',
      title: 'Business narrative',
      missingFields: missing([['Business summary', data.companyProfile.businessSummary]]),
      editHref: `/atlas/sba-loan-package?token=${encodeURIComponent(token)}`,
      previewText: data.companyProfile.businessSummary,
    },
    {
      id: 'revenue_assumptions',
      title: 'Revenue assumptions',
      missingFields: missing([
        ['Revenue assumptions', data.companyProfile.revenueAssumptions],
        ['Starting MRR', String(data.financialAssumptions.startingMrr || '')],
        ['Average subscription price', String(data.financialAssumptions.averageSubscriptionPrice || '')],
      ]),
      editHref: `/atlas/financial-model?token=${encodeURIComponent(token)}`,
      previewText: `${data.companyProfile.revenueAssumptions} The model starts at ${money(data.financialAssumptions.startingMrr)} MRR with an average subscription price of ${money(data.financialAssumptions.averageSubscriptionPrice)}.`,
    },
    {
      id: 'repayment_plan',
      title: 'Repayment plan',
      missingFields: missing([
        ['Repayment strategy', data.companyProfile.repaymentStrategy],
        ['Loan term', String(data.financialAssumptions.loanTermMonths || '')],
        ['Interest rate', String(data.financialAssumptions.estimatedInterestRate || '')],
      ]),
      editHref: `/atlas/financial-model?token=${encodeURIComponent(token)}`,
      previewText: data.companyProfile.repaymentStrategy,
    },
    {
      id: 'risk_mitigation',
      title: 'Risk mitigation',
      missingFields: missing([['Risk mitigation', data.companyProfile.riskMitigation]]),
      editHref: `/atlas/due-diligence-checklist?token=${encodeURIComponent(token)}`,
      previewText: data.companyProfile.riskMitigation,
    },
    {
      id: 'chapter_7_explanation',
      title: 'Chapter 7 explanation',
      missingFields: missing([['Chapter 7 explanation', data.companyProfile.chapterSevenExplanation]]),
      editHref: `/atlas/sba-loan-package?token=${encodeURIComponent(token)}`,
      previewText: data.companyProfile.chapterSevenExplanation,
    },
    {
      id: 'supporting_documents',
      title: 'Supporting documents',
      missingFields: documentMissing,
      editHref: `/atlas/document-vault?token=${encodeURIComponent(token)}`,
      previewText: documentMissing.length
        ? `${documentMissing.length} required supporting documents remain missing: ${documentMissing.slice(0, 5).join(', ')}.`
        : 'All required supporting documents are marked complete for founder review.',
    },
  ];

  return sections.map((section) => {
    const reviewed = Boolean(sectionState.get(section.id)?.reviewed);
    return {
      ...section,
      reviewed,
      completionStatus: section.missingFields.length ? 'missing_fields' : reviewed ? 'complete' : 'needs_review',
    };
  });
}

export type AtlasGeneratedDocumentType =
  | 'executive_summary'
  | 'sba_microloan_narrative'
  | 'cdfi_application_narrative'
  | 'use_of_funds_summary'
  | 'repayment_strategy'
  | 'chapter_7_explanation';

export const atlasGeneratedDocumentLabels: Record<AtlasGeneratedDocumentType, string> = {
  executive_summary: 'Executive Summary',
  sba_microloan_narrative: 'SBA Microloan Application Narrative',
  cdfi_application_narrative: 'CDFI Application Narrative',
  use_of_funds_summary: 'Use of Funds Summary',
  repayment_strategy: 'Repayment Strategy',
  chapter_7_explanation: 'Chapter 7 Explanation',
};

export function generateAtlasApplicationPreview(data: AtlasData, type: AtlasGeneratedDocumentType) {
  const profile = data.companyProfile;
  const assumptions = data.financialAssumptions;
  const activeLender = data.fundingOpportunities.find((opportunity) => opportunity.status !== 'declined');
  const useOfFunds = profile.primaryUseOfFunds.map((item) => `- ${item}`).join('\n');
  const sharedHeader = `# ${atlasGeneratedDocumentLabels[type]}\n\n**Company:** ${profile.companyName}\n**Product:** ${profile.productName}\n**Funding Target:** ${money(profile.fundingTargetMin)} to ${money(profile.fundingTargetMax)}\n**Preferred Funding:** ${profile.preferredFundingTypes.join(' / ')}\n`;

  switch (type) {
    case 'executive_summary':
      return `${sharedHeader}\n## Overview\n${profile.businessSummary}\n\n## Funding Request\n${profile.fundingRequest}\n\n## Use of Funds\n${useOfFunds}\n\n## Revenue Stage\n${profile.revenueStage}. First 90-day MRR estimate: ${profile.firstNinetyDayMrrEstimate}. Six-month MRR target: ${profile.sixMonthMrrTarget}.\n\n## Next Step\n${profile.nextAction}`;
    case 'sba_microloan_narrative':
      return `${sharedHeader}\n## Business Narrative\n${profile.businessSummary}\n\n## SBA Microloan Request\nNieves Labs is preparing a conservative request modeled at ${money(assumptions.loanAmount)} over ${assumptions.loanTermMonths} months. The request supports production readiness, launch execution, and disciplined working capital.\n\n## Repayment Strategy\n${profile.repaymentStrategy}\n\n## Risk Mitigation\n${profile.riskMitigation}`;
    case 'cdfi_application_narrative':
      return `${sharedHeader}\n## CDFI Fit\nNieves Labs is evaluating CDFI funding as a practical working-capital path for an early-stage AI products company with a measured funding request and clear use-of-funds plan.\n\n## Target Lender\n${activeLender ? `${activeLender.lenderName || activeLender.fundingSource} (${activeLender.type})` : 'Target lender not selected.'}\n\n## Community and Business Impact\nThe company focuses on practical AI tools that help professionals prepare, organize, and complete real-world workflows with more confidence and less manual work.\n\n## Underwriting Considerations\n${profile.riskMitigation}`;
    case 'use_of_funds_summary':
      return `${sharedHeader}\n## Use of Funds\n${profile.useOfFunds}\n\n${useOfFunds}\n\n## Funding Discipline\nFunds will be tied to specific launch, infrastructure, compliance, and working-capital needs tracked in Atlas before deployment.`;
    case 'repayment_strategy':
      return `${sharedHeader}\n## Repayment Plan\n${profile.repaymentStrategy}\n\n## Model Assumptions\n- Starting MRR: ${money(assumptions.startingMrr)}\n- Monthly customer growth: ${assumptions.monthlyCustomerGrowth}\n- Average subscription price: ${money(assumptions.averageSubscriptionPrice)}\n- Monthly churn: ${assumptions.monthlyChurn}%\n- Estimated interest rate: ${assumptions.estimatedInterestRate}%\n- Loan term: ${assumptions.loanTermMonths} months`;
    case 'chapter_7_explanation':
      return `${sharedHeader}\n## Chapter 7 Explanation\n${profile.chapterSevenExplanation}\n\n## Mitigation\n${profile.riskMitigation}\n\n## Founder Review Note\nThis language is prepared for founder review only. Tomas Nieves must review, edit, and approve the final explanation before any lender submission.`;
    default:
      return sharedHeader;
  }
}

function missing(fields: Array<[string, string]>) {
  return fields.filter(([, value]) => !value.trim()).map(([label]) => label);
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
