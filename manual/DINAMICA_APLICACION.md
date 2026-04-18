# 🎮 DINÁMICA DE LA APLICACIÓN TRIBIA

## 📋 Índice

1. [Concepto General](#concepto-general)
2. [Reglas del Juego](#reglas-del-juego)
3. [Sistema de Premios](#sistema-de-premios)
4. [Fases del Mundial](#fases-del-mundial)
5. [Flujo de Usuario](#flujo-de-usuario)
6. [Lógica de Negocio](#lógica-de-negocio)

---

## 🎯 Concepto General

**Tribia** es un clon de **Progol** (Lotería Nacional de México) adaptado para el **Mundial de Fútbol 2026**.

### Características Principales

- ✅ **Solo usuarios verificados** con World ID (Orb Verified)
- 💰 **1 WGoal gratis** por login diario
- ⚽ **Predicciones simples**: Gana / Empate / Pierde
- 🏆 **Premios progresivos** según la fase del torneo
- 🎰 **Premio gordo** de 100,000 WGoal en la final

---

## 📜 Reglas del Juego

### 1. Acceso Obligatorio con Verificación

```typescript
// Solo usuarios con World ID verificado pueden jugar
interface AccessRequirement {
  worldIdVerified: true;  // Obligatorio
  orbVerified: true;      // Verificación con Orb
  walletConnected: true;  // Wallet conectada
}
```

**Flujo de acceso:**
1. Usuario abre Tribia
2. Sistema verifica World ID
3. Si NO está verificado → Bloqueo total
4. Si está verificado → Acceso completo

### 2. Login Diario (1 WGoal Gratis)

**Regla:** Cada usuario recibe **1 WGoal** por iniciar sesión cada día.

```typescript
interface DailyLogin {
  reward: 1;              // WGoal
  frequency: "daily";     // Una vez al día
  resetTime: "00:00 UTC"; // Reinicia a medianoche
}
```

**Condiciones:**
- Solo 1 WGoal por día
- No acumulable si no se reclama
- Racha de días consecutivos (opcional para gamificación)

### 3. Predicciones en Fase de Grupos

**Mecánica:** Predicción simple de 3 opciones

```
Partido: México vs. Sudáfrica
┌─────────────────────┐
│ [ ] México gana     │
│ [ ] Empate          │
│ [ ] Sudáfrica gana  │
└─────────────────────┘
```

**Reglas:**
- ✅ Una predicción por partido
- ✅ Predicción antes del kickoff
- ✅ No se puede cambiar después de enviar
- ✅ Premio: **5 WGoal** por acierto

### 4. Predicciones en Fase Eliminatoria

**Mecánica:** Seleccionar qué equipo avanza

```
Octavos de Final: Brasil vs. Argentina
┌─────────────────────┐
│ [ ] Brasil pasa     │
│ [ ] Argentina pasa  │
└─────────────────────┘
```

**Reglas:**
- ✅ Solo importa quién avanza (no el marcador)
- ✅ Aplica para: Octavos, Cuartos, Semifinales
- ✅ Premio: **5 WGoal** por acierto

### 5. Predicción de la Final

#### Opción A: Predicción Simple (10,000 WGoal)

**Mecánica:** Solo seleccionar el campeón

```
¿Quién gana la Copa del Mundo?
┌─────────────────────┐
│ [ ] Equipo A        │
│ [ ] Equipo B        │
└─────────────────────┘
```

**Reglas:**
- ✅ **Primeros 50 usuarios** que acierten
- ✅ Premio: **10,000 WGoal** cada uno
- ✅ Orden: Timestamp de la transacción blockchain
- ✅ Después del usuario 50: Sin premio

#### Opción B: Premio Gordo (100,000 WGoal)

**Mecánica:** Predicción completa del resultado

```
¿Quién gana la Copa del Mundo?
┌─────────────────────┐
│ [ ] Equipo A        │
│ [ ] Equipo B        │
└─────────────────────┘

¿Cómo gana?
┌─────────────────────┐
│ [ ] Tiempo normal   │
│ [ ] Tiempo extra    │
│ [ ] Penales         │
└─────────────────────┘

Marcador final (90 minutos):
┌─────────────────────┐
│ Equipo A: [__]      │
│ Equipo B: [__]      │
└─────────────────────┘
```

**Reglas:**
- ✅ Acertar: Campeón + Forma de victoria + Marcador exacto
- ✅ Premio: **100,000 WGoal**
- ✅ Si hay múltiples ganadores: Se divide el premio
- ✅ Ejemplo: 2 ganadores = 50,000 WGoal cada uno

---

## 💰 Sistema de Premios

### Tabla de Premios

| Fase | Tipo de Predicción | Premio | Condición |
|------|-------------------|--------|-----------|
| **Fase de Grupos** | Gana/Empate/Pierde | 5 WGoal | Por cada acierto |
| **Octavos** | Equipo que avanza | 5 WGoal | Por cada acierto |
| **Cuartos** | Equipo que avanza | 5 WGoal | Por cada acierto |
| **Semifinales** | Equipo que avanza | 5 WGoal | Por cada acierto |
| **Final (Simple)** | Campeón | 10,000 WGoal | Primeros 50 usuarios |
| **Final (Completa)** | Campeón + Resultado | 100,000 WGoal | Predicción exacta |

### Distribución de Premios

```typescript
interface RewardDistribution {
  groupStage: {
    perMatch: 5;
    totalMatches: 48;
    maxPossible: 240; // 48 × 5
  };
  knockout: {
    perMatch: 5;
    totalMatches: 15; // 8 + 4 + 2 + 1
    maxPossible: 75;  // 15 × 5
  };
  final: {
    simple: {
      perWinner: 10000;
      maxWinners: 50;
      totalPool: 500000; // 50 × 10,000
    };
    jackpot: {
      totalPool: 100000;
      shared: true; // Se divide entre ganadores
    };
  };
}
```

---

## 🏆 Fases del Mundial

### Fase 1: Grupos (48 partidos)

**Fechas:** 11-27 de junio de 2026

**Estructura:**
- 12 grupos (A-L)
- 4 equipos por grupo
- 6 partidos por grupo
- Total: 48 partidos

**Predicción:**
```typescript
interface GroupStagePrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: "home" | "draw" | "away";
  timestamp: Date;
}
```

### Fase 2: Octavos de Final (16 equipos)

**Fechas:** 28 junio - 3 julio

**Estructura:**
- 8 partidos
- Eliminación directa
- Clasifican: Primeros 2 de cada grupo + 8 mejores terceros

**Predicción:**
```typescript
interface KnockoutPrediction {
  matchId: string;
  team1: string;
  team2: string;
  prediction: "team1" | "team2"; // Solo quién avanza
  timestamp: Date;
}
```

### Fase 3: Cuartos de Final (8 equipos)

**Fechas:** 9-11 de julio

**Estructura:**
- 4 partidos
- Eliminación directa

### Fase 4: Semifinales (4 equipos)

**Fechas:** 14-15 de julio

**Estructura:**
- 2 partidos
- Eliminación directa

### Fase 5: Final (2 equipos)

**Fecha:** 19 de julio de 2026
**Sede:** MetLife Stadium, New Jersey

**Predicción especial:**
```typescript
interface FinalPrediction {
  // Predicción simple
  champion: string;
  
  // Predicción completa (opcional para premio gordo)
  decidedBy?: "normal" | "extra" | "penalties";
  homeScore?: number;
  awayScore?: number;
  
  timestamp: Date;
}
```

---

## 🔄 Flujo de Usuario

### 1. Primera Vez (Onboarding)

```
┌─────────────────────────────────────┐
│ 1. Usuario abre Tribia              │
│ 2. Pantalla de bienvenida           │
│ 3. Botón "Conectar con World ID"    │
│ 4. Verificación World ID (Orb)      │
│ 5. Wallet Auth (MiniKit)            │
│ 6. Registro en base de datos        │
│ 7. Recibe 1 WGoal de bienvenida     │
│ 8. Acceso al dashboard               │
└─────────────────────────────────────┘
```

### 2. Login Diario

```
┌─────────────────────────────────────┐
│ 1. Usuario abre Tribia              │
│ 2. Sistema verifica última sesión   │
│ 3. Si es nuevo día → 1 WGoal gratis │
│ 4. Actualiza racha de días          │
│ 5. Muestra dashboard                │
└─────────────────────────────────────┘
```

### 3. Hacer Predicción

```
┌─────────────────────────────────────┐
│ 1. Usuario ve lista de partidos     │
│ 2. Selecciona partido pendiente     │
│ 3. Elige resultado (Gana/Empate)    │
│ 4. Confirma predicción               │
│ 5. Transacción blockchain           │
│ 6. Predicción guardada              │
│ 7. Notificación de confirmación     │
└─────────────────────────────────────┘
```

### 4. Reclamar Premio

```
┌─────────────────────────────────────┐
│ 1. Partido termina                  │
│ 2. Sistema verifica resultados      │
│ 3. Compara con predicciones         │
│ 4. Si acierta → Envía WGoal         │
│ 5. Notificación push al usuario     │
│ 6. Balance actualizado              │
└─────────────────────────────────────┘
```

---

*Continúa en la siguiente sección...*

## 🧠 Lógica de Negocio

### 1. Validación de Acceso

```typescript
async function validateAccess(walletAddress: string): Promise<boolean> {
  // 1. Verificar World ID
  const worldId = await getWorldId(walletAddress);
  if (!worldId) {
    throw new Error("World ID no encontrado");
  }
  
  // 2. Verificar Orb Verification
  const isOrbVerified = await checkOrbVerification(worldId);
  if (!isOrbVerified) {
    throw new Error("Debes verificarte con Orb para jugar");
  }
  
  return true;
}
```

### 2. Login Diario

```typescript
async function processDailyLogin(walletAddress: string): Promise<{
  wgoalAwarded: number;
  streak: number;
}> {
  const user = await getUser(walletAddress);
  const today = new Date().toDateString();
  const lastLogin = user.lastLoginDate.toDateString();
  
  // Ya reclamó hoy
  if (lastLogin === today) {
    return {
      wgoalAwarded: 0,
      streak: user.dailyLoginStreak
    };
  }
  
  // Calcular racha
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  const newStreak = lastLogin === yesterday 
    ? user.dailyLoginStreak + 1 
    : 1;
  
  // Otorgar 1 WGoal
  await updateUser(walletAddress, {
    totalWGoal: user.totalWGoal + 1,
    lastLoginDate: new Date(),
    dailyLoginStreak: newStreak
  });
  
  await sendWGoal(walletAddress, 1);
  
  return {
    wgoalAwarded: 1,
    streak: newStreak
  };
}
```

### 3. Crear Predicción (Fase de Grupos)

```typescript
async function createGroupStagePrediction(
  userId: string,
  matchId: string,
  prediction: "home" | "draw" | "away"
): Promise<{
  success: boolean;
  predictionId: string;
}> {
  // 1. Validar que el partido existe
  const match = await getMatch(matchId);
  if (!match) {
    throw new Error("Partido no encontrado");
  }
  
  // 2. Validar que el partido no ha comenzado
  const now = new Date();
  if (now >= match.matchDate) {
    throw new Error("El partido ya comenzó");
  }
  
  // 3. Validar que no existe predicción previa
  const existingPrediction = await getPrediction(userId, matchId);
  if (existingPrediction) {
    throw new Error("Ya hiciste una predicción para este partido");
  }
  
  // 4. Guardar predicción
  const predictionId = generateId();
  await savePrediction({
    predictionId,
    userId,
    matchId,
    prediction,
    timestamp: new Date(),
    isCorrect: null,
    rewardClaimed: false
  });
  
  return {
    success: true,
    predictionId
  };
}
```

### 4. Crear Predicción (Fase Eliminatoria)

```typescript
async function createKnockoutPrediction(
  userId: string,
  matchId: string,
  prediction: "team1" | "team2"
): Promise<{
  success: boolean;
  predictionId: string;
}> {
  const match = await getMatch(matchId);
  
  // Validaciones similares a fase de grupos
  if (new Date() >= match.matchDate) {
    throw new Error("El partido ya comenzó");
  }
  
  const existingPrediction = await getPrediction(userId, matchId);
  if (existingPrediction) {
    throw new Error("Ya hiciste una predicción para este partido");
  }
  
  // Guardar predicción
  const predictionId = generateId();
  await savePrediction({
    predictionId,
    userId,
    matchId,
    prediction,
    timestamp: new Date(),
    isCorrect: null,
    rewardClaimed: false
  });
  
  return {
    success: true,
    predictionId
  };
}
```

### 5. Crear Predicción Final

```typescript
async function createFinalPrediction(
  userId: string,
  champion: string,
  options?: {
    decidedBy?: "normal" | "extra" | "penalties";
    homeScore?: number;
    awayScore?: number;
  }
): Promise<{
  success: boolean;
  predictionId: string;
  eligibleFor: "simple" | "jackpot";
}> {
  const finalMatch = await getMatch("final");
  
  // Validar que la final no ha comenzado
  if (new Date() >= finalMatch.matchDate) {
    throw new Error("La final ya comenzó");
  }
  
  // Validar que no existe predicción previa
  const existingPrediction = await getFinalPrediction(userId);
  if (existingPrediction) {
    throw new Error("Ya hiciste tu predicción para la final");
  }
  
  // Determinar tipo de predicción
  const isJackpot = !!(
    options?.decidedBy && 
    options?.homeScore !== undefined && 
    options?.awayScore !== undefined
  );
  
  // Guardar predicción
  const predictionId = generateId();
  await saveFinalPrediction({
    predictionId,
    userId,
    champion,
    decidedBy: options?.decidedBy,
    homeScore: options?.homeScore,
    awayScore: options?.awayScore,
    timestamp: new Date(),
    isCorrect: null,
    rewardAmount: null,
    rewardClaimed: false
  });
  
  return {
    success: true,
    predictionId,
    eligibleFor: isJackpot ? "jackpot" : "simple"
  };
}
```

### 6. Procesar Resultados (Fase de Grupos)

```typescript
async function processGroupStageResults(matchId: string): Promise<{
  totalPredictions: number;
  correctPredictions: number;
  wgoalDistributed: number;
}> {
  const match = await getMatch(matchId);
  
  // Validar que el partido terminó
  if (match.status !== "finished" || !match.result) {
    throw new Error("El partido no ha terminado");
  }
  
  // Obtener todas las predicciones
  const predictions = await getPredictionsByMatch(matchId);
  
  let correctCount = 0;
  let totalWGoal = 0;
  
  for (const prediction of predictions) {
    // Determinar si la predicción es correcta
    const isCorrect = checkPrediction(
      prediction.prediction, 
      match.result.winner
    );
    
    // Actualizar predicción
    await updatePrediction(prediction.predictionId, { 
      isCorrect 
    });
    
    // Distribuir premio si es correcta
    if (isCorrect && !prediction.rewardClaimed) {
      await sendWGoal(prediction.userId, 5);
      await updatePrediction(prediction.predictionId, { 
        rewardClaimed: true 
      });
      
      correctCount++;
      totalWGoal += 5;
    }
  }
  
  return {
    totalPredictions: predictions.length,
    correctPredictions: correctCount,
    wgoalDistributed: totalWGoal
  };
}

function checkPrediction(
  prediction: "home" | "draw" | "away",
  result: "home" | "draw" | "away"
): boolean {
  return prediction === result;
}
```

### 7. Procesar Resultados (Final)

```typescript
async function processFinalResults(): Promise<{
  simpleWinners: number;
  jackpotWinners: number;
  totalDistributed: number;
}> {
  const finalMatch = await getMatch("final");
  
  if (finalMatch.status !== "finished" || !finalMatch.result) {
    throw new Error("La final no ha terminado");
  }
  
  const predictions = await getFinalPredictions();
  
  // Filtrar predicciones correctas del campeón
  const correctChampion = predictions.filter(
    p => p.champion === finalMatch.result.winner
  );
  
  // Ordenar por timestamp (primeros 50)
  const sortedByTime = correctChampion.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  // PREMIOS SIMPLES (10,000 WGoal)
  const simpleWinners = sortedByTime.slice(0, 50);
  let simpleCount = 0;
  
  for (const winner of simpleWinners) {
    await sendWGoal(winner.userId, 10000);
    await updateFinalPrediction(winner.predictionId, {
      isCorrect: true,
      rewardAmount: 10000,
      rewardClaimed: true
    });
    simpleCount++;
  }
  
  // PREMIO GORDO (100,000 WGoal)
  const jackpotWinners = correctChampion.filter(p => 
    p.decidedBy === finalMatch.result.decidedBy &&
    p.homeScore === finalMatch.result.homeScore &&
    p.awayScore === finalMatch.result.awayScore
  );
  
  let jackpotCount = 0;
  let totalDistributed = simpleCount * 10000;
  
  if (jackpotWinners.length > 0) {
    const jackpotPerWinner = Math.floor(100000 / jackpotWinners.length);
    
    for (const winner of jackpotWinners) {
      await sendWGoal(winner.userId, jackpotPerWinner);
      await updateFinalPrediction(winner.predictionId, {
        isCorrect: true,
        rewardAmount: jackpotPerWinner,
        rewardClaimed: true
      });
      jackpotCount++;
      totalDistributed += jackpotPerWinner;
    }
  }
  
  return {
    simpleWinners: simpleCount,
    jackpotWinners: jackpotCount,
    totalDistributed
  };
}
```

---

## ✅ Validaciones Críticas

### 1. Validación de Tiempo

```typescript
function validateMatchTime(matchDate: Date): void {
  const now = new Date();
  const timeUntilMatch = matchDate.getTime() - now.getTime();
  
  // No se puede predecir después del kickoff
  if (timeUntilMatch <= 0) {
    throw new Error("El partido ya comenzó");
  }
  
  // Opcional: Cerrar predicciones 5 minutos antes
  const BUFFER_TIME = 5 * 60 * 1000; // 5 minutos
  if (timeUntilMatch < BUFFER_TIME) {
    throw new Error("Las predicciones cerraron");
  }
}
```

### 2. Validación de Duplicados

```typescript
async function validateNoDuplicate(
  userId: string, 
  matchId: string
): Promise<void> {
  const existing = await getPrediction(userId, matchId);
  
  if (existing) {
    throw new Error(
      "Ya hiciste una predicción para este partido. " +
      "No se puede cambiar después de enviar."
    );
  }
}
```

### 3. Validación de Balance

```typescript
async function validateBalance(
  userId: string, 
  requiredAmount: number
): Promise<void> {
  const user = await getUser(userId);
  
  if (user.totalWGoal < requiredAmount) {
    throw new Error(
      `Balance insuficiente. Necesitas ${requiredAmount} WGoal`
    );
  }
}
```

### 4. Validación de Verificación

```typescript
async function validateVerification(
  walletAddress: string
): Promise<void> {
  const worldId = await getWorldId(walletAddress);
  
  if (!worldId) {
    throw new Error("No tienes World ID");
  }
  
  const verification = await getVerificationStatus(worldId);
  
  if (!verification.isOrbVerified) {
    throw new Error(
      "Debes verificarte con Orb para jugar en Tribia. " +
      "Visita un Orb cerca de ti."
    );
  }
}
```

---

## 🔒 Seguridad

### 1. Prevención de Manipulación de Timestamp

```typescript
// Usar timestamp del blockchain, no del cliente
async function createPredictionSecure(
  userId: string,
  matchId: string,
  prediction: string
): Promise<string> {
  // Enviar transacción al smart contract
  const tx = await contract.createPrediction(matchId, prediction);
  await tx.wait();
  
  // El timestamp se registra en el blockchain
  const blockTimestamp = (await tx.getBlock()).timestamp;
  
  // Guardar en base de datos con timestamp del blockchain
  await savePrediction({
    userId,
    matchId,
    prediction,
    timestamp: new Date(blockTimestamp * 1000),
    txHash: tx.hash
  });
  
  return tx.hash;
}
```

### 2. Prevención de Doble Gasto

```typescript
// Verificar que el premio no se ha reclamado
async function claimReward(
  predictionId: string
): Promise<void> {
  const prediction = await getPrediction(predictionId);
  
  if (prediction.rewardClaimed) {
    throw new Error("Premio ya reclamado");
  }
  
  // Marcar como reclamado ANTES de enviar
  await updatePrediction(predictionId, { 
    rewardClaimed: true 
  });
  
  try {
    await sendWGoal(prediction.userId, 5);
  } catch (error) {
    // Revertir si falla el envío
    await updatePrediction(predictionId, { 
      rewardClaimed: false 
    });
    throw error;
  }
}
```

### 3. Rate Limiting

```typescript
// Limitar predicciones por usuario
const RATE_LIMIT = {
  maxPredictionsPerMinute: 10,
  maxPredictionsPerHour: 100
};

async function checkRateLimit(userId: string): Promise<void> {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentPredictions = await getPredictionsByUser(userId, {
    since: oneMinuteAgo
  });
  
  if (recentPredictions.length >= RATE_LIMIT.maxPredictionsPerMinute) {
    throw new Error("Demasiadas predicciones. Espera un minuto.");
  }
  
  const hourlyPredictions = await getPredictionsByUser(userId, {
    since: oneHourAgo
  });
  
  if (hourlyPredictions.length >= RATE_LIMIT.maxPredictionsPerHour) {
    throw new Error("Límite de predicciones por hora alcanzado.");
  }
}
```

---

## 📊 Métricas y Analytics

### KPIs a Monitorear

```typescript
interface TribiaMetrics {
  // Usuarios
  totalUsers: number;
  dailyActiveUsers: number;
  verifiedUsers: number;
  
  // Predicciones
  totalPredictions: number;
  predictionsToday: number;
  averagePredictionsPerUser: number;
  
  // Premios
  totalWGoalDistributed: number;
  wgoalDistributedToday: number;
  averageWinRate: number;
  
  // Engagement
  dailyLoginStreak: {
    average: number;
    max: number;
  };
  retentionRate: {
    d1: number; // Day 1
    d7: number; // Day 7
    d30: number; // Day 30
  };
}
```

---

## 🎯 Casos de Uso

### Caso 1: Usuario Nuevo

```
1. Juan descarga World App
2. Se verifica con Orb
3. Abre Tribia por primera vez
4. Conecta su wallet
5. Recibe 1 WGoal de bienvenida
6. Ve el calendario de partidos
7. Hace su primera predicción: México gana
8. Espera el resultado del partido
9. México gana → Recibe 5 WGoal
10. Balance total: 6 WGoal
```

### Caso 2: Usuario Activo

```
1. María abre Tribia cada día
2. Lleva 15 días consecutivos
3. Ha acumulado 15 WGoal por login diario
4. Ha hecho 30 predicciones
5. Ha acertado 18 predicciones
6. Ha ganado 90 WGoal (18 × 5)
7. Balance total: 105 WGoal
8. Está en el Top 50 del leaderboard
```

### Caso 3: Ganador del Premio Gordo

```
1. Carlos predice la final
2. Selecciona: Argentina campeón
3. Forma de victoria: Penales
4. Marcador: 3-3 (tiempo reglamentario)
5. La final termina exactamente así
6. Carlos es el único que acertó todo
7. Recibe 100,000 WGoal
8. Es el ganador del premio gordo
```

---

**Fin del documento de Dinámica de la Aplicación**
