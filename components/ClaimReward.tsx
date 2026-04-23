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
      // Transferir 1 WGOAL desde treasury al usuario usando MiniKit nativo
      const result = await MiniKit.sendTransaction({
        chainId: 480, // World Chain
        transactions: [
          {
            to: '0x1A1E80A27093665a2E6e7f3Af3B69BB64fE79cD7', // WGOAL contract
            data: '0xa9059cbb' + // transfer function selector
                  walletAddress.slice(2).padStart(64, '0') + // to address
                  '0de0b6b3a7640000', // 1 WGOAL (1e18 in hex)
          }
        ],
      });

      console.log('✅ Transacción resultado:', result);
      
      if (result.executedWith !== 'fallback') {
        alert('💰 ¡WGOAL reclamado exitosamente!');
      }
    } catch (error) {
      console.error('❌ Error reclamando WGOAL:', error);
      alert('❌ Error al reclamar WGOAL: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
