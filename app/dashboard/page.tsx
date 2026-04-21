"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyRewardModal from "@/components/modals/DailyRewardModal";
import PaymentModal from "@/components/modals/PaymentModal";
import { getUser, hasClaimedDailyReward, getUserStreak } from "@/lib/database/users";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      const userData = localStorage.getItem("tribia_user");
      
      if (!userData) {
        router.push("/");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const dbUser = await getUser(parsedUser.address);
      
      if (!dbUser) {
        router.push("/");
        return;
      }

      if (!dbUser.welcomeReceived) {
        setShowWelcomeModal(true);
      } else {
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
      const { markWelcomeReceived } = await import("@/lib/database/users");
      await markWelcomeReceived(user.address);
    }
  };

  const handleDailyRewardClaimed = async () => {
    setShowDailyModal(false);
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

        <main className="flex-1 flex items-center justify-center p-4">
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </main>

        <Footer userId={user.address} />
      </div>
    </>
  );
}
