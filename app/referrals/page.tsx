"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Generar código único basado en timestamp y random
const generateReferralCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRIB-${timestamp.slice(-4)}${random}`;
};

interface ReferredUser {
  id: string;
  username: string;
  date: string;
  reward: number;
}

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [hasUsedCode, setHasUsedCode] = useState(false);

  // Generar código único al cargar
  useEffect(() => {
    const savedCode = localStorage.getItem("userReferralCode");
    if (savedCode) {
      setReferralCode(savedCode);
    } else {
      const newCode = generateReferralCode();
      setReferralCode(newCode);
      localStorage.setItem("userReferralCode", newCode);
    }

    // Cargar usuarios referidos (simulado)
    const savedReferrals = localStorage.getItem("referredUsers");
    if (savedReferrals) {
      setReferredUsers(JSON.parse(savedReferrals));
    }

    // Verificar si ya usó un código
    const usedCode = localStorage.getItem("hasUsedReferralCode");
    setHasUsedCode(usedCode === "true");
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitReferralCode = () => {
    if (!inputCode.trim()) {
      alert("❌ Ingresa un código de referido");
      return;
    }

    if (inputCode === referralCode) {
      alert("❌ No puedes usar tu propio código");
      return;
    }

    if (hasUsedCode) {
      alert("❌ Ya has usado un código de referido");
      return;
    }

    // Guardar que ya usó un código
    localStorage.setItem("hasUsedReferralCode", "true");
    localStorage.setItem("usedReferralCode", inputCode);
    setHasUsedCode(true);
    alert(`✅ Código ${inputCode} aplicado!\n\n+10 WGoal para ti\n+10 WGoal para tu referidor`);
    setInputCode("");
  };

  const totalRewards = referredUsers.reduce((sum, user) => sum + user.reward, 0);

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

        {/* Tu Código */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <p className="text-sm text-gray-600 mb-2">Tu código de referido:</p>
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
                text-lg
              "
            />
            <button
              onClick={copyCode}
              className={`
                min-h-[44px]
                px-4
                ${copied ? "bg-green-600" : "bg-blue-600"}
                text-white
                rounded-lg
                font-bold
                active:scale-95
                transition-all
              `}
            >
              {copied ? "✓" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Ingresar Código de Referido */}
        {!hasUsedCode && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow">
            <p className="text-sm text-gray-600 mb-2">¿Tienes un código de referido?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="TRIB-XXXX"
                className="
                  flex-1
                  min-h-[44px]
                  px-4
                  py-2
                  border-2
                  border-gray-300
                  rounded-lg
                  font-mono
                  text-center
                  focus:border-blue-600
                  focus:outline-none
                "
              />
              <button
                onClick={submitReferralCode}
                className="
                  min-h-[44px]
                  px-4
                  bg-green-600
                  text-white
                  rounded-lg
                  font-bold
                  active:scale-95
                  transition-transform
                "
              >
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Referidos</p>
              <p className="text-2xl font-bold">{referredUsers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">WGoal ganados</p>
              <p className="text-2xl font-bold text-green-600">{totalRewards}</p>
            </div>
          </div>
        </div>

        {/* Lista de Usuarios Referidos */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="font-bold text-lg mb-3">Tus Referidos</h2>
          {referredUsers.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              Aún no has referido a nadie
            </p>
          ) : (
            <div className="space-y-2">
              {referredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{user.reward} WGoal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer userId="user-demo-123" />
    </div>
  );
}
