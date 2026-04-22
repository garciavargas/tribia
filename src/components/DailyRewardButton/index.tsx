'use client';
import { useWalletValidation } from '@/hooks/useWalletValidation';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useState, useEffect } from 'react';

export const DailyRewardButton = () => {
  const { isConnected, validateAndExecute } = useWalletValidation();
  const [isPending, setIsPending] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isConnected) return;

    const checkClaim = async () => {
      const res = await fetch('/api/daily-reward');
      const data = await res.json();
      setCanClaim(data.canClaim);

      if (!data.canClaim && data.nextClaimTime) {
        updateTimeLeft(data.nextClaimTime);
      }
    };

    checkClaim();
    const interval = setInterval(checkClaim, 10000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const updateTimeLeft = (nextClaimTime: number) => {
    const now = Date.now();
    const diff = nextClaimTime - now;
    
    if (diff <= 0) {
      setCanClaim(true);
      setTimeLeft('');
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleClaim = async () => {
    await validateAndExecute(async () => {
      setIsPending(true);
      try {
        const res = await fetch('/api/daily-reward', { method: 'POST' });
        const data = await res.json();

        if (!res.ok) {
          alert(data.error);
          return;
        }

        alert(`¡Reclamaste ${data.amount} WGoal!`);
        setCanClaim(false);
        if (data.nextClaimTime) {
          updateTimeLeft(data.nextClaimTime);
        }
      } catch (error) {
        console.error('Error reclamando:', error);
        alert('Error al reclamar recompensa');
      } finally {
        setIsPending(false);
      }
    });
  };

  return (
    <LiveFeedback
      label={{
        failed: 'Error',
        pending: 'Reclamando...',
        success: '¡Reclamado!',
      }}
      state={isPending ? 'pending' : undefined}
    >
      <Button
        onClick={handleClaim}
        disabled={!canClaim || isPending}
        size="lg"
        variant="primary"
      >
        {canClaim ? 'Reclamar 1 WGoal Diario' : `Espera ${timeLeft}`}
      </Button>
    </LiveFeedback>
  );
};
