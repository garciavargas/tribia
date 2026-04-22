"use client";

import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';

export default function ClaimReward() {
  const [claiming, setClaiming] = useState(false);
  const [lastClaim, setLastClaim] = useState<string | null>(null);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const result = await MiniKit.pay({
        reference: `reward_${Date.now()}`,
        to: "0x1234567890123456789012345678901234567890", // Dirección del usuario
        tokens: [{
          symbol: "WLD",
          token_amount: "0.1"
        }]
      });
      
      if (result.success) {
        setLastClaim(new Date().toLocaleTimeString());
        console.log('✅ Recompensa reclamada:', result);
      }
    } catch (error) {
      console.error('❌ Error reclamando recompensa:', error);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">Reclamar Recompensa</h2>
      
      <button 
        onClick={handleClaim}
        disabled={claiming}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {claiming ? 'Reclamando...' : '🎁 Reclamar 0.1 WLD'}
      </button>
      
      {lastClaim && (
        <p className="text-sm text-green-600 mt-2">
          ✅ Última recompensa: {lastClaim}
        </p>
      )}
    </div>
  );
}
