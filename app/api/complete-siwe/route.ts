import { NextRequest, NextResponse } from 'next/server';
import { verifySiweMessage } from '@worldcoin/minikit-js/siwe';

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = await req.json();

    if (!payload || !nonce) {
      return NextResponse.json(
        { error: 'Missing payload or nonce' },
        { status: 400 }
      );
    }

    // Verificar la firma SIWE
    const verification = await verifySiweMessage(payload, nonce);

    if (verification.isValid) {
      return NextResponse.json({
        isValid: true,
        address: verification.address,
      });
    } else {
      return NextResponse.json({
        isValid: false,
        error: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying SIWE:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
