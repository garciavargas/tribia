"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button, Box, Typography } from "@mui/material";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleConnect = () => {
    setConnecting(true);
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
          {connecting ? "Conectando..." : "Conectar Wallet"}
        </Button>
      </Box>
    </Box>
  );
}
