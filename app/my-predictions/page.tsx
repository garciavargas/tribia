"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUserPredictions } from "@/lib/database/predictions";
import { Prediction } from "@/types/database";

type FilterType = "all" | "correct" | "incorrect" | "pending";

export default function MyPredictionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    pending: 0,
    accuracy: 0
  });

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
    loadPredictions();
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [filter, predictions]);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const userPredictions = await getUserPredictions(user.address);
      setPredictions(userPredictions);
      
      // Calcular estadísticas
      const total = userPredictions.length;
      const correct = userPredictions.filter(p => p.isCorrect === true).length;
      const incorrect = userPredictions.filter(p => p.isCorrect === false).length;
      const pending = userPredictions.filter(p => p.isCorrect === null).length;
      const accuracy = total > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
      
      setStats({ total, correct, incorrect, pending, accuracy });
    } catch (error) {
      console.error("Error loading predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = predictions;
    
    switch (filter) {
      case "correct":
        filtered = predictions.filter(p => p.isCorrect === true);
        break;
      case "incorrect":
        filtered = predictions.filter(p => p.isCorrect === false);
        break;
      case "pending":
        filtered = predictions.filter(p => p.isCorrect === null);
        break;
      default:
        filtered = predictions;
    }
    
    setFilteredPredictions(filtered);
  };

  const getPredictionLabel = (prediction: "home" | "draw" | "away") => {
    switch (prediction) {
      case "home": return "Local gana";
      case "draw": return "Empate";
      case "away": return "Visitante gana";
    }
  };

  const getPredictionIcon = (isCorrect: boolean | null) => {
    if (isCorrect === null) return "⏳";
    return isCorrect ? "✅" : "❌";
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
        <h1 className="text-2xl font-bold mb-4">📊 Mis Predicciones</h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Precisión</p>
            <p className="text-2xl font-bold text-green-600">
              {isNaN(stats.accuracy) ? 0 : stats.accuracy}%
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Correctas</p>
            <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Todas ({stats.total})
          </button>
          <button
            onClick={() => setFilter("correct")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === "correct"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            ✅ Correctas ({stats.correct})
          </button>
          <button
            onClick={() => setFilter("incorrect")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === "incorrect"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            ❌ Incorrectas ({stats.incorrect})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === "pending"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            ⏳ Pendientes ({stats.pending})
          </button>
        </div>

        {/* Lista de Predicciones */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando predicciones...</p>
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay predicciones en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPredictions.map((pred) => (
              <div
                key={pred.predictionId}
                className="bg-white rounded-lg p-4 shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPredictionIcon(pred.isCorrect)}</span>
                    <div>
                      <p className="font-bold text-sm">Match ID: {pred.matchId}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(pred.timestamp).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {pred.rewardClaimed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      +5 WGoal
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Tu predicción: <span className="font-bold">{getPredictionLabel(pred.prediction)}</span>
                  </p>
                  {pred.isCorrect !== null && (
                    <span className={`text-xs font-bold ${
                      pred.isCorrect ? "text-green-600" : "text-red-600"
                    }`}>
                      {pred.isCorrect ? "¡Acertaste!" : "Fallaste"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer userId={user.address} />
    </div>
  );
}
