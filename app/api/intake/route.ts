import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({
    error: 'Nieves Labs does not collect operational product intake. Continue in the verified product application.',
  }, { status: 410 });
}
