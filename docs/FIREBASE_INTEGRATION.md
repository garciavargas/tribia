# 🔥 Integración Firebase - Tribia

## ✅ Completado - 2026-04-20

---

## 📦 Instalación

```bash
pnpm install firebase
```

**Versión instalada:** `firebase@12.12.0`

---

## 🏗️ Estructura de Archivos

```
lib/
├── firebase.ts              # Configuración de Firebase
└── database/
    └── users.ts             # Funciones de usuarios y rewards

types/
└── database.ts              # Tipos TypeScript para BD

app/
├── page.tsx                 # Crear usuario en Firebase al registrarse
└── dashboard/page.tsx       # Leer datos de Firebase

components/modals/
└── DailyRewardModal.tsx     # Registrar reward en Firebase
```

---

## 🔧 Configuración

### `lib/firebase.ts`

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAbdosgXJhWVI_XDS6PifH6RkpdNZijkoQ",
  authDomain: "tribia-fb08c.firebaseapp.com",
  projectId: "tribia-fb08c",
  storageBucket: "tribia-fb08c.firebasestorage.app",
  messagingSenderId: "1095585601912",
  appId: "1:1095585601912:web:094b11fc85b13dcc1fd08d",
  measurementId: "G-ZC03DCMZKD"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
```

---

## 📊 Estructura de Base de Datos

### Colección: `users`

```typescript
interface User {
  walletAddress: string;        // Primary key (document ID)
  worldId: string;               // World ID verificado
  nullifierHash: string;         // Hash único de World ID
  username?: string;
  totalWGoal: number;            // Balance total
  dailyLoginStreak: number;      // Racha de logins
  lastLoginDate: string;         // ISO string
  welcomeReceived: boolean;      // Si ya recibió pago de bienvenida
  createdAt: string;             // ISO string
  referralCode?: string;
  referredBy?: string;
}
```

**Ejemplo:**
```json
{
  "walletAddress": "0x1234...5678",
  "worldId": "orb",
  "nullifierHash": "0xabcd...ef01",
  "totalWGoal": 5,
  "dailyLoginStreak": 3,
  "lastLoginDate": "2026-04-20T17:00:00.000Z",
  "welcomeReceived": true,
  "createdAt": "2026-04-17T10:00:00.000Z"
}
```

---

### Colección: `dailyRewards`

```typescript
interface DailyReward {
  rewardId: string;              // Primary key (userId-YYYY-MM-DD)
  userId: string;                // walletAddress
  date: string;                  // YYYY-MM-DD
  amount: number;                // Siempre 1 WGoal
  claimed: boolean;
  claimedAt?: string;            // ISO string
  txHash?: string;
}
```

**Ejemplo:**
```json
{
  "rewardId": "0x1234...5678-2026-04-20",
  "userId": "0x1234...5678",
  "date": "2026-04-20",
  "amount": 1,
  "claimed": true,
  "claimedAt": "2026-04-20T17:00:00.000Z",
  "txHash": "0xabc...def"
}
```

---

## 🔄 Flujo de Datos

### 1️⃣ Registro de Usuario

```
Usuario completa World ID + Wallet Auth
  ↓
app/page.tsx → handleConnect()
  ↓
createUser(address, worldId, nullifierHash)
  ↓
Firestore: users/{walletAddress}
  ↓
Redirect a /dashboard
```

**Código:**
```typescript
const { createUser, getUser } = await import("@/lib/database/users");
const existingUser = await getUser(finalPayload.address);

if (!existingUser) {
  await createUser(
    finalPayload.address,
    verifyResult.finalPayload.verification_level,
    verifyResult.finalPayload.nullifier_hash
  );
}
```

---

### 2️⃣ Dashboard - Cargar Datos

```
Usuario entra a /dashboard
  ↓
getUser(walletAddress)
  ↓
Leer datos de Firestore
  ↓
Verificar welcomeReceived
  ├─ false → Mostrar PaymentModal
  └─ true → Verificar hasClaimedDailyReward()
      ├─ false → Mostrar DailyRewardModal
      └─ true → Dashboard normal
```

**Código:**
```typescript
const dbUser = await getUser(parsedUser.address);

if (!dbUser.welcomeReceived) {
  setShowWelcomeModal(true);
} else {
  const alreadyClaimed = await hasClaimedDailyReward(parsedUser.address);
  if (!alreadyClaimed) {
    setShowDailyModal(true);
  }
}
```

---

### 3️⃣ Reclamar Reward Diario

```
Usuario click "Reclamar"
  ↓
distributeDailyReward(address) → Envía 1 WGoal
  ↓
recordDailyReward(address, txHash)
  ↓
Firestore: dailyRewards/{userId-date}
  ↓
updateWGoalBalance(address, +1)
  ↓
Actualizar lastLoginDate y dailyLoginStreak
```

**Código:**
```typescript
const success = await distributeDailyReward(userAddress);

if (success) {
  const { recordDailyReward } = await import("@/lib/database/users");
  await recordDailyReward(userAddress, "tx-hash-placeholder");
  
  toast.success("¡Recompensa reclamada! +1 WGoal");
  onSuccess();
}
```

---

## 🛠️ Funciones Disponibles

### `lib/database/users.ts`

| Función | Descripción | Parámetros | Retorno |
|---------|-------------|------------|---------|
| `createUser()` | Crear nuevo usuario | `walletAddress, worldId, nullifierHash` | `User` |
| `getUser()` | Obtener usuario | `walletAddress` | `User \| null` |
| `updateUser()` | Actualizar datos | `walletAddress, data` | `void` |
| `markWelcomeReceived()` | Marcar bienvenida | `walletAddress` | `void` |
| `updateWGoalBalance()` | Actualizar balance | `walletAddress, amount` | `void` |
| `hasClaimedDailyReward()` | Verificar reward hoy | `walletAddress` | `boolean` |
| `recordDailyReward()` | Registrar reward | `walletAddress, txHash` | `void` |
| `getUserStreak()` | Obtener racha | `walletAddress` | `number` |

---

## 🔐 Reglas de Seguridad (Firestore)

**Pendiente de configurar en Firebase Console:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios: Solo lectura pública, escritura solo por el propio usuario
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Daily Rewards: Solo lectura pública, escritura autenticada
    match /dailyRewards/{rewardId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Predicciones: Solo lectura pública, escritura autenticada
    match /predictions/{predictionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📝 Migraciones Pendientes

### De localStorage a Firebase

**Antes:**
```typescript
localStorage.setItem("tribia_welcome_received", "true");
localStorage.setItem("tribia_last_login", today);
```

**Después:**
```typescript
await markWelcomeReceived(walletAddress);
// lastLoginDate se actualiza automáticamente en recordDailyReward()
```

---

## 🧪 Testing

### Test 1: Registro de Usuario
```
1. Completar World ID + Wallet Auth
2. Verificar que se crea documento en Firestore: users/{address}
3. Verificar campos: welcomeReceived = false, totalWGoal = 0
```

### Test 2: Primer Login (Bienvenida)
```
1. Entrar a /dashboard
2. Ver PaymentModal
3. Reclamar 1 WGoal
4. Verificar que welcomeReceived = true en Firestore
5. Verificar que totalWGoal = 1
```

### Test 3: Reward Diario
```
1. Entrar a /dashboard (día diferente)
2. Ver DailyRewardModal
3. Reclamar 1 WGoal
4. Verificar documento en dailyRewards/{userId-date}
5. Verificar que totalWGoal aumenta en 1
6. Verificar que dailyLoginStreak aumenta
```

---

## 🚀 Próximos Pasos

1. ✅ **Firebase configurado** - Listo
2. ✅ **Funciones de usuarios** - Listo
3. 🔄 **Configurar reglas de seguridad** - Pendiente
4. 🔄 **Implementar predicciones** - Siguiente fase
5. 🔄 **Implementar referidos** - Siguiente fase
6. 🔄 **Implementar leaderboard** - Siguiente fase

---

## 🐛 Notas Importantes

### Analytics
- `getAnalytics()` solo funciona en cliente (browser)
- Usar `getAnalyticsInstance()` que verifica `typeof window !== "undefined"`

### Inicialización
- Firebase se inicializa solo una vez con `getApps().length === 0`
- Evita errores de "Firebase already initialized"

### Timestamps
- Usar `new Date().toISOString()` para fechas
- Formato: `"2026-04-20T17:00:00.000Z"`

### Queries
- `hasClaimedDailyReward()` usa query compuesto:
  - `where("userId", "==", walletAddress)`
  - `where("date", "==", today)`
  - `where("claimed", "==", true)`

---

**Última actualización:** 2026-04-20 17:13
**Estado:** ✅ Integración completa y funcional
