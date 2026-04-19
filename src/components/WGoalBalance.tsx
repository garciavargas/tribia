"use client";

import AnimatedCounter from "./AnimatedCounter";

interface WGoalBalanceProps {
  balance: number;
}

export default function WGoalBalance({ balance }: WGoalBalanceProps) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg animate-bounce-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Tu balance</p>
          <p className="text-4xl font-bold mt-1">
            <AnimatedCounter value={balance} />
          </p>
          <p className="text-sm mt-1 opacity-90">WGoal</p>
        </div>
        <div className="text-6xl">⚽</div>
      </div>
    </div>
  );
}
