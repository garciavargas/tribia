"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";
import { Match } from "@/types/database";

interface MatchCardProps {
  match: Match;
  userAddress: string;
  existingPrediction?: "home" | "draw" | "away";
  onPredictionSaved?: () => void;
}

export default function MatchCard({ 
  match, 
  userAddress, 
  existingPrediction,
  onPredictionSaved 
}: MatchCardProps) {
  const [prediction, setPrediction] = useState<"home" | "draw" | "away" | null>(
    existingPrediction || null
  );
  const [loading, setLoading] = useState(false);

  const matchDate = new Date(match.matchDate);
  const isPast = matchDate < new Date();
  const isLocked = existingPrediction !== undefined;

  const handleSave = async () => {
    if (!prediction) {
      toast.error("Selecciona un resultado");
      return;
    }

    setLoading(true);

    try {
      const { savePrediction } = await import("@/lib/database/predictions");
      await savePrediction(userAddress, match.matchId, prediction);
      
      toast.success("✅ Predicción guardada");
      onPredictionSaved?.();
    } catch (error: any) {
      console.error("Error saving prediction:", error);
      toast.error(error.message || "Error al guardar predicción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: isLocked ? "2px solid #4caf50" : "1px solid #e0e0e0",
        bgcolor: isLocked ? "#f1f8f4" : "white"
      }}
    >
      <CardContent>
        {/* Fecha y Estado */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaClock size={14} color="#666" />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {matchDate.toLocaleDateString("es-MX", { 
                day: "numeric", 
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Typography>
          </Box>
          
          {isLocked && (
            <Chip 
              icon={<FaCheckCircle />}
              label="Predicción guardada" 
              size="small" 
              color="success"
            />
          )}
        </Box>

        {/* Equipos */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", flex: 1 }}>
              {match.homeTeam}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mx: 2 }}>
              VS
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", flex: 1, textAlign: "right" }}>
              {match.awayTeam}
            </Typography>
          </Box>
          
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            📍 {match.venue}
          </Typography>
        </Box>

        {/* Selector de Predicción */}
        {!isPast && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tu predicción:
            </Typography>
            
            <ToggleButtonGroup
              value={prediction}
              exclusive
              onChange={(_, value) => !isLocked && setPrediction(value)}
              fullWidth
              disabled={isLocked}
            >
              <ToggleButton 
                value="home"
                sx={{ 
                  py: 1.5,
                  fontWeight: prediction === "home" ? "bold" : "normal"
                }}
              >
                Gana {match.homeTeam}
              </ToggleButton>
              <ToggleButton 
                value="draw"
                sx={{ 
                  py: 1.5,
                  fontWeight: prediction === "draw" ? "bold" : "normal"
                }}
              >
                Empate
              </ToggleButton>
              <ToggleButton 
                value="away"
                sx={{ 
                  py: 1.5,
                  fontWeight: prediction === "away" ? "bold" : "normal"
                }}
              >
                Gana {match.awayTeam}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Botón de Guardar */}
        {!isPast && !isLocked && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={!prediction || loading}
            sx={{ py: 1.5 }}
          >
            {loading ? "Guardando..." : "💾 Guardar Predicción"}
          </Button>
        )}

        {/* Premio */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Chip 
            label="🏆 5 WGoal por acierto" 
            size="small" 
            color="warning"
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
