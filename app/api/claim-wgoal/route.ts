import { NextRequest, NextResponse } from 'next/server';
import { getIsUserVerified } from '@worldcoin/minikit-js/address-book';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // 1. Verificar World ID
    const isVerified = await getIsUserVerified(walletAddress);
    
    if (!isVerified) {
      return NextResponse.json(
        { error: 'World ID verification required' },
        { status: 403 }
      );
    }

    // 2. TODO: Verificar si ya reclamó en las últimas 8 horas
    // 3. TODO: Enviar 1 WGOAL desde treasury usando viem + private key

    console.log('✅ Usuario verificado:', walletAddress);
    
    // Por ahora solo verificamos World ID
    return NextResponse.json({
      success: true,
      message: 'WGOAL claim processed',
      txHash: 'fake-tx-' + Date.now(), // TODO: real tx hash
    });

  } catch (error) {
    console.error('❌ Error en claim:', error);
    return NextResponse.json(
      { error: 'Claim failed: ' + error.message },
      { status: 500 }
    );
  }
}
