import type { ProductKey } from './products';

export type OrderStatus = 'created' | 'checkout_pending' | 'paid' | 'intake_pending' | 'processing' | 'needs_review' | 'completed' | 'failed';
export type WorkflowStepStatus = 'pending' | 'completed' | 'skipped' | 'failed';

export type Customer = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
};

export type UploadRecord = {
  id: string;
  orderId: string;
  fileName: string;
  fileType: string;
  size: number;
  storagePath: string;
  googleFileId?: string;
  createdAt: string;
};

export type Deliverable = {
  id: string;
  orderId: string;
  title: string;
  type: string;
  content: string;
  googleFileId?: string;
  createdAt: string;
};

export type WorkflowLog = {
  id: string;
  orderId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: Record<string, unknown>;
  createdAt: string;
};

export type Order = {
  id: string;
  productKey: ProductKey;
  packageId: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'manual_review';
  amount: number;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  intakeToken: string;
  intakeSubmittedAt?: string;
  intakeAnswers: Record<string, string>;
  uploads: UploadRecord[];
  deliverables: Deliverable[];
  driveFolderId?: string;
  workflowStatus: Record<string, WorkflowStepStatus>;
  createdAt: string;
  updatedAt: string;
};

export type StoreData = {
  customers: Customer[];
  orders: Order[];
  logs: WorkflowLog[];
};
