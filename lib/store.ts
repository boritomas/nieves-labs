import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { PersistentStorageUnavailableError, readStoreFromDurableStorage, storageMode, writeStoreToDurableStorage } from './durable-storage';
import type { Customer, Order, StoreData, WorkflowLog } from './types';
import type { ProductKey } from './products';

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'orders.json');

const emptyStore: StoreData = {
  customers: [],
  orders: [],
  logs: [],
};

async function readStore(): Promise<StoreData> {
  if (storageMode() === 'google_sheets') {
    return readStoreFromDurableStorage();
  }

  if (storageMode() === 'unconfigured') {
    throw new PersistentStorageUnavailableError();
  }

  try {
    const raw = await readFile(dataFile, 'utf8');
    return JSON.parse(raw) as StoreData;
  } catch {
    return emptyStore;
  }
}

async function writeStore(data: StoreData) {
  if (storageMode() === 'google_sheets') {
    await writeStoreToDurableStorage(data);
    return;
  }

  if (storageMode() === 'unconfigured') {
    throw new PersistentStorageUnavailableError();
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function listOrders() {
  const data = await readStore();
  return data.orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listLogs(orderId?: string) {
  const data = await readStore();
  return orderId ? data.logs.filter((log) => log.orderId === orderId) : data.logs;
}

export async function getOrder(orderId: string) {
  const data = await readStore();
  return data.orders.find((order) => order.id === orderId);
}

export async function getOrderByIntakeToken(token: string) {
  const data = await readStore();
  return data.orders.find((order) => order.intakeToken === token);
}

export async function getOrderByStripeSession(sessionId: string) {
  const data = await readStore();
  return data.orders.find((order) => order.stripeCheckoutSessionId === sessionId);
}

export async function createOrder(input: {
  productKey: ProductKey;
  packageId: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
}) {
  const data = await readStore();
  const now = new Date().toISOString();
  let customer: Customer | undefined = data.customers.find((item) => item.email.toLowerCase() === input.customerEmail.toLowerCase());
  if (!customer) {
    customer = {
      id: randomUUID(),
      email: input.customerEmail,
      name: input.customerName,
      createdAt: now,
    };
    data.customers.push(customer);
  }

  const order: Order = {
    id: randomUUID(),
    productKey: input.productKey,
    packageId: input.packageId,
    customerId: customer.id,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    status: 'checkout_pending',
    paymentStatus: 'pending',
    amount: input.amount,
    intakeToken: randomUUID(),
    intakeAnswers: {},
    uploads: [],
    deliverables: [],
    workflowStatus: {},
    createdAt: now,
    updatedAt: now,
  };
  data.orders.push(order);
  data.logs.push(makeLog(order.id, 'info', 'Order created', { productKey: input.productKey, packageId: input.packageId }));
  await writeStore(data);
  return order;
}

export async function updateOrder(orderId: string, patch: Partial<Order>) {
  const data = await readStore();
  const index = data.orders.findIndex((order) => order.id === orderId);
  if (index === -1) return undefined;

  data.orders[index] = {
    ...data.orders[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(data);
  return data.orders[index];
}

export async function addLog(orderId: string, level: WorkflowLog['level'], message: string, meta?: Record<string, unknown>) {
  const data = await readStore();
  const log = makeLog(orderId, level, message, meta);
  data.logs.push(log);
  await writeStore(data);
  return log;
}

function makeLog(orderId: string, level: WorkflowLog['level'], message: string, meta?: Record<string, unknown>): WorkflowLog {
  return {
    id: randomUUID(),
    orderId,
    level,
    message,
    meta,
    createdAt: new Date().toISOString(),
  };
}
