"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, Button, Box, Typography, Divider } from "@mui/material";
import { FaCheckCircle, FaCoins, FaTrophy } from "react-icons/fa";

interface ModalInicioProps {
  open: boolean;
  onConnect: () => void;
  connecting: boolean;
}

export default function ModalInicio({ open, onConnect, connecting }: ModalInicioProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const worldCupDate = new Date('2026-06-11T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = worldCupDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog 
      open={open}
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            m: 2,
            bgcolor: "#ffffff"
          }
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Logo y Título */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
            ⚽ Tribia Futbolera
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 500 }}>
            Haz tus predicciones del Mundial 2026
          </Typography>
        </Box>

        {/* Cronómetro */}
        <Box sx={{ 
          bgcolor: "primary.main", 
          borderRadius: 3, 
          p: 3, 
          mb: 3,
          textAlign: "center"
        }}>
          <Typography variant="body2" sx={{ color: "white", mb: 1, opacity: 0.9 }}>
            Comienza en:
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "white" }}>
                {countdown.days}
              </Typography>
              <Typography variant="caption" sx={{ color: "white", opacity: 0.8 }}>días</Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "white", opacity: 0.5 }}>:</Typography>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "white" }}>
                {String(countdown.hours).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" sx={{ color: "white", opacity: 0.8 }}>hrs</Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "white", opacity: 0.5 }}>:</Typography>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "white" }}>
                {String(countdown.minutes).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" sx={{ color: "white", opacity: 0.8 }}>min</Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "white", opacity: 0.5 }}>:</Typography>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "white" }}>
                {String(countdown.seconds).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" sx={{ color: "white", opacity: 0.8 }}>seg</Typography>
            </Box>
          </Box>
        </Box>

        {/* Ventajas de ser humano verificado */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            ✅ Solo humanos verificados
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FaCheckCircle size={20} color="#4caf50" />
              <Typography variant="body2">Verificación con World ID (Orb)</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FaCheckCircle size={20} color="#4caf50" />
              <Typography variant="body2">Sin bots, solo personas reales</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FaCheckCircle size={20} color="#4caf50" />
              <Typography variant="body2">Juego justo y transparente</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Tabla de Ganancias */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            💰 Gana tokens WGoal
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaCoins size={18} color="#FFD700" />
                <Typography variant="body2">Login diario</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                +1 WGoal
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaCoins size={18} color="#FFD700" />
                <Typography variant="body2">Predicción correcta</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                +5 WGoal
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaTrophy size={18} color="#FFD700" />
                <Typography variant="body2">Acertar campeón (Top 50)</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "success.main" }}>
                +10,000 WGoal
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                bgcolor: "#fff3cd",
                p: 1.5,
                borderRadius: 2,
                mt: 1
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaTrophy size={20} color="#ff9800" />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  🎰 PREMIO GORDO
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                +100,000 WGoal
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", display: "block", mt: 1 }}>
              * Premio gordo: Acertar campeón + resultado exacto de la final
            </Typography>
          </Box>
        </Box>

        {/* Botón de Conectar */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onConnect}
          disabled={connecting}
          sx={{ 
            minHeight: 56, 
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 3,
            textTransform: "none",
            position: "relative"
          }}
        >
          {connecting ? (
            <>
              <span style={{ opacity: 0.7 }}>Conectando</span>
              <span className="ml-2">
                <svg className="animate-spin h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </>
          ) : (
            "🔗 Conectar con World ID"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
