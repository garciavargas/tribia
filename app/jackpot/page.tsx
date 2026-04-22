"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalPrediction from "@/components/FinalPrediction";
import { getFinalPrediction } from "@/lib/database/predictions";
import { FinalPrediction as FinalPredictionType } from "@/types/database";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { FaTrophy, FaCheckCircle } from "react-icons/fa";

export default function JackpotPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [existingPrediction, setExistingPrediction] = useState<FinalPredictionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("tribia_user");
    if (!userData) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    loadExistingPrediction();
  }, [user]);

  const loadExistingPrediction = async () => {
    setLoading(true);
    try {
      const prediction = await getFinalPrediction(user.address);
      setExistingPrediction(prediction);
    } catch (error) {
      console.error("Error loading prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-4">
        {/* Título */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <FaTrophy size={60} color="#FFD700" />
          <Typography variant="h3" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
            🎰 Premio Gordo
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Predice el resultado exacto de la final y gana
          </Typography>
        </Box>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : existingPrediction ? (
          // Mostrar predicción existente
          <Card sx={{ maxWidth: 600, mx: "auto", border: "2px solid #4caf50" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <FaCheckCircle size={24} color="#4caf50" />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4caf50" }}>
                  Tu Predicción del Premio Gordo
                </Typography>
              </Box>

              <Box sx={{ bgcolor: "#f5f5f5", p: 3, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                  Finalistas:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                  {existingPrediction.teamA} 🆚 {existingPrediction.teamB}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  Campeón:
                </Typography>
                <Chip 
                  label={`🏆 ${existingPrediction.champion}`}
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 3 }}
                />

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  Forma de victoria:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 3 }}>
                  {existingPrediction.decidedBy === "normal" && "⏱️ Tiempo normal (90 min)"}
                  {existingPrediction.decidedBy === "extra" && "⏱️ Tiempo extra (120 min)"}
                  {existingPrediction.decidedBy === "penalties" && "🎯 Penales"}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  Marcador final (90 min):
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {existingPrediction.scoreA} - {existingPrediction.scoreB}
                </Typography>
              </Box>

              <Box sx={{ bgcolor: "#fff3cd", p: 2, borderRadius: 2, border: "1px solid #ffc107" }}>
                <Typography variant="caption" sx={{ color: "#856404" }}>
                  ⚠️ Solo puedes hacer UNA predicción del Premio Gordo. Esta predicción es final y no se puede modificar.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Predicción realizada el {new Date(existingPrediction.timestamp).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          // Formulario de predicción
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <FinalPrediction 
              userAddress={user.address}
              onSuccess={loadExistingPrediction}
            />
          </Box>
        )}
      </main>

      <Footer userId={user.address} />
    </div>
  );
}
