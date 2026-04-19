"use client";

import { rewardDailyLogin } from "@/lib/rewards";
import { useState } from "react";

interface DailyRewardButtonProps {
  walletAddress: string;
  onClaimed?: () => void;
}

export default function DailyRewardButton({
  walletAddress,
  onClaimed,
}: DailyRewardButtonProps) {
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    const result = await rewardDailyLogin(walletAddress);
    setLoading(false);

    if (result.success) {
      setClaimed(true);
      onClaimed?.();
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={claimed || loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
    >
      {loading ? "⏳ Procesando..." : claimed ? "✅ Reclamado hoy" : "🎁 Reclamar 1 WGoal diario"}
    </button>
  );
}
