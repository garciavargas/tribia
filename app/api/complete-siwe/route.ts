import { NextRequest, NextResponse } from 'next/server';
import type { MiniAppWalletAuthSuccessPayload } from '@worldcoin/minikit-js/commands';
import { verifySiweMessage } from '@worldcoin/minikit-js/siwe';

type RequestBody = {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
};

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = (await req.json()) as RequestBody;

    if (!payload || !nonce) {
      return NextResponse.json(
        { isValid: false, error: 'Missing payload or nonce' },
        { status: 400 }
      );
    }

    // Verificar la firma SIWE
    const verification = await verifySiweMessage(payload, nonce);

    return NextResponse.json({
      isValid: verification.isValid,
      address: verification.siweMessageData.address,
    });
  } catch (error) {
    console.error('Error verifying SIWE:', error);
    return NextResponse.json(
      {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
