import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { runWorkflow } from '@/lib/workflows';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!env.adminToken && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'ADMIN_TOKEN must be configured in production' }, { status: 503 });
  }

  if (env.adminToken && request.headers.get('x-admin-token') !== env.adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { productKey?: string; orderId?: string };
  if (!body.productKey || !body.orderId) {
    return NextResponse.json({ error: 'productKey and orderId are required' }, { status: 400 });
  }

  const order = await runWorkflow(body.productKey, body.orderId);
  return NextResponse.json({ order });
}
