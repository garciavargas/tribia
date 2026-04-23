'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import type {
  CommandResultByVia,
  MiniKitWalletAuthOptions,
  WalletAuthResult,
} from '@worldcoin/minikit-js/commands';

interface ConnectWalletProps {
  onWalletConnected: (address: string) => void;
}

export default function ConnectWallet({ onWalletConnected }: ConnectWalletProps) {
  const [loading, setLoading] = useState(false);

  const conectarWallet = async () => {
    setLoading(true);
    try {
      // 1. Obtener nonce del backend
      const response = await fetch('/api/nonce');
      const { nonce } = await response.json();

      // 2. Configurar opciones de autenticación
      const input = {
        nonce,
        statement: 'Conecta tu wallet para jugar Trivia Futbolera',
        expirationTime: new Date(Date.now() + 1000 * 60 * 60),
      } satisfies MiniKitWalletAuthOptions;

      // 3. Autenticar con MiniKit
      const result: CommandResultByVia<WalletAuthResult> = await MiniKit.walletAuth(input);

      if (result.executedWith === 'fallback') {
        console.log('Fallback ejecutado');
        return;
      }

      // 4. Verificar en el backend
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: result.data,
          nonce,
        }),
      });

      const verification = await verifyResponse.json();
      
      if (verification.isValid) {
        onWalletConnected(verification.address);
      } else {
        console.error('Verificación fallida:', verification.error);
      }
    } catch (error) {
      console.error('Error conectando wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={conectarWallet}
      disabled={loading}
      className="px-8 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 font-semibold hover:bg-blue-700"
    >
      {loading ? 'Conectando...' : 'Conectar Wallet'}
    </button>
  );
}
