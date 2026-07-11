import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({
    error: 'Nieves Labs is a portfolio and marketplace site. Product checkout is handled by each verified operational application.',
  }, { status: 410 });
}
