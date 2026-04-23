'use client';

import { useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import Header from '../components/Header';
import PayButton from '../components/PayButton';
import ClaimReward from '../components/ClaimReward';

export default function Home() {
  const [wallet, setWallet] = useState('');

  const handleWalletConnected = (address: string) => {
    setWallet(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold mb-8">Trivia Futbolera</h1>
      
      <div className="flex flex-col gap-4">
        <ConnectWallet onWalletConnected={handleWalletConnected} />
        
        {wallet && (
          <>
            <Header walletAddress={wallet} />
            <PayButton walletAddress={wallet} />
            <ClaimReward walletAddress={wallet} />
          </>
        )}
      </div>
    </div>
  );
}
