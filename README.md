# ⚽ Tribia - World Cup Prediction Game

**Tribia** es una Mini App de Worldcoin que permite a usuarios verificados predecir resultados del Mundial de Fútbol 2026 y ganar tokens **WGoal**.

---

## 🎯 Concepto del Juego

Tribia es un **clon de Progol** (Lotería Nacional) adaptado exclusivamente para el **Mundial de Fútbol 2026**. Los usuarios predicen resultados de partidos y ganan tokens WGoal.

---

## 🔐 Requisitos de Acceso

### ✅ Solo Usuarios Verificados

- **Verificación obligatoria** con World ID (Orb Verified)
- Autenticación mediante **Wallet Auth** de MiniKit
- Sin verificación = Sin acceso al juego

---

## 💰 Sistema de Tokens WGoal

### Recompensa Diaria
- **1 WGoal gratis** por iniciar sesión diaria
- Incentivo para mantener usuarios activos

### Premios por Predicciones

| Fase | Premio | Condición |
|------|--------|-----------|
| **Fase de Grupos** | 5 WGoal | Acertar resultado de partido |
| **Octavos de Final** | 5 WGoal | Acertar equipo que avanza |
| **Cuartos de Final** | 5 WGoal | Acertar equipo que avanza |
| **Semifinales** | 5 WGoal | Acertar equipo que avanza |
| **Final** | 10,000 WGoal | Acertar campeón (primeros 50) |
| **Final** | 100,000 WGoal | **PREMIO GORDO** - Acertar campeón + resultado exacto |

---

## 🏆 Mecánica del Juego

### 1️⃣ Fase de Grupos (48 partidos)

**Predicción simple: Gana / Empate / Pierde**

- Usuario selecciona resultado de cada partido
- **5 WGoal** por cada acierto
- Calendario sincronizado con el Mundial real

**Ejemplo:**
```
México vs. Sudáfrica
[ ] México gana
[ ] Empate
[ ] Sudáfrica gana
```

### 2️⃣ Fase Eliminatoria (Octavos, Cuartos, Semifinales)

**Predicción: ¿Qué equipo pasa a la siguiente ronda?**

- Usuario selecciona el equipo ganador
- **5 WGoal** por cada acierto
- No importa el marcador, solo quién avanza

**Ejemplo:**
```
Brasil vs. Argentina
[ ] Brasil pasa
[ ] Argentina pasa
```

### 3️⃣ Final del Mundial

#### Predicción Estándar (10,000 WGoal)
- Seleccionar **campeón del mundo**
- **Primeros 50 usuarios** que acierten: **10,000 WGoal**
- Orden de predicción: timestamp de la transacción

#### 🎰 PREMIO GORDO (100,000 WGoal)
**Predicción completa del resultado final:**

```
¿Quién gana la Copa del Mundo?
[ ] Equipo A
[ ] Equipo B

¿Cómo gana?
[ ] Tiempo normal (90 minutos)
[ ] Tiempo extra (120 minutos)
[ ] Penales

Marcador final (tiempo reglamentario):
Equipo A: [__] - Equipo B: [__]
```

**Condiciones:**
- Acertar **campeón + forma de victoria + marcador exacto**
- **100,000 WGoal** al ganador
- Si hay múltiples ganadores, se divide el premio

---

## 📅 Calendario Mundial 2026

### Fechas Clave
- **Inicio:** 11 de junio de 2026
- **Fase de Grupos:** 11-27 de junio
- **Octavos de Final:** 28 junio - 3 julio
- **Cuartos de Final:** 9-11 de julio
- **Semifinales:** 14-15 de julio
- **Final:** 19 de julio de 2026

### Grupos del Mundial

#### Grupo A
- 🇲🇽 México
- 🇿🇦 Sudáfrica
- 🇰🇷 Corea del Sur
- 🏴 UEFA Playoff D

#### Grupo B
- 🇨🇦 Canadá
- 🇶🇦 Qatar
- 🇨🇭 Suiza
- 🏴 UEFA Playoff A

#### Grupo C
- 🇧🇷 Brasil
- 🇲🇦 Marruecos
- 🇭🇹 Haití
- 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia

#### Grupo D
- 🇺🇸 Estados Unidos
- 🇵🇾 Paraguay
- 🇦🇺 Australia
- 🏴 UEFA Playoff C

#### Grupo E
- 🇩🇪 Alemania
- 🇨🇮 Costa de Marfil
- 🇪🇨 Ecuador
- 🇨🇼 Curazao

#### Grupo F
- 🇳🇱 Países Bajos
- 🇯🇵 Japón
- 🇹🇳 Túnez
- 🏴 UEFA Playoff B

#### Grupo G
- 🇧🇪 Bélgica
- 🇪🇬 Egipto
- 🇮🇷 Irán
- 🇳🇿 Nueva Zelanda

#### Grupo H
- 🇪🇸 España
- 🇺🇾 Uruguay
- 🇸🇦 Arabia Saudita
- 🇨🇻 Cabo Verde

#### Grupo I
- 🇫🇷 Francia
- 🇸🇳 Senegal
- 🇳🇴 Noruega
- 🏴 FIFA Playoff 2

#### Grupo J
- 🇦🇷 Argentina
- 🇩🇿 Argelia
- 🇦🇹 Austria
- 🇯🇴 Jordania

#### Grupo K
- 🇵🇹 Portugal
- 🇨🇴 Colombia
- 🇺🇿 Uzbekistán
- 🏴 FIFA Playoff 1

#### Grupo L
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra
- 🇭🇷 Croacia
- 🇬🇭 Ghana
- 🇵🇦 Panamá

---

## 🎮 Flujo de Usuario

### 1. Registro y Verificación
```
Usuario abre Tribia → Wallet Auth → Verificación World ID → Acceso concedido
```

### 2. Login Diario
```
Usuario inicia sesión → Recibe 1 WGoal gratis → Puede hacer predicciones
```

### 3. Hacer Predicciones
```
Usuario selecciona partido → Elige resultado → Confirma con transacción → Predicción guardada
```

### 4. Resultados y Premios
```
Partido termina → Sistema verifica predicciones → Distribuye WGoal a ganadores
```

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend:** Next.js + React + TypeScript
- **SDK:** @worldcoin/minikit-js
- **Estilos:** Tailwind CSS v4 (mobile-first)
- **Blockchain:** World Chain (Optimism Superchain)
- **Token:** WGoal (ERC-20)

### Componentes Principales

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Autenticación
│   ├── dashboard/               # Dashboard usuario
│   ├── predictions/             # Sistema de predicciones
│   └── leaderboard/             # Tabla de posiciones
├── components/
│   ├── MatchCard.tsx            # Tarjeta de partido
│   ├── PredictionForm.tsx       # Formulario predicción
│   ├── GroupStage.tsx           # Vista fase de grupos
│   └── KnockoutBracket.tsx      # Llave eliminatoria
├── lib/
│   ├── worldcoin.ts             # Integración MiniKit
│   ├── blockchain.ts            # Interacción con World Chain
│   ├── predictions.ts           # Lógica de predicciones
│   └── rewards.ts               # Sistema de recompensas
├── types/
│   ├── match.ts                 # Tipos de partidos
│   ├── prediction.ts            # Tipos de predicciones
│   └── user.ts                  # Tipos de usuario
└── constants/
    ├── matches.ts               # Calendario de partidos
    └── groups.ts                # Grupos del mundial
```

---

## 📊 Base de Datos (Estructura Conceptual)

### Tabla: Users
```typescript
interface User {
  walletAddress: string;        // Primary key
  worldId: string;               // World ID verificado
  username?: string;
  totalWGoal: number;            // Balance total
  dailyLoginStreak: number;      // Racha de logins
  lastLoginDate: Date;
  createdAt: Date;
}
```

### Tabla: Matches
```typescript
interface Match {
  matchId: string;               // Primary key
  phase: "group" | "round32" | "round16" | "quarter" | "semi" | "final";
  group?: string;                // A-L (solo fase de grupos)
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  venue: string;
  result?: {
    homeScore: number;
    awayScore: number;
    winner: "home" | "away" | "draw";
    decidedBy: "normal" | "extra" | "penalties";
  };
  status: "scheduled" | "live" | "finished";
}
```

### Tabla: Predictions
```typescript
interface Prediction {
  predictionId: string;          // Primary key
  userId: string;                // Foreign key → Users
  matchId: string;               // Foreign key → Matches
  prediction: "home" | "draw" | "away";
  timestamp: Date;               // Para orden de llegada
  isCorrect?: boolean;           // null hasta que termine el partido
  rewardClaimed: boolean;
}
```

### Tabla: FinalPredictions
```typescript
interface FinalPrediction {
  predictionId: string;          // Primary key
  userId: string;                // Foreign key → Users
  champion: string;              // Equipo ganador
  decidedBy: "normal" | "extra" | "penalties";
  homeScore?: number;            // Solo para premio gordo
  awayScore?: number;            // Solo para premio gordo
  timestamp: Date;               // Para orden de llegada
  isCorrect?: boolean;
  rewardAmount?: number;         // 10k o 100k
  rewardClaimed: boolean;
}
```

---

## 🔄 Lógica de Negocio

### 1. Login Diario
```typescript
async function handleDailyLogin(walletAddress: string): Promise<number> {
  const user = await getUser(walletAddress);
  const today = new Date().toDateString();
  
  if (user.lastLoginDate.toDateString() !== today) {
    await updateUser(walletAddress, {
      totalWGoal: user.totalWGoal + 1,
      lastLoginDate: new Date(),
      dailyLoginStreak: user.dailyLoginStreak + 1
    });
    
    await sendWGoal(walletAddress, 1);
    return 1; // WGoal otorgado
  }
  
  return 0; // Ya reclamó hoy
}
```

### 2. Crear Predicción
```typescript
async function createPrediction(
  userId: string,
  matchId: string,
  prediction: "home" | "draw" | "away"
): Promise<boolean> {
  const match = await getMatch(matchId);
  
  // Validar que el partido no haya comenzado
  if (match.status !== "scheduled") {
    throw new Error("El partido ya comenzó");
  }
  
  // Validar que no exista predicción previa
  const existingPrediction = await getPrediction(userId, matchId);
  if (existingPrediction) {
    throw new Error("Ya hiciste una predicción para este partido");
  }
  
  await savePrediction({
    userId,
    matchId,
    prediction,
    timestamp: new Date(),
    rewardClaimed: false
  });
  
  return true;
}
```

### 3. Verificar Resultados y Distribuir Premios
```typescript
async function processMatchResults(matchId: string): Promise<void> {
  const match = await getMatch(matchId);
  
  if (match.status !== "finished" || !match.result) {
    throw new Error("El partido no ha terminado");
  }
  
  const predictions = await getPredictionsByMatch(matchId);
  
  for (const prediction of predictions) {
    const isCorrect = checkPrediction(prediction.prediction, match.result.winner);
    
    await updatePrediction(prediction.predictionId, { isCorrect });
    
    if (isCorrect && !prediction.rewardClaimed) {
      const reward = match.phase === "group" ? 5 : 5; // 5 WGoal por acierto
      await sendWGoal(prediction.userId, reward);
      await updatePrediction(prediction.predictionId, { rewardClaimed: true });
    }
  }
}
```

### 4. Premio Final
```typescript
async function processFinalResults(): Promise<void> {
  const finalMatch = await getMatch("final");
  const predictions = await getFinalPredictions();
  
  // Ordenar por timestamp (primeros 50)
  const sortedPredictions = predictions
    .filter(p => p.champion === finalMatch.result.winner)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Premios estándar (10k WGoal)
  const standardWinners = sortedPredictions.slice(0, 50);
  for (const winner of standardWinners) {
    await sendWGoal(winner.userId, 10000);
    await updateFinalPrediction(winner.predictionId, {
      isCorrect: true,
      rewardAmount: 10000,
      rewardClaimed: true
    });
  }
  
  // Premio gordo (100k WGoal)
  const jackpotWinners = sortedPredictions.filter(p => 
    p.decidedBy === finalMatch.result.decidedBy &&
    p.homeScore === finalMatch.result.homeScore &&
    p.awayScore === finalMatch.result.awayScore
  );
  
  if (jackpotWinners.length > 0) {
    const jackpotPerWinner = 100000 / jackpotWinners.length;
    
    for (const winner of jackpotWinners) {
      await sendWGoal(winner.userId, jackpotPerWinner);
      await updateFinalPrediction(winner.predictionId, {
        isCorrect: true,
        rewardAmount: jackpotPerWinner,
        rewardClaimed: true
      });
    }
  }
}
```

---

## 🎨 Diseño UI/UX (Mobile-First)

### Pantallas Principales

#### 1. Landing Page
- Hero con logo de Tribia
- Explicación breve del juego
- Botón "Conectar con World ID"
- Contador de usuarios activos

#### 2. Dashboard
- Balance de WGoal
- Racha de login diario
- Próximos partidos
- Mis predicciones activas
- Leaderboard

#### 3. Fase de Grupos
- 12 tabs (Grupo A - L)
- Lista de partidos por grupo
- Estado: Pendiente / En vivo / Finalizado
- Botón "Predecir" en partidos pendientes

#### 4. Fase Eliminatoria
- Bracket visual interactivo
- Octavos → Cuartos → Semis → Final
- Click en partido para predecir

#### 5. Predicción Final
- Formulario especial para la final
- Selector de campeón
- Selector de forma de victoria
- Input de marcador (opcional para premio gordo)

#### 6. Leaderboard
- Top 100 usuarios
- Ordenado por WGoal total
- Filtros: Semanal / Mensual / Total

---

## 🚀 Roadmap de Desarrollo

### Fase 1: MVP (Funcionalidad Core)
- [ ] Autenticación con World ID
- [ ] Sistema de login diario (1 WGoal)
- [ ] Calendario de partidos (hardcoded)
- [ ] Predicciones fase de grupos (Gana/Empate/Pierde)
- [ ] Sistema de recompensas (5 WGoal por acierto)
- [ ] Dashboard básico

### Fase 2: Fase Eliminatoria
- [ ] Bracket visual interactivo
- [ ] Predicciones de eliminatorias
- [ ] Actualización automática de resultados
- [ ] Notificaciones push (MiniKit)

### Fase 3: Premio Final
- [ ] Formulario de predicción final
- [ ] Sistema de ranking por timestamp
- [ ] Distribución de premios (10k y 100k WGoal)
- [ ] Leaderboard global

### Fase 4: Gamificación
- [ ] Badges y logros
- [ ] Racha de aciertos
- [ ] Sistema de referidos
- [ ] Chat entre usuarios (World Chat)

### Fase 5: Optimización
- [ ] Caché de datos
- [ ] Optimización de transacciones
- [ ] Analytics y métricas
- [ ] A/B testing

---

## 📱 Integración con MiniKit

### Comandos Utilizados

#### 1. Wallet Auth (Autenticación)
```typescript
import { MiniKit } from "@worldcoin/minikit-js";

const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
  nonce: generateNonce(),
  requestId: generateRequestId(),
  expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
});
```

#### 2. Pay (Distribución de WGoal)
```typescript
const { commandPayload, finalPayload } = await MiniKit.commandsAsync.pay({
  reference: generateReference(),
  to: userWalletAddress,
  tokens: [{
    symbol: "WGOAL",
    token_amount: "5.0"
  }],
  description: "Premio por predicción correcta"
});
```

#### 3. Send Transaction (Crear predicción on-chain)
```typescript
const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
  transaction: [
    {
      address: TRIBIA_CONTRACT_ADDRESS,
      abi: TribiaABI,
      functionName: "createPrediction",
      args: [matchId, prediction]
    }
  ]
});
```

---

## 🔒 Seguridad

### Validaciones Críticas
1. **Verificación World ID obligatoria**
2. **Timestamp de predicciones** (evitar manipulación)
3. **Una predicción por partido por usuario**
4. **Predicciones bloqueadas después del kickoff**
5. **Distribución de premios verificada on-chain**

### Smart Contract (Conceptual)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tribia {
    struct Prediction {
        address user;
        string matchId;
        uint8 prediction; // 0=home, 1=draw, 2=away
        uint256 timestamp;
        bool claimed;
    }
    
    mapping(address => mapping(string => Prediction)) public predictions;
    mapping(string => bool) public matchStarted;
    
    function createPrediction(string memory matchId, uint8 prediction) external {
        require(!matchStarted[matchId], "Match already started");
        require(predictions[msg.sender][matchId].timestamp == 0, "Already predicted");
        
        predictions[msg.sender][matchId] = Prediction({
            user: msg.sender,
            matchId: matchId,
            prediction: prediction,
            timestamp: block.timestamp,
            claimed: false
        });
    }
}
```

---

## 📈 Métricas de Éxito

### KPIs
- **DAU** (Daily Active Users)
- **Tasa de retención** (D1, D7, D30)
- **Predicciones por usuario**
- **WGoal distribuidos**
- **Tasa de conversión** (visitantes → usuarios verificados)

### Objetivos
- **10,000 usuarios** en la primera semana
- **50% de retención** en D7
- **5 predicciones promedio** por usuario
- **100,000 WGoal** distribuidos en fase de grupos

---

## 🌍 Expansión Futura

### Post-Mundial 2026
- **Champions League**
- **Copa América / Eurocopa**
- **Ligas nacionales** (La Liga, Premier League, etc.)
- **Otros deportes** (NBA, NFL, etc.)

---

## 📞 Contacto y Soporte

- **Documentación técnica:** `/manual`
- **Telegram:** @tribia_support
- **GitHub:** github.com/tribia/worldcup-2026

---

**¡Que gane el mejor predictor! ⚽🏆**
