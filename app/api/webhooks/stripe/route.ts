import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({
    error: 'Stripe webhooks are handled by each operational product application, not by Nieves Labs.',
  }, { status: 410 });
}
