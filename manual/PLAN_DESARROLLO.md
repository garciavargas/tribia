# 📋 PLAN DE DESARROLLO - TRIBIA

## 🎯 Objetivo

Desarrollar **Tribia**, una Mini App de Worldcoin para predicciones del Mundial 2026, con sistema de recompensas en tokens WGoal.

---

## 📅 Timeline del Proyecto

### Contexto Temporal
- **Fecha actual:** 18 de abril de 2026
- **Inicio del Mundial:** 11 de junio de 2026
- **Tiempo disponible:** ~54 días (7.7 semanas)

### Fases de Desarrollo

```
Semana 1-2: MVP Core (Autenticación + Predicciones)
Semana 3-4: Sistema de Premios + UI/UX
Semana 5-6: Testing + Optimización
Semana 7: Deploy + Marketing Pre-Mundial
```

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```typescript
const TECH_STACK = {
  frontend: {
    framework: "Next.js 14",
    language: "TypeScript",
    styling: "Tailwind CSS v4",
    sdk: "@worldcoin/minikit-js"
  },
  backend: {
    api: "Next.js API Routes",
    database: "PostgreSQL",
    orm: "Prisma",
    cache: "Redis"
  },
  blockchain: {
    network: "World Chain",
    token: "WGoal (ERC-20)",
    wallet: "MiniKit Wallet"
  },
  deployment: {
    hosting: "Vercel",
    database: "Supabase",
    cdn: "Cloudflare"
  }
};
```

---

## 📦 Fase 1: MVP Core (Semanas 1-2)

### Objetivo
Sistema funcional de autenticación y predicciones básicas.

### Tareas

#### 1.1 Setup del Proyecto
```bash
# Inicializar proyecto
pnpm create next-app@latest tribia --typescript --tailwind --app
cd tribia

# Instalar dependencias
pnpm add @worldcoin/minikit-js @worldcoin/minikit-react
pnpm add @prisma/client
pnpm add -D prisma
```

#### 1.2 Configuración de MiniKit

**Archivo: `app/providers.tsx`**
```typescript
"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
}
```

#### 1.3 Autenticación con World ID

**Archivo: `lib/auth.ts`**
```typescript
import { MiniKit } from "@worldcoin/minikit-js";

export async function authenticateUser(): Promise<{
  address: string;
  verified: boolean;
}> {
  const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
    nonce: generateNonce(),
    requestId: generateRequestId(),
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
  });

  if (finalPayload.status === "success") {
    const address = finalPayload.address;
    const verified = await checkOrbVerification(address);
    
    return { address, verified };
  }

  throw new Error("Autenticación fallida");
}

function generateNonce(): string {
  return Math.random().toString(36).substring(7);
}

function generateRequestId(): string {
  return `tribia-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
```

#### 1.4 Base de Datos (Prisma Schema)

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
  totalWGoal        Float    @default(0)
  dailyLoginStreak  Int      @default(0)
  lastLoginDate     DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  predictions       Prediction[]
  finalPredictions  FinalPrediction[]
}

model Match {
  id          String   @id @default(cuid())
  matchId     String   @unique
  phase       String   // "group", "round32", "round16", "quarter", "semi", "final"
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
  prediction    String   // "home", "draw", "away"
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
```

#### 1.5 Datos del Mundial (Constantes)

**Archivo: `constants/groups.ts`**
```typescript
export const WORLD_CUP_GROUPS = {
  A: ["México", "Sudáfrica", "Corea del Sur", "UEFA Playoff D"],
  B: ["Canadá", "Qatar", "Suiza", "UEFA Playoff A"],
  C: ["Brasil", "Marruecos", "Haití", "Escocia"],
  D: ["Estados Unidos", "Paraguay", "Australia", "UEFA Playoff C"],
  E: ["Alemania", "Costa de Marfil", "Ecuador", "Curazao"],
  F: ["Países Bajos", "Japón", "Túnez", "UEFA Playoff B"],
  G: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"],
  H: ["España", "Uruguay", "Arabia Saudita", "Cabo Verde"],
  I: ["Francia", "Senegal", "Noruega", "FIFA Playoff 2"],
  J: ["Argentina", "Argelia", "Austria", "Jordania"],
  K: ["Portugal", "Colombia", "Uzbekistán", "FIFA Playoff 1"],
  L: ["Inglaterra", "Croacia", "Ghana", "Panamá"]
} as const;

export const WORLD_CUP_DATES = {
  start: new Date("2026-06-11"),
  groupStageEnd: new Date("2026-06-27"),
  round32Start: new Date("2026-06-28"),
  round32End: new Date("2026-07-03"),
  round16Start: new Date("2026-07-04"),
  round16End: new Date("2026-07-07"),
  quarterStart: new Date("2026-07-09"),
  quarterEnd: new Date("2026-07-11"),
  semiStart: new Date("2026-07-14"),
  semiEnd: new Date("2026-07-15"),
  final: new Date("2026-07-19")
} as const;
```

**Archivo: `constants/matches.ts`**
```typescript
export const GROUP_STAGE_MATCHES = [
  // Grupo A
  {
    matchId: "A1",
    phase: "group",
    group: "A",
    homeTeam: "México",
    awayTeam: "Sudáfrica",
    matchDate: new Date("2026-06-11T19:00:00Z"),
    venue: "Estadio Azteca, Ciudad de México"
  },
  {
    matchId: "A2",
    phase: "group",
    group: "A",
    homeTeam: "Corea del Sur",
    awayTeam: "UEFA Playoff D",
    matchDate: new Date("2026-06-11T22:00:00Z"),
    venue: "Estadio Akron, Guadalajara"
  },
  // ... más partidos
] as const;
```

#### 1.6 API Routes

**Archivo: `app/api/auth/login/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { walletAddress, worldId } = await req.json();
  
  // Buscar o crear usuario
  let user = await prisma.user.findUnique({
    where: { walletAddress }
  });
  
  const today = new Date().toDateString();
  const isNewDay = !user || user.lastLoginDate?.toDateString() !== today;
  
  if (!user) {
    // Nuevo usuario
    user = await prisma.user.create({
      data: {
        walletAddress,
        worldId,
        totalWGoal: 1, // 1 WGoal de bienvenida
        dailyLoginStreak: 1,
        lastLoginDate: new Date()
      }
    });
    
    return NextResponse.json({
      user,
      wgoalAwarded: 1,
      message: "¡Bienvenido a Tribia!"
    });
  }
  
  if (isNewDay) {
    // Login diario
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    const newStreak = user.lastLoginDate?.toDateString() === yesterday
      ? user.dailyLoginStreak + 1
      : 1;
    
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        totalWGoal: user.totalWGoal + 1,
        dailyLoginStreak: newStreak,
        lastLoginDate: new Date()
      }
    });
    
    return NextResponse.json({
      user,
      wgoalAwarded: 1,
      message: `¡Día ${newStreak} de racha!`
    });
  }
  
  return NextResponse.json({
    user,
    wgoalAwarded: 0,
    message: "Ya reclamaste tu WGoal hoy"
  });
}
```

**Archivo: `app/api/predictions/create/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, matchId, prediction } = await req.json();
  
  // Validar que el partido existe
  const match = await prisma.match.findUnique({
    where: { matchId }
  });
  
  if (!match) {
    return NextResponse.json(
      { error: "Partido no encontrado" },
      { status: 404 }
    );
  }
  
  // Validar que el partido no ha comenzado
  if (new Date() >= match.matchDate) {
    return NextResponse.json(
      { error: "El partido ya comenzó" },
      { status: 400 }
    );
  }
  
  // Validar que no existe predicción previa
  const existing = await prisma.prediction.findUnique({
    where: {
      userId_matchId: { userId, matchId: match.id }
    }
  });
  
  if (existing) {
    return NextResponse.json(
      { error: "Ya hiciste una predicción para este partido" },
      { status: 400 }
    );
  }
  
  // Crear predicción
  const newPrediction = await prisma.prediction.create({
    data: {
      userId,
      matchId: match.id,
      prediction
    }
  });
  
  return NextResponse.json({
    success: true,
    prediction: newPrediction
  });
}
```

---

## 📱 Fase 2: UI/UX Mobile-First (Semanas 3-4)

### Componentes Principales

#### 2.1 Landing Page

**Archivo: `app/page.tsx`**
```typescript
"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: Math.random().toString(36).substring(7),
        requestId: `tribia-${Date.now()}`,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia"
      });

      if (finalPayload.status === "success") {
        // Guardar sesión y redirigir
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          ⚽ Tribia
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Predice el Mundial 2026 y gana WGoal
        </p>
        
        <button
          onClick={handleConnect}
          disabled={loading}
          className="
            min-h-[44px]
            px-8
            py-3
            bg-white
            text-blue-600
            font-bold
            rounded-lg
            active:scale-95
            transition-transform
            disabled:opacity-50
          "
        >
          {loading ? "Conectando..." : "Conectar con World ID"}
        </button>
        
        <div className="mt-8 text-white/80 text-sm">
          <p>✅ Solo usuarios verificados</p>
          <p>💰 1 WGoal gratis por día</p>
          <p>🏆 Premios hasta 100,000 WGoal</p>
        </div>
      </div>
    </div>
  );
}
```

#### 2.2 Dashboard

**Archivo: `app/dashboard/page.tsx`**
```typescript
"use client";

import { useEffect, useState } from "react";

interface User {
  walletAddress: string;
  totalWGoal: number;
  dailyLoginStreak: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cargar datos del usuario
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-3xl font-bold text-blue-600">
              {user.totalWGoal} WGoal
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Racha</p>
            <p className="text-3xl font-bold text-orange-600">
              {user.dailyLoginStreak} días
            </p>
          </div>
        </div>
      </div>

      {/* Próximos partidos */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-bold mb-4">Próximos Partidos</h2>
        {/* Lista de partidos */}
      </div>
    </div>
  );
}
```

#### 2.3 Componente de Partido

**Archivo: `components/MatchCard.tsx`**
```typescript
interface MatchCardProps {
  match: {
    matchId: string;
    homeTeam: string;
    awayTeam: string;
    matchDate: Date;
    venue: string;
  };
  onPredict: (matchId: string, prediction: string) => void;
}

export default function MatchCard({ match, onPredict }: MatchCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected) {
      onPredict(match.matchId, selected);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-4">
      <div className="text-sm text-gray-600 mb-2">
        {match.matchDate.toLocaleDateString("es-MX", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <p className="font-bold">{match.homeTeam}</p>
        </div>
        <div className="text-gray-400 px-4">vs</div>
        <div className="text-center flex-1">
          <p className="font-bold">{match.awayTeam}</p>
        </div>
      </div>

      <div className="space-y-2">
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

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="
          w-full
          mt-4
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
        Confirmar Predicción
      </button>
    </div>
  );
}
```

---

*Continúa en siguiente mensaje...*

## 💰 Fase 3: Sistema de Premios (Semana 4)

### 3.1 Distribución de WGoal

**Archivo: `lib/rewards.ts`**
```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import { prisma } from "./prisma";

export async function sendWGoal(
  toAddress: string,
  amount: number,
  description: string
): Promise<string> {
  const { finalPayload } = await MiniKit.commandsAsync.pay({
    reference: `tribia-${Date.now()}`,
    to: toAddress,
    tokens: [{
      symbol: "WGOAL",
      token_amount: amount.toString()
    }],
    description
  });

  if (finalPayload.status === "success") {
    return finalPayload.transactionHash;
  }

  throw new Error("Error al enviar WGoal");
}

export async function processMatchRewards(matchId: string): Promise<void> {
  const match = await prisma.match.findUnique({
    where: { matchId },
    include: { predictions: { include: { user: true } } }
  });

  if (!match || match.status !== "finished") {
    throw new Error("Partido no finalizado");
  }

  for (const prediction of match.predictions) {
    const isCorrect = checkPrediction(prediction.prediction, match.winner);

    await prisma.prediction.update({
      where: { id: prediction.id },
      data: { isCorrect }
    });

    if (isCorrect && !prediction.rewardClaimed) {
      await sendWGoal(
        prediction.user.walletAddress,
        5,
        `Premio por acertar ${match.homeTeam} vs ${match.awayTeam}`
      );

      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { rewardClaimed: true }
      });

      await prisma.user.update({
        where: { id: prediction.userId },
        data: {
          totalWGoal: { increment: 5 }
        }
      });
    }
  }
}

function checkPrediction(
  prediction: string,
  winner: string | null
): boolean {
  return prediction === winner;
}
```

### 3.2 Procesamiento de Resultados

**Archivo: `app/api/admin/process-results/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { processMatchRewards } from "@/lib/rewards";

export async function POST(req: NextRequest) {
  const { matchId, homeScore, awayScore, decidedBy } = await req.json();

  // Determinar ganador
  let winner: string;
  if (homeScore > awayScore) {
    winner = "home";
  } else if (awayScore > homeScore) {
    winner = "away";
  } else {
    winner = "draw";
  }

  // Actualizar partido
  await prisma.match.update({
    where: { matchId },
    data: {
      homeScore,
      awayScore,
      winner,
      decidedBy,
      status: "finished"
    }
  });

  // Procesar premios
  await processMatchRewards(matchId);

  return NextResponse.json({
    success: true,
    message: "Resultados procesados"
  });
}
```

### 3.3 Premio Final

**Archivo: `lib/final-rewards.ts`**
```typescript
export async function processFinalRewards(): Promise<void> {
  const finalMatch = await prisma.match.findUnique({
    where: { matchId: "final" }
  });

  if (!finalMatch || finalMatch.status !== "finished") {
    throw new Error("La final no ha terminado");
  }

  const predictions = await prisma.finalPrediction.findMany({
    include: { user: true },
    orderBy: { timestamp: "asc" }
  });

  // Filtrar predicciones correctas
  const correctPredictions = predictions.filter(
    p => p.champion === finalMatch.winner
  );

  // Premios simples (primeros 50)
  const simpleWinners = correctPredictions.slice(0, 50);
  
  for (const winner of simpleWinners) {
    await sendWGoal(
      winner.user.walletAddress,
      10000,
      "¡Acertaste el campeón del Mundial!"
    );

    await prisma.finalPrediction.update({
      where: { id: winner.id },
      data: {
        isCorrect: true,
        rewardAmount: 10000,
        rewardClaimed: true
      }
    });

    await prisma.user.update({
      where: { id: winner.userId },
      data: {
        totalWGoal: { increment: 10000 }
      }
    });
  }

  // Premio gordo
  const jackpotWinners = correctPredictions.filter(p =>
    p.decidedBy === finalMatch.decidedBy &&
    p.homeScore === finalMatch.homeScore &&
    p.awayScore === finalMatch.awayScore
  );

  if (jackpotWinners.length > 0) {
    const amountPerWinner = Math.floor(100000 / jackpotWinners.length);

    for (const winner of jackpotWinners) {
      await sendWGoal(
        winner.user.walletAddress,
        amountPerWinner,
        "¡PREMIO GORDO! Predicción perfecta de la final"
      );

      await prisma.finalPrediction.update({
        where: { id: winner.id },
        data: {
          isCorrect: true,
          rewardAmount: amountPerWinner,
          rewardClaimed: true
        }
      });

      await prisma.user.update({
        where: { id: winner.userId },
        data: {
          totalWGoal: { increment: amountPerWinner }
        }
      });
    }
  }
}
```

---

## 🧪 Fase 4: Testing y Optimización (Semanas 5-6)

### 4.1 Tests Unitarios

**Archivo: `__tests__/predictions.test.ts`**
```typescript
import { describe, it, expect } from "vitest";
import { checkPrediction } from "@/lib/rewards";

describe("Predictions", () => {
  it("should validate correct home prediction", () => {
    expect(checkPrediction("home", "home")).toBe(true);
  });

  it("should validate incorrect prediction", () => {
    expect(checkPrediction("home", "away")).toBe(false);
  });

  it("should validate draw prediction", () => {
    expect(checkPrediction("draw", "draw")).toBe(true);
  });
});
```

### 4.2 Tests de Integración

**Archivo: `__tests__/api/predictions.test.ts`**
```typescript
import { describe, it, expect } from "vitest";

describe("Predictions API", () => {
  it("should create a prediction", async () => {
    const response = await fetch("/api/predictions/create", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user",
        matchId: "A1",
        prediction: "home"
      })
    });

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("should reject duplicate predictions", async () => {
    // Primera predicción
    await fetch("/api/predictions/create", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user",
        matchId: "A1",
        prediction: "home"
      })
    });

    // Segunda predicción (debe fallar)
    const response = await fetch("/api/predictions/create", {
      method: "POST",
      body: JSON.stringify({
        userId: "test-user",
        matchId: "A1",
        prediction: "away"
      })
    });

    expect(response.status).toBe(400);
  });
});
```

### 4.3 Optimización de Performance

**Archivo: `lib/cache.ts`**
```typescript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedMatches(): Promise<Match[]> {
  const cached = await redis.get("matches:upcoming");
  
  if (cached) {
    return JSON.parse(cached);
  }

  const matches = await prisma.match.findMany({
    where: {
      status: "scheduled",
      matchDate: { gte: new Date() }
    },
    orderBy: { matchDate: "asc" },
    take: 20
  });

  await redis.setex("matches:upcoming", 300, JSON.stringify(matches));
  
  return matches;
}

export async function invalidateMatchCache(): Promise<void> {
  await redis.del("matches:upcoming");
}
```

### 4.4 Monitoreo y Analytics

**Archivo: `lib/analytics.ts`**
```typescript
export async function trackEvent(
  event: string,
  properties: Record<string, unknown>
): Promise<void> {
  // Enviar a servicio de analytics
  await fetch("https://analytics.tribia.app/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      properties,
      timestamp: new Date().toISOString()
    })
  });
}

export async function getMetrics(): Promise<TribiaMetrics> {
  const [
    totalUsers,
    dailyActiveUsers,
    totalPredictions,
    totalWGoalDistributed
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        lastLoginDate: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.prediction.count(),
    prisma.user.aggregate({
      _sum: { totalWGoal: true }
    })
  ]);

  return {
    totalUsers,
    dailyActiveUsers,
    totalPredictions,
    totalWGoalDistributed: totalWGoalDistributed._sum.totalWGoal || 0
  };
}
```

---

## 🚀 Fase 5: Deploy y Marketing (Semana 7)

### 5.1 Configuración de Producción

**Archivo: `.env.production`**
```bash
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# Worldcoin
NEXT_PUBLIC_APP_ID="app_..."
NEXT_PUBLIC_APP_URL="https://tribia.app"

# World Chain
WORLD_CHAIN_RPC="https://worldchain-mainnet.g.alchemy.com/v2/..."
WGOAL_TOKEN_ADDRESS="0x..."
TRIBIA_CONTRACT_ADDRESS="0x..."
```

### 5.2 Deploy en Vercel

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add NEXT_PUBLIC_APP_ID
```

### 5.3 Smart Contract (Opcional)

**Archivo: `contracts/Tribia.sol`**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tribia is Ownable {
    IERC20 public wgoalToken;
    
    struct Prediction {
        address user;
        string matchId;
        uint8 prediction;
        uint256 timestamp;
        bool claimed;
    }
    
    mapping(address => mapping(string => Prediction)) public predictions;
    mapping(string => bool) public matchStarted;
    
    event PredictionCreated(
        address indexed user,
        string matchId,
        uint8 prediction,
        uint256 timestamp
    );
    
    event RewardClaimed(
        address indexed user,
        string matchId,
        uint256 amount
    );
    
    constructor(address _wgoalToken) Ownable(msg.sender) {
        wgoalToken = IERC20(_wgoalToken);
    }
    
    function createPrediction(
        string memory matchId,
        uint8 prediction
    ) external {
        require(!matchStarted[matchId], "Match already started");
        require(
            predictions[msg.sender][matchId].timestamp == 0,
            "Already predicted"
        );
        require(prediction <= 2, "Invalid prediction");
        
        predictions[msg.sender][matchId] = Prediction({
            user: msg.sender,
            matchId: matchId,
            prediction: prediction,
            timestamp: block.timestamp,
            claimed: false
        });
        
        emit PredictionCreated(msg.sender, matchId, prediction, block.timestamp);
    }
    
    function claimReward(string memory matchId) external {
        Prediction storage pred = predictions[msg.sender][matchId];
        require(pred.timestamp > 0, "No prediction found");
        require(!pred.claimed, "Already claimed");
        
        pred.claimed = true;
        
        uint256 reward = 5 * 10**18; // 5 WGoal
        require(
            wgoalToken.transfer(msg.sender, reward),
            "Transfer failed"
        );
        
        emit RewardClaimed(msg.sender, matchId, reward);
    }
    
    function setMatchStarted(string memory matchId) external onlyOwner {
        matchStarted[matchId] = true;
    }
}
```

### 5.4 Marketing Pre-Mundial

**Estrategia:**

1. **Redes Sociales**
   - Twitter/X: @TribiaApp
   - Telegram: t.me/tribia_official
   - Discord: discord.gg/tribia

2. **Contenido**
   - Video explicativo (30 segundos)
   - Infografías de premios
   - Testimonios de beta testers

3. **Partnerships**
   - Worldcoin Developer Portal
   - Comunidades de fútbol en World App
   - Influencers de crypto + fútbol

4. **Launch Campaign**
   - Semana 1: Teaser
   - Semana 2: Beta cerrada (100 usuarios)
   - Semana 3: Beta abierta (1,000 usuarios)
   - Semana 4: Launch público

---

## ✅ Checklist de Lanzamiento

### Pre-Launch (1 semana antes del Mundial)

- [ ] Base de datos con todos los partidos cargados
- [ ] Sistema de autenticación funcionando
- [ ] Predicciones de fase de grupos activas
- [ ] Sistema de premios testeado
- [ ] UI/UX optimizada para móvil
- [ ] Tests de carga (10,000 usuarios simultáneos)
- [ ] Monitoreo y alertas configurados
- [ ] Backup automático de base de datos
- [ ] Documentación de API completa
- [ ] Plan de contingencia para bugs críticos

### Launch Day (11 de junio)

- [ ] Monitoreo 24/7 activo
- [ ] Equipo de soporte disponible
- [ ] Sistema de notificaciones funcionando
- [ ] Cache de partidos actualizado
- [ ] Leaderboard en tiempo real
- [ ] Logs de errores monitoreados

### Post-Launch (Durante el Mundial)

- [ ] Actualización diaria de resultados
- [ ] Distribución automática de premios
- [ ] Engagement tracking
- [ ] Feedback de usuarios
- [ ] Optimizaciones de performance
- [ ] Nuevas features basadas en feedback

---

## 📊 Métricas de Éxito

### Semana 1
- **Objetivo:** 10,000 usuarios registrados
- **KPI:** 50% de retención D1

### Semana 2
- **Objetivo:** 50,000 usuarios
- **KPI:** 30% de retención D7

### Semana 3
- **Objetivo:** 100,000 usuarios
- **KPI:** 5 predicciones promedio por usuario

### Final del Mundial
- **Objetivo:** 500,000 usuarios
- **KPI:** 1,000,000 predicciones totales

---

## 🔧 Stack de Herramientas

### Desarrollo
- **IDE:** VS Code
- **Version Control:** Git + GitHub
- **Package Manager:** pnpm
- **Linter:** ESLint + Prettier
- **Testing:** Vitest + Playwright

### Infraestructura
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Cache:** Upstash Redis
- **CDN:** Cloudflare
- **Monitoring:** Sentry + Vercel Analytics

### DevOps
- **CI/CD:** GitHub Actions
- **Secrets:** Vercel Environment Variables
- **Logs:** Vercel Logs + Datadog
- **Alerts:** PagerDuty

---

## 🎯 Prioridades

### Must Have (MVP)
1. ✅ Autenticación con World ID
2. ✅ Login diario (1 WGoal)
3. ✅ Predicciones fase de grupos
4. ✅ Sistema de premios (5 WGoal)
5. ✅ Dashboard básico

### Should Have (V1.1)
1. Predicciones fase eliminatoria
2. Leaderboard global
3. Notificaciones push
4. Historial de predicciones
5. Estadísticas personales

### Nice to Have (V1.2)
1. Predicción final con premio gordo
2. Sistema de badges
3. Compartir en redes sociales
4. Chat entre usuarios
5. Modo oscuro

---

## 🚨 Riesgos y Mitigación

### Riesgo 1: Sobrecarga de Servidor
**Mitigación:**
- Cache agresivo con Redis
- CDN para assets estáticos
- Rate limiting por usuario
- Auto-scaling en Vercel

### Riesgo 2: Bugs en Distribución de Premios
**Mitigación:**
- Tests exhaustivos
- Dry-run antes de distribución real
- Sistema de rollback
- Auditoría manual de primeros 100 premios

### Riesgo 3: Fraude o Manipulación
**Mitigación:**
- Verificación World ID obligatoria
- Timestamps en blockchain
- Una predicción por partido
- Monitoreo de patrones sospechosos

### Riesgo 4: Baja Adopción
**Mitigación:**
- Marketing pre-lanzamiento
- Incentivos de referidos
- Partnerships con comunidades
- Gamificación (badges, rachas)

---

## 📞 Equipo y Roles

### Core Team
- **1 Full-Stack Developer** (tú)
- **1 Designer UI/UX** (freelance)
- **1 Community Manager** (part-time)
- **1 QA Tester** (freelance)

### Advisors
- **Analista de fútbol** (validar datos)
- **Experto en Worldcoin** (integración)
- **Legal** (términos y condiciones)

---

## 🎉 Conclusión

Este plan de desarrollo está diseñado para lanzar **Tribia** antes del Mundial 2026 (11 de junio).

**Tiempo total:** 7 semanas
**Presupuesto estimado:** $10,000 - $15,000 USD
**ROI esperado:** 500,000 usuarios × engagement

**Próximo paso:** Comenzar con Fase 1 (Setup + Autenticación)

---

**¡Vamos a construir el mejor juego de predicciones del Mundial! ⚽🏆**
