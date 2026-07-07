import { env } from './env';
import { addLog } from './store';
import type { Order } from './types';
import type { Product } from './products';

export async function sendOrderEmail(order: Order, product: Product, kind: 'confirmation' | 'intake' | 'files_received' | 'deliverable_ready' | 'failure_alert') {
  if (!env.gmailClientId || !env.gmailClientSecret || !env.gmailRefreshToken) {
    await addLog(order.id, 'warn', `Email skipped: missing Gmail credentials for ${kind}`, {
      missing: ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN'],
    });
    return;
  }

  try {
    const accessToken = await getGmailAccessToken();
    const subject = emailSubject(product, kind);
    const body = emailBody(order, product, kind);
    const raw = Buffer.from([
      `To: ${kind === 'failure_alert' ? env.supportEmail : order.customerEmail}`,
      `From: ${env.supportEmail}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\r\n')).toString('base64url');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) throw new Error(await response.text());
    await addLog(order.id, 'info', `Email sent: ${kind}`);
  } catch (error) {
    await addLog(order.id, 'error', `Email failed: ${kind}`, { error: String(error) });
  }
}

function emailSubject(product: Product, kind: string) {
  const subjects: Record<string, string> = {
    confirmation: `Your ${product.title} order is confirmed`,
    intake: `Secure intake for your ${product.title} order`,
    files_received: `Files received for ${product.title}`,
    deliverable_ready: `Your ${product.title} deliverable is ready`,
    failure_alert: `Nieves Labs workflow needs review: ${product.title}`,
  };
  return subjects[kind] || `${product.title} update`;
}

function emailBody(order: Order, product: Product, kind: string) {
  const intakeUrl = `${env.appBaseUrl}/intake/${order.intakeToken}`;
  if (kind === 'intake') return `Thanks for ordering ${product.title}.\n\nPlease complete your secure intake here:\n${intakeUrl}\n\nSupport: ${env.supportEmail}`;
  if (kind === 'files_received') return `We received your files for ${product.title}. Your order ID is ${order.id}.`;
  if (kind === 'deliverable_ready') return `Your ${product.title} deliverable is ready. Reply to this email if you need support.`;
  if (kind === 'failure_alert') return `Order ${order.id} needs review.\nProduct: ${product.title}\nCustomer: ${order.customerEmail}`;
  return `Thanks for your ${product.title} order.\nOrder ID: ${order.id}\nNext step: ${intakeUrl}`;
}

async function getGmailAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.gmailClientId,
      client_secret: env.gmailClientSecret,
      refresh_token: env.gmailRefreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json() as { access_token: string };
  return data.access_token;
}
