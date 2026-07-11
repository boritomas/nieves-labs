import { randomUUID } from 'crypto';
import { generateDeliverableContent } from './ai';
import { sendOrderEmail } from './email';
import { createCustomerDriveFolder, triggerAppsScript, uploadDeliverableToDrive, uploadOrderFilesToDrive } from './google';
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
      qa: 'pending',
      email: 'pending',
    },
  });
  await addLog(order.id, 'info', 'Workflow started', {
    productKey,
    workflowKey: product.workflow.key,
    workflowVersion: product.workflow.version,
  });

  const folderId = await createCustomerDriveFolder(order, product);
  const orderWithFolder = await getOrder(order.id);
  const uploadedFiles = orderWithFolder ? await uploadOrderFilesToDrive(orderWithFolder, folderId || orderWithFolder.driveFolderId) : order.uploads;
  const latestOrder = await getOrder(order.id);
  const generated = await generateDeliverableContent(latestOrder || order, product);
  const qa = validateGeneratedDeliverable(generated.content, product);
  if (!qa.passed) {
    await addLog(order.id, 'warn', 'Deliverable QA warnings', { warnings: qa.warnings });
  }
  const deliverable = await uploadDeliverableToDrive(latestOrder || order, generateStructuredDeliverable(order.id, product.title, generated.content), folderId || latestOrder?.driveFolderId);

  await updateOrder(order.id, {
    status: 'completed',
    deliverables: [...(latestOrder?.deliverables || []), deliverable],
    workflowStatus: {
      intake: 'completed',
      drive: folderId ? 'completed' : 'skipped',
      generation: 'completed',
      qa: qa.passed ? 'completed' : 'failed',
      email: 'pending',
      appsScript: 'pending',
    },
  });
  await addLog(order.id, 'info', generated.mode === 'openai' ? 'OpenAI deliverable generated' : 'Structured fallback deliverable generated', { deliverableId: deliverable.id });

  const refreshedOrder = await getOrder(order.id);
  if (refreshedOrder) {
    await triggerAppsScript(refreshedOrder, uploadedFiles.map((upload) => upload.googleFileId).filter((fileId): fileId is string => Boolean(fileId)));
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

function validateGeneratedDeliverable(content: string, product: { deliverables: string[]; disclaimer: string }) {
  const warnings: string[] = [];
  if (!content.trim()) warnings.push('Deliverable content is empty.');
  for (const deliverable of product.deliverables) {
    const token = deliverable.toLowerCase().split(/\s+/)[0];
    if (token && !content.toLowerCase().includes(token)) {
      warnings.push(`Expected deliverable reference may be missing: ${deliverable}`);
    }
  }
  if (product.disclaimer && !content.includes(product.disclaimer)) {
    warnings.push('Product disclaimer is missing from deliverable content.');
  }

  return {
    passed: warnings.length === 0,
    warnings,
  };
}

function generateStructuredDeliverable(orderId: string, productTitle: string, content: string): Deliverable {
  return {
    id: randomUUID(),
    orderId,
    title: `${productTitle} Package`,
    type: 'markdown',
    content,
    createdAt: new Date().toISOString(),
  };
}
