import crypto from 'crypto';
import { env } from './env';
import type { Order } from './types';
import type { Product, ProductPackage } from './products';

export async function createCheckoutSession(order: Order, product: Product, selectedPackage: ProductPackage) {
  if (!env.stripeSecretKey) {
    return {
      mode: 'missing_credentials' as const,
      url: `${env.appBaseUrl}/intake/${order.intakeToken}`,
      sessionId: undefined,
    };
  }

  const priceId = process.env[selectedPackage.stripePriceIdEnv];
  const params = new URLSearchParams({
    mode: 'payment',
    success_url: `${env.appBaseUrl}/intake/${order.intakeToken}?checkout=success`,
    cancel_url: `${env.appBaseUrl}/products/${product.slug}?checkout=cancelled`,
    customer_email: order.customerEmail,
    client_reference_id: order.id,
    'metadata[orderId]': order.id,
    'metadata[productKey]': product.key,
    'metadata[packageId]': selectedPackage.id,
  });

  if (priceId) {
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');
  } else {
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][product_data][name]', `${product.title} - ${selectedPackage.name}`);
    params.append('line_items[0][price_data][unit_amount]', String(selectedPackage.price * 100));
    params.append('line_items[0][quantity]', '1');
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe Checkout failed: ${text}`);
  }

  const session = await response.json() as { id: string; url: string };
  return {
    mode: 'stripe' as const,
    url: session.url,
    sessionId: session.id,
  };
}

export function verifyStripeSignature(payload: string, signatureHeader: string | null) {
  if (!env.stripeWebhookSecret || !signatureHeader) return false;
  const timestamp = signatureHeader.match(/t=([^,]+)/)?.[1];
  const signature = signatureHeader.match(/v1=([^,]+)/)?.[1];
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto.createHmac('sha256', env.stripeWebhookSecret).update(signedPayload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
