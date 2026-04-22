'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export const WGoalPay = () => {
  const { data: session } = useSession();
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = async () => {
    setButtonState('pending');
    try {
      // Verificación World ID
      const rpRes = await fetch('/api/rp-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'wgoal-payment' }),
      });

      if (!rpRes.ok) throw new Error('Failed to get RP signature');

      const rpSig = await rpRes.json();
      
      // Usar IDKit para verificación
      const { IDKit, orbLegacy } = await import('@worldcoin/idkit');
      
      const request = await IDKit.request({
        app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
        action: 'wgoal-payment',
        rp_context: {
          rp_id: rpSig.rp_id,
          nonce: rpSig.nonce,
          created_at: rpSig.created_at,
          expires_at: rpSig.expires_at,
          signature: rpSig.sig,
        },
        allow_legacy_proofs: true,
      }).preset(orbLegacy({ signal: '' }));

      const completion = await request.pollUntilCompletion();

      if (completion.success) {
        // Verificar en el servidor
        const verifyRes = await fetch('/api/verify-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rp_id: rpSig.rp_id,
            idkitResponse: completion.result,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setIsVerified(true);
          setButtonState('success');
        } else {
          throw new Error('Verification failed');
        }
      } else {
        throw new Error('Verification cancelled');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  const handleWGoalPayment = async () => {
    if (!isVerified) {
      alert('Primero debes verificar tu humanidad');
      return;
    }

    setButtonState('pending');
    try {
      const result = await MiniKit.sendTransaction({
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '480'),
        transactions: [
          {
            to: process.env.NEXT_PUBLIC_WGOAL_CONTRACT_ADDRESS || '',
            data: '0x', // Aquí iría la función del contrato WGOAL
            value: '0',
          },
        ],
      });

      console.log('WGOAL payment transaction:', result);
      setButtonState('success');
      setTimeout(() => setButtonState(undefined), 3000);
    } catch (error) {
      console.error('Payment error:', error);
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  if (!session) {
    return (
      <div className="grid w-full gap-4">
        <p className="text-lg font-semibold">WGOAL Payment</p>
        <p className="text-sm text-gray-600">Conecta tu wallet primero</p>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">WGOAL Payment</p>
      <p className="text-sm text-gray-600">
        Wallet: {session.user.walletAddress}
      </p>
      
      {!isVerified ? (
        <LiveFeedback
          label={{
            failed: 'Verificación fallida',
            pending: 'Verificando humanidad...',
            success: 'Humano verificado ✓',
          }}
          state={buttonState}
          className="w-full"
        >
          <Button
            onClick={handleVerification}
            disabled={buttonState === 'pending'}
            size="lg"
            variant="primary"
            className="w-full"
          >
            Verificar Humanidad
          </Button>
        </LiveFeedback>
      ) : (
        <LiveFeedback
          label={{
            failed: 'Pago fallido',
            pending: 'Procesando pago...',
            success: 'WGOAL enviado ✓',
          }}
          state={buttonState}
          className="w-full"
        >
          <Button
            onClick={handleWGoalPayment}
            disabled={buttonState === 'pending'}
            size="lg"
            variant="primary"
            className="w-full"
          >
            Cobrar WGOAL
          </Button>
        </LiveFeedback>
      )}
    </div>
  );
};
