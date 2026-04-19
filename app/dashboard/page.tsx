"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyRewardModal from "@/components/modals/DailyRewardModal";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [streak] = useState(1);
  const [showModal, setShowModal] = useState(true);

  const handleRewardClaimed = () => {
    setShowModal(false);
    setBalance(prev => prev + 1);
  };

  return (
    <>
      <DailyRewardModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleRewardClaimed}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1 p-4">
          {/* Balance */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-3xl font-bold text-blue-600">
                  {balance} WGoal
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Racha</p>
                <p className="text-3xl font-bold text-orange-600">
                  {streak} día
                </p>
              </div>
            </div>
          </div>

          {/* Próximos partidos */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-3">Próximos Partidos</h2>
            <div className="bg-white rounded-lg p-4 shadow text-center text-gray-500">
              <p>Los partidos se cargarán próximamente</p>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="space-y-3">
            <a
              href="/groups"
              className="
                block
                w-full
                min-h-[44px]
                px-6
                py-3
                bg-blue-600
                text-white
                text-center
                font-bold
                rounded-lg
                active:scale-95
                transition-transform
              "
            >
              Ver Fase de Grupos
            </a>

            <a
              href="/knockout"
              className="
                block
                w-full
                min-h-[44px]
                px-6
                py-3
                bg-purple-600
                text-white
                text-center
                font-bold
                rounded-lg
                active:scale-95
                transition-transform
              "
            >
              Ver Eliminatorias
            </a>
          </div>
        </main>

        <Footer userId="user-demo-123" />
      </div>
    </>
  );
}
