"use client";

import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';

export default function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnect = async () => {
    try {
      const result = await MiniKit.connectWallet();
      if (result.success) {
        setIsConnected(true);
        setAddress(result.address);
        console.log('✅ Wallet conectada:', result.address);
      }
    } catch (error) {
      console.error('❌ Error conectando wallet:', error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">Conectar Wallet</h2>
      
      {!isConnected ? (
        <button 
          onClick={handleConnect}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Conectar Wallet
        </button>
      ) : (
        <div>
          <p className="text-green-600">✅ Conectado</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      )}
    </div>
  );
}
