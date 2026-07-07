import { NextResponse } from 'next/server';
import { env, requiredCredentialStatus } from '@/lib/env';
import { listLogs, listOrders } from '@/lib/store';
import { products } from '@/lib/products';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!env.adminToken && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'ADMIN_TOKEN must be configured in production' }, { status: 503 });
  }

  if (env.adminToken) {
    const token = new URL(request.url).searchParams.get('token') || request.headers.get('x-admin-token');
    if (token !== env.adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const orders = await listOrders();
  const logs = await listLogs();
  return NextResponse.json({
    products,
    orders,
    logs,
    credentials: requiredCredentialStatus(),
  });
}
