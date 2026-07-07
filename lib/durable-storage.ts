import crypto from 'crypto';
import { env } from './env';
import type { StoreData } from './types';

export type StorageMode = 'google_sheets' | 'local_only';

export function storageMode(): StorageMode {
  return env.googleSheetsSpreadsheetId && env.googleServiceAccountEmail && env.googlePrivateKey ? 'google_sheets' : 'local_only';
}

export async function mirrorStoreToDurableStorage(data: StoreData) {
  if (storageMode() !== 'google_sheets') return;

  try {
    const rows = [
      ...data.customers.map((customer) => ['customer', customer.id, customer.createdAt, JSON.stringify(redact(customer))]),
      ...data.orders.map((order) => ['order', order.id, order.updatedAt, JSON.stringify(redact(order))]),
      ...data.logs.map((log) => ['workflow_log', log.id, log.createdAt, JSON.stringify(redact(log))]),
      ...data.orders.flatMap((order) => [
        ...order.uploads.map((upload) => ['upload', upload.id, upload.createdAt, JSON.stringify(redact(upload))]),
        ...order.deliverables.map((deliverable) => ['deliverable', deliverable.id, deliverable.createdAt, JSON.stringify(redact({ ...deliverable, content: '[content stored in workflow artifact]' }))]),
        ['intake_token', order.id, order.updatedAt, JSON.stringify({ orderId: order.id, tokenConfigured: Boolean(order.intakeToken) })],
        ['product_config', order.productKey, order.updatedAt, JSON.stringify({ productKey: order.productKey, packageId: order.packageId })],
      ]),
    ];

    if (!rows.length) return;
    const accessToken = await getServiceAccountAccessToken();
    const range = encodeURIComponent(`${env.googleSheetsOrdersSheetName}!A:D`);
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.googleSheetsSpreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: rows }),
    });
  } catch {
    // Durable mirroring must never block checkout, intake, or delivery workflows.
  }
}

function redact<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (key, item) => {
    if (/token|secret|key|content/i.test(key)) return '[redacted]';
    return item;
  })) as T;
}

async function getServiceAccountAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: env.googleServiceAccountEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const privateKey = env.googlePrivateKey.replace(/\\n/g, '\n');
  const signature = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(privateKey, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${signature}`,
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json() as { access_token: string };
  return data.access_token;
}

function base64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}
