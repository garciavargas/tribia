'use client';

import { useState } from 'react';
import { IDKit, orbLegacy } from '@worldcoin/idkit-core';

interface ClaimRewardProps {
  walletAddress: string;
}

export default function ClaimReward({ walletAddress }: ClaimRewardProps) {
  const [loading, setLoading] = useState(false);

  const reclamarWGOAL = async () => {
    setLoading(true);
    try {
      // 1. Obtener RP signature del backend
      const rpSig = await fetch('/api/rp-signature', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'claim-wgoal' }),
      }).then((r) => r.json());

      // 2. Crear request de World ID con IDKit
      const request = await IDKit.request({
        app_id: process.env.NEXT_PUBLIC_APP_ID!,
        action: 'claim-wgoal',
        rp_context: {
          rp_id: process.env.NEXT_PUBLIC_RP_ID!,
          nonce: rpSig.nonce,
          created_at: rpSig.created_at,
          expires_at: rpSig.expires_at,
          signature: rpSig.sig,
        },
        allow_legacy_proofs: true,
        environment: 'production',
      }).preset(orbLegacy({ signal: walletAddress }));

      // 3. Esperar respuesta del usuario
      const response = await request.pollUntilCompletion();

      // 4. Verificar proof en backend
      const verifyResponse = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rp_id: process.env.NEXT_PUBLIC_RP_ID!,
          idkitResponse: response,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        alert('❌ Verificación fallida');
        return;
      }

      // 5. Usuario verificado → Transferir WGOAL desde treasury
      const MiniKit = (await import('@worldcoin/minikit-js')).MiniKit;
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
    <div className="fixed bottom-8 left-0 right-0 flex justify-center">
      <button
        onClick={reclamarWGOAL}
        disabled={loading}
        className="px-8 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 font-semibold hover:bg-green-700"
      >
        {loading ? 'Reclamando...' : 'Reclamar'}
      </button>
    </div>
  );
}
