# ✅ Validaciones Implementadas - Tribia

## 🔐 Validaciones de Autenticación

### 1. World ID Verification (IDKit 4.0)

**Endpoint:** `POST /api/verify-proof`

**Validaciones:**
- ✅ IDKit response requerido
- ✅ RP ID configurado
- ✅ Verificación con Developer Portal (`https://developer.world.org/api/v4/verify/{rpId}`)
- ✅ Extracción de nullifier
- ✅ Verificación de nullifier duplicado (anti-replay)
- ✅ Guardado de nullifier en Firebase

**Flujo:**
```
1. Usuario completa verificación World ID
2. Backend recibe proof de IDKit
3. Verifica proof con Developer Portal
4. Extrae nullifier
5. Verifica que nullifier no exista (checkNullifier)
6. Guarda nullifier (saveNullifier)
7. Retorna success + nullifier
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "nullifier": "0x...",
  "verification": { ... }
}
```

**Errores Posibles:**
- `400` - IDKit response faltante
- `400` - Verificación fallida
- `409` - Nullifier ya usado (World ID duplicado)
- `500` - Error de servidor

---

### 2. RP Signature Generation

**Endpoint:** `POST /api/rp-signature`

**Validaciones:**
- ✅ Action requerido
- ✅ Signing key configurado
- ✅ Generación de nonce único
- ✅ Firma con `signRequest` de IDKit

**Respuesta:**
```json
{
  "sig": "0x...",
  "nonce": "...",
  "created_at": "...",
  "expires_at": "..."
}
```

---

### 3. Wallet Auth (MiniKit)

**Validaciones en Frontend:**
- ✅ MiniKit disponible (`isMiniKitAvailable()`)
- ✅ Nonce único generado
- ✅ Request ID único
- ✅ Expiración configurada (7 días)
- ✅ Verificación de `executedWith !== "fallback"`
- ✅ Verificación de `data.address` presente

**Código:**
```typescript
const walletAuthResult = await MiniKit.walletAuth({
  nonce: crypto.randomUUID(),
  requestId: crypto.randomUUID(),
  expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  statement: "Inicia sesión en Tribia..."
});

// Validaciones
if (walletAuthResult.executedWith === "fallback") {
  // Error: No está en World App
}

if (!walletAuthResult.data?.address) {
  // Error: No se obtuvo dirección
}
```

---

## 🗄️ Validaciones de Base de Datos

### 1. Nullifiers (Anti-Replay)

**Colección:** `nullifiers`

**Estructura:**
```typescript
{
  nullifier: string,
  action: string,
  walletAddress?: string,
  verifiedAt: number
}
```

**Funciones:**
- `saveNullifier(nullifier, action, walletAddress?)` - Guarda nullifier
- `checkNullifier(nullifier, action)` - Verifica si existe
- `getNullifiersByWallet(walletAddress)` - Obtiene por wallet
- `getNullifiersByAction(action)` - Obtiene por acción

**Validación Clave:**
```typescript
const exists = await checkNullifier(nullifier, action);
if (exists) {
  return { error: "World ID ya usado" };
}
```

---

### 2. Usuarios

**Colección:** `users`

**Estructura:**
```typescript
{
  walletAddress: string,
  worldId: string,
  nullifierHash: string,
  totalWGoal: number,
  dailyLoginStreak: number,
  lastLoginDate: string,
  welcomeReceived: boolean,
  createdAt: string
}
```

**Validaciones:**
- ✅ Wallet address único (ID del documento)
- ✅ World ID verificado
- ✅ Nullifier hash guardado
- ✅ Balance WGoal >= 0
- ✅ Fecha de último login válida

**Funciones:**
- `createUser(walletAddress, worldId, nullifierHash)` - Crea usuario
- `getUser(walletAddress)` - Obtiene usuario
- `updateUser(walletAddress, data)` - Actualiza datos
- `markWelcomeReceived(walletAddress)` - Marca bienvenida recibida
- `updateWGoalBalance(walletAddress, amount)` - Actualiza balance

---

### 3. Recompensas Diarias

**Colección:** `dailyRewards`

**Estructura:**
```typescript
{
  rewardId: string, // walletAddress-YYYY-MM-DD
  userId: string,
  date: string, // YYYY-MM-DD
  amount: number,
  claimed: boolean,
  claimedAt: string,
  txHash: string
}
```

**Validaciones:**
- ✅ Un reward por día por usuario
- ✅ Fecha en formato YYYY-MM-DD
- ✅ Amount = 1 WGoal
- ✅ TxHash presente

**Funciones:**
- `hasClaimedDailyReward(walletAddress)` - Verifica si ya reclamó hoy
- `recordDailyReward(walletAddress, txHash)` - Registra reward
- `getUserStreak(walletAddress)` - Obtiene racha de login

**Validación Clave:**
```typescript
const hasClaimed = await hasClaimedDailyReward(walletAddress);
if (hasClaimed) {
  return { error: "Ya reclamaste tu reward de hoy" };
}
```

---

## 🔒 Validaciones de Seguridad

### 1. Variables de Entorno

**Requeridas:**
```bash
NEXT_PUBLIC_APP_ID=app_...
NEXT_PUBLIC_RP_ID=rp_...
WORLDCOIN_SIGNING_KEY=0x...
```

**Validación en Runtime:**
```typescript
if (!process.env.NEXT_PUBLIC_APP_ID) {
  throw new Error("APP_ID no configurado");
}
```

---

### 2. Nullifier Duplicado (Anti-Sybil)

**Problema:** Un usuario intenta usar el mismo World ID múltiples veces

**Solución:**
```typescript
// En /api/verify-proof
const exists = await checkNullifier(nullifier, action);
if (exists) {
  return NextResponse.json(
    { error: "This World ID has already been used" },
    { status: 409 }
  );
}
```

---

### 3. Reward Diario Duplicado

**Problema:** Un usuario intenta reclamar múltiples rewards en el mismo día

**Solución:**
```typescript
const today = new Date().toISOString().split('T')[0];
const hasClaimed = await hasClaimedDailyReward(walletAddress);

if (hasClaimed) {
  return { error: "Ya reclamaste tu reward de hoy" };
}
```

---

## 🧪 Cómo Probar Validaciones

### 1. Nullifier Duplicado

```bash
# Primera vez - debe funcionar
curl -X POST /api/verify-proof \
  -H "Content-Type: application/json" \
  -d '{"idkitResponse": {...}}'

# Segunda vez con mismo nullifier - debe fallar con 409
curl -X POST /api/verify-proof \
  -H "Content-Type: application/json" \
  -d '{"idkitResponse": {...}}'
```

**Resultado Esperado:** `409 Conflict - World ID ya usado`

---

### 2. Reward Diario Duplicado

```typescript
// Primera vez - debe funcionar
await recordDailyReward(walletAddress, txHash);

// Segunda vez mismo día - debe fallar
const hasClaimed = await hasClaimedDailyReward(walletAddress);
// hasClaimed === true
```

---

### 3. Wallet Auth sin World App

```typescript
// En navegador normal (no World App)
const result = await MiniKit.walletAuth({...});

// result.executedWith === "fallback"
// Debe mostrar: "Debes usar World App para conectar"
```

---

## 📊 Estado de Validaciones

| Validación | Estado | Prioridad |
|-----------|--------|-----------|
| World ID Verification | ✅ Implementado | Alta |
| Nullifier Anti-Replay | ✅ Implementado | Alta |
| Wallet Auth | ✅ Implementado | Alta |
| Reward Diario Único | ✅ Implementado | Alta |
| Balance WGoal | ✅ Implementado | Media |
| Racha de Login | ✅ Implementado | Media |
| Variables de Entorno | ✅ Implementado | Alta |

---

## ⚠️ Validaciones Pendientes

### 1. Verificación de Transacciones

**Problema:** No se verifica que las transacciones de pago realmente se ejecutaron

**Solución Propuesta:**
```typescript
// Verificar con Developer Portal API
const response = await fetch(
  `https://developer.worldcoin.org/api/v2/minikit/transaction/${txId}`,
  {
    headers: {
      Authorization: `Bearer ${DEV_PORTAL_API_KEY}`
    }
  }
);
```

---

### 2. Rate Limiting

**Problema:** Un usuario puede hacer múltiples requests rápidamente

**Solución Propuesta:**
- Implementar rate limiting en API routes
- Usar Redis o Firebase para tracking
- Límite: 10 requests por minuto por IP

---

### 3. Validación de Predicciones

**Problema:** No hay validación de que las predicciones sean válidas

**Solución Propuesta:**
```typescript
// Validar que el partido existe
// Validar que el partido no ha comenzado
// Validar que el usuario no ha predicho antes
```

---

## 🚀 Recomendaciones

1. **Probar en World App** - Todas las validaciones funcionan correctamente en desarrollo
2. **Monitorear Logs** - Revisar logs de Firebase y Developer Portal
3. **Implementar Rate Limiting** - Prevenir abuso de APIs
4. **Agregar Validación de Transacciones** - Verificar que los pagos se ejecutaron
5. **Testing Automatizado** - Crear tests para cada validación

---

**Fecha:** 21 de Abril 2026  
**Estado:** ✅ Validaciones core implementadas y funcionando
