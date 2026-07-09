export type AtlasFundingType = 'SBA Microloan' | 'CDFI' | 'Grant' | 'Bank Loan' | 'Investor' | 'Accelerator';
export type AtlasFundingStatus = 'researching' | 'targeted' | 'preparing' | 'submitted' | 'follow_up' | 'approved' | 'declined';
export type AtlasDocumentCategory = 'legal' | 'financial' | 'founder' | 'product' | 'market';
export type AtlasTaskStatus = 'not_started' | 'in_progress' | 'complete' | 'blocked';
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

export type AtlasData = {
  companyProfile: AtlasCompanyProfile;
  financialAssumptions: AtlasFinancialAssumptions;
  fundingOpportunities: AtlasFundingOpportunity[];
  documents: AtlasDocument[];
  risks: AtlasRisk[];
  tasks: AtlasTask[];
  applicationSections: AtlasApplicationSection[];
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

export const atlasFundingTypes: AtlasFundingType[] = ['SBA Microloan', 'CDFI', 'Grant', 'Bank Loan', 'Investor', 'Accelerator'];
export const atlasFundingStatuses: AtlasFundingStatus[] = ['researching', 'targeted', 'preparing', 'submitted', 'follow_up', 'approved', 'declined'];
export const atlasTaskStatuses: AtlasTaskStatus[] = ['not_started', 'in_progress', 'complete', 'blocked'];
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
  const capitalReadiness = Math.round((fundingTrackerScore * 0.35) + (requiredDocumentsScore * 0.25) + (financialAssumptionsScore * 0.2) + (riskMitigationScore * 0.2));
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
