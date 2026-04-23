import { NextResponse } from 'next/server';
import { verifySiweMessage } from '@worldcoin/minikit-js/siwe';

export async function POST(request: Request) {
  try {
    const { payload, nonce } = await request.json();

    if (!payload || !nonce) {
      return NextResponse.json(
        { isValid: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // VERIFICAR SIWE con MiniKit
    const verification = await verifySiweMessage(payload, nonce);

    if (!verification.isValid) {
      return NextResponse.json(
        { isValid: false, error: 'Firma SIWE inválida' },
        { status: 400 }
      );
    }

    // Extraer dirección de la wallet
    const address = verification.siweMessageData.address;

    if (!address) {
      return NextResponse.json(
        { isValid: false, error: 'No se pudo obtener la dirección' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      isValid: true,
      address,
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
      chainName: process.env.NEXT_PUBLIC_CHAIN_NAME
    });

  } catch (error) {
    console.error('Error en complete-siwe:', error);
    return NextResponse.json(
      { isValid: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
