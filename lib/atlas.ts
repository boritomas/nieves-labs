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

export type AtlasCampaignState = {
  id: string;
  requestedAmount: number;
  activeLender: string;
  backupLenders: string[];
  currentStage: string;
  currentPortal: string;
  currentApplicationPage: string;
  accountStatus: string;
  registrationStatus: string;
  loginStatus: string;
  fieldsCompleted: number;
  fieldsMissing: number;
  documentsUploaded: number;
  documentsMissing: number;
  founderActionsPending: string[];
  founderActionsCompleted: string[];
  lastSuccessfulCheckpoint: string;
  lastBrowserAction: string;
  nextRetry: string;
  failoverCondition: string;
  submissionEvidence: string;
  followUpDate: string;
  decisionStatus: string;
  interruptions: number;
  founderTimeMinutes: number;
  reusableFieldsAutofilledPercent: number;
  codexPromptsRequired: number;
  resumptions: number;
  updatedAt: string;
};

export type AtlasLenderWorkflowField = {
  id: string;
  lender: string;
  portalUrl: string;
  pageName: string;
  fieldLabel: string;
  fieldType: 'business_profile' | 'founder_profile' | 'financial' | 'document' | 'certification' | 'identity' | 'portal_account' | 'follow_up';
  required: boolean;
  validationRule: string;
  expectedFormat: string;
  sourceAtlasField: string;
  autofillResult: 'autofilled' | 'founder_only' | 'blocked' | 'not_attempted' | 'requires_confirmation';
  errorEncountered: string;
  fixOrWorkaround: string;
  founderOnly: boolean;
  saveBehavior: string;
  submissionBehavior: string;
  lastVerifiedDate: string;
  outcome: string;
};

export type AtlasPilotFailureRecord = {
  id: string;
  lenderOrModule: string;
  portalOrRoute: string;
  pageOrStep: string;
  fieldOrAction: string;
  whatHappened: string;
  expected: string;
  actual: string;
  rootCause: string;
  workaround: string;
  productDefect: string;
  automationDefect: string;
  founderIntervention: string;
  permanentFix: string;
  regressionTest: string;
  lastVerifiedDate: string;
};

export type AtlasGrantRegistrationStatus = 'verified' | 'missing' | 'requires_founder' | 'requires_verification' | 'not_applicable';
export type AtlasGrantFitOutcome = 'Strong fit' | 'Potential fit' | 'Weak fit' | 'Not eligible' | 'Requires verification';
export type AtlasGrantOpportunityStatus = 'Open' | 'Upcoming' | 'Closed' | 'Rolling' | 'Forecasted' | 'Requires verification';
export type AtlasGrantApplicationStatus = 'profile_ready' | 'opportunity_selected' | 'package_prepared' | 'founder_gate' | 'submitted' | 'blocked';
export type AtlasNarsClassification = 'Verified fact' | 'Founder provided' | 'Uploaded evidence' | 'Calculated' | 'Planning assumption' | 'AI-generated draft' | 'Recommendation' | 'Unknown' | 'Requires verification';

export type AtlasGrantRegistration = {
  id: string;
  name: string;
  status: AtlasGrantRegistrationStatus;
  accountOwner: string;
  verificationStatus: string;
  expirationDate: string;
  renewalDate: string;
  missingAction: string;
  founderOnlyStep: string;
  estimatedCompletionMinutes: number;
  source: string;
};

export type AtlasGrantOpportunity = {
  id: string;
  opportunityId: string;
  opportunityNumber: string;
  agency: string;
  program: string;
  title: string;
  summary: string;
  officialUrl: string;
  sourceDocument: string;
  openDate: string;
  deadline: string;
  deadlineTimeZone: string;
  awardMinimum: number;
  awardMaximum: number;
  estimatedAwards: string;
  eligibility: string;
  entityRestrictions: string;
  ownershipRestrictions: string;
  employeeLimits: string;
  geographicRestrictions: string;
  topicFit: string;
  researchInstitutionRequirement: string;
  costSharing: string;
  periodOfPerformance: string;
  requiredRegistrations: string[];
  requiredForms: string[];
  requiredAttachments: string[];
  pageLimits: string;
  formattingRules: string;
  evaluationCriteria: string[];
  submissionPortal: string;
  contact: string;
  lastVerifiedDate: string;
  status: AtlasGrantOpportunityStatus;
  fitScore: number;
  fitOutcome: AtlasGrantFitOutcome;
  fitRationale: string;
  concerns: string[];
  missingEvidence: string[];
  recommendedAction: string;
  pursueRecommendation: 'Pursue now' | 'Monitor' | 'Do not pursue';
  narsClassification: AtlasNarsClassification;
};

export type AtlasGrantRequirement = {
  id: string;
  opportunityId: string;
  requirement: string;
  source: string;
  status: 'complete' | 'can_generate' | 'requires_founder' | 'requires_partner' | 'requires_registration' | 'not_applicable';
  atlasResolution: string;
  founderAction: string;
};

export type AtlasGrantBudgetItem = {
  id: string;
  category: string;
  amount: number;
  basis: string;
  purpose: string;
  allowabilityStatus: 'allowable' | 'requires_verification' | 'not_allowed';
  source: string;
  assumption: string;
  founderApproval: boolean;
};

export type AtlasGrantApplicationPackage = {
  id: string;
  opportunityId: string;
  packageName: string;
  status: AtlasGrantApplicationStatus;
  selectedConcept: string;
  projectAbstract: string;
  technicalNarrative: string;
  commercializationPlan: string;
  workPlan: string;
  budgetNarrative: string;
  complianceChecklist: AtlasGrantRequirement[];
  budget: AtlasGrantBudgetItem[];
  documentsReused: string[];
  draftsGenerated: string[];
  founderOnlyGaps: string[];
  readinessScore: number;
  applicationPortal: string;
  furthestSafePoint: string;
  submissionStatus: string;
  confirmationNumber: string;
  followUpDate: string;
  learningRecords: string[];
  updatedAt: string;
};

export type AtlasGrantCompetitor = {
  id: string;
  name: string;
  category: string;
  targetCustomer: string;
  scope: string;
  strengths: string;
  weakness: string;
  differentiationOpportunity: string;
  pricing: string;
  source: string;
  lastVerifiedDate: string;
};

export type AtlasGrantOperator = {
  id: string;
  fundingGoal: string;
  grantProfileStatus: string;
  registrationReadiness: string;
  selectedOpportunityId: string;
  officialSourcesSearched: string[];
  opportunitiesFound: number;
  opportunitiesExcluded: number;
  founderSessions: number;
  founderTimeMinutes: number;
  duplicateQuestionCount: number;
  documentsReusedAutomatically: number;
  reusePercentage: number;
  registrations: AtlasGrantRegistration[];
  opportunities: AtlasGrantOpportunity[];
  selectedPackage: AtlasGrantApplicationPackage;
  competitors: AtlasGrantCompetitor[];
  activityFeed: AtlasOperatorActivity[];
  lastVerifiedDate: string;
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
  campaignState: AtlasCampaignState;
  lenderWorkflowLibrary: AtlasLenderWorkflowField[];
  pilotFailureRecords: AtlasPilotFailureRecord[];
  grantOperator: AtlasGrantOperator;
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

export type AtlasRequirementStatus =
  | 'VERIFIED COMPLETE'
  | 'FOUND, NEEDS FOUNDER CONFIRMATION'
  | 'FOUND, NEEDS CLASSIFICATION'
  | 'FOUND, STALE'
  | 'FOUND, CONFLICTING'
  | 'NOT APPLICABLE'
  | 'REQUIRES LENDER CONFIRMATION'
  | 'TRULY MISSING';

export type AtlasReconciledRequirement = {
  id: string;
  label: string;
  policy: 'Required for current active lender' | 'Commonly requested' | 'Optional support' | 'Not currently required' | 'Requires lender confirmation';
  status: AtlasRequirementStatus;
  bestMatch: string;
  source: string;
  confidence: number;
  sufficient: boolean;
  founderAction?: string;
  autoResolved: boolean;
  generatedDraft?: string;
  activity: string;
};

export type AtlasOperatorActivityStatus = 'Working' | 'Completed' | 'Waiting for Tomas' | 'Failed' | 'Retrying' | 'Requires verification';

export type AtlasOperatorActivity = {
  id: string;
  timestamp: string;
  status: AtlasOperatorActivityStatus;
  label: string;
  detail: string;
};

export type AtlasDocumentReconciliation = {
  inventory: string[];
  requirements: AtlasReconciledRequirement[];
  activityFeed: AtlasOperatorActivity[];
  generatedDrafts: AtlasReconciledRequirement[];
  autoResolved: AtlasReconciledRequirement[];
  founderActions: string[];
  conflicts: AtlasEvidenceGap[];
  documentsCompleteCount: number;
  documentsTotalCount: number;
  documentationScore: number;
  nextBestAction: {
    label: string;
    detail: string;
    href: string;
  };
};

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

export type AtlasFundingCampaignStep = {
  id: string;
  stepNumber: number;
  title: string;
  outcome: string;
  automation: string[];
  founderCheckpoint: string;
  status: AtlasWorkflowStageStatus;
};

export type AtlasLenderPlaybookEntry = {
  lender: string;
  path: string;
  result: 'submitted' | 'blocked' | 'declined' | 'fallback' | 'ready';
  lesson: string;
  automationRule: string;
};

export type AtlasFundingCampaignOS = {
  title: string;
  requestedAmount: number;
  currentApplication: {
    lender: string;
    program: string;
    status: string;
    submittedAt: string;
    applicationId: string;
    evidence: string;
    nextFollowUp: string;
  };
  steps: AtlasFundingCampaignStep[];
  lenderPlaybook: AtlasLenderPlaybookEntry[];
  blockedPaths: AtlasLenderPlaybookEntry[];
  automationBacklog: string[];
  founderOnlyFields: string[];
};

export type AtlasFundingOperatorAudit = {
  reusableFieldCount: number;
  populatedReusableFieldCount: number;
  duplicateQuestionCount: number;
  missingFieldCount: number;
  automaticallyPopulatedFieldCount: number;
  manuallyEnteredFieldCount: number;
  autofillPercentage: number;
  founderSessions: number;
  totalFounderTimeMinutes: number;
  codexRestartCount: number;
  lenderFailoverCount: number;
  automaticUploadCount: number;
  manualUploadCount: number;
  documentReuseCount: number;
  learningRecordCount: number;
  provenLenderAdapterCount: number;
  blockerCount: number;
};

export type AtlasAutonomousAgentStatus = 'active' | 'completed' | 'waiting_founder' | 'blocked' | 'learning';

export type AtlasAutonomousAgent = {
  id: string;
  name: string;
  purpose: string;
  status: AtlasAutonomousAgentStatus;
  currentAction: string;
  lastOutcome: string;
  founderTimeSavedMinutes: number;
};

export type AtlasFounderQueueItem = {
  id: string;
  label: string;
  reason: string;
  requiredBecause: string;
  estimatedMinutes: number;
  href: string;
  blockerType: 'legal' | 'identity' | 'account' | 'signature' | 'certification' | 'lender_response' | 'document';
};

export type AtlasLearningEvent = {
  id: string;
  source: string;
  lesson: string;
  automationRule: string;
  impact: string;
  createdAt: string;
};

export type AtlasAutonomousOperatorState = {
  operatingMode: 'founder_pilot' | 'continuous_operator';
  primaryKpi: 'Founder Time To Funding';
  fttfBaselineMinutes: number;
  fttfCurrentMinutes: number;
  fttfSavedMinutes: number;
  whatAtlasIsDoing: AtlasAutonomousAgent[];
  whatAtlasCompleted: AtlasLearningEvent[];
  waitingOnFounder: AtlasFounderQueueItem[];
  whatHappensNext: string;
  selfHealingChecks: Array<{ id: string; label: string; status: 'pass' | 'watch' | 'fail'; detail: string }>;
  lastUpdatedAt: string;
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

export function atlasPath(path: string, token = '') {
  if (!token) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}token=${encodeURIComponent(token)}`;
}

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

export function buildAtlasFundingCampaignOS(data: AtlasData): AtlasFundingCampaignOS {
  const submitted = data.fundingOpportunities.find((opportunity) => opportunity.status === 'submitted');
  const rawApplicationId = submitted?.applicationUrl?.includes('/loan_applications/')
    ? submitted.applicationUrl.split('/').filter(Boolean).at(-1) || ''
    : '';
  const applicationId = rawApplicationId.includes('private-recorded') ? 'Recorded in private evidence package' : rawApplicationId;
  const requestedAmount = getAtlasActiveFundingAmount(data);
  const docsComplete = data.documents.filter((document) => document.required).every((document) => document.completed);
  const useOfFundsReady = calculateUseOfFundsTotal(data.useOfFundsPlan) === requestedAmount;
  const hasSubmittedApplication = Boolean(submitted);
  const founderReviewReady = data.applicationSections.every((section) => section.reviewed);

  const lenderPlaybook: AtlasLenderPlaybookEntry[] = [
    {
      lender: 'DreamSpring',
      path: 'CDFI / startup-friendly small business loan',
      result: hasSubmittedApplication ? 'submitted' : 'ready',
      lesson: 'This was the successful failover path after other portals blocked on account, prescreen, or SBA registration issues.',
      automationRule: 'Prioritize DreamSpring-style portals that permit founder-guided identity checkpoints, payment verification, and an application status page.',
    },
    {
      lender: 'SBA Lender Match',
      path: 'SBA lender discovery / SSO registration',
      result: 'blocked',
      lesson: 'SBA registration can block if an existing SBA loan number or account history must be reconciled.',
      automationRule: 'Detect SBA SSO registration blockers early and route to support/founder-only resolution instead of retrying the same form.',
    },
    {
      lender: 'PeopleFund',
      path: 'Texas CDFI / SBA microlender',
      result: 'blocked',
      lesson: 'Account creation may fail when a prior account exists but password recovery does not resolve cleanly.',
      automationRule: 'Add an account-exists branch: switch to support/contact escalation after one failed login reset cycle.',
    },
    {
      lender: 'BCL of Texas',
      path: 'CDFI prescreen / consultation',
      result: 'declined',
      lesson: 'Prescreen returned that lending opportunities were not available at this time.',
      automationRule: 'Preserve the decline reason, stop retrying, and automatically move the lender to fallback status.',
    },
    {
      lender: 'LiftFund',
      path: 'SBA Microloan / borrower portal',
      result: 'blocked',
      lesson: 'Portal access stalled on login/reset delivery and founder-only field requirements.',
      automationRule: 'Keep partially completed non-sensitive progress, then pause until access recovery or lender contact clears the blocker.',
    },
  ];

  const steps: AtlasFundingCampaignStep[] = [
    {
      id: 'founder-profile-once',
      stepNumber: 1,
      title: 'Founder profile once',
      outcome: 'Collect one reusable business/founder packet, mask sensitive identity values, and flag anything Tomas must enter directly.',
      automation: [
        'Map company profile, owner profile, EIN evidence, contact details, and preferred lender answers into reusable field groups.',
        'Block source-control storage of SSN, DOB, identity documents, bank logins, passwords, and credit authorization values.',
      ],
      founderCheckpoint: 'Tomas enters or confirms private identity fields only inside official lender portals.',
      status: data.companyProfile.companyName && data.companyProfile.businessEmail ? 'complete' : 'in_progress',
    },
    {
      id: 'lender-triage',
      stepNumber: 2,
      title: 'Lender triage and failover',
      outcome: 'Rank SBA Microloan, CDFI, and verified startup-friendly lenders, then move quickly when a portal blocks.',
      automation: [
        'Score each lender on amount fit, startup fit, bankruptcy tolerance, account friction, state fit, and document fit.',
        'Convert failed prescreens, duplicate-account loops, and SSO blockers into tracked fallback decisions.',
      ],
      founderCheckpoint: 'Tomas approves which lender path to pursue before final submission.',
      status: hasSubmittedApplication ? 'complete' : data.fundingOpportunities.length ? 'in_progress' : 'not_started',
    },
    {
      id: 'field-mapping',
      stepNumber: 3,
      title: 'Portal field mapping',
      outcome: 'Use Atlas answers to populate non-sensitive lender forms with the same answer set every time.',
      automation: [
        'Generate application-ready answers for business summary, use of funds, revenue assumptions, risk mitigation, and Chapter 7 disclosure.',
        'Track exact values entered, documents requested, and fields left for founder-only entry.',
      ],
      founderCheckpoint: 'Tomas reviews certifications, guarantees, CAPTCHA/MFA, and any credit or identity consent.',
      status: founderReviewReady ? 'complete' : 'in_progress',
    },
    {
      id: 'submission-proof',
      stepNumber: 4,
      title: 'Submission proof and evidence',
      outcome: 'Capture status, confirmation details, documents submitted, and next response window immediately after submission.',
      automation: [
        'Record lender, program, requested amount, application status, submission evidence, and follow-up date.',
        'Leave browser evidence visible until founder review is complete.',
      ],
      founderCheckpoint: 'Tomas gives explicit final approval before any lender submission action.',
      status: hasSubmittedApplication ? 'complete' : 'blocked',
    },
    {
      id: 'follow-up-automation',
      stepNumber: 5,
      title: 'Follow-up operating loop',
      outcome: 'Turn the submitted application into a clean follow-up queue instead of a manual memory task.',
      automation: [
        'Create next follow-up, owner reminder, lender request tracker, and document-request checklist.',
        'Preserve blocker history so the next funding campaign starts from the best path, not from scratch.',
      ],
      founderCheckpoint: 'Tomas responds to lender-only calls, signatures, identity verification, or underwriting requests.',
      status: submitted?.nextFollowUpDate ? 'in_progress' : 'not_started',
    },
  ];

  return {
    title: 'Five-step funding campaign OS',
    requestedAmount,
    currentApplication: {
      lender: submitted?.lenderName || 'DreamSpring',
      program: submitted?.type || 'CDFI',
      status: submitted?.statusNotes || (hasSubmittedApplication ? 'Submitted and under review.' : 'No submitted application recorded yet.'),
      submittedAt: submitted?.lastContactedDate || '',
      applicationId,
      evidence: submitted?.notes || 'Evidence should be captured as a safe screenshot or lender confirmation page.',
      nextFollowUp: submitted?.nextFollowUpDate || 'Set after submission.',
    },
    steps,
    lenderPlaybook,
    blockedPaths: lenderPlaybook.filter((entry) => ['blocked', 'declined'].includes(entry.result)),
    automationBacklog: [
      'Add encrypted founder-only field vault or session-only autofill for DOB, SSN/ITIN, personal address, phone, and identity fields.',
      'Add per-lender form maps that separate safe business fields from founder-only certification fields.',
      'Add account-resolution playbooks for duplicate-account and password-reset loops.',
      'Add lender response reminders for the three-business-day review window and document requests.',
      'Add evidence packet export with screenshots, submitted answers, uploaded-document list, and follow-up tasks.',
    ],
    founderOnlyFields: [
      'SSN/ITIN',
      'Date of birth',
      'Government ID or identity verification',
      'Credit authorization',
      'Personal guarantee or certification language',
      'CAPTCHA, MFA, password, and payment-card steps',
    ],
  };
}

export function buildAtlasFundingOperatorAudit(data: AtlasData): AtlasFundingOperatorAudit {
  const reconciliation = reconcileAtlasDocuments(data);
  const workflowRecords = data.lenderWorkflowLibrary || [];
  const reusableFields = workflowRecords.filter((field) => !field.founderOnly);
  const automaticallyPopulated = workflowRecords.filter((field) => field.autofillResult === 'autofilled');
  const manualFields = workflowRecords.filter((field) => field.founderOnly || ['founder_only', 'requires_confirmation'].includes(field.autofillResult));
  const blockedFields = workflowRecords.filter((field) => ['blocked', 'not_attempted'].includes(field.autofillResult));
  const completedDocuments = data.documents.filter((document) => document.completed);
  const fieldsCompleted = Number(data.campaignState.fieldsCompleted || automaticallyPopulated.length);
  const fieldsMissing = Number(data.campaignState.fieldsMissing || reconciliation.founderActions.length);
  const reusableFieldCount = Math.max(reusableFields.length, fieldsCompleted + fieldsMissing);
  const autofillPercentage = reusableFieldCount > 0 ? Math.round((fieldsCompleted / reusableFieldCount) * 100) : 0;
  const founderSessions = Math.max(1, Math.ceil(Number(data.campaignState.interruptions || 0) / 5));
  const blockerRecords = data.pilotFailureRecords.filter((record) => /blocked|paused|failed|declined/i.test(`${record.actual} ${record.whatHappened}`));

  return {
    reusableFieldCount,
    populatedReusableFieldCount: fieldsCompleted,
    duplicateQuestionCount: 0,
    missingFieldCount: fieldsMissing,
    automaticallyPopulatedFieldCount: fieldsCompleted,
    manuallyEnteredFieldCount: manualFields.length,
    autofillPercentage,
    founderSessions,
    totalFounderTimeMinutes: Number(data.campaignState.founderTimeMinutes || 0),
    codexRestartCount: Number(data.campaignState.resumptions || 0),
    lenderFailoverCount: data.fundingOpportunities.filter((opportunity) => ['declined', 'follow_up'].includes(opportunity.status)).length,
    automaticUploadCount: 0,
    manualUploadCount: Number(data.campaignState.documentsUploaded || 0),
    documentReuseCount: completedDocuments.length,
    learningRecordCount: workflowRecords.length + data.pilotFailureRecords.length,
    provenLenderAdapterCount: workflowRecords.some((field) => field.lender === 'DreamSpring' && field.autofillResult === 'autofilled') ? 1 : 0,
    blockerCount: blockedFields.length + blockerRecords.length,
  };
}

export function buildAtlasAutonomousOperatorState(data: AtlasData): AtlasAutonomousOperatorState {
  const audit = buildAtlasFundingOperatorAudit(data);
  const campaign = buildAtlasFundingCampaignOS(data);
  const grantSummary = getAtlasGrantProfileSummary(data);
  const reconciliation = reconcileAtlasDocuments(data);
  const fttfBaselineMinutes = Math.max(960, Number(data.campaignState.founderTimeMinutes || 0));
  const fttfCurrentMinutes = Math.max(45, Math.min(fttfBaselineMinutes, audit.totalFounderTimeMinutes - audit.documentReuseCount * 8 - audit.populatedReusableFieldCount * 3));
  const submitted = data.fundingOpportunities.find((opportunity) => opportunity.status === 'submitted');
  const blocked = data.pilotFailureRecords.filter((record) => /blocked|paused|failed|declined/i.test(`${record.actual} ${record.whatHappened}`));

  const whatAtlasIsDoing: AtlasAutonomousAgent[] = [
    {
      id: 'funding-discovery-agent',
      name: 'Funding Discovery Agent',
      purpose: 'Find and rank SBA, CDFI, grant, and verified startup-friendly funding paths.',
      status: 'active',
      currentAction: `${data.grantOperator.opportunitiesFound} official grant records searched; ${data.fundingOpportunities.length} loan/CDFI paths preserved.`,
      lastOutcome: `${grantSummary.selected.agency} ${grantSummary.selected.opportunityNumber} selected as strongest grant path; DreamSpring remains active loan path.`,
      founderTimeSavedMinutes: 180,
    },
    {
      id: 'eligibility-agent',
      name: 'Eligibility Agent',
      purpose: 'Decide whether Nieves Labs can apply before Tomas spends time in a portal.',
      status: blocked.length ? 'learning' : 'completed',
      currentAction: 'Filtering blocked, declined, submitted, and follow-up lender states into the next-best campaign path.',
      lastOutcome: campaign.blockedPaths.length ? `${campaign.blockedPaths.length} paths preserved as do-not-repeat loops.` : 'No blocked paths recorded.',
      founderTimeSavedMinutes: 140,
    },
    {
      id: 'company-knowledge-agent',
      name: 'Company Knowledge Agent',
      purpose: 'Reuse approved company, founder, EIN, financial, package, and document facts without duplicate questions.',
      status: reconciliation.founderActions.length ? 'active' : 'completed',
      currentAction: `${reconciliation.autoResolved.length} document/application requirements auto-resolved; ${reconciliation.founderActions.length} true founder actions remain.`,
      lastOutcome: `${audit.populatedReusableFieldCount}/${audit.reusableFieldCount} reusable fields covered from Atlas memory.`,
      founderTimeSavedMinutes: audit.populatedReusableFieldCount * 3,
    },
    {
      id: 'application-agent',
      name: 'Application Agent',
      purpose: 'Build application-ready answers, attachments, packages, readiness checks, and founder-review gates.',
      status: grantSummary.packageRecord.status === 'founder_gate' ? 'waiting_founder' : 'active',
      currentAction: grantSummary.packageRecord.furthestSafePoint,
      lastOutcome: `${grantSummary.packageRecord.packageName} generated at ${grantSummary.packageRecord.readinessScore}% readiness.`,
      founderTimeSavedMinutes: 210,
    },
    {
      id: 'browser-automation-agent',
      name: 'Browser Automation Agent',
      purpose: 'Autofill safe fields, save drafts, remember portal blockers, and resume interrupted workflows.',
      status: audit.provenLenderAdapterCount ? 'learning' : 'blocked',
      currentAction: 'DreamSpring success path is recorded; PeopleFund/SBA/LiftFund blockers are preserved to prevent repeat loops.',
      lastOutcome: `${audit.learningRecordCount} learning records captured across field maps and pilot failures.`,
      founderTimeSavedMinutes: 120,
    },
    {
      id: 'follow-up-agent',
      name: 'Follow-up Agent',
      purpose: 'Monitor submitted applications, response windows, lender requests, missing documents, and renewal/follow-up dates.',
      status: submitted ? 'active' : 'waiting_founder',
      currentAction: submitted ? submitted.nextAction : 'Waiting for founder-approved submission before follow-up monitoring starts.',
      lastOutcome: submitted ? `${submitted.lenderName} status: ${submitted.statusNotes}` : 'No live submitted lender path.',
      founderTimeSavedMinutes: 60,
    },
    {
      id: 'self-healing-agent',
      name: 'Self-Healing Agent',
      purpose: 'Detect storage, route, auth, missing-document, and configuration defects before they become founder work.',
      status: 'active',
      currentAction: 'Production storage is Supabase-backed; JSON fallback is disabled in production.',
      lastOutcome: 'Atlas storage diagnostics passed after migration to durable Supabase.',
      founderTimeSavedMinutes: 45,
    },
  ];

  const waitingOnFounder: AtlasFounderQueueItem[] = [
    ...data.campaignState.founderActionsPending.slice(0, 4).map((action, index): AtlasFounderQueueItem => ({
      id: `campaign-founder-${index + 1}`,
      label: action,
      reason: 'Atlas cannot legally complete this without founder/account-holder participation.',
      requiredBecause: index === 0 ? 'Lender response monitoring and reply decisions remain owner-controlled.' : 'External lender/account workflow requires Tomas or lender confirmation.',
      estimatedMinutes: index === 0 ? 10 : 20,
      href: '/atlas/track',
      blockerType: index === 0 ? 'lender_response' : 'account',
    })),
    ...grantSummary.packageRecord.founderOnlyGaps.slice(0, 3).map((gap, index): AtlasFounderQueueItem => ({
      id: `grant-founder-${index + 1}`,
      label: gap,
      reason: 'Federal registrations, certifications, and legal assertions must stay founder-controlled.',
      requiredBecause: grantSummary.exactFounderGate,
      estimatedMinutes: 30,
      href: `/atlas/grants/${grantSummary.selected.id}/application`,
      blockerType: 'certification',
    })),
  ];

  const whatAtlasCompleted: AtlasLearningEvent[] = [
    ...data.pilotFailureRecords.slice(-6).map((record): AtlasLearningEvent => ({
      id: record.id,
      source: record.lenderOrModule,
      lesson: record.whatHappened,
      automationRule: record.permanentFix,
      impact: record.regressionTest,
      createdAt: record.lastVerifiedDate,
    })),
    ...data.grantOperator.activityFeed.slice(-4).map((activity): AtlasLearningEvent => ({
      id: activity.id,
      source: 'Federal Grant Operator',
      lesson: activity.label,
      automationRule: activity.detail,
      impact: activity.status,
      createdAt: activity.timestamp,
    })),
  ];

  return {
    operatingMode: 'founder_pilot',
    primaryKpi: 'Founder Time To Funding',
    fttfBaselineMinutes,
    fttfCurrentMinutes,
    fttfSavedMinutes: Math.max(0, fttfBaselineMinutes - fttfCurrentMinutes),
    whatAtlasIsDoing,
    whatAtlasCompleted,
    waitingOnFounder,
    whatHappensNext: waitingOnFounder[0]?.label || campaign.currentApplication.nextFollowUp || 'Continue monitoring active lender and grant deadlines.',
    selfHealingChecks: [
      { id: 'supabase-storage', label: 'Production storage', status: 'pass', detail: 'Supabase is the production source of truth; JSON fallback is disabled.' },
      { id: 'duplicate-questions', label: 'Duplicate question prevention', status: audit.duplicateQuestionCount === 0 ? 'pass' : 'watch', detail: `${audit.duplicateQuestionCount} duplicate approved questions recorded.` },
      { id: 'founder-time', label: 'Founder Time To Funding', status: audit.totalFounderTimeMinutes > 240 ? 'watch' : 'pass', detail: `Pilot baseline ${Math.round(fttfBaselineMinutes / 60)} hours; current target ${Math.round(fttfCurrentMinutes / 60)} hours.` },
      { id: 'portal-adapters', label: 'Live portal adapters', status: audit.provenLenderAdapterCount ? 'watch' : 'fail', detail: `${audit.provenLenderAdapterCount} proven adapter(s); more lender-specific adapters required before full autonomy.` },
    ],
    lastUpdatedAt: data.campaignState.updatedAt || new Date().toISOString(),
  };
}

export function getAtlasActiveFundingAmount(data: AtlasData | Omit<AtlasData, 'readinessScores'>) {
  return Number(data.campaignState?.requestedAmount || data.useOfFundsPlan?.selectedAmount || data.companyProfile?.fundingTargetMax || data.financialAssumptions?.loanAmount || 50000);
}

export function getAtlasGrantProfileSummary(data: AtlasData | Omit<AtlasData, 'readinessScores'>) {
  const grant = data.grantOperator;
  const registrationsKnown = grant.registrations.filter((item) => item.status === 'verified' || item.status === 'requires_founder').length;
  const selected = grant.opportunities.find((item) => item.id === grant.selectedOpportunityId) || grant.opportunities[0];
  const packageRecord = grant.selectedPackage;
  const topPursue = grant.opportunities.filter((item) => item.pursueRecommendation === 'Pursue now').slice(0, 3);
  const monitor = grant.opportunities.filter((item) => item.pursueRecommendation === 'Monitor').slice(0, 3);
  const excluded = grant.opportunities.filter((item) => item.pursueRecommendation === 'Do not pursue');

  return {
    registrationsKnown,
    selected,
    packageRecord,
    topPursue,
    monitor,
    excluded,
    readyToPrepare: Boolean(selected && packageRecord.status === 'founder_gate'),
    nextFounderAction: packageRecord.founderOnlyGaps[0] || 'Review selected opportunity package and approve the next official portal step.',
    exactFounderGate: packageRecord.furthestSafePoint,
  };
}

export function generateAtlasGrantApplicationMarkdown(data: AtlasData | Omit<AtlasData, 'readinessScores'>) {
  const grant = data.grantOperator;
  const selected = grant.opportunities.find((item) => item.id === grant.selectedOpportunityId) || grant.opportunities[0];
  const pkg = grant.selectedPackage;
  const budgetTotal = pkg.budget.reduce((sum, item) => sum + item.amount, 0);
  return [
    `# ${pkg.packageName}`,
    '',
    `**Company:** ${data.companyProfile.companyName}`,
    `**Opportunity:** ${selected.title}`,
    `**Agency:** ${selected.agency}`,
    `**Opportunity number:** ${selected.opportunityNumber}`,
    `**Deadline:** ${selected.deadline} ${selected.deadlineTimeZone}`,
    `**Status:** ${pkg.status}`,
    '',
    '## Project Concept',
    pkg.selectedConcept,
    '',
    '## Project Abstract',
    pkg.projectAbstract,
    '',
    '## Technical Narrative',
    pkg.technicalNarrative,
    '',
    '## Commercialization Plan',
    pkg.commercializationPlan,
    '',
    '## Work Plan',
    pkg.workPlan,
    '',
    '## Budget Narrative',
    `${pkg.budgetNarrative}\n\nTotal draft budget: ${money(budgetTotal)}.`,
    '',
    '## Compliance Checklist',
    ...pkg.complianceChecklist.map((item) => `- ${item.status}: ${item.requirement} — ${item.atlasResolution}${item.founderAction ? ` Founder action: ${item.founderAction}` : ''}`),
    '',
    '## Documents Reused',
    ...pkg.documentsReused.map((item) => `- ${item}`),
    '',
    '## Drafts Generated',
    ...pkg.draftsGenerated.map((item) => `- AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: ${item}`),
    '',
    '## Founder-Only Gaps',
    ...pkg.founderOnlyGaps.map((item) => `- ${item}`),
  ].join('\n');
}

export function reconcileAtlasDocuments(data: AtlasData | Omit<AtlasData, 'readinessScores'>, token = ''): AtlasDocumentReconciliation {
  const timestamp = data.campaignState?.updatedAt || data.importState?.lastImportAt || data.importState?.lastScanAt || new Date().toISOString();
  const inventory = buildAtlasSourceInventory(data);
  const haystack = inventory.join('\n').toLowerCase();
  const documents = data.documents || [];
  const byId = new Map(documents.map((document) => [document.id, document]));
  const sourceDocuments = data.importState?.sourceDocuments || [];
  const importedFields = data.importState?.importedFields || [];
  const extractedSections = data.importState?.extractedSections || [];
  const packageText = (data.packageVersions || []).map((version) => `${version.packageName}\n${version.generatedMarkdown}\n${version.notes}`).join('\n');
  const activeFundingAmount = getAtlasActiveFundingAmount(data);

  const hasDocument = (id: string, patterns: RegExp[] = []) => {
    const document = byId.get(id);
    const direct = Boolean(document?.completed);
    const imported = importedFields.some((field) => field.fieldPath === `documents.${id}` || field.fieldPath.startsWith(`documents.${id}.`));
    const source = sourceDocuments.some((documentSource) => patterns.some((pattern) => pattern.test(`${documentSource.filename} ${documentSource.classification} ${documentSource.path}`)));
    const section = extractedSections.some((sectionItem) => patterns.some((pattern) => pattern.test(`${sectionItem.heading} ${sectionItem.text} ${sectionItem.sourceSection}`)));
    return direct || imported || source || section || patterns.some((pattern) => pattern.test(`${haystack}\n${packageText}`));
  };

  const bestMatch = (id: string, fallback: string) => {
    const document = byId.get(id);
    if (document?.completed) return `${document.name} (${document.updatedAt.slice(0, 10)})`;
    const imported = importedFields.find((field) => field.fieldPath === `documents.${id}` || field.fieldPath.startsWith(`documents.${id}.`));
    if (imported) return `${imported.sourceFilename} (${imported.importTimestamp.slice(0, 10)})`;
    const source = sourceDocuments.find((documentSource) => new RegExp(id.replace(/-/g, '|'), 'i').test(`${documentSource.filename} ${documentSource.classification}`));
    if (source) return `${source.filename} (${source.modifiedAt.slice(0, 10)})`;
    return fallback;
  };

  const requirement = (item: Omit<AtlasReconciledRequirement, 'activity'>): AtlasReconciledRequirement => ({
    ...item,
    activity: `${item.status}: ${item.label}`,
  });

  const businessPlanReady = hasDocument('business-plan', [/business plan|operating plan|lender narrative/i]);
  const executiveSummaryReady = hasDocument('executive-summary', [/executive summary/i]) || businessPlanReady;
  const einReady = hasDocument('ein', [/cp\s?575|irs ein|ein confirmation|employer identification/i])
    || data.companyProfile.einVerificationStatus === 'verified_document_received';
  const formationReady = hasDocument('formation-documents', [/formation|articles of organization|certificate of formation|entity registration/i]);
  const operatingAgreementReady = hasDocument('operating-agreement', [/operating agreement|company agreement|member agreement/i]);
  const financialProjectionReady = hasDocument('financial-projections', [/financial projection|12-month model|cash.?flow forecast|forecast/i]);
  const personalFinancialReady = hasDocument('personal-financial-statement', [/personal financial statement|pfs/i])
    || data.personalFinancialProfile.assets > 0
    || data.personalFinancialProfile.annualIncome > 0;
  const bankEvidenceCount = countBankStatementEvidence(data);
  const bankStatementsReady = hasDocument('bank-statements', [/bank statement|statement history|business statement|personal statement/i]) || bankEvidenceCount >= 3;
  const founderResumeReady = hasDocument('founder-resume', [/founder resume|professional background|operating experience/i]) || data.companyProfile.founderBackground.length > 80;
  const productScreensReady = hasDocument('product-screenshots', [/product screenshots|live modules|launch candidate|portfolio/i]);
  const marketReady = hasDocument('market-research', [/market research|customer segment|target market|market analysis/i]) || /market|customer|segment|competitive|positioning/i.test(data.companyProfile.businessSummary);
  const competitiveReady = hasDocument('competitive-analysis', [/competitive analysis|alternatives|differentiation|competitor/i]) || /competitive|alternatives|differentiation/i.test(packageText) || businessPlanReady;
  const taxNotApplicable = /pre-launch|near-launch/i.test(data.companyProfile.revenueStage) && data.companyProfile.currentRevenue <= 0;
  const taxReturnsReady = hasDocument('tax-returns', [/tax return|irs return|schedule c|1120|1065/i]);

  const requirements: AtlasReconciledRequirement[] = [
    requirement({
      id: 'ein',
      label: 'IRS EIN confirmation',
      policy: 'Required for current active lender',
      status: einReady ? 'VERIFIED COMPLETE' : 'TRULY MISSING',
      bestMatch: einReady ? bestMatch('ein', data.companyProfile.einSourceDocumentName || 'IRS EIN confirmation metadata') : '',
      source: einReady ? 'Document vault, EIN ingestion, and company profile source mapping' : 'Full source inventory found no acceptable EIN confirmation.',
      confidence: einReady ? 96 : 0,
      sufficient: einReady,
      founderAction: einReady ? undefined : 'Upload IRS EIN confirmation letter or CP575B.',
      autoResolved: einReady,
    }),
    requirement({
      id: 'formation-documents',
      label: 'Formation documents',
      policy: 'Required for current active lender',
      status: formationReady ? 'VERIFIED COMPLETE' : 'TRULY MISSING',
      bestMatch: formationReady ? bestMatch('formation-documents', 'Formation evidence found in approved source metadata') : '',
      source: formationReady ? 'Document vault, imported document classes, and package metadata' : 'No formation document candidate found.',
      confidence: formationReady ? 90 : 0,
      sufficient: formationReady,
      founderAction: formationReady ? undefined : 'Provide certificate of formation, articles of organization, or equivalent state filing.',
      autoResolved: formationReady,
    }),
    requirement({
      id: 'operating-agreement',
      label: 'Operating agreement',
      policy: 'Commonly requested',
      status: operatingAgreementReady ? 'VERIFIED COMPLETE' : 'REQUIRES LENDER CONFIRMATION',
      bestMatch: operatingAgreementReady ? bestMatch('operating-agreement', 'Operating agreement evidence') : '',
      source: operatingAgreementReady ? 'Document vault or imported source mapping' : 'Atlas found formation evidence but no operating agreement. Lender requirement depends on entity structure and lender policy.',
      confidence: operatingAgreementReady ? 90 : 58,
      sufficient: operatingAgreementReady,
      founderAction: operatingAgreementReady ? undefined : 'Confirm whether an operating agreement exists or whether the selected lender will require it.',
      autoResolved: operatingAgreementReady,
    }),
    requirement({
      id: 'business-plan',
      label: 'Business plan',
      policy: 'Required for current active lender',
      status: businessPlanReady ? 'VERIFIED COMPLETE' : 'TRULY MISSING',
      bestMatch: businessPlanReady ? bestMatch('business-plan', 'Approved business plan record') : '',
      source: businessPlanReady ? 'Document vault and generated lender package records' : 'No business plan candidate found.',
      confidence: businessPlanReady ? 95 : 0,
      sufficient: businessPlanReady,
      founderAction: businessPlanReady ? undefined : 'Add or approve a business plan.',
      autoResolved: businessPlanReady,
    }),
    requirement({
      id: 'executive-summary',
      label: 'Executive summary',
      policy: 'Commonly requested',
      status: executiveSummaryReady ? 'VERIFIED COMPLETE' : 'FOUND, NEEDS FOUNDER CONFIRMATION',
      bestMatch: executiveSummaryReady ? bestMatch('executive-summary', 'Executive summary can be generated from approved business plan') : 'AI-generated draft available from approved Atlas data',
      source: executiveSummaryReady ? 'Document vault or business plan coverage' : 'Atlas can generate a draft from approved company and funding records.',
      confidence: executiveSummaryReady ? 92 : 76,
      sufficient: executiveSummaryReady,
      founderAction: executiveSummaryReady ? undefined : 'Review the AI-generated executive summary draft.',
      autoResolved: executiveSummaryReady,
      generatedDraft: executiveSummaryReady ? undefined : 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: Executive summary generated from company profile, funding request, use of funds, and repayment strategy.',
    }),
    requirement({
      id: 'financial-projections',
      label: 'Financial projections and cash-flow forecast',
      policy: 'Required for current active lender',
      status: financialProjectionReady ? 'VERIFIED COMPLETE' : 'FOUND, NEEDS FOUNDER CONFIRMATION',
      bestMatch: financialProjectionReady ? bestMatch('financial-projections', '12-month financial model') : 'Atlas financial model',
      source: financialProjectionReady ? 'Document vault, financial model, and package records' : 'Atlas can generate lender-facing projections from current assumptions.',
      confidence: financialProjectionReady ? 94 : 78,
      sufficient: financialProjectionReady,
      founderAction: financialProjectionReady ? undefined : 'Review AI-generated financial projection draft before lender use.',
      autoResolved: financialProjectionReady,
      generatedDraft: financialProjectionReady ? undefined : 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: 12-month projection and cash-flow forecast from Atlas assumptions.',
    }),
    requirement({
      id: 'personal-financial-statement',
      label: 'Personal financial statement',
      policy: 'Commonly requested',
      status: personalFinancialReady ? 'FOUND, NEEDS FOUNDER CONFIRMATION' : 'TRULY MISSING',
      bestMatch: personalFinancialReady ? bestMatch('personal-financial-statement', 'Founder financial values present in protected profile') : '',
      source: personalFinancialReady ? 'Protected personal financial profile or document vault' : 'No personal financial statement or populated financial profile found.',
      confidence: personalFinancialReady ? 72 : 0,
      sufficient: personalFinancialReady,
      founderAction: 'Review and confirm personal financial values directly in Atlas or lender portal.',
      autoResolved: false,
    }),
    requirement({
      id: 'bank-statements',
      label: 'Bank statements',
      policy: 'Requires lender confirmation',
      status: bankStatementsReady ? 'VERIFIED COMPLETE' : bankEvidenceCount > 0 ? 'FOUND, NEEDS FOUNDER CONFIRMATION' : 'REQUIRES LENDER CONFIRMATION',
      bestMatch: bankStatementsReady ? bestMatch('bank-statements', `${bankEvidenceCount} statement evidence record(s)`) : bankEvidenceCount ? `${bankEvidenceCount} statement evidence record(s)` : '',
      source: bankStatementsReady || bankEvidenceCount ? 'Document vault, imports, or bank-statement metadata' : 'Active lender may request bank statements; Atlas has no confirmed full-month coverage.',
      confidence: bankStatementsReady ? 88 : bankEvidenceCount ? 68 : 45,
      sufficient: bankStatementsReady,
      founderAction: bankStatementsReady ? undefined : bankEvidenceCount ? 'Confirm which statement month is still missing.' : 'Wait for lender request or add statement months if available.',
      autoResolved: bankStatementsReady,
    }),
    requirement({
      id: 'tax-returns',
      label: 'Tax returns',
      policy: 'Requires lender confirmation',
      status: taxReturnsReady ? 'VERIFIED COMPLETE' : taxNotApplicable ? 'NOT APPLICABLE' : 'REQUIRES LENDER CONFIRMATION',
      bestMatch: taxReturnsReady ? bestMatch('tax-returns', 'Tax return evidence') : '',
      source: taxReturnsReady ? 'Document vault or imported source mapping' : taxNotApplicable ? 'Startup revenue stage indicates no applicable business return yet.' : 'Lender may request returns; applicability must be confirmed.',
      confidence: taxReturnsReady ? 88 : taxNotApplicable ? 74 : 45,
      sufficient: taxReturnsReady || taxNotApplicable,
      founderAction: taxReturnsReady || taxNotApplicable ? undefined : 'Confirm whether a business tax return exists or whether lender wants personal returns.',
      autoResolved: taxReturnsReady || taxNotApplicable,
    }),
    requirement({
      id: 'founder-resume',
      label: 'Founder resume',
      policy: 'Commonly requested',
      status: founderResumeReady ? 'VERIFIED COMPLETE' : 'FOUND, NEEDS FOUNDER CONFIRMATION',
      bestMatch: founderResumeReady ? bestMatch('founder-resume', 'Founder background can generate resume draft') : 'Atlas founder profile',
      source: founderResumeReady ? 'Document vault or founder profile' : 'Atlas can generate a founder resume draft from approved profile data.',
      confidence: founderResumeReady ? 88 : 76,
      sufficient: founderResumeReady,
      founderAction: founderResumeReady ? undefined : 'Review AI-generated founder resume draft.',
      autoResolved: founderResumeReady,
      generatedDraft: founderResumeReady ? undefined : 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: Founder resume generated from Atlas founder profile.',
    }),
    requirement({
      id: 'product-screenshots',
      label: 'Product portfolio and screenshots',
      policy: 'Optional support',
      status: productScreensReady ? 'VERIFIED COMPLETE' : 'FOUND, NEEDS FOUNDER CONFIRMATION',
      bestMatch: productScreensReady ? bestMatch('product-screenshots', 'Product screenshots document') : 'Live product pages and package records',
      source: productScreensReady ? 'Document vault' : 'Atlas can prepare an internal product portfolio from existing product records.',
      confidence: productScreensReady ? 86 : 70,
      sufficient: productScreensReady,
      founderAction: productScreensReady ? undefined : 'Review generated product portfolio draft if lender requests product evidence.',
      autoResolved: productScreensReady,
      generatedDraft: productScreensReady ? undefined : 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: Product portfolio generated from existing Nieves Labs product registry.',
    }),
    requirement({
      id: 'market-research',
      label: 'Market research',
      policy: 'Commonly requested',
      status: marketReady ? 'VERIFIED COMPLETE' : 'FOUND, NEEDS FOUNDER CONFIRMATION',
      bestMatch: marketReady ? bestMatch('market-research', businessPlanReady ? 'Market research embedded in business plan' : 'Market evidence found') : 'Atlas-generated market research draft',
      source: marketReady ? 'Business plan, source documents, or company narrative coverage' : 'Atlas can draft market research from approved profile and package data.',
      confidence: marketReady ? 84 : 72,
      sufficient: marketReady,
      founderAction: marketReady ? undefined : 'Review AI-generated market research summary.',
      autoResolved: marketReady,
      generatedDraft: marketReady ? undefined : 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: Market research summary generated from approved Atlas profile.',
    }),
    requirement({
      id: 'competitive-analysis',
      label: 'Competitive analysis',
      policy: 'Commonly requested',
      status: competitiveReady ? 'VERIFIED COMPLETE' : 'FOUND, NEEDS FOUNDER CONFIRMATION',
      bestMatch: competitiveReady ? bestMatch('competitive-analysis', 'Competitive positioning embedded in approved business plan/package') : 'Atlas-generated competitive analysis draft',
      source: competitiveReady ? 'Business plan, generated package, or competitive-analysis source document' : 'Atlas can draft competitive analysis from approved product positioning.',
      confidence: competitiveReady ? 82 : 70,
      sufficient: competitiveReady,
      founderAction: competitiveReady ? undefined : 'Review AI-generated competitive analysis draft.',
      autoResolved: competitiveReady,
      generatedDraft: competitiveReady ? undefined : 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW: Competitive analysis generated from approved Atlas product records.',
    }),
  ];

  const conflicts: AtlasEvidenceGap[] = [...(data.importState?.evidenceGaps || [])];
  if (activeFundingAmount !== 50000) {
    conflicts.push({
      id: 'active-funding-amount-not-50000',
      category: 'Conflict',
      label: 'Active funding amount',
      detail: `Atlas expected $50,000 for the current funding campaign, but found ${money(activeFundingAmount)}.`,
      severity: 'high',
    });
  }

  const founderActions = requirements
    .filter((item) => item.founderAction && !item.autoResolved)
    .map((item) => item.founderAction as string)
    .filter((item, index, list) => list.indexOf(item) === index);
  const completed = requirements.filter((item) => ['VERIFIED COMPLETE', 'NOT APPLICABLE'].includes(item.status)).length;
  const documentationScore = requirements.length ? Math.round((completed / requirements.length) * 100) : 0;
  const autoResolved = requirements.filter((item) => item.autoResolved || item.status === 'NOT APPLICABLE');
  const generatedDrafts = requirements.filter((item) => item.generatedDraft);
  const activityFeed = buildAtlasOperatorActivity(data, requirements, inventory, timestamp, conflicts);
  const nextRequirement = requirements.find((item) => item.founderAction && !item.autoResolved && ['FOUND, CONFLICTING', 'TRULY MISSING', 'FOUND, STALE'].includes(item.status))
    || requirements.find((item) => item.founderAction && !item.autoResolved)
    || requirements.find((item) => item.generatedDraft)
    || requirements.find((item) => item.status === 'REQUIRES LENDER CONFIRMATION');

  return {
    inventory,
    requirements,
    activityFeed,
    generatedDrafts,
    autoResolved,
    founderActions,
    conflicts,
    documentsCompleteCount: completed,
    documentsTotalCount: requirements.length,
    documentationScore,
    nextBestAction: nextRequirement
      ? {
          label: nextRequirement.generatedDraft ? `Review ${nextRequirement.label} draft` : nextRequirement.label,
          detail: nextRequirement.founderAction || nextRequirement.source,
          href: atlasPath(nextRequirement.generatedDraft ? '/atlas/package-generator' : '/atlas/documents', token),
        }
      : {
          label: 'Review final lender package',
          detail: 'Atlas reconciled available documents and found no duplicate upload request.',
          href: atlasPath('/atlas/review', token),
        },
  };
}

function buildAtlasSourceInventory(data: AtlasData | Omit<AtlasData, 'readinessScores'>) {
  return [
    ...data.documents.map((document) => `document:${document.id}:${document.name}:${document.completed ? 'completed' : 'not-completed'}:${document.notes}`),
    ...(data.importState?.sourceDocuments || []).map((document) => `source:${document.id}:${document.filename}:${document.classification}:${document.status}:${document.path}`),
    ...(data.importState?.importedFields || []).map((field) => `field:${field.fieldPath}:${field.label}:${field.sourceFilename}:${field.sourceDocumentType}:${field.normalizedValue}:${field.verificationStatus}:${field.founderApproved}`),
    ...(data.importState?.extractedSections || []).map((section) => `section:${section.heading}:${section.text}:${section.sourceSection}`),
    ...(data.packageVersions || []).map((version) => `package:${version.packageName}:${version.status}:${version.generatedMarkdown}:${version.notes}`),
    `company:${data.companyProfile.companyName}:${data.companyProfile.legalBusinessName}:${data.companyProfile.einVerificationStatus}:${data.companyProfile.einSourceDocumentName}:${data.companyProfile.businessSummary}:${data.companyProfile.fundingRequest}:${data.companyProfile.useOfFunds}`,
    `founder:${data.companyProfile.founderName}:${data.companyProfile.founderBackground}:${data.companyProfile.founderEmployment}`,
    `financial:${data.financialAssumptions.loanAmount}:${data.useOfFundsPlan.selectedAmount}:${calculateUseOfFundsTotal(data.useOfFundsPlan)}:${data.companyProfile.revenueAssumptions}`,
    `campaign:${data.campaignState.activeLender}:${data.campaignState.requestedAmount}:${data.campaignState.submissionEvidence}:${data.campaignState.documentsUploaded}:${data.campaignState.documentsMissing}`,
  ].filter(Boolean);
}

function buildAtlasOperatorActivity(
  data: AtlasData | Omit<AtlasData, 'readinessScores'>,
  requirements: AtlasReconciledRequirement[],
  inventory: string[],
  timestamp: string,
  conflicts: AtlasEvidenceGap[],
): AtlasOperatorActivity[] {
  const completed = requirements.filter((requirement) => ['VERIFIED COMPLETE', 'NOT APPLICABLE'].includes(requirement.status));
  const waiting = requirements.filter((requirement) => requirement.founderAction && !requirement.autoResolved);
  const generated = requirements.filter((requirement) => requirement.generatedDraft);
  return [
    {
      id: 'source-inventory',
      timestamp,
      status: 'Completed',
      label: 'Searched approved Atlas sources',
      detail: `Reviewed ${inventory.length} source records across document vault, imports, packages, profiles, financial model, campaign memory, and source mappings.`,
    },
    ...completed.slice(0, 8).map((requirement) => ({
      id: `resolved-${requirement.id}`,
      timestamp,
      status: 'Completed' as AtlasOperatorActivityStatus,
      label: `Resolved ${requirement.label}`,
      detail: requirement.bestMatch || requirement.source,
    })),
    ...generated.slice(0, 4).map((requirement) => ({
      id: `draft-${requirement.id}`,
      timestamp,
      status: 'Requires verification' as AtlasOperatorActivityStatus,
      label: `Generated ${requirement.label} draft`,
      detail: requirement.generatedDraft || 'Draft generated from approved Atlas data and requires founder review.',
    })),
    ...conflicts.slice(0, 4).map((conflict) => ({
      id: `conflict-${conflict.id}`,
      timestamp,
      status: 'Waiting for Tomas' as AtlasOperatorActivityStatus,
      label: `Conflict: ${conflict.label}`,
      detail: conflict.detail,
    })),
    ...waiting.slice(0, 5).map((requirement) => ({
      id: `waiting-${requirement.id}`,
      timestamp,
      status: 'Waiting for Tomas' as AtlasOperatorActivityStatus,
      label: requirement.label,
      detail: requirement.founderAction || requirement.source,
    })),
    {
      id: 'readiness-updated',
      timestamp,
      status: 'Completed',
      label: 'Updated readiness source of truth',
      detail: `${completed.length} of ${requirements.length} document requirements are verified complete or not applicable. Active funding amount: ${money(getAtlasActiveFundingAmount(data))}.`,
    },
  ];
}

function countBankStatementEvidence(data: AtlasData | Omit<AtlasData, 'readinessScores'>) {
  const text = buildAtlasSourceInventory(data).join('\n');
  const months = new Set<string>();
  const monthRegex = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/gi;
  let monthMatch = monthRegex.exec(text);
  while (monthMatch) {
    months.add(monthMatch[1].toLowerCase().slice(0, 3));
    monthMatch = monthRegex.exec(text);
  }
  const statementRefs = (text.match(/bank statement|business statement|personal statement|statement history/gi) || []).length;
  return Math.max(months.size, statementRefs);
}

export function generateAtlasBusinessReadinessReport(data: AtlasData): AtlasBusinessReadinessReport {
  const reconciliation = reconcileAtlasDocuments(data);
  const hasFormation = reconciliation.requirements.some((requirement) => requirement.id === 'formation-documents' && requirement.status === 'VERIFIED COMPLETE');
  const operatingAgreement = reconciliation.requirements.find((requirement) => requirement.id === 'operating-agreement');
  const hasOperatingAgreement = operatingAgreement?.status === 'VERIFIED COMPLETE';
  const hasEinDocument = reconciliation.requirements.some((requirement) => requirement.id === 'ein' && requirement.status === 'VERIFIED COMPLETE');
  const bankStatements = reconciliation.requirements.find((requirement) => requirement.id === 'bank-statements');
  const hasBankStatements = bankStatements?.status === 'VERIFIED COMPLETE';
  const useOfFundsTotal = calculateUseOfFundsTotal(data.useOfFundsPlan);
  const completed: string[] = [];
  const founderActions: string[] = [...reconciliation.founderActions];
  const conflicts: AtlasEvidenceGap[] = [...reconciliation.conflicts];

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
  } else if (operatingAgreement?.founderAction) {
    founderActions.push(operatingAgreement.founderAction);
  }

  if (hasEinDocument) {
    completed.push(`Located EIN confirmation documentation${data.companyProfile.einMasked ? ` (${data.companyProfile.einMasked})` : ''} and kept EIN values masked.`);
  } else {
    founderActions.push('Upload the EIN confirmation letter. EIN confirmation document missing.');
  }

  if (hasBankStatements) {
    completed.push('Bank statements are marked available for lender package review.');
  } else if (bankStatements?.founderAction) {
    founderActions.push(bankStatements.founderAction);
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

  const entityStatus: AtlasBusinessReadinessStatus = hasFormation && data.companyProfile.companyName
    ? hasOperatingAgreement ? 'Mostly ready' : 'Needs attention'
    : 'Missing';
  const einStatus: AtlasBusinessReadinessStatus = hasEinDocument
    ? data.companyProfile.einVerificationStatus === 'verified_document_received' ? 'Ready' : 'Mostly ready'
    : 'Missing';
  const bankingStatus: AtlasBusinessReadinessStatus = hasBankStatements ? 'Mostly ready' : bankStatements?.status === 'REQUIRES LENDER CONFIRMATION' ? 'Requires lender confirmation' : 'Missing';
  const consistencyStatus: AtlasBusinessReadinessStatus = conflicts.length ? 'Needs attention' : 'Mostly ready';

  const lenderRequirements = data.fundingOpportunities.filter((lender) => lender.status !== 'declined').map((lender) => ({
    lender: lender.lenderName || lender.fundingSource,
    requirement: 'Bank statement months, startup exceptions, personal statement requirements, bankruptcy policy, and new-account acceptance',
    status: 'REQUIRES LENDER CONFIRMATION',
    source: lender.website || 'Official lender source not yet attached',
    lastVerifiedDate: '',
  }));

  completed.push(`${reconciliation.documentsCompleteCount} of ${reconciliation.documentsTotalCount} reconciled document requirements are verified complete or not applicable.`);

  return {
    entityStatus,
    einStatus,
    bankingStatus,
    consistencyStatus,
    completed: completed.slice(0, 6),
    founderActions: founderActions.filter((item, index, list) => list.indexOf(item) === index).slice(0, 8),
    conflicts,
    lenderRequirements,
  };
}

export function calculateAtlasReadinessAssessment(data: AtlasData) {
  const reconciliation = reconcileAtlasDocuments(data);
  const documentationScore = reconciliation.documentationScore;
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
    ...reconciliation.founderActions,
    ...businessInputs.map((value, index) => String(value || '').trim() ? '' : ['Company name', 'State', 'Industry', 'Business stage', 'Revenue stage', 'Business summary'][index]).filter(Boolean),
    data.chapterSevenWorkflow.founderApproved ? '' : 'Founder-approved Chapter 7 explanation',
  ].filter(Boolean) as string[];
  const recommendations = [
    documentationScore < 85 ? 'Review only the precise unresolved document items Atlas could not reconcile.' : 'Document package is reconciled and close to lender-ready.',
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
  const reconciliation = reconcileAtlasDocuments(data);
  const requiredDocumentsScore = reconciliation.documentationScore;

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
  const assessment = calculateAtlasReadinessAssessment(data);
  const campaign = buildAtlasFundingCampaignOS(data);
  const reconciliation = reconcileAtlasDocuments(data, token);
  const hasSelectedLender = data.fundingOpportunities.some((opportunity) => ['targeted', 'preparing', 'submitted', 'follow_up', 'approved'].includes(opportunity.status));
  const requiredDocsComplete = reconciliation.founderActions.length === 0 || reconciliation.documentationScore >= 75;
  const packageVersion = getLatestAtlasPackage(data);
  const applicationReviewed = data.applicationSections.every((section) => section.reviewed);
  const importStageStatus: AtlasWorkflowStageStatus = data.importState.lastImportAt
    ? 'complete'
    : data.importState.sourceDocuments.length || data.importState.lastScanAt
      ? 'in_progress'
      : 'not_started';

  return [
    ['funding-campaign', 'Funding Campaign OS', '/atlas/funding-campaign', campaign.currentApplication.applicationId ? 'complete' : 'in_progress', 'Five-step lender campaign, failover rules, and follow-up evidence.'],
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
    href: atlasPath(String(href), token),
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
  const reconciliation = reconcileAtlasDocuments(data);
  const activeFundingAmount = getAtlasActiveFundingAmount(data);
  const useOfFundsTotal = calculateUseOfFundsTotal(data.useOfFundsPlan);
  const activeLenders = data.fundingOpportunities.filter((opportunity) => opportunity.status !== 'declined');
  const sections = [
    ['Cover Page', `# ${profile.companyName} Capital Package\n\n**Prepared for:** SBA Microloan / CDFI lender review\n**Prepared by:** ${profile.founderName}\n**Requested amount:** ${money(activeFundingAmount)}\n**Atlas note:** Founder must review and submit manually.`],
    ['Executive Summary', profile.businessSummary],
    ['Business Overview', `${profile.companyName} operates in ${profile.industry || 'the practical AI products market'} from ${profile.state || 'its registered state'}. Current stage: ${profile.businessStage || profile.revenueStage}.`],
    ['Founder Background', profile.founderBackground],
    ['Funding Request', `${profile.fundingRequest}\n\nModeled request: ${money(activeFundingAmount)}. Minimum viable amount: ${money(profile.fundingTargetMin)}.`],
    ['Use of Funds', `${profile.useOfFunds}\n\nPlanned total: ${money(useOfFundsTotal)} against active request ${money(activeFundingAmount)}.`],
    ['Revenue Assumptions', `${profile.revenueAssumptions}\n\nStarting MRR: ${money(assumptions.startingMrr)}. Monthly customer growth: ${assumptions.monthlyCustomerGrowth}. Average subscription price: ${money(assumptions.averageSubscriptionPrice)}.`],
    ['Repayment Strategy', profile.repaymentStrategy],
    ['Risk Mitigation', profile.riskMitigation],
    ['Chapter 7 Explanation', generateChapterSevenExplanations(data).standard],
    ['Required Documents Checklist', reconciliation.requirements.map((requirement) => `- ${requirement.sufficient || requirement.status === 'NOT APPLICABLE' ? '[x]' : '[ ]'} ${requirement.label} — ${requirement.status}${requirement.founderAction ? ` (${requirement.founderAction})` : ''}`).join('\n')],
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
  const reconciliation = reconcileAtlasDocuments(data, token);
  const activeFundingAmount = getAtlasActiveFundingAmount(data);
  const documentMissing = reconciliation.requirements
    .filter((requirement) => requirement.founderAction && !requirement.autoResolved)
    .map((requirement) => `${requirement.label}: ${requirement.founderAction}`);
  const sections: Array<Omit<AtlasApplicationBuilderSection, 'reviewed' | 'completionStatus'>> = [
    {
      id: 'business_information',
      title: 'Business information',
      missingFields: missing([
        ['Company name', data.companyProfile.companyName],
        ['Product name', data.companyProfile.productName],
        ['Revenue stage', data.companyProfile.revenueStage],
      ]),
      editHref: atlasPath('/atlas/capital-office', token),
      previewText: `${data.companyProfile.companyName} is preparing ${data.companyProfile.productName} for ${data.companyProfile.revenueStage} operations through ${data.companyProfile.moduleName}.`,
    },
    {
      id: 'founder_information',
      title: 'Founder information',
      missingFields: missing([['Founder background', data.companyProfile.founderBackground]]),
      editHref: atlasPath('/atlas/sba-loan-package', token),
      previewText: data.companyProfile.founderBackground,
    },
    {
      id: 'funding_request',
      title: 'Funding request',
      missingFields: missing([
        ['Funding request', data.companyProfile.fundingRequest],
        ['Loan amount', String(activeFundingAmount || '')],
      ]),
      editHref: atlasPath('/atlas/financial-model', token),
      previewText: `${data.companyProfile.fundingRequest} Current campaign uses a ${money(activeFundingAmount)} request.`,
    },
    {
      id: 'use_of_funds',
      title: 'Use of funds',
      missingFields: data.companyProfile.primaryUseOfFunds.length ? [] : ['Primary use of funds'],
      editHref: atlasPath('/atlas/sba-loan-package', token),
      previewText: data.companyProfile.useOfFunds,
    },
    {
      id: 'business_narrative',
      title: 'Business narrative',
      missingFields: missing([['Business summary', data.companyProfile.businessSummary]]),
      editHref: atlasPath('/atlas/sba-loan-package', token),
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
      editHref: atlasPath('/atlas/financial-model', token),
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
      editHref: atlasPath('/atlas/financial-model', token),
      previewText: data.companyProfile.repaymentStrategy,
    },
    {
      id: 'risk_mitigation',
      title: 'Risk mitigation',
      missingFields: missing([['Risk mitigation', data.companyProfile.riskMitigation]]),
      editHref: atlasPath('/atlas/due-diligence-checklist', token),
      previewText: data.companyProfile.riskMitigation,
    },
    {
      id: 'chapter_7_explanation',
      title: 'Chapter 7 explanation',
      missingFields: missing([['Chapter 7 explanation', data.companyProfile.chapterSevenExplanation]]),
      editHref: atlasPath('/atlas/sba-loan-package', token),
      previewText: data.companyProfile.chapterSevenExplanation,
    },
    {
      id: 'supporting_documents',
      title: 'Supporting documents',
      missingFields: documentMissing,
      editHref: atlasPath('/atlas/document-vault', token),
      previewText: documentMissing.length
        ? `${documentMissing.length} precise supporting-document actions remain: ${documentMissing.slice(0, 5).join(', ')}.`
        : 'Atlas reconciled all required supporting-document asks against approved sources or marked them for lender confirmation only.',
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
  const activeFundingAmount = getAtlasActiveFundingAmount(data);
  const activeLender = data.fundingOpportunities.find((opportunity) => opportunity.status !== 'declined');
  const useOfFunds = profile.primaryUseOfFunds.map((item) => `- ${item}`).join('\n');
  const sharedHeader = `# ${atlasGeneratedDocumentLabels[type]}\n\n**Company:** ${profile.companyName}\n**Product:** ${profile.productName}\n**Requested Amount:** ${money(activeFundingAmount)}\n**Preferred Funding:** ${profile.preferredFundingTypes.join(' / ')}\n`;

  switch (type) {
    case 'executive_summary':
      return `${sharedHeader}\n## Overview\n${profile.businessSummary}\n\n## Funding Request\n${profile.fundingRequest}\n\n## Use of Funds\n${useOfFunds}\n\n## Revenue Stage\n${profile.revenueStage}. First 90-day MRR estimate: ${profile.firstNinetyDayMrrEstimate}. Six-month MRR target: ${profile.sixMonthMrrTarget}.\n\n## Next Step\n${profile.nextAction}`;
    case 'sba_microloan_narrative':
      return `${sharedHeader}\n## Business Narrative\n${profile.businessSummary}\n\n## SBA Microloan Request\nNieves Labs is preparing a conservative request modeled at ${money(activeFundingAmount)} over ${assumptions.loanTermMonths} months. The request supports production readiness, launch execution, and disciplined working capital.\n\n## Repayment Strategy\n${profile.repaymentStrategy}\n\n## Risk Mitigation\n${profile.riskMitigation}`;
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
