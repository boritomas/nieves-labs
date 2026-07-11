import { NextResponse } from 'next/server';
import { startPlatformCheckout } from '@/lib/commerce';
import { PersistentStorageUnavailableError } from '@/lib/durable-storage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const result = await startPlatformCheckout(await request.json());
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Checkout failed', error);
    if (error instanceof PersistentStorageUnavailableError) {
      return NextResponse.json({ error: "We couldn't start checkout. Please try again or contact support." }, { status: 503 });
    }
    return NextResponse.json({ error: "We couldn't start checkout. Please try again or contact support." }, { status: 500 });
  }
}
