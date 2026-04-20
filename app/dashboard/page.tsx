"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyRewardModal from "@/components/modals/DailyRewardModal";
import PaymentModal from "@/components/modals/PaymentModal";
import ReferralSystem from "@/components/ReferralSystem";
import { getWGoalBalance } from "@/lib/rewards";
import { getUser, hasClaimedDailyReward, getUserStreak } from "@/lib/database/users";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      // Verificar autenticación
      const userData = localStorage.getItem("tribia_user");
      
      if (!userData) {
        router.push("/");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Cargar datos del usuario desde Firebase
      const dbUser = await getUser(parsedUser.address);
      
      if (!dbUser) {
        // Usuario no existe en Firebase, redirigir a home
        router.push("/");
        return;
      }

      // Cargar balance real del contrato
      const realBalance = await getWGoalBalance(parsedUser.address);
      setBalance(realBalance);

      // Cargar racha
      const userStreak = await getUserStreak(parsedUser.address);
      setStreak(userStreak);

      // Verificar si es primera vez (no ha recibido bienvenida)
      if (!dbUser.welcomeReceived) {
        setShowWelcomeModal(true);
      } else {
        // Verificar si ya reclamó el reward diario de hoy
        const alreadyClaimed = await hasClaimedDailyReward(parsedUser.address);
        
        if (!alreadyClaimed) {
          setShowDailyModal(true);
        }
      }
    };

    initDashboard();
  }, [router]);

  const handleWelcomeComplete = async () => {
    setShowWelcomeModal(false);
    
    if (user) {
      // Marcar bienvenida como recibida en Firebase
      const { markWelcomeReceived } = await import("@/lib/database/users");
      await markWelcomeReceived(user.address);
      
      // Recargar balance real
      const realBalance = await getWGoalBalance(user.address);
      setBalance(realBalance);
    }
  };

  const handleDailyRewardClaimed = async () => {
    setShowDailyModal(false);
    
    if (user) {
      // Recargar balance real
      const realBalance = await getWGoalBalance(user.address);
      setBalance(realBalance);
      
      // Recargar racha
      const userStreak = await getUserStreak(user.address);
      setStreak(userStreak);
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
    <>
      {/* Modal de Bienvenida - Primer pago */}
      <PaymentModal
        open={showWelcomeModal}
        onClose={() => {}}
        amount={1}
        description="🎉 ¡Bienvenido a Tribia!"
        onSuccess={handleWelcomeComplete}
      />

      {/* Modal de Recompensa Diaria */}
      <DailyRewardModal
        open={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        onSuccess={handleDailyRewardClaimed}
        userAddress={user.address}
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

          {/* Sistema de Referidos */}
          <div className="mb-4">
            <ReferralSystem walletAddress={user.address} />
          </div>

          {/* Botones de navegación */}
          <div className="space-y-3">
            <a
              href="/jackpot"
              className="
                block
                w-full
                min-h-[60px]
                px-6
                py-4
                bg-gradient-to-r from-purple-600 to-pink-600
                text-white
                text-center
                font-bold
                text-lg
                rounded-lg
                active:scale-95
                transition-transform
                shadow-lg
              "
            >
              🎰 PREMIO GORDO - 1,000,000 WGoal
            </a>

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

        <Footer userId={user.address} />
      </div>
    </>
  );
}
