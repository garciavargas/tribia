'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface PayButtonProps {
  walletAddress: string;
}

export default function PayButton({ walletAddress }: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  const pagarWLD = async () => {
    setLoading(true);
    try {
      const result = await MiniKit.pay({
        reference: `payment-${Date.now()}`,
        to: '0x7400ffa080c63a689e56936d76752d252fc2ce68',
        tokens: [
          {
            symbol: 'WLD',
            token_amount: '1',
          }
        ],
        description: 'Pago Trivia Futbolera',
      });

      if (result.executedWith !== 'fallback') {
        alert('💰 Pago exitoso');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al pagar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={pagarWLD}
      disabled={loading}
      className="px-8 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 font-semibold hover:bg-blue-700"
    >
      {loading ? 'Pagando...' : 'Pagar 1 WLD'}
    </button>
  );
}
