import type { ProductKey, ProductWorkflowKey } from './products';

export type PromptRecord = {
  id: string;
  version: string;
  purpose: string;
  productKey: ProductKey;
  workflowKey: ProductWorkflowKey;
  inputSchema: string[];
  outputSchema: string[];
  model: {
    provider: 'openai';
    name: string;
    temperature: number;
  };
  dependencies: string[];
  active: boolean;
  changeHistory: Array<{ version: string; date: string; note: string }>;
};

const promptRegistry: PromptRecord[] = [
  makePrompt('answerbrief_ai', 'answerbrief_fulfillment', 'answerbrief-deliverable-v1', [
    'resume files',
    'job posting',
    'target role',
    'interview stage',
  ], [
    'interview brief',
    'STAR story bank',
    'role-fit talking points',
    'final prep checklist',
  ]),
  makePrompt('tax_buddy', 'tax_buddy_organizer', 'tax-buddy-organizer-v1', ['tax year', 'filing type', 'tax files'], ['document checklist', 'missing item report', 'preparation summary']),
  makePrompt('tax_appeal_buddy', 'tax_appeal_packet', 'tax-appeal-packet-v1', ['property address', 'assessment year', 'appeal evidence'], ['appeal packet', 'comps worksheet', 'hearing prep notes']),
  makePrompt('interview_coach', 'interview_coach_plan', 'interview-coach-plan-v1', ['target role', 'confidence level', 'resume or career summary'], ['practice plan', 'question bank', 'improvement checklist']),
  makePrompt('workforce_study', 'workforce_study_report', 'workforce-study-report-v1', ['team size', 'process notes', 'current tools'], ['study report', 'workflow map', 'opportunity backlog']),
  makePrompt('mixpilot_ai', 'mixpilot_set_plan', 'mixpilot-set-plan-v1', ['event type', 'audience', 'song list', 'energy style'], ['cue sheet', 'energy flow', 'transition notes']),
  makePrompt('nieves_ai_platform', 'platform_consultation', 'platform-consultation-v1', ['business goal', 'current stack', 'timeline'], ['consultation summary', 'architecture outline', 'roadmap']),
];

export function getPromptForProduct(productKey: ProductKey) {
  return promptRegistry.find((prompt) => prompt.productKey === productKey && prompt.active);
}

export function listPromptRegistry() {
  return [...promptRegistry];
}

function makePrompt(
  productKey: ProductKey,
  workflowKey: ProductWorkflowKey,
  id: string,
  inputSchema: string[],
  outputSchema: string[],
): PromptRecord {
  return {
    id,
    version: '1.0.0',
    purpose: `Generate the configured ${workflowKey.replaceAll('_', ' ')} deliverable using customer-provided intake and files.`,
    productKey,
    workflowKey,
    inputSchema,
    outputSchema,
    model: {
      provider: 'openai',
      name: 'gpt-4.1-mini',
      temperature: 0.2,
    },
    dependencies: ['product registry', 'order storage', 'intake schema', 'file metadata'],
    active: true,
    changeHistory: [
      {
        version: '1.0.0',
        date: '2026-07-11',
        note: 'Initial NAIP shared prompt registry record.',
      },
    ],
  };
}
