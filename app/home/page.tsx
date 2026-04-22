"use client";

import ConnectWallet from '@/components/ConnectWallet';
import ClaimReward from '@/components/ClaimReward';
import VerifyHuman from '@/components/VerifyHuman';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🏆 Tribia Futbolera - Test MiniKit
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ConnectWallet />
          <VerifyHuman />
          <ClaimReward />
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="font-bold mb-2">📋 Orden de prueba:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Conectar Wallet primero</li>
            <li>Verificar humanidad con World ID</li>
            <li>Reclamar recompensa</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
