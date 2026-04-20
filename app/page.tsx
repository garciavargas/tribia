"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button, Box, Typography, Container, Card, CardContent, Chip } from "@mui/material";
import { MiniKit, isMiniKitAvailable } from "@/lib/minikit";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [miniKitReady, setMiniKitReady] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const router = useRouter();

  useEffect(() => {
    // Countdown hasta el Mundial (11 de junio 2026)
    const worldCupDate = new Date('2026-06-11T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = worldCupDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Verificar MiniKit inmediatamente y con reintentos
    const checkMiniKit = () => {
      const isAvailable = isMiniKitAvailable();
      
      if (isAvailable) {
        setMiniKitReady(true);
      }
    };

    // Verificar inmediatamente
    checkMiniKit();
    
    // Reintentar cada 500ms durante 5 segundos
    const interval = setInterval(checkMiniKit, 500);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      // Si después de 5 segundos no está disponible, habilitarlo igual
      // (para permitir pruebas en desarrollo)
      if (!isMiniKitAvailable()) {
        console.warn("MiniKit no detectado, pero habilitando botón");
        setMiniKitReady(true);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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

      // Paso 1: Verificar World ID (prueba de humanidad)
      // @ts-expect-error - MiniKit types
      const verifyResult = await MiniKit.commandsAsync.verify({
        action: "tribia-signup",
        signal: crypto.randomUUID(),
        verification_level: "orb"
      });

      if (verifyResult.finalPayload.status !== "success") {
        alert("Necesitas verificar tu identidad con World ID para jugar.");
        setConnecting(false);
        return;
      }

      // Paso 2: Conectar wallet
      // @ts-expect-error - MiniKit types
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: Math.random().toString(36).substring(7),
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
      });

      if (finalPayload.status === "success") {
        // Guardar datos de usuario en localStorage
        localStorage.setItem("tribia_user", JSON.stringify({
          address: finalPayload.address,
          verified: true,
          nullifierHash: verifyResult.finalPayload.nullifier_hash,
          joinedAt: Date.now()
        }));
        
        // Crear usuario en Firebase
        const { createUser, getUser } = await import("@/lib/database/users");
        const existingUser = await getUser(finalPayload.address);
        
        if (!existingUser) {
          await createUser(
            finalPayload.address,
            verifyResult.finalPayload.verification_level,
            verifyResult.finalPayload.nullifier_hash
          );
        }
        
        router.push("/dashboard");
      } else {
        alert("Error al conectar wallet. Intenta de nuevo.");
        setConnecting(false);
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      alert(`Error: ${error}`);
      setConnecting(false);
    }
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", color: "primary.main", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
            ⚽ Tribia Futbolera
          </Typography>
          <Typography variant="h5" sx={{ color: "text.secondary", mb: 3, fontWeight: 500 }}>
            Predice el Mundial 2026 y gana tokens WGoal
          </Typography>
          
          {/* Countdown */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {countdown.days}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>días</Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "text.secondary" }}>:</Typography>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {countdown.hours}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>horas</Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "text.secondary" }}>:</Typography>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {countdown.minutes}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>min</Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 4, flexWrap: "wrap" }}>
            <Chip label="🎮 1,247 jugadores" color="primary" />
            <Chip label="💰 45,890 WGoal distribuidos" color="success" />
            <Chip label="🏆 48 partidos disponibles" color="secondary" />
          </Box>
        </Box>

        {/* Cómo Funciona */}
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          ¿Cómo funciona?
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 6 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
              <Typography sx={{ fontSize: 60, mb: 2 }}>🔐</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                1. Verifica tu identidad
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Conecta con World ID para acceder al juego de forma segura
              </Typography>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
              <Typography sx={{ fontSize: 60, mb: 2 }}>⚽</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                2. Haz tus predicciones
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Predice resultados de partidos antes de que comiencen
              </Typography>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
              <Typography sx={{ fontSize: 60, mb: 2 }}>💰</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                3. Gana WGoal
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Recibe 5 WGoal por cada predicción correcta + 1 WGoal diario
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Preview de Partidos */}
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Próximos partidos
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography variant="h4">🇲🇽</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>México</Typography>
                </Box>
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    11 Jun • 12:00
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    VS
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography variant="h4">🇿🇦</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>Sudáfrica</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Chip label="🏆 5 WGoal por acierto" size="small" color="success" />
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography variant="h4">🇧🇷</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>Brasil</Typography>
                </Box>
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    11 Jun • 15:00
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    VS
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography variant="h4">🇲🇦</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>Marruecos</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Chip label="🏆 5 WGoal por acierto" size="small" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Premio Final */}
        <Card sx={{ bgcolor: "primary.main", color: "white", mb: 6, p: 3, textAlign: "center" }}>
          <Typography sx={{ fontSize: 60, mb: 2 }}>🏆</Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            🎰 PREMIO GORDO: 100,000 WGoal
          </Typography>
          <Typography variant="body1">
            Predice el campeón + resultado exacto de la final
          </Typography>
        </Card>

        {/* CTA */}
        <Box sx={{ textAlign: "center" }}>
          {!miniKitReady && (
            <Typography variant="body2" sx={{ color: "warning.main", mb: 2 }}>
              ⚠️ Abre esta app desde Worldcoin para conectar
            </Typography>
          )}
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleConnect}
            disabled={connecting || !miniKitReady}
            sx={{ 
              minHeight: 56, 
              fontSize: "1.1rem",
              fontWeight: "bold",
              maxWidth: 400,
              mx: "auto"
            }}
          >
            {connecting ? "Conectando..." : "🔗 Conectar Wallet"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
