import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({
    error: 'Synthetic fulfillment smoke tests belong to each operational product application. Nieves Labs is portfolio-only.',
  }, { status: 410 });
}
