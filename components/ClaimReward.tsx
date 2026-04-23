'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface ClaimRewardProps {
  walletAddress: string;
}

export default function ClaimReward({ walletAddress }: ClaimRewardProps) {
  const [loading, setLoading] = useState(false);

  const reclamarWGOAL = async () => {
    setLoading(true);
    try {
      const result = await MiniKit.pay({
        reference: `claim-${Date.now()}`,
        to: walletAddress,
        tokens: [
          {
            symbol: 'WGOAL',
            token_amount: '1.0',
          }
        ],
        description: 'Reclamo diario WGOAL - Trivia Futbolera',
        fallback: async () => {
          console.log('🔧 Fallback pay - desarrollo local');
          return { 
            executedWith: 'fallback',
            data: { 
              userOpHash: 'fake-hash-' + Date.now(),
              status: 'success' 
            }
          };
        },
      });

      console.log('💰 Pago resultado:', result);
      
      if (result.executedWith === 'fallback') {
        console.log('✅ Pago simulado en desarrollo');
        alert('💰 WGOAL reclamado (simulado en desarrollo)');
      } else {
        console.log('✅ Pago real ejecutado');
        alert('💰 ¡WGOAL reclamado exitosamente!');
      }
    } catch (error) {
      console.error('❌ Error reclamando WGOAL:', error);
      alert('❌ Error al reclamar WGOAL: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Reclamo Diario</h2>
      
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-green-600 mb-2">1 WGOAL</div>
        <p className="text-gray-600 text-sm">Disponible cada 8 horas</p>
      </div>

      <button
        onClick={reclamarWGOAL}
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 font-semibold"
      >
        {loading ? 'Reclamando...' : 'Reclamar WGOAL'}
      </button>
    </div>
  );
}
