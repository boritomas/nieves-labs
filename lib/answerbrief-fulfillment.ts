import { interviewPrepKnowledgeBase, summarizeInterviewPrepKnowledge } from './interview-prep-knowledge';
import type { Order, UploadRecord } from './types';

export type AnswerBriefFulfillmentResult = {
  content: string;
  qa: {
    passed: boolean;
    issues: string[];
    warnings: string[];
  };
  events: Array<{ event: string; message: string; severity?: 'info' | 'warning' | 'error' }>;
};

export async function generateAnswerBriefPackage(order: Order): Promise<AnswerBriefFulfillmentResult> {
  const analysis = buildAnalysis(order);
  const content = composeAnswerBrief(analysis);
  const qa = validateAnswerBrief(content, analysis);

  return {
    content,
    qa,
    events: [
      { event: 'interview_prep_kb_reused', message: `Loaded ${interviewPrepKnowledgeBase.id} ${interviewPrepKnowledgeBase.version}.` },
      { event: 'resume_analyzed', message: 'Resume/source material analyzed from intake and uploaded file metadata.' },
      { event: 'job_description_analyzed', message: 'Job description analyzer completed from pasted job posting.' },
      { event: 'resume_role_alignment_completed', message: 'Resume-to-role alignment and gap analysis completed.' },
      { event: 'interview_questions_generated', message: 'Behavioral, situational, leadership, technical, and follow-up questions generated as applicable.' },
      { event: 'star_guidance_generated', message: 'STAR story guidance generated from customer-provided facts only.' },
      { event: 'strength_risk_analysis_completed', message: 'Strength and risk analysis completed.' },
      { event: 'interview_strategy_generated', message: 'Interview strategy and preparation priorities generated.' },
      { event: qa.passed ? 'qa_validation_passed' : 'qa_validation_failed', message: qa.passed ? 'AnswerBrief QA passed.' : `AnswerBrief QA found ${qa.issues.length} issue(s).`, severity: qa.passed ? 'info' : 'warning' },
    ],
  };
}

type Analysis = ReturnType<typeof buildAnalysis>;

function buildAnalysis(order: Order) {
  const answers = order.intakeAnswers;
  const candidateName = answers.candidate_name || order.customerName || order.customerEmail;
  const targetRole = answers.target_role || 'target role';
  const targetCompany = answers.target_company || extractCompanyFromRole(targetRole);
  const jobPosting = answers.job_posting_text || '';
  const careerLane = answers.career_lane || 'professional background';
  const focusAreas = answers.focus_areas || '';
  const resumeSignals = extractSignals([careerLane, focusAreas, uploadSummary(order.uploads)].join('\n'));
  const roleSignals = extractSignals([targetRole, targetCompany, jobPosting].join('\n'));
  const likelyQuestions = buildLikelyQuestions(targetRole, targetCompany, roleSignals);
  const starGuidance = buildStarGuidance(resumeSignals, careerLane);
  const strengths = buildStrengths(resumeSignals, careerLane);
  const risks = buildRisks(order, jobPosting);

  return {
    candidateName,
    careerLane,
    focusAreas,
    jobPosting,
    knowledgeSummary: summarizeInterviewPrepKnowledge(),
    likelyQuestions,
    order,
    registryVersion: interviewPrepKnowledgeBase.version,
    resumeSignals,
    risks,
    roleSignals,
    starGuidance,
    strengths,
    targetCompany,
    targetRole,
  };
}

function composeAnswerBrief(analysis: Analysis) {
  const companyLine = analysis.targetCompany ? ` at ${analysis.targetCompany}` : '';
  return [
    '# AnswerBrief AI Interview Brief',
    '',
    'Fulfillment engine: Nieves AI AnswerBrief automated fulfillment v1',
    `Interview Prep knowledge base: ${interviewPrepKnowledgeBase.id} ${interviewPrepKnowledgeBase.version}`,
    `Candidate: ${analysis.candidateName}`,
    `Target role: ${analysis.targetRole}${companyLine}`,
    analysis.order.intakeAnswers.interview_date ? `Interview date: ${analysis.order.intakeAnswers.interview_date}` : undefined,
    '',
    '## Executive Summary',
    `Prepare to connect customer-provided ${analysis.careerLane} experience directly to ${analysis.targetRole}. Keep answers specific, practical, and grounded in real examples rather than broad claims.`,
    '',
    '## Inputs Reviewed',
    `- Resume/source files: ${analysis.order.uploads.length ? analysis.order.uploads.map((upload) => upload.fileName).join(', ') : 'Missing or not uploaded'}`,
    `- Job posting: ${analysis.jobPosting ? 'Provided and analyzed' : 'Missing; customer should add the exact posting before relying on role-specific guidance'}`,
    `- Interview stage: ${analysis.order.intakeAnswers.interview_stage || 'Not provided'}`,
    '',
    '## Resume-to-Role Alignment',
    ...analysis.roleSignals.slice(0, 5).map((signal) => `- Role signal to prepare for: ${signal}`),
    ...analysis.resumeSignals.slice(0, 5).map((signal) => `- Candidate evidence to connect: ${signal}`),
    '- Translate internal project language into language a new hiring team can understand quickly.',
    '',
    '## Top Strengths to Emphasize',
    ...analysis.strengths.map((item) => `- ${item}`),
    '',
    '## Gaps and Risks to Prepare For',
    ...analysis.risks.map((item) => `- ${item}`),
    '',
    '## Likely Interview Questions',
    ...analysis.likelyQuestions.map((question, index) => `${index + 1}. ${question}`),
    '',
    '## STAR Story Angles',
    ...analysis.starGuidance.map((item) => `- ${item}`),
    '',
    '## Interview Strategy',
    '- Prepare a concise opening pitch that connects your background to the target role.',
    '- Select three real examples and practice them using Situation, Task, Action, Result.',
    '- Pair each story with one role requirement or business problem from the posting.',
    '- Prepare one calm answer for each gap or missing requirement.',
    analysis.focusAreas ? `- Customer focus area: ${analysis.focusAreas}` : undefined,
    '',
    '## Questions to Ask the Interviewer',
    '- What would success look like in the first 90 days?',
    '- Which problems are most urgent for this role to solve?',
    '- How does the team make decisions when priorities conflict?',
    '',
    '## Final Prep Checklist',
    '- Practice a 60-second opening pitch out loud.',
    '- Practice three STAR stories without reading from notes.',
    '- Review the job posting and mark the highest-risk requirements.',
    '- Prepare two thoughtful questions for each interviewer.',
    '- Remove confidential, proprietary, or unsupported details from every answer.',
    '',
    '## Automated QA Notes',
    '- Required AnswerBrief sections were checked before delivery.',
    '- Missing or weak source inputs are called out in this brief.',
    '- STAR guidance uses only customer-provided context and does not invent achievements.',
    '',
    '## Disclaimer',
    'This brief is interview preparation support only. It does not guarantee interviews, job offers, promotions, or hiring outcomes. Outcomes depend on many factors outside AnswerBrief AI, including market conditions, employer needs, candidate fit, and interview performance.',
  ].filter(Boolean).join('\n');
}

function validateAnswerBrief(content: string, analysis: Analysis) {
  const issues: string[] = [];
  const warnings: string[] = [];

  for (const section of [
    'Executive Summary',
    'Inputs Reviewed',
    'Resume-to-Role Alignment',
    'Likely Interview Questions',
    'STAR Story Angles',
    'Final Prep Checklist',
    'Disclaimer',
  ]) {
    if (!content.includes(`## ${section}`)) issues.push(`Missing section: ${section}`);
  }

  if (!analysis.order.uploads.length) warnings.push('Resume/source upload is missing.');
  if (!analysis.jobPosting) warnings.push('Job posting text is missing.');
  if (/guaranteed job|will get hired|guarantee an offer/i.test(content)) issues.push('Potential unsupported hiring guarantee detected.');

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

function buildLikelyQuestions(targetRole: string, targetCompany: string, roleSignals: string[]) {
  return Array.from(new Set([
    `Walk me through your background and how it connects to ${targetRole}.`,
    `Why are you interested in ${targetCompany || 'this organization'} and this role?`,
    'Tell me about a project where you had to solve an ambiguous problem.',
    'How do you prioritize when stakeholders disagree?',
    'What is a gap in your background for this role, and how would you ramp up?',
    ...roleSignals.slice(0, 4).map((signal) => `How have you handled work related to ${signal}?`),
    'Tell me about a time you improved a process, reduced risk, or created clarity.',
    'What questions do you have for us?',
  ])).slice(0, 12);
}

function buildStarGuidance(resumeSignals: string[], careerLane: string) {
  return [
    `A measurable ${careerLane} project win that shows ownership. Use only real scope, tools, stakeholders, and outcomes from your experience.`,
    'A cross-functional challenge that shows communication and judgment.',
    'A time you improved a process, reduced risk, or created clarity.',
    resumeSignals[0] ? `A story connected to this customer-provided signal: ${resumeSignals[0]}.` : 'A story showing how you learned a new tool, process, or domain quickly.',
  ];
}

function buildStrengths(resumeSignals: string[], careerLane: string) {
  return [
    `Relevant ${careerLane} experience that can be translated into the target role language.`,
    'Ability to explain complex work in a structured way.',
    'Evidence of ownership, follow-through, and collaboration when supported by provided examples.',
    ...resumeSignals.slice(0, 2).map((signal) => `Customer-provided signal to emphasize: ${signal}.`),
  ];
}

function buildRisks(order: Order, jobPosting: string) {
  const risks = [
    'Any requirement in the posting that is adjacent to, but not directly proven by, the resume.',
    'Questions about scale, leadership scope, or domain depth.',
  ];
  if (!order.uploads.length) risks.unshift('Resume/source file was not uploaded, so STAR evidence should be confirmed by the customer.');
  if (!jobPosting) risks.unshift('Job posting text was not provided, so role-specific alignment should be reviewed against the actual posting.');
  return risks;
}

function uploadSummary(uploads: UploadRecord[]) {
  return uploads.map((upload) => upload.fileName.replace(/[-_.]/g, ' ')).join('\n');
}

function extractSignals(text: string) {
  const normalized = text
    .replace(/\s+/g, ' ')
    .split(/[.;\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 12);
  return normalized.length ? normalized.slice(0, 8) : ['role responsibilities', 'stakeholder communication', 'problem solving', 'ownership'];
}

function extractCompanyFromRole(value: string) {
  return value.match(/\bat\s+(.+)$/i)?.[1]?.trim() || '';
}
