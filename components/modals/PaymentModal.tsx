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
      // @ts-expect-error - MiniKit types - WGOAL es token custom
      const { finalPayload } = await MiniKit.pay({
        reference: `tribia-welcome-${Date.now()}`,
        to: process.env.NEXT_PUBLIC_TREASURY_WALLET || "0x7400ffa080c63a689e56936d76752d252fc2ce68",
        tokens: [{
          symbol: "WGOAL" as any,
          token_amount: amount.toString()
        }],
        description: description
      });

      if (finalPayload.status === "success") {
        onSuccess?.();
        onClose();
      } else {
        alert("Pago cancelado");
      }
    } catch (error) {
      console.error("Error en pago:", error);
      alert("Error al procesar el pago");
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
              {processing ? "Procesando..." : "Recibir"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
