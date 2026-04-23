'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import ConnectWallet from '../components/ConnectWallet';
import Header from '../components/Header';
import ClaimReward from '../components/ClaimReward';
import PayButton from '../components/PayButton';

export default function Home() {
  const [wallet, setWallet] = useState('');

  useEffect(() => {
    // Verificar si ya hay wallet en el estado de MiniKit
    if (MiniKit.user?.walletAddress) {
      setWallet(MiniKit.user.walletAddress);
    }
  }, []);

  const handleWalletConnected = (address: string) => {
    setWallet(address);
  };

  if (!wallet) {
    return <ConnectWallet onWalletConnected={handleWalletConnected} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header walletAddress={wallet} />
      
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center gap-4 mb-6">
          <PayButton walletAddress={wallet} />
        </div>
        <div className="grid gap-6">
          <ClaimReward walletAddress={wallet} />
        </div>
      </main>
    </div>
  );
}
