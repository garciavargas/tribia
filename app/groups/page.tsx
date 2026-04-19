"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatchCard from "@/components/MatchCard";
import { GROUP_KEYS, GROUPS, GroupKey } from "@/constants/groups";
import { getMatchesByGroup } from "@/lib/matches";
import { PredictionResult, MatchPrediction, GroupPrediction } from "@/types/match";

export default function GroupsPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<GroupKey>("A");
  const [matchPredictions, setMatchPredictions] = useState<MatchPrediction[]>([]);
  const [groupPredictions, setGroupPredictions] = useState<GroupPrediction[]>([]);

  const matches = getMatchesByGroup(selectedGroup);
  const teams = GROUPS[selectedGroup];

  const handleMatchPrediction = (matchId: string, prediction: PredictionResult) => {
    setMatchPredictions((prev) => {
      const existing = prev.find((p) => p.matchId === matchId);
      if (existing) {
        return prev.map((p) => (p.matchId === matchId ? { ...p, prediction } : p));
      }
      return [...prev, { matchId, prediction }];
    });
  };

  const handleFirstPlacePrediction = (team: string) => {
    setGroupPredictions((prev) => {
      const existing = prev.find((p) => p.group === selectedGroup);
      if (existing) {
        return prev.map((p) => (p.group === selectedGroup ? { ...p, firstPlace: team } : p));
      }
      return [...prev, { group: selectedGroup, firstPlace: team }];
    });
  };

  const handleSavePredictions = () => {
    alert(`Predicciones guardadas:\n${matchPredictions.length} partidos\n${groupPredictions.length} grupos`);
  };

  const currentGroupPrediction = groupPredictions.find((p) => p.group === selectedGroup);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">⚽ Fase de Grupos</h1>

        {/* Tabs de grupos */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
          {GROUP_KEYS.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`
                px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all
                ${selectedGroup === group
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              Grupo {group}
            </button>
          ))}
        </div>

        {/* Predicción de primer lugar */}
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <h3 className="font-bold text-gray-800 mb-3">¿Quién pasa primero?</h3>
          <div className="grid grid-cols-2 gap-2">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => handleFirstPlacePrediction(team)}
                className={`
                  py-3 px-4 rounded-lg font-semibold text-sm transition-all
                  ${currentGroupPrediction?.firstPlace === team
                    ? "bg-green-600 text-white scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de partidos */}
        <h3 className="font-bold text-gray-800 mb-3">Partidos del Grupo {selectedGroup}</h3>
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPredict={handleMatchPrediction}
            currentPrediction={matchPredictions.find((p) => p.matchId === match.id)?.prediction}
          />
        ))}

        {/* Botón guardar */}
        <button
          onClick={handleSavePredictions}
          className="
            w-full py-4 bg-green-600 text-white font-bold rounded-lg
            hover:bg-green-700 transition-colors mt-4
          "
        >
          Guardar Predicciones
        </button>
      </main>

      <Footer userId="user-demo-123" />
    </div>
  );
}
