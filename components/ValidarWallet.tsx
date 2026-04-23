'use client';

import { useState } from 'react';

interface ValidarWalletProps {
  onValidationSuccess: (walletAddress: string) => void;
}

export default function ValidarWallet({ onValidationSuccess }: ValidarWalletProps) {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateWallet = async () => {
    setIsValidating(true);
    
    try {
      // Simular conexión de wallet por ahora
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      const response = await fetch('/api/worldcoin/validate-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'success',
          address: mockAddress
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onValidationSuccess(mockAddress);
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
