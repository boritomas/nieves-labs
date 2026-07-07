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
      email: 'pending',
    },
  });
  await addLog(order.id, 'info', 'Workflow started', { productKey });

  const folderId = await createCustomerDriveFolder(order, product);
  const orderWithFolder = await getOrder(order.id);
  const uploadedFiles = orderWithFolder ? await uploadOrderFilesToDrive(orderWithFolder, folderId || orderWithFolder.driveFolderId) : order.uploads;
  const latestOrder = await getOrder(order.id);
  const generated = await generateDeliverableContent(latestOrder || order, product);
  const deliverable = await uploadDeliverableToDrive(latestOrder || order, generateStructuredDeliverable(order.id, product.title, generated.content), folderId || latestOrder?.driveFolderId);

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
