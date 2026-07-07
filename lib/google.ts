import { readFile } from 'fs/promises';
import crypto from 'crypto';
import { env } from './env';
import { addLog, updateOrder } from './store';
import type { Deliverable, Order, UploadRecord } from './types';
import type { Product } from './products';

export async function createCustomerDriveFolder(order: Order, product: Product) {
  if (!hasGoogleDriveCredentials()) {
    await addLog(order.id, 'warn', 'Google Drive folder creation skipped: missing credentials', {
      required: ['GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_REFRESH_TOKEN or GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_PRIVATE_KEY', 'GOOGLE_DRIVE_FOLDER_ROOT_ID or GOOGLE_DRIVE_ROOT_FOLDER_ID'],
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

export async function uploadOrderFilesToDrive(order: Order, folderId?: string) {
  if (!folderId || !hasGoogleDriveCredentials()) return order.uploads;
  const uploads: UploadRecord[] = [];

  for (const upload of order.uploads) {
    if (upload.googleFileId) {
      uploads.push(upload);
      continue;
    }

    try {
      const content = await readFile(upload.storagePath);
      const fileId = await uploadBufferToDrive(folderId, upload.fileName, upload.fileType, content);
      uploads.push({ ...upload, googleFileId: fileId });
      await addLog(order.id, 'info', 'Uploaded customer file to Google Drive', { fileName: upload.fileName, googleFileId: fileId });
    } catch (error) {
      uploads.push(upload);
      await addLog(order.id, 'error', 'Customer file upload to Google Drive failed', { fileName: upload.fileName, error: String(error) });
    }
  }

  await updateOrder(order.id, { uploads });
  return uploads;
}

export async function uploadDeliverableToDrive(order: Order, deliverable: Deliverable, folderId?: string) {
  if (!folderId || !hasGoogleDriveCredentials()) return deliverable;

  try {
    const fileId = await uploadBufferToDrive(
      folderId,
      `${deliverable.title}.md`,
      'text/markdown',
      Buffer.from(deliverable.content, 'utf8'),
    );
    await addLog(order.id, 'info', 'Uploaded deliverable to Google Drive', { title: deliverable.title, googleFileId: fileId });
    return { ...deliverable, googleFileId: fileId };
  } catch (error) {
    await addLog(order.id, 'error', 'Deliverable upload to Google Drive failed', { title: deliverable.title, error: String(error) });
    return deliverable;
  }
}

export async function triggerAppsScript(order: Order, uploadedFileIds: string[] = []) {
  if (!env.googleAppsScriptUrl) {
    await addLog(order.id, 'info', 'Apps Script not used: GOOGLE_APPS_SCRIPT_WEBHOOK_URL is not configured');
    return;
  }

  try {
    const response = await fetch(env.googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        productKey: order.productKey,
        customerEmail: order.customerEmail,
        driveFolderId: order.driveFolderId,
        uploadedFileIds,
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    await addLog(order.id, 'info', 'Apps Script trigger completed', { status: response.status });
  } catch (error) {
    await addLog(order.id, 'error', 'Apps Script trigger failed', { error: String(error) });
  }
}

function hasGoogleDriveCredentials() {
  return Boolean(env.googleDriveRootId && ((env.googleClientId && env.googleClientSecret && env.googleRefreshToken) || (env.googleServiceAccountEmail && env.googlePrivateKey)));
}

async function getGoogleAccessToken() {
  if (env.googleServiceAccountEmail && env.googlePrivateKey) {
    return getServiceAccountAccessToken();
  }

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

async function getServiceAccountAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: env.googleServiceAccountEmail,
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const privateKey = env.googlePrivateKey.replace(/\\n/g, '\n');
  const signature = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(privateKey, 'base64url');
  const assertion = `${header}.${claim}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json() as { access_token: string };
  return data.access_token;
}

async function uploadBufferToDrive(folderId: string, name: string, mimeType: string, content: Buffer) {
  const accessToken = await getGoogleAccessToken();
  const boundary = `nl-${crypto.randomUUID()}`;
  const metadata = {
    name,
    parents: [folderId],
    mimeType,
  };
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType || 'application/octet-stream'}\r\n\r\n`),
    content,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) throw new Error(await response.text());
  const file = await response.json() as { id: string };
  return file.id;
}

function base64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}
