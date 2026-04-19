"use client";

import { useState } from "react";
import { Dialog, DialogContent, Button, Box, Typography, IconButton } from "@mui/material";
import { FaTimes, FaGift } from "react-icons/fa";

interface DailyRewardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DailyRewardModal({ open, onClose, onSuccess }: DailyRewardModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    
    // Simulación temporal
    setTimeout(() => {
      alert("¡Recompensa reclamada! +1 WGoal");
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
          disabled={loading}
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
        <Box sx={{ p: 4, pt: 5, textAlign: "center" }}>
          {/* Icon */}
          <Box 
            sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: 4,
              bgcolor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              mx: "auto",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              boxShadow: "0 8px 24px rgba(240, 147, 251, 0.3)"
            }}
          >
            <FaGift size={50} color="white" />
          </Box>

          {/* Title */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: "#1a1a1a"
            }}
          >
            🎁 Recompensa Diaria
          </Typography>

          {/* Amount */}
          <Box 
            sx={{ 
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 3,
              py: 1.5,
              bgcolor: "white",
              borderRadius: 3,
              mb: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                color: "#FFD700",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              +1
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: "#1a1a1a"
              }}
            >
              WGoal
            </Typography>
          </Box>

          {/* Description */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#666",
              mb: 4,
              maxWidth: 280,
              mx: "auto"
            }}
          >
            Reclama tu recompensa diaria por iniciar sesión en Tribia
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              disabled={loading}
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
              variant="contained"
              fullWidth
              onClick={handleConfirm}
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
              {loading ? "Reclamando..." : "Reclamar"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
