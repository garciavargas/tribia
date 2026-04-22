"use client";

import { useState } from "react";
import { Button, Typography, Box, IconButton, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { FaTimes, FaFutbol } from "react-icons/fa";
import BaseModal from "./BaseModal";

interface PredictionModalProps {
  open: boolean;
  onClose: () => void;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  matchDate: string;
  onConfirm: (prediction: "home" | "draw" | "away") => void;
}

export default function PredictionModal({ 
  open, 
  onClose,
  homeTeam,
  awayTeam,
  homeFlag,
  awayFlag,
  matchDate,
  onConfirm
}: PredictionModalProps) {
  const [prediction, setPrediction] = useState<"home" | "draw" | "away" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!prediction) return;
    
    setLoading(true);
    await onConfirm(prediction);
    setLoading(false);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose} showCloseButton={false}>
      <Box sx={{ p: 4, pt: 5 }}>
        {/* Close Button Custom */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            bgcolor: "#e0e0e0",
            width: 40,
            height: 40,
            zIndex: 10,
            "&:hover": { bgcolor: "#d0d0d0" }
          }}
        >
          <FaTimes size={18} />
        </IconButton>

        {/* Icon */}
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: 3,
            bgcolor: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
          }}
        >
          <FaFutbol size={40} color="white" />
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
          Hacer Predicción
        </Typography>

        {/* Match Info */}
        <Box 
          sx={{ 
            bgcolor: "white",
            borderRadius: 2,
            p: 2.5,
            mb: 3
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
              <Typography variant="h4">{homeFlag}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                {homeTeam}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
              VS
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, justifyContent: "flex-end" }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                {awayTeam}
              </Typography>
              <Typography variant="h4">{awayFlag}</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: "#999", display: "block", textAlign: "center" }}>
            {matchDate}
          </Typography>
        </Box>

        {/* Prediction Options */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#666",
            mb: 2,
            fontWeight: 500
          }}
        >
          ¿Quién ganará?
        </Typography>

        <RadioGroup
          value={prediction}
          onChange={(e) => setPrediction(e.target.value as "home" | "draw" | "away")}
        >
          <Box 
            sx={{ 
              bgcolor: prediction === "home" ? "#e3f2fd" : "white",
              borderRadius: 2,
              p: 2,
              mb: 1.5,
              border: prediction === "home" ? "2px solid #1976d2" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: prediction === "home" ? "#e3f2fd" : "#f5f5f5"
              }
            }}
            onClick={() => setPrediction("home")}
          >
            <FormControlLabel 
              value="home" 
              control={<Radio />} 
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h5">{homeFlag}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {homeTeam} gana
                  </Typography>
                </Box>
              }
              sx={{ m: 0, width: "100%" }}
            />
          </Box>

          <Box 
            sx={{ 
              bgcolor: prediction === "draw" ? "#fff3e0" : "white",
              borderRadius: 2,
              p: 2,
              mb: 1.5,
              border: prediction === "draw" ? "2px solid #ff9800" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: prediction === "draw" ? "#fff3e0" : "#f5f5f5"
              }
            }}
            onClick={() => setPrediction("draw")}
          >
            <FormControlLabel 
              value="draw" 
              control={<Radio />} 
              label={
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  🤝 Empate
                </Typography>
              }
              sx={{ m: 0, width: "100%" }}
            />
          </Box>

          <Box 
            sx={{ 
              bgcolor: prediction === "away" ? "#e3f2fd" : "white",
              borderRadius: 2,
              p: 2,
              mb: 3,
              border: prediction === "away" ? "2px solid #1976d2" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: prediction === "away" ? "#e3f2fd" : "#f5f5f5"
              }
            }}
            onClick={() => setPrediction("away")}
          >
            <FormControlLabel 
              value="away" 
              control={<Radio />} 
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h5">{awayFlag}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {awayTeam} gana
                  </Typography>
                </Box>
              }
              sx={{ m: 0, width: "100%" }}
            />
          </Box>
        </RadioGroup>

        {/* Reward Info */}
        <Box 
          sx={{ 
            bgcolor: "#fff9e6",
            borderRadius: 2,
            p: 2,
            mb: 3,
            border: "1px solid #ffe082"
          }}
        >
          <Typography variant="caption" sx={{ color: "#f57c00", fontWeight: 600 }}>
            ⚡ Gana 5 WGoal si aciertas
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
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
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConfirm}
            disabled={!prediction || loading}
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
            {loading ? "Confirmando..." : "Confirmar"}
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
}
