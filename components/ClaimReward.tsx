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
      // Llamar API backend que maneja World ID + transferencia
      const response = await fetch('/api/claim-wgoal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Claim exitoso:', result);
        alert('💰 ¡WGOAL reclamado exitosamente!');
      } else {
        console.error('❌ Error en claim:', result.error);
        alert('❌ ' + result.error);
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
