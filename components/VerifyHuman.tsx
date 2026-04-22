"use client";

import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';

export default function VerifyHuman() {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await MiniKit.verify({
        action: "verify-human",
        signal: "tribia-futbolera-verification"
      });
      
      if (result.success) {
        setVerified(true);
        console.log('✅ Humano verificado:', result);
      }
    } catch (error) {
      console.error('❌ Error verificando:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">Verificar Humanidad</h2>
      
      {!verified ? (
        <button 
          onClick={handleVerify}
          disabled={verifying}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {verifying ? 'Verificando...' : '🔐 Verificar con World ID'}
        </button>
      ) : (
        <div>
          <p className="text-green-600">✅ Humano Verificado</p>
          <p className="text-sm text-gray-600">Listo para jugar</p>
        </div>
      )}
    </div>
  );
}
