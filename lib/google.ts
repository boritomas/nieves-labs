import { env } from './env';
import { addLog, updateOrder } from './store';
import type { Order } from './types';
import type { Product } from './products';

export async function createCustomerDriveFolder(order: Order, product: Product) {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleRefreshToken || !env.googleDriveRootId) {
    await addLog(order.id, 'warn', 'Google Drive folder creation skipped: missing credentials', {
      missing: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN', 'GOOGLE_DRIVE_FOLDER_ROOT_ID'],
    });
    return undefined;
  }

  const date = new Date().toISOString().slice(0, 10);
  const folderName = `${product.title} - ${order.customerEmail} - ${date}`;

  try {
    const accessToken = await getGoogleAccessToken();
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [env.googleDriveRootId],
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const folder = await response.json() as { id: string };
    await updateOrder(order.id, { driveFolderId: folder.id });
    await addLog(order.id, 'info', 'Google Drive customer folder created', { folderId: folder.id, folderName });
    return folder.id;
  } catch (error) {
    await addLog(order.id, 'error', 'Google Drive folder creation failed', { error: String(error) });
    return undefined;
  }
}

export async function triggerAppsScript(order: Order) {
  if (!env.googleAppsScriptUrl) {
    await addLog(order.id, 'warn', 'Apps Script trigger skipped: GOOGLE_APPS_SCRIPT_URL is not configured');
    return;
  }

  try {
    const response = await fetch(env.googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, productKey: order.productKey }),
    });
    if (!response.ok) throw new Error(await response.text());
    await addLog(order.id, 'info', 'Apps Script trigger completed');
  } catch (error) {
    await addLog(order.id, 'error', 'Apps Script trigger failed', { error: String(error) });
  }
}

async function getGoogleAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      refresh_token: env.googleRefreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json() as { access_token: string };
  return data.access_token;
}
