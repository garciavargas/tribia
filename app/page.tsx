"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button, Box, Typography } from "@mui/material";
import { MiniKit, isMiniKitAvailable } from "@/lib/minikit";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [miniKitReady, setMiniKitReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si MiniKit está disponible después de que se cargue
    const checkMiniKit = () => {
      const isAvailable = isMiniKitAvailable();
      setMiniKitReady(isAvailable);
      console.log("MiniKit disponible:", isAvailable);
    };

    // Esperar un poco para que MiniKit se inicialice
    setTimeout(checkMiniKit, 500);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      if (!miniKitReady) {
        alert("MiniKit no está disponible. Asegúrate de abrir la app desde Worldcoin.");
        setConnecting(false);
        return;
      }

      // @ts-expect-error - MiniKit types are not fully exported
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: Math.random().toString(36).substring(7),
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
      });

      console.log("Wallet Auth response:", finalPayload);

      if (finalPayload.status === "success") {
        router.push("/dashboard");
      } else {
        alert("Error al conectar. Intenta de nuevo.");
        setConnecting(false);
      }
    } catch (error) {
      console.error("Error en Wallet Auth:", error);
      alert(`Error al conectar con World ID: ${error}`);
      setConnecting(false);
    }
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "grey.50"
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: 400 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
          ⚽ Bienvenido a Tribia Futbolera
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
          Predice resultados del Mundial 2026 y gana WGoal
        </Typography>
        
        {!miniKitReady && (
          <Typography variant="body2" sx={{ color: "warning.main", mb: 2, fontSize: "0.875rem" }}>
            ⚠️ Abre esta app desde Worldcoin para conectar
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleConnect}
          disabled={connecting || !miniKitReady}
          sx={{ minHeight: 44 }}
        >
          {connecting ? "Conectando..." : "Conectar con World ID"}
        </Button>

        {/* Debug info (remover en producción) */}
        <Typography variant="caption" sx={{ display: "block", mt: 2, color: "text.disabled" }}>
          MiniKit: {miniKitReady ? "✅ Listo" : "❌ No disponible"}
        </Typography>
      </Box>
    </Box>
  );
}
