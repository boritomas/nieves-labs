export type AtlasFundingType = 'SBA Microloan' | 'CDFI' | 'Grant' | 'Bank Loan' | 'Investor' | 'Accelerator';
export type AtlasFundingStatus = 'researching' | 'targeted' | 'preparing' | 'submitted' | 'follow_up' | 'approved' | 'declined';
export type AtlasDocumentCategory = 'legal' | 'financial' | 'founder' | 'product' | 'market';
export type AtlasTaskStatus = 'not_started' | 'in_progress' | 'complete' | 'blocked';

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
  type: AtlasFundingType;
  targetAmount: number;
  status: AtlasFundingStatus;
  deadline: string;
  contact: string;
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

export type AtlasReadinessScores = {
  id: string;
  capitalReadiness: number;
  productReadiness: number;
  documentationReadiness: number;
  updatedAt: string;
};

export type AtlasData = {
  companyProfile: AtlasCompanyProfile;
  financialAssumptions: AtlasFinancialAssumptions;
  fundingOpportunities: AtlasFundingOpportunity[];
  documents: AtlasDocument[];
  risks: AtlasRisk[];
  tasks: AtlasTask[];
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
  const documentationReadiness = requiredDocuments.length
    ? Math.round((completedRequiredDocuments.length / requiredDocuments.length) * 100)
    : 0;

  const activeFunding = data.fundingOpportunities.filter((opportunity) => !['declined'].includes(opportunity.status));
  const advancedFunding = activeFunding.filter((opportunity) => ['preparing', 'submitted', 'follow_up', 'approved'].includes(opportunity.status));
  const capitalReadinessBase = activeFunding.length ? Math.round((advancedFunding.length / activeFunding.length) * 55) : 0;
  const capitalReadiness = Math.min(100, capitalReadinessBase + Math.round(documentationReadiness * 0.35) + (data.tasks.some((task) => task.status === 'complete') ? 10 : 0));

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
    updatedAt: new Date().toISOString(),
  };
}

