"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  TextField, 
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Alert
} from "@mui/material";
import { FaTrophy } from "react-icons/fa";
import toast from "react-hot-toast";

interface FinalPredictionProps {
  userAddress: string;
  onSuccess?: () => void;
}

export default function FinalPrediction({ userAddress, onSuccess }: FinalPredictionProps) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [champion, setChampion] = useState<"teamA" | "teamB" | "">("");
  const [decidedBy, setDecidedBy] = useState<"normal" | "extra" | "penalties">("normal");
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validaciones
    if (!teamA || !teamB) {
      toast.error("Selecciona ambos equipos finalistas");
      return;
    }

    if (!champion) {
      toast.error("Selecciona el campeón");
      return;
    }

    if (!scoreA || !scoreB) {
      toast.error("Ingresa el marcador final");
      return;
    }

    const scoreANum = parseInt(scoreA);
    const scoreBNum = parseInt(scoreB);

    if (isNaN(scoreANum) || isNaN(scoreBNum) || scoreANum < 0 || scoreBNum < 0) {
      toast.error("Marcador inválido");
      return;
    }

    setLoading(true);

    try {
      // Guardar predicción en Firebase
      const { saveFinalPrediction } = await import("@/lib/database/predictions");
      
      await saveFinalPrediction({
        userId: userAddress,
        teamA,
        teamB,
        champion: champion === "teamA" ? teamA : teamB,
        decidedBy,
        scoreA: scoreANum,
        scoreB: scoreBNum
      });

      toast.success("🎰 ¡Predicción del Premio Gordo guardada!");
      onSuccess?.();
    } catch (error) {
      console.error("Error saving prediction:", error);
      toast.error("Error al guardar predicción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        mb: 4
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <FaTrophy size={60} color="#FFD700" />
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
            🎰 PREMIO GORDO
          </Typography>
          <Chip 
            label="1,000,000 WGoal" 
            sx={{ 
              bgcolor: "#FFD700", 
              color: "#000",
              fontWeight: "bold",
              fontSize: "1.1rem",
              px: 2,
              py: 3
            }} 
          />
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
            Predice el resultado exacto de la final del Mundial 2026
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)", color: "white" }}>
          Si hay múltiples ganadores, el premio se divide equitativamente
        </Alert>

        {/* Selección de Finalistas */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            1️⃣ ¿Quiénes llegan a la final?
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Equipo A"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              placeholder="Ej: Brasil"
              sx={{ 
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 2
              }}
            />
            <TextField
              fullWidth
              label="Equipo B"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="Ej: Argentina"
              sx={{ 
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 2
              }}
            />
          </Box>
        </Box>

        {/* Selección de Campeón */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            2️⃣ ¿Quién gana la Copa del Mundo?
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              value={champion}
              onChange={(e) => setChampion(e.target.value as "teamA" | "teamB")}
            >
              <FormControlLabel 
                value="teamA" 
                control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#FFD700" } }} />} 
                label={teamA || "Equipo A"}
                disabled={!teamA}
              />
              <FormControlLabel 
                value="teamB" 
                control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#FFD700" } }} />} 
                label={teamB || "Equipo B"}
                disabled={!teamB}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Forma de Victoria */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            3️⃣ ¿Cómo gana?
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              value={decidedBy}
              onChange={(e) => setDecidedBy(e.target.value as "normal" | "extra" | "penalties")}
            >
              <FormControlLabel 
                value="normal" 
                control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#FFD700" } }} />} 
                label="Tiempo normal (90 minutos)"
              />
              <FormControlLabel 
                value="extra" 
                control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#FFD700" } }} />} 
                label="Tiempo extra (120 minutos)"
              />
              <FormControlLabel 
                value="penalties" 
                control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#FFD700" } }} />} 
                label="Penales"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Marcador Final */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            4️⃣ Marcador final (90 minutos)
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              type="number"
              label={teamA || "Equipo A"}
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              slotProps={{
                htmlInput: { min: 0, max: 20 }
              }}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 2,
                width: 100
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>-</Typography>
            <TextField
              type="number"
              label={teamB || "Equipo B"}
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              slotProps={{
                htmlInput: { min: 0, max: 20 }
              }}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 2,
                width: 100
              }}
            />
          </Box>
          
          <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.8 }}>
            * Marcador al final de los 90 minutos (sin contar tiempo extra)
          </Typography>
        </Box>

        {/* Botón de Envío */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: "#FFD700",
            color: "#000",
            fontWeight: "bold",
            fontSize: "1.1rem",
            py: 2,
            "&:hover": {
              bgcolor: "#FFC700"
            },
            "&:disabled": {
              bgcolor: "rgba(255,255,255,0.3)"
            }
          }}
        >
          {loading ? "Guardando..." : "🎰 Hacer Predicción del Premio Gordo"}
        </Button>

        {/* Info adicional */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2 }}>
          <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
            📌 <strong>Importante:</strong>
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
            • Debes acertar: Finalistas + Campeón + Forma de victoria + Marcador exacto
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
            • Solo puedes hacer UNA predicción
          </Typography>
          <Typography variant="caption" sx={{ display: "block" }}>
            • Predicción válida hasta el inicio de la final (19 julio 2026)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
