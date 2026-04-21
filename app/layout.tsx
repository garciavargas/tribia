"use client";

import { useEffect } from "react";
import { initMiniKit } from "@/lib/minikit";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initMiniKit();
  }, []);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Tribia - Futbolera</title>
        <meta name="description" content="Predice el Mundial 2026 y otros Partidos de Futbol para ganar Token WGoal Diarios" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icono-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/icono-192x192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icono-192x192.png" sizes="192x192" type="image/png" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
