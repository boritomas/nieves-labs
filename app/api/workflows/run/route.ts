import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({
    error: 'Operational product workflows run inside their dedicated applications. Nieves Labs does not execute fulfillment jobs.',
  }, { status: 410 });
}
