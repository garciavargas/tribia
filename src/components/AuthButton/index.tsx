'use client';
import { useWalletValidation } from '@/hooks/useWalletValidation';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useState } from 'react';

export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isConnected, connectWallet } = useWalletValidation();

  const onClick = async () => {
    if (isPending || isConnected) return;
    
    setIsPending(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error conectando wallet:', error);
    } finally {
      setIsPending(false);
    }
  };

  if (isConnected) {
    return (
      <Button size="lg" variant="primary" disabled>
        Wallet Conectada
      </Button>
    );
  }

  return (
    <LiveFeedback
      label={{
        failed: 'Error al conectar',
        pending: 'Conectando...',
        success: 'Conectada',
      }}
      state={isPending ? 'pending' : undefined}
    >
      <Button
        onClick={onClick}
        disabled={isPending}
        size="lg"
        variant="primary"
      >
        Conectar Wallet
      </Button>
    </LiveFeedback>
  );
};
