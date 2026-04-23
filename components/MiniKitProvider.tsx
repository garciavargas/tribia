'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect } from 'react';

interface MiniKitProviderProps {
  children: React.ReactNode;
}

export default function MiniKitProvider({ children }: MiniKitProviderProps) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID!);
  }, []);

  return <>{children}</>;
}
