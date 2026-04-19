"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button, Box, Typography } from "@mui/material";
import { MiniKit } from "@/lib/minikit";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: Math.random().toString(36).substring(7),
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
      });

      if (finalPayload.status === "success") {
        router.push("/dashboard");
      } else {
        alert("Error al conectar. Intenta de nuevo.");
        setConnecting(false);
      }
    } catch (error) {
      console.error("Error en Wallet Auth:", error);
      alert("Error al conectar con World ID");
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
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Predice resultados del Mundial 2026 y gana WGoal
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleConnect}
          disabled={connecting}
          sx={{ minHeight: 44 }}
        >
          {connecting ? "Conectando..." : "Conectar con World ID"}
        </Button>
      </Box>
    </Box>
  );
}
