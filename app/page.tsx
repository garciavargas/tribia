'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si ya hay wallet en el estado de MiniKit
    if (MiniKit.user?.walletAddress) {
      setWallet(MiniKit.user.walletAddress);
    }
  }, []);

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
      });

      if (result.executedWith === 'fallback') {
        console.log('Fallback ejecutado');
        return;
      }

      // 3. Verificar en el backend
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
        setWallet(verification.address);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Trivia Futbolera</h1>
      
      {!wallet ? (
        <button
          onClick={conectarWallet}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Conectando...' : 'Conectar Wallet'}
        </button>
      ) : (
        <p className="text-green-600">Conectado: {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
      )}
    </div>
  );
}
