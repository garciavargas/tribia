"use client";

import { useState } from "react";
import { Dialog, DialogContent, Button, Typography, Box, IconButton } from "@mui/material";
import { FaGlobe, FaTimes, FaCheckCircle } from "react-icons/fa";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerificationModal({ 
  open, 
  onClose, 
  onSuccess 
}: VerificationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    
    setTimeout(() => {
      alert("✅ Wallet conectada exitosamente\n\n(Simulación - En producción se conectará con World ID)");
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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

        {/* Content */}
        <Box sx={{ p: 4, pt: 5 }}>
          {/* Icon */}
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: 3,
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            }}
          >
            <FaGlobe size={40} color="white" />
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
            Conectar tu World ID
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#666",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 0.5
            }}
          >
            a Tribia <FaCheckCircle size={16} color="#1976d2" />
          </Typography>

          {/* Info Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#666",
                mb: 2,
                fontSize: "0.9rem"
              }}
            >
              La app verá tu
            </Typography>
            
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1.5,
                p: 2,
                bgcolor: "white",
                borderRadius: 2
              }}
            >
              <FaCheckCircle size={20} color="#1a1a1a" />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: "#1a1a1a"
                }}
              >
                Tu prueba de humanidad
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConnect}
            disabled={loading}
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
              },
              "&:disabled": {
                bgcolor: "#ccc"
              }
            }}
          >
            {loading ? "Conectando..." : "Aprobar"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
