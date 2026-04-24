'use client';

import { useState } from 'react';

interface ClaimRewardProps {
  walletAddress: string;
}

export default function ClaimReward({ walletAddress }: ClaimRewardProps) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reclamarWGOAL = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/claim-wgoal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: walletAddress,
          amount: '1',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al reclamar');
      }

      setTxHash(data.txHash);
      
    } catch (error: any) {
      console.error('❌ Error reclamando:', error);
      setError(error.message || 'Error al reclamar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={reclamarWGOAL}
        disabled={loading}
        className={`
          px-8 py-3 rounded-lg font-semibold
          transition-all duration-200
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 active:scale-95'
          }
          text-white disabled:opacity-50
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Reclamando...
          </span>
        ) : (
          '🎁 Reclamar WGOAL'
        )}
      </button>

      {txHash && (
        <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg w-full">
          <p className="text-green-400 text-sm">
            ✅ ¡Reclamo exitoso!
          </p>
          <a 
            href={`https://worldscan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs underline hover:text-blue-300"
          >
            Ver en WorldScan ↗
          </a>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg w-full">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
