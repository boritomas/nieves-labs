import crypto from 'crypto';
import { env } from './env';
import type { StoreData } from './types';

export type StorageMode = 'google_sheets' | 'local_json' | 'unconfigured';

const emptyStore: StoreData = {
  customers: [],
  orders: [],
  logs: [],
};

export class PersistentStorageUnavailableError extends Error {
  constructor(message = 'Persistent storage is not configured for this environment.') {
    super(message);
    this.name = 'PersistentStorageUnavailableError';
  }
}

function hasGoogleSheetsCredentials() {
  return Boolean(env.googleSheetsSpreadsheetId && env.googleServiceAccountEmail && env.googlePrivateKey);
}

export function storageMode(): StorageMode {
  if (hasGoogleSheetsCredentials()) return 'google_sheets';
  if (process.env.NODE_ENV === 'development' || process.env.ALLOW_LOCAL_FILE_STORAGE === 'true') {
    return 'local_json';
  }
  return 'unconfigured';
}

export async function readStoreFromDurableStorage(): Promise<StoreData> {
  if (storageMode() !== 'google_sheets') {
    throw new PersistentStorageUnavailableError();
  }

  try {
    const accessToken = await getServiceAccountAccessToken();
    const range = encodeURIComponent(`${env.googleSheetsOrdersSheetName}!A:D`);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.googleSheetsSpreadsheetId}/values/${range}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (response.status === 404) return emptyStore;
    if (!response.ok) throw new Error(await response.text());

    const payload = await response.json() as { values?: string[][] };
    return rowsToStore(payload.values || []);
  } catch (error) {
    throw new PersistentStorageUnavailableError(`Persistent storage read failed: ${String(error)}`);
  }
}

export async function writeStoreToDurableStorage(data: StoreData) {
  if (storageMode() !== 'google_sheets') {
    throw new PersistentStorageUnavailableError();
  }

  try {
    const rows = [
      ...data.customers.map((customer) => ['customer', customer.id, customer.createdAt, JSON.stringify(redact(customer))]),
      ...data.orders.map((order) => ['order', order.id, order.updatedAt, JSON.stringify(redact(order))]),
      ...data.logs.map((log) => ['workflow_log', log.id, log.createdAt, JSON.stringify(redact(log))]),
      ...data.orders.flatMap((order) => [
        ...order.uploads.map((upload) => ['upload', upload.id, upload.createdAt, JSON.stringify(redact(upload))]),
        ...order.deliverables.map((deliverable) => ['deliverable', deliverable.id, deliverable.createdAt, JSON.stringify(redact(deliverable))]),
        ['intake_token', order.id, order.updatedAt, JSON.stringify({ orderId: order.id, tokenConfigured: Boolean(order.intakeToken) })],
        ['product_config', order.productKey, order.updatedAt, JSON.stringify({ productKey: order.productKey, packageId: order.packageId })],
      ]),
    ];

    if (!rows.length) return;
    const accessToken = await getServiceAccountAccessToken();
    const range = encodeURIComponent(`${env.googleSheetsOrdersSheetName}!A:D`);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.googleSheetsSpreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: rows }),
    });

    if (!response.ok) throw new Error(await response.text());
  } catch (error) {
    throw new PersistentStorageUnavailableError(`Persistent storage write failed: ${String(error)}`);
  }
}

function rowsToStore(rows: string[][]): StoreData {
  const customers = new Map<string, StoreData['customers'][number]>();
  const orders = new Map<string, StoreData['orders'][number]>();
  const logs = new Map<string, StoreData['logs'][number]>();

  for (const row of rows) {
    const [type, id, , raw] = row;
    if (!type || !id || !raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (type === 'customer') customers.set(id, parsed);
      if (type === 'order') orders.set(id, parsed);
      if (type === 'workflow_log') logs.set(id, parsed);
    } catch {
      // Ignore malformed historic rows rather than taking down checkout.
    }
  }

  return {
    customers: Array.from(customers.values()),
    orders: Array.from(orders.values()),
    logs: Array.from(logs.values()),
  };
}

function redact<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (key, item) => {
    if (key === 'intakeToken') return item;
    if (/token|secret|key/i.test(key)) return '[redacted]';
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
