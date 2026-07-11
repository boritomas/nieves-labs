import { env } from './env';
import { generateAnswerBriefPackage } from './answerbrief-fulfillment';
import { getPromptForProduct } from './prompt-registry';
import type { Product } from './products';
import type { Order } from './types';

export async function generateDeliverableContent(order: Order, product: Product) {
  if (product.key === 'answerbrief_ai') {
    const generated = await generateAnswerBriefPackage(order);
    return {
      mode: 'answerbrief' as const,
      content: generated.content,
      qa: generated.qa,
      events: generated.events,
    };
  }

  if (!env.openaiApiKey) {
    return {
      mode: 'fallback' as const,
      content: structuredTemplate(order, product),
      qa: undefined,
      events: [],
    };
  }

  try {
    const prompt = getPromptForProduct(product.key);
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: [
              'Generate concise, practical customer deliverables for Nieves Labs. Do not invent legal, tax, employment, or guaranteed outcome claims. Use markdown.',
              prompt ? `Use prompt registry record ${prompt.id} version ${prompt.version}. Purpose: ${prompt.purpose}` : 'No prompt registry record was found; use the product configuration as the source of truth.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify({
              product: product.title,
              workflow: product.workflow,
              prompt,
              deliverables: product.deliverables,
              disclaimer: product.disclaimer,
              answers: order.intakeAnswers,
              uploadedFiles: order.uploads.map((upload) => ({ fileName: upload.fileName, fileType: upload.fileType })),
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json() as { output_text?: string };
    return {
      mode: 'openai' as const,
      content: data.output_text || structuredTemplate(order, product),
      qa: undefined,
      events: [],
    };
  } catch {
    return {
      mode: 'fallback' as const,
      content: structuredTemplate(order, product),
      qa: undefined,
      events: [],
    };
  }
}

function structuredTemplate(order: Order, product: Product) {
  const answerLines = Object.entries(order.intakeAnswers).map(([key, value]) => `- ${key}: ${value || 'Not provided'}`);
  return [
    `# ${product.title} Deliverable`,
    '',
    '## Package Outputs',
    ...product.deliverables.map((item) => `- ${item}`),
    '',
    '## Intake Summary',
    ...(answerLines.length ? answerLines : ['- No intake answers submitted.']),
    '',
    '## Uploaded Files',
    ...(order.uploads.length ? order.uploads.map((upload) => `- ${upload.fileName} (${upload.fileType || 'unknown type'})`) : ['- No uploaded files.']),
    '',
    '## Next Steps',
    '- Review the generated package.',
    '- Confirm any missing or unclear details.',
    '- Use this structured template as the baseline when AI generation credentials are unavailable.',
    '',
    `## Disclaimer`,
    product.disclaimer,
  ].join('\n');
}
