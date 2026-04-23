'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface ValidarWalletProps {
  onValidationSuccess: (walletAddress: string) => void;
}

export default function ValidarWallet({ onValidationSuccess }: ValidarWalletProps) {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateWallet = async () => {
    setIsValidating(true);
    
    try {
      // 1. Obtener nonce del backend
      const nonceResponse = await fetch('/api/nonce');
      const { nonce } = await nonceResponse.json();

      // 2. Autenticar con MiniKit
      const result = await MiniKit.walletAuth({
        nonce,
        statement: 'Conecta tu wallet para jugar Trivia Futbolera',
        expirationTime: new Date(Date.now() + 1000 * 60 * 60),
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
        onValidationSuccess(verification.address);
      } else {
        console.error('Verificación fallida:', verification.error);
      }
    } catch (error) {
      console.error('Error validating wallet:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <button
        onClick={handleValidateWallet}
        disabled={isValidating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isValidating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Validando...
          </>
        ) : (
          'Conectar Wallet'
        )}
      </button>
    </div>
  );
}
