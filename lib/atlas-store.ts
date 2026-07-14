import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  atlasApplicationSectionIds,
  type AtlasData,
  type AtlasGrantOperator,
  type AtlasApplicationSection,
  type AtlasCampaignState,
  type AtlasChapterSevenWorkflow,
  type AtlasDocument,
  type AtlasFinancialAssumptions,
  type AtlasFundingOpportunity,
  type AtlasImportState,
  type AtlasImportedField,
  type AtlasLenderWorkflowField,
  type AtlasPackageStatus,
  type AtlasPackageVersion,
  type AtlasPilotFailureRecord,
  type AtlasPersonalFinancialProfile,
  type AtlasTask,
  type AtlasUseOfFundsPlan,
  calculateReadinessScores,
  generateAtlasPackage,
  getAtlasApplicationSectionTitle,
  atlasFounderApprovalKeys,
} from './atlas';

const dataDir = process.env.VERCEL ? path.join('/tmp', 'nieves-labs-atlas') : path.join(process.cwd(), '.data');
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

const seedGrantOperator: AtlasGrantOperator = {
  id: 'atlas_federal_grant_operator_v1',
  fundingGoal: 'Find and prepare the strongest official federal grant or SBIR/STTR opportunity for Nieves Labs without asking Tomas to re-enter known company data.',
  grantProfileStatus: 'Real Nieves Labs grant profile built from existing Atlas company, founder, financial, document, product, and funding package data.',
  registrationReadiness: 'Known gaps remain for SAM.gov, UEI, Login.gov, NSF ID, Research.gov organization registration, PI/SPO/AOR role assignment, and Grants.gov readiness. These are founder/account-holder controlled gates.',
  selectedOpportunityId: 'nsf-sbir-project-pitch-ai',
  federalGrantApplicationsSubmitted: 0,
  submissionEvidence: [],
  officialSourcesSearched: [
    'NSF America’s Seed Fund official Project Pitch page',
    'NSF America’s Seed Fund official Apply page',
    'NSF America’s Seed Fund official topic areas page',
    'Grants.gov official search API',
    'Grants.gov official opportunity detail API',
    'NIH Parent SBIR official Grants.gov record',
    'NSF Pathways to Enable Secure Open-Source Ecosystems official Grants.gov record',
  ],
  opportunitiesFound: 807,
  opportunitiesExcluded: 804,
  founderSessions: 1,
  founderTimeMinutes: 45,
  duplicateQuestionCount: 0,
  documentsReusedAutomatically: 12,
  reusePercentage: 92,
  registrations: [
    {
      id: 'sam-gov',
      name: 'SAM.gov entity registration',
      status: 'requires_founder',
      accountOwner: 'Tomas Nieves',
      verificationStatus: 'No verified Atlas evidence of active SAM.gov registration or UEI.',
      expirationDate: '',
      renewalDate: '',
      missingAction: 'Create or verify SAM.gov entity registration and UEI for Nieves Labs.',
      founderOnlyStep: 'Founder must complete Login.gov/SAM identity, entity assertions, and certifications.',
      estimatedCompletionMinutes: 45,
      source: 'Required by federal grant application workflows; status not evidenced in Atlas.',
    },
    {
      id: 'uei',
      name: 'Unique Entity ID',
      status: 'requires_founder',
      accountOwner: 'Tomas Nieves',
      verificationStatus: 'No UEI found in approved Atlas sources.',
      expirationDate: '',
      renewalDate: '',
      missingAction: 'Retrieve UEI from SAM.gov after entity setup.',
      founderOnlyStep: 'Founder account-holder action inside SAM.gov.',
      estimatedCompletionMinutes: 15,
      source: 'Federal assistance registration requirement.',
    },
    {
      id: 'grants-gov',
      name: 'Grants.gov workspace / AOR',
      status: 'requires_founder',
      accountOwner: 'Tomas Nieves',
      verificationStatus: 'No verified Grants.gov applicant workspace or AOR role in Atlas.',
      expirationDate: '',
      renewalDate: '',
      missingAction: 'Create or connect Grants.gov applicant workspace after SAM/UEI is complete.',
      founderOnlyStep: 'Founder must accept organization role and certifications.',
      estimatedCompletionMinutes: 30,
      source: 'Grants.gov submission workflow.',
    },
    {
      id: 'login-gov',
      name: 'Login.gov',
      status: 'requires_founder',
      accountOwner: 'Tomas Nieves',
      verificationStatus: 'Account status not verified in Atlas.',
      expirationDate: '',
      renewalDate: '',
      missingAction: 'Confirm Login.gov access for federal portals.',
      founderOnlyStep: 'MFA and identity access are founder-only.',
      estimatedCompletionMinutes: 10,
      source: 'SAM.gov and federal portal authentication.',
    },
    {
      id: 'research-gov',
      name: 'Research.gov / NSF account',
      status: 'requires_verification',
      accountOwner: 'Tomas Nieves',
      verificationStatus: 'Likely required for NSF SBIR/STTR submission, but account evidence is not in Atlas.',
      expirationDate: '',
      renewalDate: '',
      missingAction: 'Verify NSF Research.gov/PI registration requirement for selected opportunity.',
      founderOnlyStep: 'Founder or PI must verify account and organization role.',
      estimatedCompletionMinutes: 30,
      source: 'NSF SBIR/STTR application path requires agency portal verification.',
    },
    {
      id: 'sba-company-registry',
      name: 'SBA Company Registry',
      status: 'requires_verification',
      accountOwner: 'Tomas Nieves',
      verificationStatus: 'No completed SBA Company Registry evidence in Atlas.',
      expirationDate: '',
      renewalDate: '',
      missingAction: 'Confirm whether selected SBIR/STTR path requires SBA registry at this stage.',
      founderOnlyStep: 'Founder must certify company ownership/control information.',
      estimatedCompletionMinutes: 20,
      source: 'SBIR/STTR registration requirement varies by agency/program stage.',
    },
  ],
  opportunities: [
    {
      id: 'nsf-sbir-project-pitch-ai',
      opportunityId: 'nsf-project-pitch',
      opportunityNumber: 'NSF Project Pitch gate',
      agency: 'U.S. National Science Foundation',
      program: 'NSF SBIR/STTR / America’s Seed Fund',
      title: 'NSF SBIR/STTR Project Pitch for an AI reliability and evidence-provenance R&D concept.',
      summary: 'Official NSF America’s Seed Fund guidance requires a Project Pitch before a company may be invited to submit a full Phase I proposal. Atlas should prepare the pitch first, then stop for founder approval and portal authentication before any legal submission.',
      officialUrl: 'https://seedfund.nsf.gov/apply/project-pitch/',
      sourceDocument: 'NSF America’s Seed Fund Project Pitch official page; Apply page; topic areas page. Last verified 2026-07-14.',
      openDate: '2026-07-14',
      deadline: 'Project Pitch required before invited full proposal',
      deadlineTimeZone: 'NSF portal',
      awardMinimum: 0,
      awardMaximum: 2000000,
      estimatedAwards: 'NSF states companies can receive up to $2 million in funding across phases; actual amount and invitation eligibility require portal review.',
      eligibility: 'U.S. startup/small business developing deep technology with technical risk and commercial potential. Final eligibility must be certified by the founder in NSF systems.',
      entityRestrictions: 'For-profit small business concern expected; founder must verify legal entity, ownership/control, PI eligibility, and program-specific requirements.',
      ownershipRestrictions: 'U.S. ownership/control and small-business concern eligibility require founder/legal certification.',
      employeeLimits: 'Small-business concern limits require founder verification.',
      geographicRestrictions: 'United States small-business program; Texas location appears compatible but must be verified.',
      topicFit: 'Strongest current fit when framed as AI reliability, evidence provenance, and human-in-the-loop verification for regulated small-business funding workflows rather than ordinary SaaS development.',
      researchInstitutionRequirement: 'SBIR path may not require a research institution; STTR may. Atlas should pursue SBIR pitch unless NSF portal or founder strategy selects STTR.',
      costSharing: 'NSF SBIR/STTR generally does not require cost sharing, but final solicitation/portal guidance controls.',
      periodOfPerformance: 'Requires NSF invitation/full-proposal guidance after Project Pitch review.',
      requiredRegistrations: ['Login.gov or NSF portal identity', 'NSF ID', 'Research.gov organization record', 'SAM.gov', 'UEI', 'PI/SPO/AOR role verification', 'Grants.gov if applicable to invited proposal'],
      requiredForms: ['NSF Project Pitch fields', 'Full Phase I proposal forms only after NSF invitation'],
      requiredAttachments: ['Project Pitch does not currently require Atlas to attach a full proposal package before invitation; full proposal attachments depend on NSF invitation and solicitation instructions.'],
      pageLimits: 'Project Pitch field limits must be validated inside the official NSF portal before final submission.',
      formattingRules: 'Use concise, fact-grounded responses. Do not claim pilots, patents, revenue, university partners, or research results that are not evidenced.',
      evaluationCriteria: ['Technical innovation', 'Technical risk/research uncertainty', 'Commercial potential', 'Team capability', 'Broader economic/societal impact', 'Fit with NSF topic areas'],
      submissionPortal: 'NSF Project Pitch / MyWork Community portal',
      contact: 'NSF America’s Seed Fund official contact and portal support pages.',
      lastVerifiedDate: '2026-07-14',
      status: 'Rolling',
      fitScore: 86,
      fitOutcome: 'Strong fit',
      fitRationale: 'This is the truthful next NSF step: prepare a Project Pitch first. The strongest Nieves Labs concept is not generic business automation; it is R&D around evidence provenance, uncertainty labeling, contradiction detection, and founder-approval gates for AI agents operating in regulated funding workflows.',
      concerns: ['Founder approval required before submission', 'Portal authentication/MFA may be required', 'Field limits must be validated in the NSF Project Pitch workflow', 'Technical novelty must stay evidence-grounded'],
      missingEvidence: ['Verified NSF portal account/NSF ID', 'SAM/UEI and Research.gov organization status', 'Founder-approved pitch claims', 'Any customer/pilot metrics that may be cited'],
      recommendedAction: 'Prepare exact Project Pitch text, review with Tomas, then enter the official NSF Project Pitch portal and stop before final founder approval/submission.',
      pursueRecommendation: 'Pursue now',
      narsClassification: 'Verified fact',
    },
    {
      id: 'nsf-26-511',
      opportunityId: '362551',
      opportunityNumber: '26-511',
      agency: 'U.S. National Science Foundation',
      program: 'SBIR/STTR Phase I, Phase II, Fast-Track Programs',
      title: 'Small Business Innovation Research / Small Business Technology Transfer Phase I, Phase II, Fast-Track Programs (SBIR/STTR): A Pilot Emphasis on Scientific Instrumentation.',
      summary: 'Official Grants.gov synopsis states NSF is initiating an SBIR/STTR pilot emphasis area for startups and small businesses developing enabling technologies, next-generation instrumentation, novel experimental platforms, and scientific equipment, including instrumentation necessary for AI-driven discoveries.',
      officialUrl: 'https://www.grants.gov/search-results-detail/362551',
      sourceDocument: 'Grants.gov fetchOpportunity id 362551, opportunity number 26-511',
      openDate: '2026-05-22',
      deadline: '2026-07-27; full proposal requires NSF Project Pitch invitation first',
      deadlineTimeZone: 'EDT',
      awardMinimum: 0,
      awardMaximum: 2000000,
      estimatedAwards: 'Not specified in fetched synopsis; NSF synopsis states each company can receive up to $2.0M for R&D.',
      eligibility: 'Small business/startup SBIR/STTR fit requires verification of U.S. small business concern status, ownership/control, PI rules, and agency-specific submission requirements.',
      entityRestrictions: 'For-profit small business concern expected; exact NSF requirements require solicitation review and portal validation.',
      ownershipRestrictions: 'U.S. ownership/control verification required before submission.',
      employeeLimits: 'Small business concern limits require verification.',
      geographicRestrictions: 'United States small-business program; Texas location appears compatible but must be verified.',
      topicFit: 'Potential fit only if NSF confirms the selected concept belongs in the scientific instrumentation pilot. Current Atlas evidence supports the broader NSF SBIR/STTR Project Pitch route more strongly.',
      researchInstitutionRequirement: 'STTR may require research institution partner; SBIR path may not. Selected path must be verified.',
      costSharing: 'Official detail record indicates costSharing false.',
      periodOfPerformance: 'Requires solicitation-specific confirmation.',
      requiredRegistrations: ['SAM.gov', 'UEI', 'Grants.gov', 'Research.gov/NSF account', 'SBA Company Registry if required'],
      requiredForms: ['SF-424/R&R or agency equivalent', 'Project pitch/proposal forms', 'Budget forms', 'Company certifications'],
      requiredAttachments: ['Project abstract', 'Technical narrative', 'Commercialization plan', 'Budget narrative', 'Biographical sketch/resume', 'Facilities/resources statement', 'Letters/partner documents if applicable'],
      pageLimits: 'Requires solicitation-specific confirmation before final package.',
      formattingRules: 'Requires official solicitation and portal validation.',
      evaluationCriteria: ['Technical innovation', 'Commercial potential', 'Team capability', 'Research plan feasibility', 'Program compliance'],
      submissionPortal: 'NSF/Research.gov and official Grants.gov-linked workflow; final portal must be founder-controlled.',
      contact: 'NSF grants.gov support: grantsgovsupport@nsf.gov; phone listed 703-292-4203',
      lastVerifiedDate: '2026-07-14',
      status: 'Open',
      fitScore: 68,
      fitOutcome: 'Potential fit',
      fitRationale: 'This remains a real official NSF record, but treating it as the selected path would overstate fit. Atlas should first complete the NSF Project Pitch gate and only pursue 26-511 if NSF confirms the concept belongs in that pilot emphasis area.',
      concerns: ['Deadline risk', 'Federal registrations not verified', 'Scientific instrumentation framing may be too stretched', 'Project Pitch invitation required before a full Phase I proposal'],
      missingEvidence: ['SAM/UEI/Grants.gov/AOR status', 'NSF account/Research.gov readiness', 'Founder-approved technical claims', 'NSF confirmation that 26-511 is the correct route'],
      recommendedAction: 'Monitor while preparing the general NSF SBIR/STTR Project Pitch. Do not represent a 26-511 full proposal as ready or submitted.',
      pursueRecommendation: 'Monitor',
      narsClassification: 'Verified fact',
    },
    {
      id: 'nih-pa-27-100',
      opportunityId: '359671',
      opportunityNumber: 'PA-27-100',
      agency: 'National Institutes of Health',
      program: 'NIH, CDC and FDA Parent SBIR',
      title: 'NIH, CDC and FDA Small Business Innovation Research Grant (Parent SBIR [R43/R44] Clinical Trial Optional)',
      summary: 'Official synopsis says the SBIR program helps U.S. small business concerns bring scientific innovations to marketplace and supports feasibility studies and later R&D needed to develop a commercial product.',
      officialUrl: 'https://www.grants.gov/search-results-detail/359671',
      sourceDocument: 'Grants.gov fetchOpportunity id 359671, opportunity number PA-27-100',
      openDate: '2026-05-28',
      deadline: '2027-04-05',
      deadlineTimeZone: 'EDT',
      awardMinimum: 0,
      awardMaximum: 0,
      estimatedAwards: 'Not specified in fetched synopsis.',
      eligibility: 'Potential only if Nieves Labs develops a health, CDC, FDA, or biomedical-relevant research concept.',
      entityRestrictions: 'Small business concern; health/biomedical agency fit required.',
      ownershipRestrictions: 'U.S. ownership/control verification required.',
      employeeLimits: 'Small business concern limits require verification.',
      geographicRestrictions: 'United States small-business program.',
      topicFit: 'Weak unless AnswerBrief/Atlas is repositioned into health workforce, compliance, emergency response, or biomedical admin use case with evidence.',
      researchInstitutionRequirement: 'SBIR path may not require a research institution; must verify by institute/topic.',
      costSharing: 'Official detail record indicates costSharing false.',
      periodOfPerformance: 'Requires institute-specific confirmation.',
      requiredRegistrations: ['SAM.gov', 'UEI', 'Grants.gov', 'eRA Commons', 'SBA Company Registry if required'],
      requiredForms: ['R43/R44 package', 'Budget', 'Research plan', 'Commercialization plan'],
      requiredAttachments: ['Biosketch', 'Facilities/resources', 'Human subjects or clinical trial documentation if applicable'],
      pageLimits: 'NIH application guide controls page limits.',
      formattingRules: 'NIH application guide controls format.',
      evaluationCriteria: ['Significance', 'Innovation', 'Investigators', 'Approach', 'Environment', 'Commercialization'],
      submissionPortal: 'Grants.gov / eRA Commons workflow',
      contact: 'NIH Grants.gov record',
      lastVerifiedDate: '2026-07-13',
      status: 'Open',
      fitScore: 48,
      fitOutcome: 'Weak fit',
      fitRationale: 'Official SBIR program is real and open, but current Nieves Labs product evidence is not health-specific enough to pursue first.',
      concerns: ['Health-domain fit not proven', 'eRA Commons registration likely required', 'Scientific aims would need domain partner or validated health use case'],
      missingEvidence: ['Health-market technical problem', 'Qualified PI/domain partner', 'Institute-specific topic fit'],
      recommendedAction: 'Monitor only unless a health/compliance concept and partner emerge.',
      pursueRecommendation: 'Monitor',
      narsClassification: 'Verified fact',
    },
    {
      id: 'nsf-26-506',
      opportunityId: '361333',
      opportunityNumber: '26-506',
      agency: 'U.S. National Science Foundation',
      program: 'Pathways to Enable Secure Open-Source Ecosystems',
      title: 'Pathways to Enable Secure Open-Source Ecosystems',
      summary: 'Official synopsis says PESOSE supports translation of open-source science and engineering research products into safe and sustainable ecosystems addressing national and societal challenges, including AI, cloud computing, banking, healthcare, research, education, and cybersecurity.',
      officialUrl: 'https://www.grants.gov/search-results-detail/361333',
      sourceDocument: 'Grants.gov fetchOpportunity id 361333, opportunity number 26-506',
      openDate: '2026-02-19',
      deadline: '2026-09-01',
      deadlineTimeZone: 'EDT',
      awardMinimum: 0,
      awardMaximum: 0,
      estimatedAwards: 'Not specified in fetched synopsis.',
      eligibility: 'Requires verification; may be oriented toward open-source ecosystems and managing organizations, not a solo for-profit startup product.',
      entityRestrictions: 'Requires solicitation review.',
      ownershipRestrictions: 'Requires solicitation review.',
      employeeLimits: 'Requires solicitation review.',
      geographicRestrictions: 'Requires solicitation review.',
      topicFit: 'Potential future fit if Nieves Labs creates an open-source AI reliability or document-processing ecosystem with governance.',
      researchInstitutionRequirement: 'Requires solicitation review; may require ecosystem/community commitments.',
      costSharing: 'Official detail record indicates costSharing false.',
      periodOfPerformance: 'Requires solicitation-specific confirmation.',
      requiredRegistrations: ['SAM.gov', 'UEI', 'Grants.gov', 'Research.gov/NSF account'],
      requiredForms: ['NSF proposal package', 'Data/open-source governance plan if required'],
      requiredAttachments: ['Project description', 'Budget', 'Biosketches', 'Facilities/resources', 'Collaboration documents if applicable'],
      pageLimits: 'Requires solicitation-specific confirmation.',
      formattingRules: 'NSF proposal rules and solicitation-specific rules.',
      evaluationCriteria: ['Open-source ecosystem safety', 'Sustainability', 'Governance', 'Broader impact', 'Technical merit'],
      submissionPortal: 'NSF/Research.gov or Grants.gov-linked workflow',
      contact: 'NSF Grants.gov record',
      lastVerifiedDate: '2026-07-13',
      status: 'Open',
      fitScore: 61,
      fitOutcome: 'Potential fit',
      fitRationale: 'Relevant to AI/cloud/security and open-source ecosystems, but Nieves Labs does not yet have a verified open-source ecosystem or partner/community evidence.',
      concerns: ['Ecosystem evidence missing', 'Partner/governance commitments likely needed', 'Not a near-term operating-capital grant'],
      missingEvidence: ['Open-source project', 'Community governance plan', 'Partner commitments'],
      recommendedAction: 'Monitor as a future Atlas reliability/open-source strategy opportunity.',
      pursueRecommendation: 'Monitor',
      narsClassification: 'Verified fact',
    },
  ],
  selectedPackage: {
    id: 'grant-package-nsf-project-pitch-ai',
    opportunityId: 'nsf-sbir-project-pitch-ai',
    packageName: 'Nieves Labs NSF SBIR/STTR Project Pitch Founder Review Package',
    status: 'founder_gate',
    selectedConcept: 'Evidence-provenance AI for small-business funding workflows: a human-in-the-loop system that can label verified evidence, assumptions, generated drafts, contradictions, and founder-only certifications while preparing lender and grant packages.',
    projectAbstract: 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW. Nieves Labs proposes R&D for an evidence-provenance AI layer that helps small businesses prepare regulated funding applications without losing the source, confidence, and legal status of each claim. The system would test whether retrieval, classification, contradiction detection, and founder-approval gates can materially reduce duplicate questions and unsupported application claims.',
    technicalNarrative: 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW. The technical uncertainty is whether an AI agent can reliably convert fragmented founder records, official requirements, uploaded documents, and portal-specific questions into an auditable evidence graph that distinguishes verified facts, planning assumptions, AI-generated drafts, and founder-only certifications. The proposed R&D would evaluate evidence labeling, contradiction detection, missing-proof scoring, prompt/version traceability, and human review gates for high-stakes funding workflows.',
    commercializationPlan: 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW. Initial commercialization would begin with Atlas inside Nieves Labs and then expand to founders, small businesses, CDFIs, accelerators, and advisors that need an application-preparation operating system rather than a static grant directory. Early metrics would focus on founder time saved, duplicate-question reduction, package completeness, submission readiness, and customer willingness to pay.',
    workPlan: 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW. Phase 1 would define an evidence taxonomy, implement a provenance-aware retrieval and classification engine, build official-requirement mapping, test contradiction and missing-evidence detection, create founder-only approval gates, and evaluate package generation against SBA/CDFI and NSF-style workflows. Milestones include data model, prompt registry, evidence graph, QA validator, founder gate, and measured pilot outcomes.',
    budgetNarrative: 'AI-GENERATED DRAFT - REQUIRES FOUNDER REVIEW. Draft budget categories include founder technical R&D, AI/API evaluation, cloud infrastructure, security/compliance testing, customer discovery, and specialized contractor support. No salary, fringe, indirect, or contractor rate should be submitted until Tomas/accounting verifies allowability and actual figures.',
    complianceChecklist: [
      {
        id: 'eligibility-small-business',
        opportunityId: 'nsf-sbir-project-pitch-ai',
        requirement: 'Verify Nieves Labs qualifies as a U.S. small business concern for SBIR/STTR.',
        source: 'Official NSF SBIR/STTR Project Pitch / America’s Seed Fund eligibility path.',
        status: 'requires_founder',
        atlasResolution: 'Atlas has company/founder profile but cannot certify ownership/control.',
        founderAction: 'Confirm ownership/control and small-business eligibility in official portal.',
      },
      {
        id: 'registration-sam-uei',
        opportunityId: 'nsf-sbir-project-pitch-ai',
        requirement: 'SAM.gov and UEI readiness.',
        source: 'Federal grant registration workflow.',
        status: 'requires_registration',
        atlasResolution: 'No verified SAM/UEI evidence exists in Atlas.',
        founderAction: 'Complete or verify SAM.gov registration and UEI.',
      },
      {
        id: 'project-pitch',
        opportunityId: 'nsf-sbir-project-pitch-ai',
        requirement: 'Project Pitch must be submitted and invited before a full NSF Phase I proposal.',
        source: 'NSF America’s Seed Fund Project Pitch official process.',
        status: 'can_generate',
        atlasResolution: 'Atlas generated a founder-review concept and abstract.',
        founderAction: 'Approve or revise technical novelty claim before portal use.',
      },
      {
        id: 'budget',
        opportunityId: 'nsf-sbir-project-pitch-ai',
        requirement: 'Solicitation-compliant budget and budget justification.',
        source: 'Official solicitation budget package requirements require portal validation.',
        status: 'can_generate',
        atlasResolution: 'Atlas prepared a draft budget narrative and line-item model.',
        founderAction: 'Confirm salary, fringe, indirect, contractor, and cloud/API assumptions.',
      },
      {
        id: 'technical-narrative',
        opportunityId: 'nsf-sbir-project-pitch-ai',
        requirement: 'Technical narrative with research objectives, work plan, risks, and commercialization path.',
        source: 'Official solicitation requirements require final page-limit validation.',
        status: 'can_generate',
        atlasResolution: 'Atlas generated a solicitation-specific draft using existing Atlas capabilities.',
        founderAction: 'Approve technical claims; do not submit unsupported research results.',
      },
    ],
    budget: [
      { id: 'engineering-rd', category: 'Personnel / founder technical R&D', amount: 90000, basis: 'Planning assumption pending founder/accounting verification', purpose: 'Build and evaluate evidence reconciliation, solicitation parsing, and package generation workflow.', allowabilityStatus: 'requires_verification', source: 'Atlas plan', assumption: 'No salary/fringe rate has been certified.', founderApproval: false },
      { id: 'cloud-ai-eval', category: 'Cloud computing and AI/API usage', amount: 35000, basis: 'Estimated platform and model-evaluation costs', purpose: 'Run retrieval, classification, QA, and traceability evaluations.', allowabilityStatus: 'requires_verification', source: 'Atlas financial model', assumption: 'Vendor quotes not yet attached.', founderApproval: false },
      { id: 'security-testing', category: 'Security/compliance testing', amount: 25000, basis: 'Planning estimate', purpose: 'Validate private document handling, audit trail, access control, and safe logs.', allowabilityStatus: 'requires_verification', source: 'Atlas security requirements', assumption: 'Scope and vendor costs not yet verified.', founderApproval: false },
      { id: 'customer-discovery', category: 'Customer discovery / commercialization', amount: 20000, basis: 'Planning estimate', purpose: 'Interview founders, advisors, CDFIs, and accelerators to validate workflow adoption.', allowabilityStatus: 'requires_verification', source: 'Commercialization plan draft', assumption: 'Travel and participant costs require solicitation review.', founderApproval: false },
      { id: 'contractor-support', category: 'Consultants / contractor support', amount: 30000, basis: 'Planning estimate', purpose: 'Specialized engineering, design, compliance, and proposal support.', allowabilityStatus: 'requires_verification', source: 'Use-of-funds plan', assumption: 'No contractor commitments or quotes are claimed.', founderApproval: false },
    ],
    documentsReused: ['Business plan', 'Executive summary', 'Founder background', 'Financial model', 'Use-of-funds plan', 'EIN confirmation metadata', 'Product portfolio', 'Market research', 'Competitive analysis', 'Risk mitigation plan', 'Generated lender package', 'Operator activity feed'],
    draftsGenerated: ['Project abstract', 'Technical narrative', 'Commercialization plan', 'Work plan and milestones', 'Budget narrative', 'Facilities/resources statement', 'Partner outreach email', 'Letter-of-support request template'],
    founderOnlyGaps: ['Review and approve exact NSF Project Pitch text', 'Complete NSF portal/Login.gov/MFA or account recovery if required', 'Verify NSF ID/Research.gov organization and PI/SPO/AOR role requirements', 'Verify SAM.gov/UEI/Grants.gov readiness before any invited full proposal', 'Final legal certification/signature/submit action'],
    readinessScore: 78,
    applicationPortal: 'Official NSF Project Pitch / MyWork Community portal',
    furthestSafePoint: 'Project Pitch text prepared in Atlas; stop before founder approval, portal authentication, legal certifications, and final submission.',
    submissionStatus: 'Federal grant applications submitted: 0. NSF Project Pitch prepared for founder review; not submitted.',
    confirmationNumber: '',
    followUpDate: '2026-07-15',
    learningRecords: ['Official NSF sources confirm Project Pitch is required before any invited full Phase I proposal.', 'NSF 26-511 is now monitored rather than treated as the selected submission path.', 'The strongest current concept is evidence-provenance AI for regulated small-business funding workflows.', 'Atlas must validate Project Pitch field limits in the official portal before final submission.'],
    updatedAt: now,
  },
  nsfProjectPitch: {
    id: 'nsf-project-pitch-answerbrief-atlas-2026-07-14',
    status: 'prepared_for_founder_review',
    applicableProgram: 'NSF SBIR/STTR / America’s Seed Fund',
    projectPitchRequired: true,
    fullProposalInvitationRequired: true,
    submissionRoute: 'NSF Project Pitch / MyWork Community portal',
    projectTitle: 'Evidence-Provenance AI for Small-Business Funding Workflows',
    selectedConceptId: 'evidence-provenance-ai',
    officialSources: [
      'https://seedfund.nsf.gov/apply/project-pitch/',
      'https://seedfund.nsf.gov/apply/',
      'https://seedfund.nsf.gov/topics/artificial-intelligence/',
    ],
    lastVerifiedDate: '2026-07-14',
    conceptScores: [
      { id: 'evidence-provenance-ai', concept: 'AI reliability and evidence provenance for autonomous funding agents', technicalInnovation: 18, researchUncertainty: 18, societalEconomicImpact: 16, commercialPotential: 17, nsfTopicFit: 17, teamCapability: 13, evidenceStrength: 12, submissionReadiness: 14, totalScore: 125, recommendation: 'Selected', rationale: 'Best balance of genuine R&D uncertainty, Nieves Labs product evidence, commercial path, and NSF AI topic fit without overstating traction.' },
      { id: 'human-review-regulated-docs', concept: 'Human-in-the-loop AI verification for regulated documents', technicalInnovation: 16, researchUncertainty: 16, societalEconomicImpact: 15, commercialPotential: 15, nsfTopicFit: 15, teamCapability: 13, evidenceStrength: 12, submissionReadiness: 13, totalScore: 115, recommendation: 'Alternate', rationale: 'Strong, but narrower and less tied to the full Atlas funding-operator workflow.' },
      { id: 'funding-eligibility-reasoning', concept: 'Explainable funding-eligibility and compliance reasoning', technicalInnovation: 15, researchUncertainty: 15, societalEconomicImpact: 15, commercialPotential: 14, nsfTopicFit: 14, teamCapability: 13, evidenceStrength: 11, submissionReadiness: 12, totalScore: 109, recommendation: 'Alternate', rationale: 'Useful but could read as rules automation unless framed around uncertainty, evidence provenance, and contradiction handling.' },
      { id: 'privacy-document-intelligence', concept: 'Privacy-preserving document intelligence for founder funding workflows', technicalInnovation: 14, researchUncertainty: 14, societalEconomicImpact: 14, commercialPotential: 14, nsfTopicFit: 13, teamCapability: 12, evidenceStrength: 10, submissionReadiness: 11, totalScore: 102, recommendation: 'Monitor', rationale: 'Potential future path, but current implementation evidence is stronger for provenance and workflow reliability than new privacy-preserving ML research.' },
      { id: 'reliable-orchestration', concept: 'Reliable AI orchestration for high-stakes small-business workflows', technicalInnovation: 15, researchUncertainty: 14, societalEconomicImpact: 14, commercialPotential: 16, nsfTopicFit: 14, teamCapability: 13, evidenceStrength: 11, submissionReadiness: 12, totalScore: 109, recommendation: 'Alternate', rationale: 'Commercially broad, but needs sharper R&D hypothesis than the selected evidence-provenance concept.' },
    ],
    fields: [
      { id: 'technology-innovation', label: 'Technology Innovation (up to 3500 characters)', purpose: 'Official NSF Project Pitch element: explain the core high-risk technical innovation and why it is more than ordinary software development.', evidenceStatus: 'AI-generated draft', founderReviewRequired: true, response: 'Nieves Labs is developing an evidence-provenance AI layer for small businesses navigating regulated funding workflows. The innovation is an auditable reasoning system that can ingest founder documents, official requirements, portal questions, and workflow history, then label each output as verified evidence, planning assumption, generated draft, contradiction, missing proof, or founder-only certification. Unlike static grant databases or generic writing tools, the system is designed to preserve the source and legal status of each claim while reducing duplicate founder questions and preventing unsupported application language. The technical innovation is not simply generating application text; it is creating a reliability layer that traces why a funding-package claim exists, what source supports it, what uncertainty remains, and whether a founder legal decision is required before submission.' },
      { id: 'technical-objectives', label: 'Technical Objectives and Challenges (up to 3500 characters)', purpose: 'Official NSF Project Pitch element: state the R&D questions, objectives, and technical challenges.', evidenceStatus: 'AI-generated draft', founderReviewRequired: true, response: 'The project will test whether retrieval, classification, contradiction detection, prompt/version traceability, and human approval gates can produce funding packages that are both useful and auditable. Key technical challenges include separating verified business facts from inferred assumptions, reconciling conflicting documents, mapping official requirements to available evidence, detecting missing proof before submission, and creating reliable founder-only gates for legal certifications. Phase I R&D would define the evidence taxonomy, implement provenance-aware retrieval and classification, build contradiction and missing-evidence detection, map official requirements to company evidence, add prompt/version logging, and validate founder approval gates. Evaluation would measure duplicate-question reduction, evidence-label accuracy, missing-document detection, unsupported-claim prevention, and founder time saved across SBA/CDFI and NSF-style package workflows.' },
      { id: 'market-opportunity', label: 'Market Opportunity (up to 1750 characters)', purpose: 'Official NSF Project Pitch element: identify customers, market need, competitive landscape, and commercial potential.', evidenceStatus: 'Planning assumption', founderReviewRequired: true, response: 'The initial market includes founders, small businesses, CDFIs, accelerators, advisors, and service providers that help companies prepare SBA loans, CDFI applications, grants, and other funding packages. These workflows are document-heavy, repetitive, and error-prone. Customers need a system that can reuse known company information, track evidence gaps, prepare package-specific drafts, and clearly identify when founder review or legal certification is required. Atlas will begin as an internal Nieves Labs operating system and can expand into a subscription product or managed-service platform for small-business funding preparation. Potential revenue models include subscription access, package-based services, advisor/team seats, and partner workflows for accelerators or small-business support organizations.' },
      { id: 'company-team', label: 'Company and Team (up to 1750 characters)', purpose: 'Official NSF Project Pitch element: describe the company, team suitability, and gaps without inventing credentials.', evidenceStatus: 'Founder provided', founderReviewRequired: true, response: 'Nieves Labs is a Texas-based AI products company founded by Tomas Nieves. The company is building practical AI tools and automation workflows, including the Nieves AI Platform and Atlas Capital Office. Atlas has already been used internally to organize funding readiness, lender tracking, application packages, document checklists, founder approval gates, and workflow lessons learned. The current team gap is formal NSF/SBIR proposal and technical evaluation support, which would be addressed through contractor support, advisor review, and customer discovery during Phase I. No patents, institutional partners, customer revenue, or third-party validation are claimed in this Project Pitch unless Tomas later provides evidence.' },
    ],
    assumptions: [
      'Nieves Labs is eligible to apply as a U.S. small business, pending founder certification.',
      'The selected concept fits NSF AI / information technology topic guidance, pending portal validation.',
      'Atlas internal use can be described as product evidence, but not as customer revenue or third-party validation.',
      'All technical claims require Tomas founder review before submission.',
    ],
    missingEvidence: [
      'Verified NSF ID / Research.gov organization record.',
      'SAM.gov, UEI, Grants.gov, PI/SPO/AOR role status.',
      'Founder-approved exact pitch text.',
      'Any customer/pilot/revenue metrics Tomas wants to cite.',
      'Official portal field limits after login.',
    ],
    requiredFounderApprovalPhrase: 'I approve the NSF Project Pitch for submission.',
    finalSubmissionAction: 'Log in to the official NSF Project Pitch portal, paste/validate the approved responses, review certifications, and click the final Submit button only after Tomas gives the exact approval phrase.',
  },
  competitors: [
    { id: 'instrumentl', name: 'Instrumentl', category: 'Grant discovery/management', targetCustomer: 'Nonprofits and grant teams', scope: 'Discovery, tracking, funder research', strengths: 'Mature database and tracking workflow', weakness: 'Not a founder-specific autonomous application operator', differentiationOpportunity: 'Atlas can reuse company evidence and prepare packages with founder-only gates.', pricing: 'Requires current verification; not used as source of truth here.', source: 'Competitor category research placeholder for founder validation', lastVerifiedDate: '2026-07-13' },
    { id: 'grantable', name: 'Grantable', category: 'AI proposal-writing', targetCustomer: 'Grant writers and organizations', scope: 'AI-assisted writing', strengths: 'Proposal drafting assistance', weakness: 'Does not appear to be a full portal/operator memory layer for small-business federal workflows', differentiationOpportunity: 'Atlas combines discovery, evidence reconciliation, compliance, and application tracking.', pricing: 'Requires current verification.', source: 'Competitor category research placeholder for founder validation', lastVerifiedDate: '2026-07-13' },
    { id: 'submittable', name: 'Submittable / Fluxx / Foundant category', category: 'Grant management platforms', targetCustomer: 'Funders and grant administrators', scope: 'Application collection and management', strengths: 'Enterprise grant workflow management', weakness: 'Usually serves funders or grant offices, not small-business applicants needing autonomous prep', differentiationOpportunity: 'Atlas is applicant-side funding department, not funder CRM.', pricing: 'Enterprise/quote-oriented; requires verification.', source: 'Competitor category research placeholder for founder validation', lastVerifiedDate: '2026-07-13' },
  ],
  activityFeed: [
    { id: 'truthful-submission-status', timestamp: now, status: 'Completed', label: 'Recorded federal submission evidence', detail: 'Federal grant applications submitted: 0. Submission evidence: none. No NSF receipt or confirmation exists yet.' },
    { id: 'verified-nsf-project-pitch', timestamp: now, status: 'Completed', label: 'Verified NSF Project Pitch gate', detail: 'Official NSF America’s Seed Fund guidance requires a Project Pitch and invitation before a full Phase I proposal.' },
    { id: 'reclassified-nsf-26-511', timestamp: now, status: 'Completed', label: 'Reclassified NSF 26-511', detail: 'NSF 26-511 is monitored only; Atlas no longer treats it as a submitted or ready full proposal path.' },
    { id: 'scored-nsf-concepts', timestamp: now, status: 'Completed', label: 'Scored five Nieves Labs concepts', detail: 'Selected evidence-provenance AI for small-business funding workflows as the strongest truthful NSF pitch concept.' },
    { id: 'excluded-low-fit', timestamp: now, status: 'Completed', label: 'Excluded low-fit opportunities', detail: 'Excluded embassy APS, health-specific, academic-only, and unrelated public diplomacy opportunities from founder view.' },
    { id: 'prepared-project-pitch', timestamp: now, status: 'Completed', label: 'Generated founder-review Project Pitch', detail: 'Prepared exact Project Pitch responses, assumptions, missing evidence, and founder approval phrase.' },
    { id: 'waiting-founder-approval', timestamp: now, status: 'Waiting for Tomas', label: 'Founder approval gate', detail: 'NSF portal login/MFA, legal certifications, and final submit action require founder approval and account-holder participation.' },
  ],
  lastVerifiedDate: '2026-07-14',
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
      applicationUrl: 'https://www.liftfund.com/apply-now',
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
  campaignState: {
    id: 'atlas_campaign_state',
    requestedAmount: 50000,
    activeLender: 'DreamSpring',
    backupLenders: ['PeopleFund', 'SBA Lender Match', 'LiftFund'],
    currentStage: 'DreamSpring application under review',
    currentPortal: 'DreamSpring borrower portal',
    currentApplicationPage: 'Submitted status / lender review',
    accountStatus: 'Created and submitted during founder-guided session',
    registrationStatus: 'Complete for DreamSpring; blocked for SBA Lender Match; unresolved for PeopleFund and LiftFund',
    loginStatus: 'DreamSpring accessible during submission; other lender account states require support or founder recovery',
    fieldsCompleted: 47,
    fieldsMissing: 6,
    documentsUploaded: 0,
    documentsMissing: 4,
    founderActionsPending: [
      'Monitor DreamSpring response',
      'Respond to any lender document request',
      'Resolve SBA account history only if DreamSpring does not proceed',
      'Avoid repeating PeopleFund/LiftFund account loops without support contact',
    ],
    founderActionsCompleted: [
      'Approved $50,000 small-business loan target',
      'Completed founder-only identity prompts in lender portals',
      'Submitted DreamSpring application for lender review',
    ],
    lastSuccessfulCheckpoint: 'DreamSpring submission confirmation / under-review state',
    lastBrowserAction: 'Founder reviewed the application status after submission',
    nextRetry: 'Do not retry blocked portals until DreamSpring responds or a lender support path is selected',
    failoverCondition: 'If DreamSpring declines or requests unavailable documents, fail over to PeopleFund support-assisted path before revisiting SBA/LiftFund',
    submissionEvidence: 'Preserved in private evidence package; do not commit application IDs or screenshots containing private data',
    followUpDate: '2026-07-16',
    decisionStatus: 'under_review',
    interruptions: 18,
    founderTimeMinutes: 960,
    reusableFieldsAutofilledPercent: 72,
    codexPromptsRequired: 35,
    resumptions: 11,
    updatedAt: now,
  },
  lenderWorkflowLibrary: [
    {
      id: 'dreamspring-business-profile',
      lender: 'DreamSpring',
      portalUrl: 'https://flare.dreamspring.org/',
      pageName: 'Business information',
      fieldLabel: 'Business profile and funding request',
      fieldType: 'business_profile',
      required: true,
      validationRule: 'Use Atlas company profile and $50,000 use-of-funds package; founder reviews before submit.',
      expectedFormat: 'Plain-language lender application answers',
      sourceAtlasField: 'companyProfile + useOfFundsPlan + financialAssumptions',
      autofillResult: 'autofilled',
      errorEncountered: 'No repeatable blocker after founder-guided account setup.',
      fixOrWorkaround: 'Keep DreamSpring as active lender and preserve non-sensitive package evidence.',
      founderOnly: false,
      saveBehavior: 'Save application checkpoint after every page.',
      submissionBehavior: 'Founder must approve final certification before submission.',
      lastVerifiedDate: '2026-07-13',
      outcome: 'Submitted and under lender review.',
    },
    {
      id: 'sba-account-registration',
      lender: 'SBA Lender Match',
      portalUrl: 'https://lending.sba.gov/',
      pageName: 'MySBA registration',
      fieldLabel: 'Prior SBA loan/account validation',
      fieldType: 'portal_account',
      required: true,
      validationRule: 'Do not retry after prior-loan validation error without founder/account-holder resolution.',
      expectedFormat: 'Founder-only SBA account history confirmation',
      sourceAtlasField: 'founder-only external account state',
      autofillResult: 'blocked',
      errorEncountered: 'Registration blocked by active/prior SBA loan number validation message.',
      fixOrWorkaround: 'Escalate to SBA support or founder-only account resolution before using Lender Match.',
      founderOnly: true,
      saveBehavior: 'Record blocker and pause workflow.',
      submissionBehavior: 'No application submission attempted.',
      lastVerifiedDate: '2026-07-13',
      outcome: 'Blocked.',
    },
    {
      id: 'peoplefund-account-exists',
      lender: 'PeopleFund',
      portalUrl: 'https://peoplefund.org/get-a-loan/',
      pageName: 'Account creation/login',
      fieldLabel: 'Borrower account access',
      fieldType: 'portal_account',
      required: true,
      validationRule: 'After one failed create/reset cycle, stop and switch to lender support.',
      expectedFormat: 'Verified borrower account or support-assisted account reset',
      sourceAtlasField: 'founder-only external account state',
      autofillResult: 'blocked',
      errorEncountered: 'Portal implied an account already existed, but reset flow was not enough to proceed cleanly.',
      fixOrWorkaround: 'Use PeopleFund as fallback only through support-assisted resolution.',
      founderOnly: true,
      saveBehavior: 'Record account ambiguity and fail over.',
      submissionBehavior: 'No application submission attempted.',
      lastVerifiedDate: '2026-07-13',
      outcome: 'Blocked pending support path.',
    },
    {
      id: 'liftfund-founder-sensitive-fields',
      lender: 'LiftFund',
      portalUrl: 'https://www.liftfund.com/apply-now',
      pageName: 'Borrower onboarding',
      fieldLabel: 'Founder-only identity and entity fields',
      fieldType: 'identity',
      required: true,
      validationRule: 'Atlas may prepare answers but must not store or certify SSN, DOB, passwords, MFA, or credit consent.',
      expectedFormat: 'Founder enters private values directly in official portal',
      sourceAtlasField: 'founder-only private identity data',
      autofillResult: 'founder_only',
      errorEncountered: 'Progress paused after founder-only field requirements and account-reset friction.',
      fixOrWorkaround: 'Resume only after portal access recovery and founder approval.',
      founderOnly: true,
      saveBehavior: 'Preserve non-sensitive status only.',
      submissionBehavior: 'No application submission without founder final approval.',
      lastVerifiedDate: '2026-07-13',
      outcome: 'Paused.',
    },
  ],
  pilotFailureRecords: [
    {
      id: 'atlas-admin-token-loop',
      lenderOrModule: 'Atlas authentication',
      portalOrRoute: '/atlas',
      pageOrStep: 'Founder access',
      fieldOrAction: 'ADMIN_TOKEN prompt/query token',
      whatHappened: 'Founder had to repeatedly ask what token was needed and re-enter developer-style access.',
      expected: 'Founder signs in once and remains authenticated with a secure session.',
      actual: 'Atlas routes depended on query-token access and exposed a developer operations pattern to the founder.',
      rootCause: 'No first-class founder authentication layer existed.',
      workaround: 'Use ADMIN_TOKEN only as emergency recovery.',
      productDefect: 'Founder UX blocked normal business use.',
      automationDefect: 'Browser sessions could not resume Atlas state cleanly.',
      founderIntervention: 'Repeated token prompts.',
      permanentFix: 'HTTP-only founder session cookie, Atlas login, safe returnTo, and role-aware access control.',
      regressionTest: 'Unauthenticated /atlas routes redirect to /atlas/login; authenticated session loads without token query strings.',
      lastVerifiedDate: '2026-07-13',
    },
    {
      id: 'peoplefund-account-assumption',
      lenderOrModule: 'PeopleFund',
      portalOrRoute: 'PeopleFund borrower flow',
      pageOrStep: 'Login/account creation',
      fieldOrAction: 'Account exists / password reset',
      whatHappened: 'Workflow assumed an account existed and spent cycles on reset even though no working account path was confirmed.',
      expected: 'Detect account ambiguity early and branch to account creation or support escalation.',
      actual: 'The flow looped between login/reset states.',
      rootCause: 'Missing lender-specific account-state adapter.',
      workaround: 'Pause PeopleFund until support-assisted account resolution.',
      productDefect: 'No durable account-state memory.',
      automationDefect: 'Repeated the same browser path after failure.',
      founderIntervention: 'Founder had to correct the assumption.',
      permanentFix: 'Add lender account-state field map and one-cycle retry limit.',
      regressionTest: 'PeopleFund blocker must remain recorded and not be retried without a new account-resolution status.',
      lastVerifiedDate: '2026-07-13',
    },
    {
      id: 'sba-registration-blocker',
      lenderOrModule: 'SBA Lender Match',
      portalOrRoute: 'MySBA / lending.sba.gov',
      pageOrStep: 'Registration',
      fieldOrAction: 'Prior SBA loan validation',
      whatHappened: 'Registration failed with a prior-loan validation message requiring account-holder resolution.',
      expected: 'Pause and route to founder/SBA support.',
      actual: 'The workflow could not proceed through registration.',
      rootCause: 'External SBA account state is unavailable to Atlas and may require founder-only resolution.',
      workaround: 'Document blocker and use DreamSpring/CDFI path.',
      productDefect: 'No SBA account-resolution playbook existed.',
      automationDefect: 'No hard-stop rule for this external validation state.',
      founderIntervention: 'Founder or SBA support must resolve account status.',
      permanentFix: 'Create SBA account-resolution checklist before retrying Lender Match.',
      regressionTest: 'SBA path remains blocked until account-resolution status changes.',
      lastVerifiedDate: '2026-07-13',
    },
    {
      id: 'bcl-prescreen-decline',
      lenderOrModule: 'BCL of Texas',
      portalOrRoute: 'BCL lending inquiry',
      pageOrStep: 'Prescreen',
      fieldOrAction: 'Eligibility result',
      whatHappened: 'Prescreen indicated lending opportunities were not available at this time.',
      expected: 'Record decline and fail over.',
      actual: 'BCL was no longer viable for the current campaign.',
      rootCause: 'Lender-specific eligibility response.',
      workaround: 'Do not retry unless BCL guidance changes.',
      productDefect: 'No prior decline-state memory.',
      automationDefect: 'Needed failover logic tied to prescreen result.',
      founderIntervention: 'None beyond review.',
      permanentFix: 'Persist declined status and reason in funding tracker.',
      regressionTest: 'Declined lender does not appear as active campaign path.',
      lastVerifiedDate: '2026-07-13',
    },
    {
      id: 'dreamspring-success-path',
      lenderOrModule: 'DreamSpring',
      portalOrRoute: 'DreamSpring borrower portal',
      pageOrStep: 'Application submission',
      fieldOrAction: 'Final review and submit',
      whatHappened: 'Founder-guided application reached submitted/under-review state.',
      expected: 'Record lender, requested amount, status, evidence, and next follow-up.',
      actual: 'Submission succeeded after founder-only inputs and final review.',
      rootCause: 'DreamSpring path was compatible with current Atlas founder-guided workflow.',
      workaround: 'Use as active campaign path while response is pending.',
      productDefect: 'Follow-up reminder and evidence packaging should be automated.',
      automationDefect: 'Manual browser coordination took too long.',
      founderIntervention: 'Founder completed identity, account, and final approval steps.',
      permanentFix: 'Preserve DreamSpring as reusable lender profile with five-step campaign state.',
      regressionTest: 'Funding Campaign OS shows DreamSpring active, $50,000 requested, and follow-up date.',
      lastVerifiedDate: '2026-07-13',
    },
  ],
  grantOperator: seedGrantOperator,
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
      campaignState: normalized.campaignState,
      lenderWorkflowLibrary: normalized.lenderWorkflowLibrary,
      pilotFailureRecords: normalized.pilotFailureRecords,
      grantOperator: normalized.grantOperator,
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
    campaignState: {
      ...seedData.campaignState,
      ...(data.campaignState || {}),
      founderActionsPending: data.campaignState?.founderActionsPending?.length ? data.campaignState.founderActionsPending : seedData.campaignState.founderActionsPending,
      founderActionsCompleted: data.campaignState?.founderActionsCompleted?.length ? data.campaignState.founderActionsCompleted : seedData.campaignState.founderActionsCompleted,
    },
    lenderWorkflowLibrary: data.lenderWorkflowLibrary?.length ? data.lenderWorkflowLibrary : seedData.lenderWorkflowLibrary,
    pilotFailureRecords: data.pilotFailureRecords?.length ? data.pilotFailureRecords : seedData.pilotFailureRecords,
    grantOperator: {
      ...seedData.grantOperator,
      ...(data.grantOperator || {}),
      registrations: data.grantOperator?.registrations?.length ? data.grantOperator.registrations : seedData.grantOperator.registrations,
      opportunities: data.grantOperator?.opportunities?.length ? data.grantOperator.opportunities : seedData.grantOperator.opportunities,
      selectedPackage: {
        ...seedData.grantOperator.selectedPackage,
        ...(data.grantOperator?.selectedPackage || {}),
      },
      competitors: data.grantOperator?.competitors?.length ? data.grantOperator.competitors : seedData.grantOperator.competitors,
      activityFeed: data.grantOperator?.activityFeed?.length ? data.grantOperator.activityFeed : seedData.grantOperator.activityFeed,
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

  if (process.env.VERCEL_ENV === 'production') {
    if (configuredProvider && configuredProvider !== 'supabase') {
      throw new Error('Atlas production storage must use Supabase. JSON storage is local-development only.');
    }
    if (!hasSupabase) {
      throw new Error('Atlas production storage is not configured. Refusing to use local JSON storage on Vercel production.');
    }
    return 'supabase';
  }

  if (configuredProvider === 'supabase') {
    if (!hasSupabase) {
      throw new Error('Atlas Supabase storage is selected, but ATLAS_SUPABASE_URL and ATLAS_SUPABASE_SECRET_KEY are not configured.');
    }
    return 'supabase';
  }

  if (configuredProvider === 'json') {
    return 'json';
  }

  if (configuredProvider && configuredProvider !== 'json') {
    throw new Error(`Unsupported Atlas storage provider: ${configuredProvider}`);
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
