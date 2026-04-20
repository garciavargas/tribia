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
  const [debugInfo, setDebugInfo] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Verificar MiniKit múltiples veces
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkMiniKit = () => {
      attempts++;
      const isAvailable = isMiniKitAvailable();
      
      setDebugInfo(`Intento ${attempts}: ${isAvailable ? "✅" : "❌"}`);
      
      if (isAvailable) {
        setMiniKitReady(true);
        console.log("✅ MiniKit listo");
        return true;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkMiniKit, 500);
      } else {
        console.log("❌ MiniKit no disponible después de", maxAttempts, "intentos");
      }
      
      return false;
    };

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

  // Botón temporal para ir directo al dashboard (SOLO PARA DEBUG)
  const handleSkipToDashboard = () => {
    router.push("/dashboard");
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
          sx={{ minHeight: 44, mb: 2 }}
        >
          {connecting ? "Conectando..." : "Conectar con World ID"}
        </Button>

        {/* Botón temporal de debug */}
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleSkipToDashboard}
          sx={{ minHeight: 44, mb: 2 }}
        >
          🔧 Ir al Dashboard (Debug)
        </Button>

        {/* Debug info */}
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            MiniKit: {miniKitReady ? "✅ Listo" : "❌ No disponible"}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            {debugInfo}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 1 }}>
            App ID: {process.env.NEXT_PUBLIC_APP_ID?.substring(0, 20)}...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
