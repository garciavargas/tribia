"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { FaGlobe } from "react-icons/fa";

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
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <Box sx={{ fontSize: 60, mb: 2 }}>
          <FaGlobe />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
          Conecta con World ID
        </Typography>
        
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mb: 3 }}>
          Solo usuarios verificados pueden jugar en Tribia
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ✅ Verificación con Orb obligatoria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ 1 WGoal gratis por día
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Premios hasta 100,000 WGoal
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConnect}
          disabled={loading}
          sx={{ minHeight: 44 }}
        >
          {loading ? "Conectando..." : "Conectar Wallet"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
