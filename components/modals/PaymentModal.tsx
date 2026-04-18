"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { FaCoins } from "react-icons/fa";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  description: string;
}

export default function PaymentModal({ 
  open, 
  onClose,
  amount,
  description
}: PaymentModalProps) {
  const handlePay = () => {
    alert(`💰 Pago de ${amount} WGoal\n\n${description}\n\n(Simulación - En producción usará MiniKit Pay)`);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <Box sx={{ fontSize: 60, mb: 2, color: "warning.main" }}>
          <FaCoins />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Confirmar Pago
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
            {amount} WGoal
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {description}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "center" }}>
          Esta transacción se procesará en World Chain
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, flexDirection: "column", gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePay}
          sx={{ minHeight: 44 }}
        >
          Confirmar Pago
        </Button>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={onClose}
          sx={{ minHeight: 44 }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
