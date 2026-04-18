"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReferralsPage() {
  const [referralCode] = useState("TRIBIA-ABC123");

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("✅ Código copiado al portapapeles");
  };

  const shareCode = () => {
    alert("🎁 Compartir en World Chat\n\n(Función disponible en producción)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-4">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-4">
          <h1 className="text-2xl font-bold mb-2">🎁 Invita Amigos</h1>
          <p className="text-white/90">
            Gana 10 WGoal por cada amigo
          </p>
          <p className="text-white/90">
            Tu amigo también recibe 10 WGoal
          </p>
        </div>

        {/* Código */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <p className="text-sm text-gray-600 mb-2">Tu código:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="
                flex-1
                min-h-[44px]
                px-4
                py-2
                bg-gray-100
                rounded-lg
                font-mono
                font-bold
                text-center
              "
            />
            <button
              onClick={copyCode}
              className="
                min-h-[44px]
                px-4
                bg-blue-600
                text-white
                rounded-lg
                font-bold
                active:scale-95
                transition-transform
              "
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Compartir */}
        <button
          onClick={shareCode}
          className="
            w-full
            min-h-[44px]
            px-6
            py-3
            bg-green-600
            text-white
            font-bold
            rounded-lg
            active:scale-95
            transition-transform
            mb-4
          "
        >
          Compartir en World Chat
        </button>

        {/* Estadísticas */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Referidos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">WGoal ganados</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm">
            Aún no has referido a nadie
          </p>
        </div>
      </main>

      <Footer userId="user-demo-123" />
    </div>
  );
}
