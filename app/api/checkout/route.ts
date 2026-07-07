import { NextResponse } from 'next/server';
import { createOrder, addLog, updateOrder } from '@/lib/store';
import { createCheckoutSession } from '@/lib/stripe';
import { getPackage, getProductByKey } from '@/lib/products';
import { sendOrderEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      productKey?: string;
      packageId?: string;
      customerEmail?: string;
      customerName?: string;
    };

    if (!body.productKey || !body.packageId || !body.customerEmail) {
      return NextResponse.json({ error: 'productKey, packageId, and customerEmail are required' }, { status: 400 });
    }

    const product = getProductByKey(body.productKey);
    if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 404 });
    const selectedPackage = getPackage(product, body.packageId);
    if (!selectedPackage) return NextResponse.json({ error: 'Unknown package' }, { status: 404 });

    const order = await createOrder({
      productKey: product.key,
      packageId: selectedPackage.id,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      amount: selectedPackage.price,
    });

    const checkout = await createCheckoutSession(order, product, selectedPackage);
    await updateOrder(order.id, {
      stripeCheckoutSessionId: checkout.sessionId,
      paymentStatus: checkout.mode === 'stripe' ? 'pending' : 'manual_review',
      status: checkout.mode === 'stripe' ? 'checkout_pending' : 'intake_pending',
    });

    if (checkout.mode === 'missing_credentials') {
      await addLog(order.id, 'warn', 'Stripe Checkout skipped: STRIPE_SECRET_KEY is not configured');
    }

    await sendOrderEmail(order, product, 'confirmation');
    await sendOrderEmail(order, product, 'intake');

    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: checkout.url,
      mode: checkout.mode,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
