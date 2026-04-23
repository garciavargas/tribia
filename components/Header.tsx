'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface HeaderProps {
  walletAddress: string;
}

export default function Header({ walletAddress }: HeaderProps) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUsername = async () => {
      try {
        // Primero intentar desde MiniKit.user
        if (MiniKit.user?.username) {
          setUsername(MiniKit.user.username);
          return;
        }

        // Si no, obtener manualmente
        const worldIdUser = await MiniKit.getUserByAddress(walletAddress);
        if (worldIdUser?.username) {
          setUsername(worldIdUser.username);
        }
      } catch (error) {
        console.log('No se pudo obtener username:', error);
      }
    };

    getUsername();
  }, [walletAddress]);

  return (
    <header className="w-full p-4 bg-gray-100 border-b">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trivia Futbolera</h1>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600">Usuario: </span>
            <span className="font-semibold">
              {username || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-600">WGOAL: </span>
            <span className="font-bold text-green-600">0.00</span>
          </div>
        </div>
      </div>
    </header>
  );
}
