"use client";

import { useState } from "react";
import WGoalBalance from "@/components/WGoalBalance";
import DailyRewardButton from "@/components/DailyRewardButton";
import { ToastContainer } from "@/components/Toast";
import { ConfettiCanvas } from "@/components/Confetti";
import {
  rewardPrediction,
  rewardFinalTop50,
  rewardJackpot,
} from "@/lib/rewards";

export default function TestRewardsPage() {
  const [balance, setBalance] = useState(42);
  const mockWallet = "0x1234...5678";

  const handleDailyClaimed = () => {
    setBalance((prev) => prev + 1);
  };

  const testGroupPrediction = async () => {
    const result = await rewardPrediction(mockWallet, "group");
    if (result.success) setBalance((prev) => prev + result.amount);
  };

  const testKnockoutPrediction = async () => {
    const result = await rewardPrediction(mockWallet, "knockout");
    if (result.success) setBalance((prev) => prev + result.amount);
  };

  const testFinalTop50 = async () => {
    const result = await rewardFinalTop50(mockWallet);
    if (result.success) setBalance((prev) => prev + result.amount);
  };

  const testJackpot = async () => {
    const result = await rewardJackpot(mockWallet);
    if (result.success) setBalance((prev) => prev + result.amount);
  };

  return (
    <>
      <ToastContainer />
      <ConfettiCanvas />
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            🎮 Test de Recompensas WGoal
          </h1>

          <WGoalBalance balance={balance} />

          <div className="bg-white rounded-xl p-6 shadow space-y-4">
            <h2 className="font-semibold text-lg mb-4">Recompensas Diarias</h2>
            <DailyRewardButton
              walletAddress={mockWallet}
              onClaimed={handleDailyClaimed}
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow space-y-4">
            <h2 className="font-semibold text-lg mb-4">
              Recompensas por Predicciones
            </h2>

            <button
              onClick={testGroupPrediction}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              ⚽ Fase de Grupos (+5 WGoal)
            </button>

            <button
              onClick={testKnockoutPrediction}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              🔥 Fase Eliminatoria (+5 WGoal)
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow space-y-4">
            <h2 className="font-semibold text-lg mb-4">Premios Especiales</h2>

            <button
              onClick={testFinalTop50}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
            >
              🏆 Final Top 50 (+10,000 WGoal)
            </button>

            <button
              onClick={testJackpot}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
            >
              🎰 PREMIO GORDO (+100,000 WGoal)
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">ℹ️ Modo de Prueba</p>
            <p>
              Las recompensas se muestran con toast notifications y confetti. Cuando la UI esté
              lista, se activarán las transacciones reales en World Chain.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
