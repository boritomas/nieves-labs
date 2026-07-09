import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  type AtlasData,
  type AtlasDocument,
  type AtlasFinancialAssumptions,
  type AtlasFundingOpportunity,
  type AtlasTask,
  calculateReadinessScores,
} from './atlas';

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'atlas.json');

const now = new Date().toISOString();

const seedData: AtlasData = {
  companyProfile: {
    id: 'atlas_company_profile',
    companyName: 'Nieves Labs',
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
  fundingOpportunities: [
    {
      id: 'sba-microloan',
      fundingSource: 'SBA Microloan intermediary',
      type: 'SBA Microloan',
      targetAmount: 35000,
      status: 'preparing',
      deadline: 'Rolling',
      contact: 'Local SBA microlender / CDFI intake',
      notes: 'Best fit for conservative early-stage working capital request.',
      nextAction: 'Prepare business plan, projections, and document packet.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cdfi-working-capital',
      fundingSource: 'Regional CDFI working capital program',
      type: 'CDFI',
      targetAmount: 25000,
      status: 'targeted',
      deadline: 'Rolling',
      contact: 'CDFI loan officer',
      notes: 'Use if SBA underwriting timeline is slow or collateral requirements are heavy.',
      nextAction: 'Confirm eligibility and required personal financial statement format.',
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
  readinessScores: {
    id: 'readiness_scores',
    capitalReadiness: 0,
    productReadiness: 0,
    documentationReadiness: 0,
    updatedAt: now,
  },
};

function withScores(data: AtlasData): AtlasData {
  return {
    ...data,
    readinessScores: calculateReadinessScores({
      companyProfile: data.companyProfile,
      financialAssumptions: data.financialAssumptions,
      fundingOpportunities: data.fundingOpportunities,
      documents: data.documents,
      risks: data.risks,
      tasks: data.tasks,
    }),
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

export async function upsertAtlasFundingOpportunity(input: Partial<AtlasFundingOpportunity> & Pick<AtlasFundingOpportunity, 'fundingSource' | 'type' | 'targetAmount' | 'status'>) {
  const data = await getAtlasData();
  const timestamp = new Date().toISOString();
  const existingIndex = input.id ? data.fundingOpportunities.findIndex((item) => item.id === input.id) : -1;
  const opportunity: AtlasFundingOpportunity = {
    id: input.id || randomUUID(),
    fundingSource: input.fundingSource,
    type: input.type,
    targetAmount: Number(input.targetAmount) || 0,
    status: input.status,
    deadline: input.deadline || '',
    contact: input.contact || '',
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

