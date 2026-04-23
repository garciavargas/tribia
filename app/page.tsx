'use client';

import { useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import PayButton from '../components/PayButton';
import ClaimReward from '../components/ClaimReward';

export default function Home() {
  const [walletData, setWalletData] = useState<{
    address: string;
    chainId: string;
    chainName: string;
  } | null>(null);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      {!walletData ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Trivia Futbolera
          </h1>
          <ConnectWallet onWalletConnected={setWalletData} />
        </div>
      ) : (
        <div>
          <div className="bg-gray-800 p-4 rounded-lg mb-8">
            <p className="text-green-400">✅ Wallet Conectada</p>
            <p className="text-sm text-gray-400">{walletData.address}</p>
            <p className="text-xs text-gray-500">{walletData.chainName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <PayButton walletAddress={walletData.address} />
            <ClaimReward walletAddress={walletData.address} />
          </div>
        </div>
      )}
    </main>
  );
}
