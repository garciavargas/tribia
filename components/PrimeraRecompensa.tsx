'use client';

import { useState } from 'react';

interface PrimeraRecompensaProps {
  isVisible: boolean;
  walletAddress: string;
}

export default function PrimeraRecompensa({ isVisible, walletAddress }: PrimeraRecompensaProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClaimReward = async () => {
    setIsProcessing(true);
    
    try {
      // Simular verificación World ID por ahora
      const response = await fetch('/api/worldcoin/primera-recompensa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          verified: true
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('¡Recompensa reclamada exitosamente!');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-sm mx-auto px-4 mt-4">
      <button
        onClick={handleClaimReward}
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando...
          </>
        ) : (
          'Reclamar Primera Recompensa'
        )}
      </button>
    </div>
  );
}
