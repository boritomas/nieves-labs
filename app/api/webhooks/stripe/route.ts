import { NextResponse } from 'next/server';
import { addLog, getOrderByStripeSession, updateOrder } from '@/lib/store';
import { verifyStripeSignature } from '@/lib/stripe';
import { runWorkflow } from '@/lib/workflows';

export const runtime = 'nodejs';

type StripeEvent = {
  type: string;
  data: {
    object: {
      id: string;
      client_reference_id?: string;
      payment_intent?: string;
      metadata?: Record<string, string>;
    };
  };
};

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!verifyStripeSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid Stripe signature' }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEvent;
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const orderId = session.client_reference_id || session.metadata?.orderId;
  const order = orderId ? await updateOrder(orderId, {
    status: 'intake_pending',
    paymentStatus: 'paid',
    stripePaymentIntentId: session.payment_intent,
  }) : await getOrderByStripeSession(session.id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  await addLog(order.id, 'info', 'Stripe payment completed', { sessionId: session.id });

  if (order.intakeSubmittedAt) {
    await runWorkflow(order.productKey, order.id);
  }

  return NextResponse.json({ received: true });
}
