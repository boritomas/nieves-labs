import { createCheckoutSession } from './stripe';
import { sendOrderEmail } from './email';
import { getPackage, getProductByKey } from './products';
import { addLog, createOrder, updateOrder } from './store';

export type CheckoutStartInput = {
  productKey?: string;
  packageId?: string;
  customerEmail?: string;
  customerName?: string;
};

export type CheckoutStartResult =
  | {
      ok: true;
      orderId: string;
      checkoutUrl: string;
      mode: 'stripe' | 'payment_link' | 'missing_credentials';
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export async function startPlatformCheckout(input: CheckoutStartInput): Promise<CheckoutStartResult> {
  if (!input.productKey || !input.packageId || !input.customerEmail) {
    return { ok: false, status: 400, error: 'productKey, packageId, and customerEmail are required' };
  }

  const product = getProductByKey(input.productKey);
  if (!product) return { ok: false, status: 404, error: 'Unknown product' };
  if (product.publicAvailability !== 'available') {
    return { ok: false, status: 409, error: `${product.title} is not available for self-service checkout yet. Please contact Nieves Labs.` };
  }

  const selectedPackage = getPackage(product, input.packageId);
  if (!selectedPackage) return { ok: false, status: 404, error: 'Unknown package' };

  const order = await createOrder({
    productKey: product.key,
    packageId: selectedPackage.id,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    amount: selectedPackage.price,
  });

  await addLog(order.id, 'info', 'Platform checkout started', {
    productKey: product.key,
    packageId: selectedPackage.id,
    workflowKey: product.workflow.key,
  });

  const checkout = await createCheckoutSession(order, product, selectedPackage);
  await updateOrder(order.id, {
    stripeCheckoutSessionId: checkout.sessionId,
    paymentStatus: checkout.mode === 'stripe' || checkout.mode === 'payment_link' ? 'pending' : 'manual_review',
    status: checkout.mode === 'stripe' || checkout.mode === 'payment_link' ? 'checkout_pending' : 'intake_pending',
  });

  if (checkout.mode === 'missing_credentials') {
    await addLog(order.id, 'warn', 'Stripe Checkout skipped: STRIPE_SECRET_KEY is not configured');
  } else if (checkout.mode === 'payment_link') {
    await addLog(order.id, 'info', 'Using approved Stripe payment link fallback');
  }

  await sendOrderEmail(order, product, 'confirmation');
  await sendOrderEmail(order, product, 'intake');
  await sendOrderEmail(order, product, 'owner_update');

  return {
    ok: true,
    orderId: order.id,
    checkoutUrl: checkout.url,
    mode: checkout.mode,
  };
}
