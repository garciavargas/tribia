# 🧪 Flujo de Prueba - Tribia

## Estado Actual: 2026-04-20

---

## 📋 Flujo Completo de Usuario

### 1️⃣ **Spinner de Carga** ✅
**Archivo:** `components/LoadingScreen.tsx`

```
Usuario abre app → LoadingScreen (3 segundos) → Home
```

**Estado:** ✅ Implementado

---

### 2️⃣ **Home / Landing Page** ✅
**Archivo:** `app/page.tsx`

**Elementos:**
- ⚽ Logo y título "Tribia Futbolera"
- ⏱️ Countdown al Mundial 2026
- 📊 Stats (jugadores, WGoal distribuidos, partidos)
- 📖 Sección "¿Cómo funciona?"
- 🎮 Preview de partidos
- 🏆 Premio Gordo destacado
- 🚀 Botón "Empezar a Jugar"

**Estado:** ✅ Implementado

---

### 3️⃣ **Conectar Wallet (Autenticación)** ✅
**Archivo:** `app/page.tsx` → función `handleConnect()`

**Flujo:**
```
Click "Empezar a Jugar"
  ↓
Verificar MiniKit disponible
  ↓
Paso 1: World ID Verification (Orb)
  ↓
Paso 2: Wallet Auth
  ↓
Guardar datos en localStorage
  ↓
Redirect a /dashboard
```

**Datos guardados:**
```typescript
localStorage.setItem("tribia_user", JSON.stringify({
  address: string,
  verified: boolean,
  nullifierHash: string,
  joinedAt: number
}));
```

**Estado:** ✅ Implementado

---

### 4️⃣ **Dashboard - Primera Sesión** ✅
**Archivo:** `app/dashboard/page.tsx`

**Flujo:**
```
Usuario llega a /dashboard
  ↓
Verificar localStorage "tribia_user"
  ↓
¿Existe "tribia_welcome_received"?
  ↓
NO → Mostrar PaymentModal (Bienvenida)
```

**Estado:** ✅ Implementado

---

### 5️⃣ **Modal de Pago - Bienvenida** ✅
**Archivo:** `components/modals/PaymentModal.tsx`

**Contenido:**
- 🎉 Título: "Recibir WGoal"
- 💰 Monto: 1 WGoal
- 📝 Descripción: "¡Bienvenido a Tribia!"
- ✅ Botón: "Recibir"

**Acción:**
```typescript
MiniKit.commandsAsync.pay({
  reference: "tribia-welcome-{timestamp}",
  to: TREASURY_WALLET,
  tokens: [{ symbol: "WLD", token_amount: "1" }],
  description: "🎉 ¡Bienvenido a Tribia!"
})
```

**Después del pago:**
```typescript
localStorage.setItem("tribia_welcome_received", "true");
localStorage.setItem("tribia_last_login", today);
setBalance(1); // Actualizar balance
```

**Estado:** ✅ Implementado

---

### 6️⃣ **Dashboard - Sesiones Posteriores** ✅
**Archivo:** `app/dashboard/page.tsx`

**Flujo:**
```
Usuario llega a /dashboard
  ↓
Verificar localStorage "tribia_user"
  ↓
¿Existe "tribia_welcome_received"? → SÍ
  ↓
Verificar "tribia_last_login"
  ↓
¿Es diferente a hoy?
  ↓
SÍ → Mostrar DailyRewardModal
```

**Estado:** ✅ Implementado

---

### 7️⃣ **Modal de Recompensa Diaria** ✅
**Archivo:** `components/modals/DailyRewardModal.tsx`

**Contenido:**
- 🎁 Título: "Recompensa Diaria"
- 💰 Monto: +1 WGoal
- 📝 Descripción: "Reclama tu recompensa diaria por iniciar sesión"
- ✅ Botón: "Reclamar"

**Acción:**
```typescript
distributeDailyReward(userAddress)
  ↓
sendWGoal(userAddress, 1)
  ↓
MiniKit.commandsAsync.sendTransaction({
  transaction: [{
    address: WGOAL_CONTRACT,
    abi: WGOAL_ABI,
    functionName: "transfer",
    args: [userAddress, "1000000000000000000"] // 1 WGoal en wei
  }]
})
```

**Después del pago:**
```typescript
localStorage.setItem("tribia_last_login", today);
setBalance(prev => prev + 1); // Actualizar balance
```

**Estado:** ✅ Implementado

---

## 🔍 Puntos a Verificar

### ✅ Implementado Correctamente

1. **LoadingScreen** → Animación de 3 segundos
2. **Home** → Landing page completa con countdown
3. **Autenticación** → World ID + Wallet Auth
4. **Redirect** → De home a dashboard después de auth
5. **PaymentModal** → Modal de bienvenida (1 WGoal)
6. **DailyRewardModal** → Modal de recompensa diaria (1 WGoal)
7. **localStorage** → Persistencia de datos de usuario

### ⚠️ Pendiente de Verificar

1. **MiniKit.commandsAsync.pay** → ¿Funciona correctamente?
2. **MiniKit.commandsAsync.sendTransaction** → ¿Funciona correctamente?
3. **WGOAL Token** → ¿Está desplegado en World Chain?
4. **Treasury Wallet** → ¿Tiene fondos suficientes?
5. **Balance real** → Actualmente es solo estado local

---

## 🧪 Pasos de Prueba Manual

### Test 1: Primera Vez
```
1. Abrir app desde World App
2. Ver LoadingScreen (3 seg)
3. Ver Home con countdown
4. Click "Empezar a Jugar"
5. Verificar World ID (Orb)
6. Conectar Wallet
7. Redirect a /dashboard
8. Ver PaymentModal "Bienvenida"
9. Click "Recibir"
10. Verificar transacción en World Chain
11. Modal se cierra
12. Balance muestra 1 WGoal
```

### Test 2: Segunda Sesión (Mismo Día)
```
1. Abrir app desde World App
2. Ver LoadingScreen (3 seg)
3. Redirect automático a /dashboard
4. NO ver modal (ya reclamó hoy)
5. Balance muestra 1 WGoal
```

### Test 3: Nueva Sesión (Día Diferente)
```
1. Abrir app desde World App
2. Ver LoadingScreen (3 seg)
3. Redirect automático a /dashboard
4. Ver DailyRewardModal
5. Click "Reclamar"
6. Verificar transacción en World Chain
7. Modal se cierra
8. Balance muestra 2 WGoal
```

---

## 🐛 Problemas Conocidos

### 1. PaymentModal usa "WLD" en lugar de "WGOAL"
**Archivo:** `components/modals/PaymentModal.tsx:35`

```typescript
// ❌ ACTUAL
tokens: [{
  symbol: "WLD",
  token_amount: amount.toString()
}]

// ✅ DEBERÍA SER
tokens: [{
  symbol: "WGOAL",
  token_amount: amount.toString()
}]
```

**Impacto:** El pago de bienvenida intenta enviar WLD en lugar de WGOAL

---

### 2. Balance es solo estado local
**Archivo:** `app/dashboard/page.tsx`

```typescript
const [balance, setBalance] = useState(0);
```

**Problema:** No se lee el balance real del contrato WGOAL

**Solución:** Implementar `getWGoalBalance()` en `lib/rewards.ts`

---

### 3. DailyRewardModal no recibe userAddress
**Archivo:** `app/dashboard/page.tsx:68`

```typescript
<DailyRewardModal
  open={showDailyModal}
  onClose={() => setShowDailyModal(false)}
  onSuccess={handleDailyRewardClaimed}
  // ❌ FALTA: userAddress={user.address}
/>
```

**Impacto:** El modal no puede distribuir la recompensa

---

## 🔧 Correcciones Necesarias

### 1. Cambiar WLD por WGOAL en PaymentModal
```typescript
// components/modals/PaymentModal.tsx
tokens: [{
  symbol: "WGOAL", // ← Cambiar aquí
  token_amount: amount.toString()
}]
```

### 2. Pasar userAddress a DailyRewardModal
```typescript
// app/dashboard/page.tsx
<DailyRewardModal
  open={showDailyModal}
  onClose={() => setShowDailyModal(false)}
  onSuccess={handleDailyRewardClaimed}
  userAddress={user.address} // ← Agregar aquí
/>
```

### 3. Implementar lectura de balance real
```typescript
// lib/rewards.ts
export async function getWGoalBalance(walletAddress: string): Promise<number> {
  // TODO: Leer balance del contrato WGOAL
}
```

---

## 📊 Resumen del Estado

| Componente | Estado | Notas |
|-----------|--------|-------|
| LoadingScreen | ✅ | Funciona correctamente |
| Home | ✅ | Completo y funcional |
| Autenticación | ✅ | World ID + Wallet Auth |
| PaymentModal | ⚠️ | Usa WLD en lugar de WGOAL |
| DailyRewardModal | ⚠️ | Falta userAddress |
| Balance | ⚠️ | Solo estado local |
| localStorage | ✅ | Persistencia correcta |

---

## 🎯 Próximos Pasos

1. ✅ Corregir PaymentModal (WLD → WGOAL)
2. ✅ Pasar userAddress a DailyRewardModal
3. 🔄 Implementar lectura de balance real
4. 🔄 Integrar con Firebase para persistencia
5. 🔄 Implementar sistema de predicciones

---

**Última actualización:** 2026-04-20 16:38
