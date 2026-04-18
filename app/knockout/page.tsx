"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PHASES = [
  { id: "round32", name: "Octavos" },
  { id: "round16", name: "Cuartos" },
  { id: "semi", name: "Semifinales" },
  { id: "third", name: "3er Lugar" },
  { id: "final", name: "Final" }
];

export default function KnockoutPage() {
  const [selectedPhase, setSelectedPhase] = useState("round32");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Tabs */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="flex overflow-x-auto p-2 gap-2">
            {PHASES.map(phase => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`
                  min-h-[44px]
                  px-4
                  py-2
                  rounded-lg
                  font-bold
                  whitespace-nowrap
                  transition-all
                  ${selectedPhase === phase.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {phase.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            {PHASES.find(p => p.id === selectedPhase)?.name}
          </h2>

          <div className="bg-white rounded-lg p-6 shadow text-center text-gray-500">
            <p>Los partidos de {PHASES.find(p => p.id === selectedPhase)?.name}</p>
            <p className="text-sm mt-2">se cargarán próximamente</p>
          </div>
        </div>
      </main>

      <Footer userId="user-demo-123" />
    </div>
  );
}
