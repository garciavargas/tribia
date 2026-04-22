import { signRequest } from '@worldcoin/idkit';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SIGNING_KEY = process.env.WORLDCOIN_SIGNING_KEY;
const RP_ID = process.env.NEXT_PUBLIC_RP_ID ?? 'rp_2392e525d07f07ec';

export async function POST(req: Request) {
  if (!SIGNING_KEY) {
    return NextResponse.json(
      { error: 'WORLDCOIN_SIGNING_KEY not configured' },
      { status: 500 },
    );
  }

  const { action } = await req.json();
  const sig = signRequest(action, SIGNING_KEY);

  return NextResponse.json({
    rp_id: RP_ID,
    sig: sig.sig,
    nonce: sig.nonce,
    created_at: Number(sig.createdAt),
    expires_at: Number(sig.expiresAt),
  });
}
