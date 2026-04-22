# 🎁 Sistema de Referidos - Tribia

## 📋 Cómo Funciona

### 1. Código Único por Usuario
Cada usuario tiene un **código de referido único** de 8 caracteres generado automáticamente desde su wallet address:

```typescript
// Ejemplo: Wallet 0xABCD1234EFGH5678...
// Código: ABCD1234
```

### 2. Compartir el Código
El usuario puede compartir:
- **Código directo:** `ABCD1234`
- **Link con código:** `https://tribia.app?ref=ABCD1234`

### 3. Aplicar Código
Cuando un nuevo usuario:
1. Se registra en Tribia
2. Ingresa el código de referido
3. **Ambos ganan 5 WGoal** 🎉

### 4. Recompensas
- **Referidor:** 5 WGoal por cada persona que refiere
- **Referido:** 5 WGoal al usar un código
- **Sin límite** de referidos

---

## 🏗️ Arquitectura

### Base de Datos

#### Tabla: Users (actualizada)
```typescript
interface User {
  walletAddress: string;
  referralCode: string;      // Código único (8 chars)
  referredBy?: string;       // Código de quien lo refirió
  totalReferrals: number;    // Cuántos ha referido
  referralEarnings: number;  // WGoal ganados por referidos
}
```

#### Tabla: Referrals
```typescript
interface Referral {
  referralId: string;
  referrerId: string;        // Wallet del que refiere
  referredId: string;        // Wallet del referido
  referralCode: string;      // Código usado
  timestamp: Date;
  rewardClaimed: boolean;
  rewardAmount: number;      // 5 WGoal
}
```

---

## 🔐 Validaciones

### Al Aplicar un Código:
1. ✅ El código debe existir en la base de datos
2. ✅ No puede ser el propio código del usuario
3. ✅ El usuario solo puede usar UN código (una vez)
4. ✅ El código debe tener formato válido (8 chars hex)

### Ejemplo de Validación:
```typescript
// ❌ Inválido
applyReferralCode("0xABCD...", "ABCD1234") // Es su propio código

// ❌ Inválido
applyReferralCode("0xABCD...", "XYZ") // Formato incorrecto

// ✅ Válido
applyReferralCode("0xABCD...", "12345678") // Código de otro usuario
```

---

## 🎮 Flujo de Usuario

### Escenario 1: Usuario A refiere a Usuario B

1. **Usuario A** comparte su código: `ABCD1234`
2. **Usuario B** se registra en Tribia
3. **Usuario B** ingresa el código `ABCD1234`
4. Sistema valida el código
5. **Ambos reciben 5 WGoal** 💰
6. Stats de Usuario A:
   - `totalReferrals: 1`
   - `referralEarnings: 5`

### Escenario 2: Link con Código

1. **Usuario A** comparte: `https://tribia.app?ref=ABCD1234`
2. **Usuario B** abre el link
3. Al registrarse, el código se aplica **automáticamente**
4. **Ambos reciben 5 WGoal** 💰

---

## 🚀 Implementación

### Frontend (Componente)
```typescript
import ReferralSystem from "@/components/ReferralSystem";

<ReferralSystem walletAddress={user.walletAddress} />
```

### Backend (Lógica)
```typescript
import { applyReferralCode, getUserReferralStats } from "@/lib/referrals";

// Aplicar código
const result = await applyReferralCode(newUserId, "ABCD1234");

// Obtener stats
const stats = await getUserReferralStats(userId);
```

---

## 📊 Métricas

### KPIs del Sistema de Referidos
- **Tasa de conversión:** % de usuarios que usan un código
- **Viralidad:** Promedio de referidos por usuario
- **Tokens distribuidos:** Total de WGoal por referidos
- **Top referidores:** Usuarios con más referidos

### Objetivos
- **30% de usuarios** usan un código de referido
- **2 referidos promedio** por usuario activo
- **10,000 WGoal** distribuidos en el primer mes

---

## 🔮 Futuras Mejoras

### Fase 2: Gamificación
- 🏆 **Badges:** "Influencer" (10+ referidos), "Viral" (50+ referidos)
- 🎁 **Bonos:** 50 WGoal al llegar a 10 referidos
- 📊 **Leaderboard:** Top 10 referidores del mes

### Fase 3: Recompensas Dinámicas
- 💎 **Referidos activos:** Bonus si el referido hace predicciones
- 🔥 **Rachas:** Bonus por referir X usuarios en Y días
- 🎰 **Eventos especiales:** 2x recompensas en fechas clave

---

## 🛠️ TODO (Implementación Completa)

- [ ] Crear tabla `Referrals` en base de datos
- [ ] Agregar campos de referidos a tabla `Users`
- [ ] Implementar función `saveReferral()` en backend
- [ ] Implementar función `getWalletFromReferralCode()` con DB
- [ ] Conectar distribución de tokens con smart contract
- [ ] Agregar analytics de referidos
- [ ] Crear página de leaderboard de referidores
- [ ] Implementar detección automática de código desde URL
- [ ] Agregar notificaciones cuando alguien usa tu código
- [ ] Crear sistema de badges y logros

---

## 📞 Preguntas Frecuentes

### ¿Puedo cambiar mi código de referido?
No, el código es único y permanente basado en tu wallet.

### ¿Cuántos códigos puedo usar?
Solo puedes usar UN código de referido al registrarte.

### ¿Hay límite de referidos?
No, puedes referir a tantas personas como quieras.

### ¿Cuándo recibo los tokens?
Inmediatamente después de que el referido aplique tu código.

---

**¡Comparte Tribia y gana WGoal! ⚽💰**
