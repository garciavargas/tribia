'use client';

import './globals.css';
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Inicializar MiniKit con tu APP_ID
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID!);
  }, []);

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
