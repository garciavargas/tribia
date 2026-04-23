'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState('');

  const conectarWallet = async () => {
    setLoading(true);
    try {
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(),
        statement: 'Conecta tu wallet para jugar',
      });
      
      if (finalPayload.status === 'success') {
        setWallet(finalPayload.address);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Trivia Futbolera</h1>
      
      {!wallet ? (
        <button
          onClick={conectarWallet}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Conectando...
            </span>
          ) : (
            'Conectar Wallet'
          )}
        </button>
      ) : (
        <p className="text-green-600">Conectado: {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
      )}
    </div>
  );
}
