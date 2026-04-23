'use client';

import { useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import Header from '../components/Header';

export default function Home() {
  const [wallet, setWallet] = useState('');

  const handleWalletConnected = (address: string) => {
    setWallet(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold mb-8">Trivia Futbolera</h1>
      
      {!wallet ? (
        <ConnectWallet onWalletConnected={handleWalletConnected} />
      ) : (
        <>
          <Header walletAddress={wallet} />
          
          <div className="flex flex-col gap-4 mt-8">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Pagar 1 WLD
            </button>
            
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
              Reclamar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
