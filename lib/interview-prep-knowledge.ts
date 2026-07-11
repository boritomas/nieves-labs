export type InterviewPrepKnowledgeAsset = {
  id: string;
  title: string;
  source: string;
  purpose: string;
  content: string[];
};

export const interviewPrepKnowledgeBase = {
  id: 'interview-prep-authoritative-kb',
  version: '2026.07.11',
  auditSummary: [
    'Reused the existing AnswerBrief AI package definitions, delivery standards, sample brief framework, and Interview Prep fulfillment workflow from the AnswerBrief AI implementation available in this workspace.',
    'Preserved the established method: role-specific preparation, no invented candidate experience, STAR guidance grounded in supplied facts, and no hiring guarantees.',
    'Operationalized the mature AnswerBrief structure inside the Nieves AI shared workflow engine instead of replacing it with a generic prompt-only implementation.',
  ],
  assets: [
    {
      id: 'ab-deliverable-framework',
      title: 'AnswerBrief deliverable framework',
      source: 'answerbrief-ai-automation/lib/brief.ts',
      purpose: 'Defines the customer-facing brief sections.',
      content: [
        'Executive summary',
        'Inputs reviewed',
        'Resume-to-role alignment',
        'Strengths and gaps',
        'Likely interview questions',
        'STAR story guidance',
        'Interview strategy',
        'Questions to ask',
        'Final prep checklist',
        'Outcome disclaimer',
      ],
    },
    {
      id: 'ab-quality-standard',
      title: 'AnswerBrief quality standard',
      source: 'answerbrief-ai-automation/lib/answerbrief-fulfillment.ts',
      purpose: 'Defines release-gate expectations for automated fulfillment.',
      content: [
        'The workflow must record Interview Prep knowledge reuse.',
        'The workflow must analyze resume/source material and job description text when available.',
        'The workflow must generate likely questions, STAR guidance, strengths, risks, strategy, and checklist content.',
        'The workflow must validate required sections and flag missing source inputs.',
      ],
    },
    {
      id: 'ab-safety-standard',
      title: 'AnswerBrief safety and claims standard',
      source: 'answerbrief-ai-automation/lib/interview-prep-knowledge.ts',
      purpose: 'Prevents unsupported claims in customer deliverables.',
      content: [
        'Do not invent candidate achievements, metrics, employers, technologies, credentials, or outcomes.',
        'Use only customer-provided experience and clearly identify missing inputs.',
        'Do not guarantee interviews, offers, promotions, or hiring outcomes.',
      ],
    },
  ] satisfies InterviewPrepKnowledgeAsset[],
};

export function summarizeInterviewPrepKnowledge() {
  return interviewPrepKnowledgeBase.assets
    .map((asset) => `${asset.title}: ${asset.content.join(' ')}`)
    .join('\n');
}
