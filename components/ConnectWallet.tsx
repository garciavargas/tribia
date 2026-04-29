'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface ConnectWalletProps {
  onWalletConnected: (data: {
    address: string;
    chainId: string;
    chainName: string;
  }) => void;
}

export default function ConnectWallet({ onWalletConnected }: ConnectWalletProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conectarWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // 0. Desconectar primero para forzar el modal
      if (MiniKit.isInstalled()) {
        await MiniKit.logout();
      }

      // 1. Obtener nonce
      const nonceResponse = await fetch('/api/nonce');
      if (!nonceResponse.ok) {
        throw new Error('Error al obtener nonce del servidor');
      }
      const { nonce } = await nonceResponse.json();

      // 2. Wallet Auth con MiniKit
      const result = await MiniKit.walletAuth({
        nonce,
        statement: 'Conecta tu wallet para usar Trivia Futbolera',
        expirationTime: new Date(Date.now() + 60 * 60 * 1000),
      });

      // 3. Verificar errores de MiniKit
      if (result.executedWith === 'fallback') {
        setError('Conexión cancelada por el usuario');
        return;
      }

      // 4. Enviar a backend para verificación SIWE
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
        // ¡ÉXITO! Pasar datos al padre
        onWalletConnected({
          address: verification.address,
          chainId: verification.chainId,
          chainName: verification.chainName,
        });
      } else {
        setError(verification.error || 'Verificación fallida');
      }
    } catch (err) {
      console.error('Error conectando wallet:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={conectarWallet}
        disabled={loading}
        className={`
          px-8 py-4 text-lg font-bold rounded-xl
          transition-all duration-300 transform
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-lg'
          }
          text-white shadow-md
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Conectando...
          </span>
        ) : (
          '🔌 Conectar Wallet'
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          <p className="font-semibold">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
