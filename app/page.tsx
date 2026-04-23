'use client';

import { useState } from 'react';
import ValidarWallet from '@/components/ValidarWallet';
import PrimeraRecompensa from '@/components/PrimeraRecompensa';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');

  const handleWalletValidation = (address: string) => {
    setWalletAddress(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Trivia Futbolera
        </h1>
        
        <ValidarWallet onValidationSuccess={handleWalletValidation} />
        
        <PrimeraRecompensa 
          isVisible={!!walletAddress} 
          walletAddress={walletAddress}
        />
      </div>
    </div>
  );
}
