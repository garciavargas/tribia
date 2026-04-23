'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface ConnectWalletProps {
  onWalletConnected: (address: string) => void;
}

export default function ConnectWallet({ onWalletConnected }: ConnectWalletProps) {
  const [loading, setLoading] = useState(false);

  const conectarWallet = async () => {
    setLoading(true);
    try {
      // 1. Obtener nonce del backend
      const nonceResponse = await fetch('/api/nonce');
      const { nonce } = await nonceResponse.json();

      // 2. Autenticar con MiniKit
      const result = await MiniKit.walletAuth({
        nonce,
        statement: 'Conecta tu wallet para jugar Trivia Futbolera',
        expirationTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
        fallback: async () => {
          console.log('🔧 Fallback wallet - desarrollo local');
          return { address: '0x1234567890123456789012345678901234567890' };
        },
      });

      if (result.executedWith === 'fallback') {
        console.log('✅ Usando fallback para desarrollo');
        onWalletConnected(result.data.address);
        return;
      }

      // 3. Verificar en el backend (solo si no es fallback)
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
        console.error('❌ Verificación fallida:', verification.error);
      }
    } catch (error) {
      console.error('❌ Error conectando wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Trivia Futbolera</h1>
      
      <button
        onClick={conectarWallet}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Conectando...' : 'Conectar Wallet'}
      </button>
    </div>
  );
}
