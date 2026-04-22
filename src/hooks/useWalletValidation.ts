'use client';
import { useSession } from 'next-auth/react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { walletAuth } from '@/auth/wallet';

export const useWalletValidation = () => {
  const { data: session, status } = useSession();
  const { isInstalled } = useMiniKit();

  const isConnected = status === 'authenticated' && !!session?.user;
  const isLoading = status === 'loading';

  const connectWallet = async () => {
    if (!isInstalled) {
      throw new Error('MiniKit no está instalado');
    }
    await walletAuth();
  };

  const validateAndExecute = async (callback: () => void | Promise<void>) => {
    if (!isConnected) {
      await connectWallet();
    }
    await callback();
  };

  return {
    isConnected,
    isLoading,
    connectWallet,
    validateAndExecute,
    address: session?.user?.address,
  };
};
