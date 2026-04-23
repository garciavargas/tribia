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
      // Por ahora solo transferir WGOAL (sin verificación World ID)
      // TODO: Implementar verificación World ID con IDKit cuando esté disponible
      
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [
          {
            to: '0x1A1E80A27093665a2E6e7f3Af3B69BB64fE79cD7',
            data: '0xa9059cbb' +
                  walletAddress.slice(2).padStart(64, '0') +
                  '0de0b6b3a7640000',
          }
        ],
      });

      if (txResult.executedWith !== 'fallback') {
        alert('💰 ¡WGOAL reclamado exitosamente!');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al reclamar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={reclamarWGOAL}
      disabled={loading}
      className="px-8 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 font-semibold hover:bg-green-700"
    >
      {loading ? 'Reclamando...' : 'Reclamar'}
    </button>
  );
}
