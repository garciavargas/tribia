"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button, Box, Typography, CircularProgress } from "@mui/material";

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
      PaperProps={{
        sx: {
          bgcolor: "white",
          color: "black",
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "black" }}>
        🎁 Recompensa Diaria
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "black", mb: 2 }}>
            +1 WGoal
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", mb: 4 }}>
            Reclama tu recompensa diaria por iniciar sesión
          </Typography>

          {/* Botones */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              disabled={loading}
              sx={{ 
                minHeight: 44,
                borderColor: "black",
                color: "black",
                "&:hover": {
                  borderColor: "black",
                  bgcolor: "rgba(0,0,0,0.05)"
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
                minHeight: 44,
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.8)"
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Confirmar"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
