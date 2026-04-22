"use client";

import { Dialog, DialogContent, Button, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

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
        {/* Close Button - Solo visible cuando no está pending */}
        {status !== "pending" && (
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
        <Box sx={{ p: 4, pt: 5, textAlign: "center" }}>
          {/* Pending State */}
          {status === "pending" && (
            <>
              <Box 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 4,
                  bgcolor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  mx: "auto",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                <CircularProgress size={60} sx={{ color: "#1976d2" }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: "#1a1a1a"
                }}
              >
                Procesando...
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  maxWidth: 280,
                  mx: "auto"
                }}
              >
                {message}
              </Typography>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <Box 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 4,
                  bgcolor: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  mx: "auto",
                  boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)"
                }}
              >
                <FaCheckCircle size={60} color="white" />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: "#1a1a1a"
                }}
              >
                ¡Éxito!
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  mb: 4,
                  maxWidth: 280,
                  mx: "auto"
                }}
              >
                {message}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={onClose}
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
                Continuar
              </Button>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <Box 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 4,
                  bgcolor: "#f44336",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  mx: "auto",
                  boxShadow: "0 8px 24px rgba(244, 67, 54, 0.3)"
                }}
              >
                <FaTimesCircle size={60} color="white" />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: "#1a1a1a"
                }}
              >
                Error
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  mb: 4,
                  maxWidth: 280,
                  mx: "auto"
                }}
              >
                {message}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={onClose}
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
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
