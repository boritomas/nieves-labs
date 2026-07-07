import { randomUUID } from 'crypto';
import { sendOrderEmail } from './email';
import { createCustomerDriveFolder, triggerAppsScript } from './google';
import { getProductByKey } from './products';
import { addLog, getOrder, updateOrder } from './store';
import type { Deliverable } from './types';

export async function runWorkflow(productKey: string, orderId: string) {
  const order = await getOrder(orderId);
  const product = getProductByKey(productKey);
  if (!order || !product) {
    throw new Error('Order or product not found');
  }

  await updateOrder(order.id, {
    status: 'processing',
    workflowStatus: {
      intake: order.intakeSubmittedAt ? 'completed' : 'pending',
      drive: 'pending',
      generation: 'pending',
      email: 'pending',
    },
  });
  await addLog(order.id, 'info', 'Workflow started', { productKey });

  const folderId = await createCustomerDriveFolder(order, product);
  const deliverable = generateStructuredDeliverable(order.id, product.title, product.deliverables, order.intakeAnswers);
  const latestOrder = await getOrder(order.id);

  await updateOrder(order.id, {
    status: 'completed',
    deliverables: [...(latestOrder?.deliverables || []), deliverable],
    workflowStatus: {
      intake: 'completed',
      drive: folderId ? 'completed' : 'skipped',
      generation: 'completed',
      email: 'pending',
      appsScript: 'pending',
    },
  });
  await addLog(order.id, 'info', 'Structured deliverable generated', { deliverableId: deliverable.id });

  const refreshedOrder = await getOrder(order.id);
  if (refreshedOrder) {
    await triggerAppsScript(refreshedOrder);
    await sendOrderEmail(refreshedOrder, product, 'deliverable_ready');
    await updateOrder(order.id, {
      workflowStatus: {
        ...refreshedOrder.workflowStatus,
        email: 'completed',
        appsScript: 'completed',
      },
    });
  }

  return getOrder(order.id);
}

function generateStructuredDeliverable(orderId: string, productTitle: string, deliverables: string[], answers: Record<string, string>): Deliverable {
  const answerLines = Object.entries(answers).map(([key, value]) => `- ${key}: ${value || 'Not provided'}`);
  const content = [
    `# ${productTitle} Deliverable`,
    '',
    '## Package Outputs',
    ...deliverables.map((item) => `- ${item}`),
    '',
    '## Intake Summary',
    ...(answerLines.length ? answerLines : ['- No intake answers submitted.']),
    '',
    '## Next Steps',
    '- Review the generated package.',
    '- Confirm any missing or unclear details.',
    '- Use this structured template as the baseline when AI generation credentials are unavailable.',
  ].join('\n');

  return {
    id: randomUUID(),
    orderId,
    title: `${productTitle} Package`,
    type: 'markdown',
    content,
    createdAt: new Date().toISOString(),
  };
}
