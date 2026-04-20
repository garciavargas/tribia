"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatchCard from "@/components/MatchCard";
import { Match } from "@/types/database";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserPredictions } from "@/lib/database/predictions";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function GroupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState("A");
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, "home" | "draw" | "away">>({});
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
    loadGroupMatches();
    loadUserPredictions();
  }, [selectedGroup, user]);

  const loadGroupMatches = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "matches"),
        where("group", "==", selectedGroup),
        orderBy("matchDate", "asc")
      );
      
      const snapshot = await getDocs(q);
      const matchesData = snapshot.docs.map(doc => doc.data() as Match);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPredictions = async () => {
    try {
      const userPredictions = await getUserPredictions(user.address);
      const predictionsMap: Record<string, "home" | "draw" | "away"> = {};
      
      userPredictions.forEach(p => {
        predictionsMap[p.matchId] = p.prediction;
      });
      
      setPredictions(predictionsMap);
    } catch (error) {
      console.error("Error loading predictions:", error);
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
        <h1 className="text-2xl font-bold mb-4">⚽ Fase de Grupos</h1>

        {/* Selector de Grupos */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {GROUPS.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`
                px-4 py-2 rounded-lg font-bold whitespace-nowrap
                ${selectedGroup === group 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300"
                }
              `}
            >
              Grupo {group}
            </button>
          ))}
        </div>

        {/* Lista de Partidos */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando partidos...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay partidos disponibles</p>
          </div>
        ) : (
          <div>
            {matches.map(match => (
              <MatchCard
                key={match.matchId}
                match={match}
                userAddress={user.address}
                existingPrediction={predictions[match.matchId]}
                onPredictionSaved={loadUserPredictions}
              />
            ))}
          </div>
        )}
      </main>

      <Footer userId={user.address} />
    </div>
  );
}
