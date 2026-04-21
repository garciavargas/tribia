"use client";

import { useState } from "react";
import { Dialog, DialogContent, Button, Typography, Box, IconButton } from "@mui/material";
import { FaCoins, FaTimes, FaExclamationCircle } from "react-icons/fa";
import { MiniKit } from "@/lib/minikit";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess?: () => void;
}

export default function PaymentModal({ 
  open, 
  onClose,
  amount,
  description,
  onSuccess
}: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    
    try {
      // Para el modal de bienvenida, el backend envía WGoal al usuario
      // No usamos MiniKit.pay porque eso es para que el usuario PAGUE
      
      const toast = (await import("react-hot-toast")).default;
      toast.loading("Recibiendo tu WGoal de bienvenida...", { id: "welcome" });

      // Llamar al backend para que envíe el WGoal
      const response = await fetch("/api/send-welcome-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: localStorage.getItem("tribia_user") 
            ? JSON.parse(localStorage.getItem("tribia_user")!).address 
            : null
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("¡Recibiste 1 WGoal de bienvenida! 🎉", { id: "welcome" });
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || "Error al enviar WGoal", { id: "welcome" });
      }
    } catch (error) {
      console.error("Error en bienvenida:", error);
      const toast = (await import("react-hot-toast")).default;
      toast.error("Error al procesar la bienvenida", { id: "welcome" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={processing ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            m: 2,
            maxWidth: 400,
            bgcolor: "#f5f5f5"
          }
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Close Button */}
        {!processing && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              bgcolor: "#e0e0e0",
              width: 40,
              height: 40,
              "&:hover": { bgcolor: "#d0d0d0" }
            }}
          >
            <FaTimes size={18} />
          </IconButton>
        )}

        {/* Content */}
        <Box sx={{ p: 4, pt: 5 }}>
          {/* Icon */}
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: 3,
              bgcolor: "#FFD700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3
            }}
          >
            <FaCoins size={40} color="#1a1a1a" />
          </Box>

          {/* Title */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: "#1a1a1a"
            }}
          >
            Recibir WGoal
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#666",
              mb: 3
            }}
          >
            de Tribia
          </Typography>

          {/* Amount Section */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              bgcolor: "white",
              borderRadius: 2,
              mb: 2
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: "50%",
                  bgcolor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FaCoins size={18} color="#FFD700" />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: "#1a1a1a"
                }}
              >
                Recibir
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 700,
                color: "#1a1a1a"
              }}
            >
              {amount} WGoal
            </Typography>
          </Box>

          {/* Description */}
          {description && (
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "flex-start",
                gap: 1,
                p: 2,
                bgcolor: "#e8f5e9",
                borderRadius: 2,
                mb: 3
              }}
            >
              <FaExclamationCircle size={16} color="#2e7d32" style={{ marginTop: 2 }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "#2e7d32",
                  fontSize: "0.85rem",
                  lineHeight: 1.5
                }}
              >
                {description}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={onClose}
              disabled={processing}
              sx={{ 
                minHeight: 56,
                borderRadius: 3,
                borderColor: "#d0d0d0",
                color: "#1a1a1a",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#b0b0b0",
                  bgcolor: "#f5f5f5"
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePay}
              disabled={processing}
              sx={{ 
                minHeight: 56,
                borderRadius: 3,
                bgcolor: "#1a1a1a",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#2a2a2a"
                }
              }}
            >
              {processing ? (
                <>
                  <span style={{ opacity: 0.7 }}>Procesando</span>
                  <span style={{ marginLeft: 8 }}>
                    <svg className="animate-spin h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                "Recibir"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
