# 🎨 FLUJO COMPLETO UI/UX - TRIBIA

## 📋 Índice

1. [Tokenomics](#tokenomics)
2. [Pantalla de Carga](#pantalla-de-carga)
3. [Modal de Conexión](#modal-de-conexión)
4. [Dashboard Principal](#dashboard-principal)
5. [Fase de Grupos](#fase-de-grupos)
6. [Fase Eliminatoria](#fase-eliminatoria)
7. [Sistema de Referidos](#sistema-de-referidos)
8. [Componentes Globales](#componentes-globales)
9. [Base de Datos Actualizada](#base-de-datos-actualizada)

---

## 💰 Tokenomics - 100,000,000 WGoal

### Distribución Total

```typescript
const TOKENOMICS = {
  totalSupply: 100_000_000, // 100 millones de WGoal
  
  distribution: {
    // Premios del juego
    gamePrizes: 50_000_000,      // 50% - Premios de predicciones
    dailyLogin: 20_000_000,      // 20% - Login diario
    referrals: 10_000_000,       // 10% - Sistema de referidos
    marketing: 10_000_000,       // 10% - Marketing y partnerships
    team: 5_000_000,             // 5% - Equipo
    reserve: 5_000_000,          // 5% - Reserva
  }
};
```

### Cálculo de Premios del Juego

```typescript
const GAME_PRIZES = {
  // Fase de grupos (48 partidos)
  groupStage: {
    perMatch: 5,
    totalMatches: 48,
    estimatedUsers: 100_000,
    winRate: 0.30, // 30% de aciertos
    total: 48 * 5 * 100_000 * 0.30, // = 7,200,000 WGoal
  },
  
  // Fase eliminatoria (15 partidos)
  knockout: {
    perMatch: 5,
    totalMatches: 15,
    estimatedUsers: 200_000,
    winRate: 0.25,
    total: 15 * 5 * 200_000 * 0.25, // = 3,750,000 WGoal
  },
  
  // Final - Premios simples
  finalSimple: {
    perWinner: 10_000,
    maxWinners: 50,
    total: 10_000 * 50, // = 500,000 WGoal
  },
  
  // Final - Premio gordo
  finalJackpot: {
    total: 100_000, // = 100,000 WGoal
  },
  
  // Total estimado
  totalEstimated: 11_550_000, // ~11.5 millones
};

// Sobran: 50,000,000 - 11,550,000 = 38,450,000 WGoal
// ✅ Suficiente para expansión futura
```

### Login Diario

```typescript
const DAILY_LOGIN = {
  perUser: 1,
  estimatedUsers: 500_000,
  averageDays: 40, // 40 días de actividad promedio
  total: 1 * 500_000 * 40, // = 20,000,000 WGoal
};
```

### Sistema de Referidos

```typescript
const REFERRALS = {
  rewardPerReferral: 10, // 10 WGoal para ambos
  estimatedReferrals: 500_000,
  total: 10 * 2 * 500_000, // = 10,000,000 WGoal
};
```

### Resumen

```
Total Supply:        100,000,000 WGoal
Premios del juego:    11,550,000 WGoal (11.5%)
Login diario:         20,000,000 WGoal (20%)
Referidos:            10,000,000 WGoal (10%)
Marketing:            10,000,000 WGoal (10%)
Team:                  5,000,000 WGoal (5%)
Reserve:               5,000,000 WGoal (5%)
Buffer:               38,450,000 WGoal (38.5%)

✅ Sobran 38.5 millones para expansión futura
```

---

## 🎬 Pantalla de Carga (Splash Screen)

### Diseño

**Carrusel de 3 imágenes con barra de progreso**

```
┌─────────────────────────────────────┐
│                                     │
│         [Imagen 1/2/3]              │
│       (Fondo completo)              │
│                                     │
│                                     │
│     ⚽ Tribia                        │
│     Predice el Mundial 2026         │
│                                     │
│     ┌─────────────────────┐         │
│     │████████░░░░░░░░░░░░░│ 45%     │
│     └─────────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

### Componente: LoadingScreen

**Archivo: `components/LoadingScreen.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  {
    image: "/pagina1.png",
    title: "Predice el Mundial 2026",
    subtitle: "Gana hasta 100,000 WGoal"
  },
  {
    image: "/pagina2.png",
    title: "Solo Usuarios Verificados",
    subtitle: "Conecta con World ID"
  },
  {
    image: "/paginatoken.png",
    title: "1 WGoal Gratis Diario",
    subtitle: "Inicia sesión cada día"
  }
];

export default function LoadingScreen({ 
  onComplete 
}: { 
  onComplete: () => void 
}) {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 2000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-600 to-blue-900">
      {/* Carrusel de imágenes */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-opacity duration-500
              ${index === currentSlide ? "opacity-100" : "opacity-0"}
            `}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      {/* Overlay con contenido */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            ⚽ Tribia
          </h1>
          <p className="text-xl text-white/90">
            {SLIDES[currentSlide].subtitle}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full max-w-sm">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white text-center mt-2 text-sm">
            {progress}%
          </p>
        </div>

        {/* Indicadores de slides */}
        <div className="flex gap-2 mt-4">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentSlide 
                  ? "bg-white w-6" 
                  : "bg-white/50"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔐 Modal de Conexión

### Diseño

```
┌─────────────────────────────────────┐
│                                     │
│         [X]                         │
│                                     │
│     🌍                              │
│     Conecta con World ID            │
│                                     │
│     Solo usuarios verificados       │
│     pueden jugar en Tribia          │
│                                     │
│     ┌─────────────────────┐         │
│     │ Conectar Wallet     │         │
│     └─────────────────────┘         │
│                                     │
│     ✅ Verificación con Orb         │
│     ✅ 1 WGoal gratis               │
│     ✅ Premios hasta 100k           │
│                                     │
└─────────────────────────────────────┘
```

### Componente: ConnectModal

**Archivo: `components/ConnectModal.tsx`**

```typescript
"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: string) => void;
}

export default function ConnectModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: ConnectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setLoading(true);
    setError("");

    try {
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: Math.random().toString(36).substring(7),
        requestId: `tribia-${Date.now()}`,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
      });

      if (finalPayload.status === "success") {
        // Verificar World ID
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: finalPayload.address,
            signature: finalPayload.signature
          })
        });

        const data = await response.json();

        if (!data.verified) {
          setError("Debes verificarte con Orb para jugar");
          return;
        }

        onSuccess(finalPayload.address);
      }
    } catch (err) {
      setError("Error al conectar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="float-right text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Contenido */}
        <div className="text-center mt-4">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-2">
            Conecta con World ID
          </h2>
          <p className="text-gray-600 mb-6">
            Solo usuarios verificados pueden jugar en Tribia
          </p>

          {/* Botón de conexión */}
          <button
            onClick={handleConnect}
            disabled={loading}
            className="
              w-full
              min-h-[44px]
              px-6
              py-3
              bg-blue-600
              text-white
              font-bold
              rounded-lg
              active:scale-95
              transition-transform
              disabled:opacity-50
              mb-4
            "
          >
            {loading ? "Conectando..." : "Conectar Wallet"}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          {/* Beneficios */}
          <div className="text-left space-y-2 text-sm text-gray-600">
            <p>✅ Verificación con Orb obligatoria</p>
            <p>✅ 1 WGoal gratis por día</p>
            <p>✅ Premios hasta 100,000 WGoal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

*Continúa en la siguiente parte...*

## 📱 Dashboard Principal

### Diseño

```
┌─────────────────────────────────────┐
│ Header (Anuncios de premios)        │
├─────────────────────────────────────┤
│                                     │
│  💰 Balance: 25 WGoal               │
│  🔥 Racha: 5 días                   │
│                                     │
│  ┌─────────────────────┐            │
│  │ Próximos Partidos   │            │
│  │                     │            │
│  │ [Partido 1]         │            │
│  │ [Partido 2]         │            │
│  │ [Partido 3]         │            │
│  └─────────────────────┘            │
│                                     │
│  ┌─────────────────────┐            │
│  │ Mis Predicciones    │            │
│  │ 15 activas          │            │
│  └─────────────────────┘            │
│                                     │
├─────────────────────────────────────┤
│ Footer (Usuario + Referidos)        │
└─────────────────────────────────────┘
```

### Componente: Dashboard

**Archivo: `app/dashboard/page.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatchCard from "@/components/MatchCard";

interface User {
  id: string;
  walletAddress: string;
  totalWGoal: number;
  dailyLoginStreak: number;
}

interface Match {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  group: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, matchesRes] = await Promise.all([
        fetch("/api/user/me"),
        fetch("/api/matches/upcoming")
      ]);

      const userData = await userRes.json();
      const matchesData = await matchesRes.json();

      setUser(userData.user);
      setMatches(matchesData.matches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Cargando...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-4">
        {/* Balance */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-3xl font-bold text-blue-600">
                {user?.totalWGoal} WGoal
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Racha</p>
              <p className="text-3xl font-bold text-orange-600">
                {user?.dailyLoginStreak} días
              </p>
            </div>
          </div>
        </div>

        {/* Próximos partidos */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-3">Próximos Partidos</h2>
          <div className="space-y-3">
            {matches.slice(0, 5).map(match => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </div>

        {/* Ver todos los grupos */}
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
          Ver Todos los Grupos
        </a>
      </main>

      <Footer userId={user?.id || ""} />
    </div>
  );
}
```

---

## ⚽ Fase de Grupos

### Diseño

```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│                                     │
│  [A][B][C][D][E][F][G][H][I][J][K][L]│
│  ─────                              │
│                                     │
│  Grupo A                            │
│                                     │
│  📅 11 Jun - 19:00                  │
│  ┌─────────────────────┐            │
│  │ 🇲🇽 México          │            │
│  │      vs             │            │
│  │ 🇿🇦 Sudáfrica       │            │
│  │                     │            │
│  │ [ ] México gana     │            │
│  │ [ ] Empate          │            │
│  │ [ ] Sudáfrica gana  │            │
│  │                     │            │
│  │ [Predecir]          │            │
│  └─────────────────────┘            │
│                                     │
│  📅 11 Jun - 22:00                  │
│  [Partido 2...]                     │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Componente: GroupsPage

**Archivo: `app/groups/page.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GroupTab from "@/components/GroupTab";
import MatchCard from "@/components/MatchCard";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState("A");
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadMatches(selectedGroup);
  }, [selectedGroup]);

  const loadMatches = async (group: string) => {
    const res = await fetch(`/api/matches/group/${group}`);
    const data = await res.json();
    setMatches(data.matches);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Tabs de grupos */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="flex overflow-x-auto p-2 gap-2">
            {GROUPS.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`
                  min-w-[44px]
                  min-h-[44px]
                  px-4
                  py-2
                  rounded-lg
                  font-bold
                  transition-all
                  ${selectedGroup === group
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Partidos del grupo */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            Grupo {selectedGroup}
          </h2>

          <div className="space-y-4">
            {matches.map((match: any) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </div>
      </main>

      <Footer userId={userId} />
    </div>
  );
}
```

### Componente: MatchCard (Mejorado)

**Archivo: `components/MatchCard.tsx`**

```typescript
"use client";

import { useState } from "react";

interface MatchCardProps {
  match: {
    matchId: string;
    homeTeam: string;
    awayTeam: string;
    matchDate: Date;
    venue: string;
    status: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState(false);

  const handlePredict = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const res = await fetch("/api/predictions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.matchId,
          prediction: selected
        })
      });

      if (res.ok) {
        setPredicted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      {/* Fecha y hora */}
      <div className="text-sm text-gray-600 mb-3">
        📅 {formatDate(match.matchDate)}
      </div>

      {/* Equipos */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <p className="font-bold text-lg">{match.homeTeam}</p>
        </div>
        <div className="text-gray-400 px-4 font-bold">vs</div>
        <div className="text-center flex-1">
          <p className="font-bold text-lg">{match.awayTeam}</p>
        </div>
      </div>

      {/* Opciones de predicción */}
      {!predicted ? (
        <>
          <div className="space-y-2 mb-4">
            <button
              onClick={() => setSelected("home")}
              className={`
                w-full
                min-h-[44px]
                px-4
                py-2
                rounded-lg
                font-medium
                transition-all
                ${selected === "home"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {match.homeTeam} gana
            </button>

            <button
              onClick={() => setSelected("draw")}
              className={`
                w-full
                min-h-[44px]
                px-4
                py-2
                rounded-lg
                font-medium
                transition-all
                ${selected === "draw"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }
              `}
            >
              Empate
            </button>

            <button
              onClick={() => setSelected("away")}
              className={`
                w-full
                min-h-[44px]
                px-4
                py-2
                rounded-lg
                font-medium
                transition-all
                ${selected === "away"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {match.awayTeam} gana
            </button>
          </div>

          {/* Botón confirmar */}
          <button
            onClick={handlePredict}
            disabled={!selected || loading}
            className="
              w-full
              min-h-[44px]
              px-4
              py-2
              bg-green-600
              text-white
              font-bold
              rounded-lg
              active:scale-95
              transition-transform
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Guardando..." : "Confirmar Predicción"}
          </button>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-green-600 font-bold">
            ✅ Predicción guardada
          </p>
        </div>
      )}
    </div>
  );
}
```

---

*Continúa en la siguiente parte...*

## 🏆 Fase Eliminatoria

### Estructura

```
Octavos de Final (16 equipos → 8)
Cuartos de Final (8 equipos → 4)
Semifinales (4 equipos → 2)
Tercer Lugar (2 equipos perdedores de semis)
Final (2 equipos)
```

### Diseño del Bracket

```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│                                     │
│  [Octavos][Cuartos][Semis][Final]  │
│  ────────                           │
│                                     │
│  Octavos de Final                   │
│                                     │
│  ┌─────────────────────┐            │
│  │ 🇧🇷 Brasil          │            │
│  │      vs             │            │
│  │ 🇦🇷 Argentina       │            │
│  │                     │            │
│  │ ¿Quién avanza?      │            │
│  │                     │            │
│  │ [ ] Brasil          │            │
│  │ [ ] Argentina       │            │
│  │                     │            │
│  │ [Predecir]          │            │
│  └─────────────────────┘            │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Componente: KnockoutPage

**Archivo: `app/knockout/page.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KnockoutMatch from "@/components/KnockoutMatch";

const PHASES = [
  { id: "round32", name: "Octavos", matches: 8 },
  { id: "round16", name: "Cuartos", matches: 4 },
  { id: "semi", name: "Semifinales", matches: 2 },
  { id: "third", name: "3er Lugar", matches: 1 },
  { id: "final", name: "Final", matches: 1 }
];

export default function KnockoutPage() {
  const [selectedPhase, setSelectedPhase] = useState("round32");
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadMatches(selectedPhase);
  }, [selectedPhase]);

  const loadMatches = async (phase: string) => {
    const res = await fetch(`/api/matches/knockout/${phase}`);
    const data = await res.json();
    setMatches(data.matches);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Tabs de fases */}
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

        {/* Partidos */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            {PHASES.find(p => p.id === selectedPhase)?.name}
          </h2>

          <div className="space-y-4">
            {matches.map((match: any) => (
              <KnockoutMatch key={match.matchId} match={match} />
            ))}
          </div>
        </div>
      </main>

      <Footer userId={userId} />
    </div>
  );
}
```

### Componente: KnockoutMatch

**Archivo: `components/KnockoutMatch.tsx`**

```typescript
"use client";

import { useState } from "react";

interface KnockoutMatchProps {
  match: {
    matchId: string;
    team1: string;
    team2: string;
    matchDate: Date;
    venue: string;
  };
}

export default function KnockoutMatch({ match }: KnockoutMatchProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState(false);

  const handlePredict = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const res = await fetch("/api/predictions/knockout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.matchId,
          prediction: selected
        })
      });

      if (res.ok) {
        setPredicted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      {/* Fecha */}
      <div className="text-sm text-gray-600 mb-3">
        📅 {new Date(match.matchDate).toLocaleDateString("es-MX", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>

      {/* Equipos */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <p className="font-bold text-lg">{match.team1}</p>
        </div>
        <div className="text-gray-400 px-4 font-bold">vs</div>
        <div className="text-center flex-1">
          <p className="font-bold text-lg">{match.team2}</p>
        </div>
      </div>

      {/* Pregunta */}
      <p className="text-center text-gray-600 mb-4 font-medium">
        ¿Quién avanza a la siguiente ronda?
      </p>

      {/* Opciones */}
      {!predicted ? (
        <>
          <div className="space-y-2 mb-4">
            <button
              onClick={() => setSelected("team1")}
              className={`
                w-full
                min-h-[44px]
                px-4
                py-2
                rounded-lg
                font-medium
                transition-all
                ${selected === "team1"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {match.team1} avanza
            </button>

            <button
              onClick={() => setSelected("team2")}
              className={`
                w-full
                min-h-[44px]
                px-4
                py-2
                rounded-lg
                font-medium
                transition-all
                ${selected === "team2"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {match.team2} avanza
            </button>
          </div>

          <button
            onClick={handlePredict}
            disabled={!selected || loading}
            className="
              w-full
              min-h-[44px]
              px-4
              py-2
              bg-green-600
              text-white
              font-bold
              rounded-lg
              active:scale-95
              transition-transform
              disabled:opacity-50
            "
          >
            {loading ? "Guardando..." : "Confirmar Predicción"}
          </button>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-green-600 font-bold">
            ✅ Predicción guardada
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 🎁 Sistema de Referidos

### Mecánica

- Usuario comparte su código de referido
- Nuevo usuario se registra con el código
- **Ambos reciben 10 WGoal**

### Diseño

```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│                                     │
│  🎁 Invita Amigos                   │
│                                     │
│  Gana 10 WGoal por cada amigo       │
│  Tu amigo también recibe 10 WGoal   │
│                                     │
│  Tu código:                         │
│  ┌─────────────────────┐            │
│  │ TRIBIA-ABC123       │ [Copiar]   │
│  └─────────────────────┘            │
│                                     │
│  [Compartir en World Chat]          │
│                                     │
│  ─────────────────────              │
│                                     │
│  Referidos: 5                       │
│  WGoal ganados: 50                  │
│                                     │
│  📋 Historial:                      │
│  • Juan - 10 WGoal                  │
│  • María - 10 WGoal                 │
│  • Pedro - 10 WGoal                 │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Componente: ReferralsPage

**Archivo: `app/referrals/page.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Referral {
  id: string;
  referredUser: string;
  reward: number;
  createdAt: Date;
}

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    const res = await fetch("/api/referrals/me");
    const data = await res.json();
    
    setReferralCode(data.referralCode);
    setReferrals(data.referrals);
    setTotalRewards(data.totalRewards);
    setUserId(data.userId);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Código copiado!");
  };

  const shareInWorldChat = async () => {
    await MiniKit.commands.share({
      message: `¡Únete a Tribia y predice el Mundial 2026! Usa mi código ${referralCode} y ambos ganamos 10 WGoal 🎁⚽`
    });
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

        {/* Código de referido */}
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

        {/* Botón compartir */}
        <button
          onClick={shareInWorldChat}
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
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Referidos</p>
              <p className="text-2xl font-bold">{referrals.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">WGoal ganados</p>
              <p className="text-2xl font-bold text-green-600">
                {totalRewards}
              </p>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="font-bold mb-3">📋 Historial</h2>
          {referrals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Aún no has referido a nadie
            </p>
          ) : (
            <div className="space-y-2">
              {referrals.map(ref => (
                <div
                  key={ref.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <span className="text-gray-700">
                    {ref.referredUser.slice(0, 8)}...
                  </span>
                  <span className="text-green-600 font-bold">
                    +{ref.reward} WGoal
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer userId={userId} />
    </div>
  );
}
```

---

*Continúa en la siguiente parte...*

## 🧩 Componentes Globales

### Header (Anuncios de Premios)

**Archivo: `components/Header.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    const res = await fetch("/api/announcements/latest");
    const data = await res.json();
    setAnnouncement(data.message);
  };

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      {/* Anuncio de premio gordo */}
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-2 px-4">
          <span className="text-sm font-bold">
            🏆 {announcement || "¡Premio gordo de 100,000 WGoal en la final!"}
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <a href="/dashboard" className="text-xl font-bold text-blue-600">
            ⚽ Tribia
          </a>

          <div className="flex gap-2">
            <a
              href="/groups"
              className="
                min-h-[44px]
                px-4
                py-2
                bg-gray-100
                text-gray-700
                rounded-lg
                font-medium
                active:scale-95
                transition-transform
              "
            >
              Grupos
            </a>
            <a
              href="/knockout"
              className="
                min-h-[44px]
                px-4
                py-2
                bg-gray-100
                text-gray-700
                rounded-lg
                font-medium
                active:scale-95
                transition-transform
              "
            >
              Eliminatorias
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
```

**Agregar animación en `tailwind.config.ts`:**

```typescript
export default {
  theme: {
    extend: {
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
};
```

### Footer (Usuario + Referidos)

**Archivo: `components/Footer.tsx`**

```typescript
"use client";

interface FooterProps {
  userId: string;
}

export default function Footer({ userId }: FooterProps) {
  return (
    <footer className="bg-white border-t">
      <div className="p-4">
        {/* Usuario conectado */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            Usuario: <span className="font-mono">{userId.slice(0, 8)}...</span>
          </div>
          <a
            href="/profile"
            className="text-blue-600 text-sm font-medium"
          >
            Ver perfil
          </a>
        </div>

        {/* Botón de referidos */}
        <a
          href="/referrals"
          className="
            block
            w-full
            min-h-[44px]
            px-4
            py-2
            bg-gradient-to-r
            from-purple-600
            to-pink-600
            text-white
            text-center
            font-bold
            rounded-lg
            active:scale-95
            transition-transform
          "
        >
          🎁 Invita amigos y gana 10 WGoal
        </a>
      </div>

      {/* Links */}
      <div className="border-t p-4">
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <a href="/terms" className="hover:text-blue-600">
            Términos
          </a>
          <a href="/privacy" className="hover:text-blue-600">
            Privacidad
          </a>
          <a href="/help" className="hover:text-blue-600">
            Ayuda
          </a>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          © 2026 Tribia. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
```

---

## 🗄️ Base de Datos Actualizada

### Schema Completo con Referidos

**Archivo: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String   @id @default(cuid())
  walletAddress     String   @unique
  worldId           String?
  username          String?
  referralCode      String   @unique @default(cuid())
  referredBy        String?  // Código de quien lo refirió
  totalWGoal        Float    @default(0)
  dailyLoginStreak  Int      @default(0)
  lastLoginDate     DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  predictions       Prediction[]
  finalPredictions  FinalPrediction[]
  referrals         Referral[] @relation("Referrer")
  referredFrom      Referral[] @relation("Referred")
}

model Match {
  id          String   @id @default(cuid())
  matchId     String   @unique
  phase       String   // "group", "round32", "round16", "quarter", "semi", "third", "final"
  group       String?  // A-L (solo fase de grupos)
  homeTeam    String
  awayTeam    String
  matchDate   DateTime
  venue       String
  homeScore   Int?
  awayScore   Int?
  winner      String?  // "home", "away", "draw"
  decidedBy   String?  // "normal", "extra", "penalties"
  status      String   @default("scheduled") // "scheduled", "live", "finished"
  
  predictions Prediction[]
}

model Prediction {
  id            String   @id @default(cuid())
  userId        String
  matchId       String
  prediction    String   // "home", "draw", "away" (grupos) o "team1", "team2" (eliminatorias)
  timestamp     DateTime @default(now())
  isCorrect     Boolean?
  rewardClaimed Boolean  @default(false)
  
  user          User     @relation(fields: [userId], references: [id])
  match         Match    @relation(fields: [matchId], references: [id])
  
  @@unique([userId, matchId])
}

model FinalPrediction {
  id            String   @id @default(cuid())
  userId        String   @unique
  champion      String
  decidedBy     String?  // "normal", "extra", "penalties"
  homeScore     Int?
  awayScore     Int?
  timestamp     DateTime @default(now())
  isCorrect     Boolean?
  rewardAmount  Float?
  rewardClaimed Boolean  @default(false)
  
  user          User     @relation(fields: [userId], references: [id])
}

model Referral {
  id            String   @id @default(cuid())
  referrerId    String
  referredId    String
  reward        Float    @default(10) // 10 WGoal para ambos
  claimed       Boolean  @default(false)
  createdAt     DateTime @default(now())
  
  referrer      User     @relation("Referrer", fields: [referrerId], references: [id])
  referred      User     @relation("Referred", fields: [referredId], references: [id])
  
  @@unique([referrerId, referredId])
}

model Announcement {
  id        String   @id @default(cuid())
  message   String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migraciones

```bash
# Crear migración
npx prisma migrate dev --name add_referrals_and_announcements

# Aplicar en producción
npx prisma migrate deploy
```

---

## 🔄 API Routes para Referidos

### Crear Referido

**Archivo: `app/api/referrals/create/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWGoal } from "@/lib/rewards";

export async function POST(req: NextRequest) {
  const { userId, referralCode } = await req.json();

  // Buscar usuario que refirió
  const referrer = await prisma.user.findUnique({
    where: { referralCode }
  });

  if (!referrer) {
    return NextResponse.json(
      { error: "Código de referido inválido" },
      { status: 400 }
    );
  }

  // No puede referirse a sí mismo
  if (referrer.id === userId) {
    return NextResponse.json(
      { error: "No puedes usar tu propio código" },
      { status: 400 }
    );
  }

  // Verificar que no exista referido previo
  const existing = await prisma.referral.findUnique({
    where: {
      referrerId_referredId: {
        referrerId: referrer.id,
        referredId: userId
      }
    }
  });

  if (existing) {
    return NextResponse.json(
      { error: "Ya usaste este código" },
      { status: 400 }
    );
  }

  // Crear referido
  const referral = await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredId: userId,
      reward: 10
    }
  });

  // Dar 10 WGoal a ambos
  const [referrerUser, referredUser] = await Promise.all([
    prisma.user.findUnique({ where: { id: referrer.id } }),
    prisma.user.findUnique({ where: { id: userId } })
  ]);

  if (referrerUser && referredUser) {
    await Promise.all([
      sendWGoal(referrerUser.walletAddress, 10, "Referido exitoso"),
      sendWGoal(referredUser.walletAddress, 10, "Bienvenida por referido"),
      prisma.user.update({
        where: { id: referrer.id },
        data: { totalWGoal: { increment: 10 } }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { 
          totalWGoal: { increment: 10 },
          referredBy: referralCode
        }
      }),
      prisma.referral.update({
        where: { id: referral.id },
        data: { claimed: true }
      })
    ]);
  }

  return NextResponse.json({
    success: true,
    message: "¡Ambos recibieron 10 WGoal!"
  });
}
```

### Obtener Referidos del Usuario

**Archivo: `app/api/referrals/me/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      referrals: {
        include: {
          referred: {
            select: {
              walletAddress: true,
              createdAt: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const totalRewards = user.referrals.length * 10;

  return NextResponse.json({
    referralCode: user.referralCode,
    referrals: user.referrals.map(ref => ({
      id: ref.id,
      referredUser: ref.referred.walletAddress,
      reward: ref.reward,
      createdAt: ref.createdAt
    })),
    totalRewards,
    userId: user.id
  });
}
```

---

## 📊 Resumen del Flujo Completo

### Páginas Creadas

1. ✅ **LoadingScreen** - Carrusel con barra de progreso
2. ✅ **ConnectModal** - Modal de conexión con verificación
3. ✅ **Dashboard** - Página principal con balance y próximos partidos
4. ✅ **GroupsPage** - Fase de grupos con tabs A-L
5. ✅ **KnockoutPage** - Fase eliminatoria (Octavos, Cuartos, Semis, Final)
6. ✅ **ReferralsPage** - Sistema de referidos

### Componentes Creados

1. ✅ **Header** - Anuncios de premios + navegación
2. ✅ **Footer** - Usuario conectado + botón de referidos
3. ✅ **MatchCard** - Tarjeta de partido (fase de grupos)
4. ✅ **KnockoutMatch** - Tarjeta de partido (eliminatorias)

### Base de Datos

1. ✅ **User** - Con referralCode y referredBy
2. ✅ **Match** - Partidos de todas las fases
3. ✅ **Prediction** - Predicciones de usuarios
4. ✅ **FinalPrediction** - Predicción especial de la final
5. ✅ **Referral** - Sistema de referidos
6. ✅ **Announcement** - Anuncios dinámicos

### APIs Creadas

1. ✅ `/api/auth/verify` - Verificar World ID
2. ✅ `/api/predictions/create` - Crear predicción
3. ✅ `/api/predictions/knockout` - Predicción eliminatoria
4. ✅ `/api/referrals/create` - Crear referido
5. ✅ `/api/referrals/me` - Obtener referidos del usuario
6. ✅ `/api/announcements/latest` - Obtener último anuncio

---

## ✅ Checklist de Implementación

### Fase 1: UI Básica
- [ ] Implementar LoadingScreen con carrusel
- [ ] Implementar ConnectModal con verificación
- [ ] Crear Header con anuncios
- [ ] Crear Footer con referidos
- [ ] Implementar Dashboard

### Fase 2: Predicciones
- [ ] Crear página de Grupos con tabs
- [ ] Implementar MatchCard
- [ ] Crear página de Eliminatorias
- [ ] Implementar KnockoutMatch
- [ ] Conectar con APIs

### Fase 3: Referidos
- [ ] Crear página de Referidos
- [ ] Implementar sistema de códigos
- [ ] Integrar con World Chat
- [ ] Crear API de referidos
- [ ] Distribuir recompensas

### Fase 4: Base de Datos
- [ ] Actualizar schema de Prisma
- [ ] Crear migraciones
- [ ] Poblar datos de partidos
- [ ] Configurar índices
- [ ] Testing de queries

---

**¡Flujo completo de UI/UX documentado! 🎨⚽**
