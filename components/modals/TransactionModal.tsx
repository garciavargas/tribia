"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  status: "pending" | "success" | "error";
  message: string;
}

export default function TransactionModal({ 
  open, 
  onClose,
  status,
  message
}: TransactionModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={status !== "pending" ? onClose : undefined}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent sx={{ textAlign: "center", py: 4 }}>
        {status === "pending" && (
          <>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Procesando...
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {message}
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Box sx={{ fontSize: 60, mb: 2, color: "success.main" }}>
              <FaCheckCircle />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              ¡Éxito!
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {message}
            </Typography>
          </>
        )}

        {status === "error" && (
          <>
            <Box sx={{ fontSize: 60, mb: 2, color: "error.main" }}>
              <FaTimesCircle />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Error
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {message}
            </Typography>
          </>
        )}
      </DialogContent>

      {status !== "pending" && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{ minHeight: 44 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
