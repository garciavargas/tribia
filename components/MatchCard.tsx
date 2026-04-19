"use client";

import { useState } from "react";
import { Match, PredictionResult } from "@/types/match";

interface MatchCardProps {
  match: Match;
  onPredict: (matchId: string, prediction: PredictionResult) => void;
  currentPrediction?: PredictionResult;
}

export default function MatchCard({ match, onPredict, currentPrediction }: MatchCardProps) {
  const [selected, setSelected] = useState<PredictionResult | undefined>(currentPrediction);

  const handleSelect = (prediction: PredictionResult) => {
    setSelected(prediction);
    onPredict(match.id, prediction);
  };

  const buttonClass = (type: PredictionResult) => `
    flex-1 py-3 px-2 rounded-lg font-semibold text-sm transition-all
    ${selected === type 
      ? "bg-blue-600 text-white scale-105" 
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }
  `;

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-3">
      {/* Equipos */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-800">{match.homeTeam}</p>
        </div>
        <div className="px-3 text-gray-400 font-bold">VS</div>
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-800">{match.awayTeam}</p>
        </div>
      </div>

      {/* Fecha */}
      <p className="text-xs text-gray-500 text-center mb-3">{match.date}</p>

      {/* Opciones de predicción */}
      <div className="flex gap-2">
        <button
          onClick={() => handleSelect("home")}
          className={buttonClass("home")}
        >
          Gana Local
        </button>
        <button
          onClick={() => handleSelect("draw")}
          className={buttonClass("draw")}
        >
          Empate
        </button>
        <button
          onClick={() => handleSelect("away")}
          className={buttonClass("away")}
        >
          Gana Visita
        </button>
      </div>
    </div>
  );
}
