# Correcciones MiniKit - 21 Abril 2026

## 🎯 Objetivo
Corregir toda la implementación de MiniKit según la documentación oficial de Worldcoin para resolver errores de autenticación y transacciones.

---

## 📚 Documentación Revisada

### Comandos Principales
1. ✅ [Wallet Auth](https://docs.world.org/mini-apps/commands/wallet-auth)
2. ✅ [Pay](https://docs.world.org/mini-apps/commands/pay)
3. ✅ [Send Transaction](https://docs.world.org/mini-apps/commands/send-transaction)

### Comandos Adicionales (No usados en el proyecto)
- [Notifications](https://docs.world.org/mini-apps/commands/how-to-send-notifications)
- [Haptic Feedback](https://docs.world.org/mini-apps/commands/send-haptic-feedback)
- [Share](https://docs.world.org/mini-apps/commands/share)
- [Attestation](https://docs.world.org/mini-apps/commands/attestation)
- [Close MiniApp](https://docs.world.org/mini-apps/commands/close-miniapp)

### Referencias
- [Address Book](https://docs.world.org/mini-apps/reference/address-book)
- [Usernames](https://docs.world.org/mini-apps/reference/usernames)
- [Status Page](https://docs.world.org/mini-apps/reference/status-page)
- [Payment Methods](https://docs.world.org/mini-apps/reference/payment-methods)

---

## 🔧 Cambios Aplicados

### 1. **app/page.tsx** - Wallet Authentication

#### ❌ ANTES (Incorrecto)
```typescript
const { finalPayload } = await MiniKit.walletAuth({
  nonce: "...",
  // ...
});

if (finalPayload.status === "success") {
  const address = finalPayload.address;
}
```

#### ✅ DESPUÉS (Correcto)
```typescript
const walletAuthResult = await MiniKit.walletAuth({
  nonce: "...",
  // ...
});

if (walletAuthResult.executedWith === "fallback") {
  toast.error("Debes usar World App para conectar");
  return;
}

if (walletAuthResult.data?.address) {
  const address = walletAuthResult.data.address;
}
```

**Cambios clave:**
- Retorna `{ executedWith, data }` no `{ finalPayload }`
- `executedWith` puede ser: `"minikit"`, `"wagmi"`, o `"fallback"`
- Datos del usuario en `data.address`, `data.message`, `data.signature`

---

### 2. **components/modals/PaymentModal.tsx** - Pay Command

#### ❌ ANTES (Incorrecto)
```typescript
const { finalPayload } = await MiniKit.pay({
  reference: "...",
  to: "0x...",
  tokens: [{ symbol: "WGOAL", token_amount: "1" }],
  description: "..."
});

if (finalPayload.status === "success") {
  // ...
}
```

#### ✅ DESPUÉS (Correcto)
```typescript
const payResult = await MiniKit.pay({
  reference: "...",
  to: "0x...",
  tokens: [{ symbol: "WGOAL", token_amount: "1" }],
  description: "..."
});

if (payResult.executedWith === "fallback") {
  toast.error("Debes usar World App para realizar pagos");
  return;
}

if (payResult.data?.transactionId) {
  // Pago exitoso
  const txId = payResult.data.transactionId;
}
```

**Cambios clave:**
- Retorna `{ executedWith, data }` no `{ finalPayload }`
- Datos del pago en `data.transactionId`, `data.reference`, `data.from`, `data.chain`, `data.timestamp`
- Usar toasts en lugar de `alert()`

---

### 3. **lib/rewards.ts** - Send Transaction

#### ❌ ANTES (Incorrecto)
```typescript
const result: any = await MiniKit.sendTransaction({
  chainId: 480,
  transactions: [
    {
      to: TOKEN_ADDRESS,
      abi: WGOAL_ABI,
      functionName: "transfer",
      args: [recipient, amount]
    } as any
  ]
});

if (result.finalPayload?.status === "success") {
  return result.finalPayload.transaction_hash;
}
```

#### ✅ DESPUÉS (Correcto)
```typescript
import { encodeFunctionData } from "viem";

const result = await MiniKit.sendTransaction({
  chainId: 480,
  transactions: [
    {
      to: TOKEN_ADDRESS as `0x${string}`,
      data: encodeFunctionData({
        abi: WGOAL_ABI,
        functionName: "transfer",
        args: [recipient as `0x${string}`, amount]
      })
    }
  ]
});

if (result.executedWith === "fallback") {
  return { success: false, error: "Must use World App" };
}

if (result.data?.userOpHash) {
  return { success: true, txHash: result.data.userOpHash };
}
```

**Cambios clave:**
- Usar `encodeFunctionData` de viem para generar `data`
- NO usar `abi`, `functionName`, `args` directamente
- Retorna `{ executedWith, data }` donde `data` contiene `userOpHash` (NO `transaction_hash`)
- `userOpHash` es el identificador inicial, el hash final se obtiene después

---

### 4. **components/modals/ModalInicio.tsx** - UI Improvements

#### Cambios aplicados:
- ✅ Título centrado con balón: "Tribia Futb⚽lera"
- ✅ Números del contador centrados con `minWidth: 60` y `textAlign: center`
- ✅ Simplificado: solo "✅ Solo humanos verificados" + botón conectar
- ✅ Eliminada tabla de ganancias para reducir complejidad

---

### 5. **app/my-predictions/page.tsx** - TypeScript Fix

#### ❌ ANTES
```typescript
const getPredictionIcon = (isCorrect: boolean | null) => {
  if (isCorrect === null) return "⏳";
  // ...
}
```

#### ✅ DESPUÉS
```typescript
const getPredictionIcon = (isCorrect: boolean | null | undefined) => {
  if (isCorrect === null || isCorrect === undefined) return "⏳";
  // ...
}
```

---

## 📊 Formato de Respuestas MiniKit

### Wallet Auth Response
```typescript
type WalletAuthResponse =
  | {
      executedWith: "minikit" | "wagmi";
      data: {
        address: string;
        message: string;
        signature: string;
      };
    }
  | {
      executedWith: "fallback";
      data: unknown;
    };
```

### Pay Response
```typescript
type PayResponse =
  | {
      executedWith: "minikit";
      data: {
        transactionId: string;
        reference: string;
        from: string;
        chain: "worldchain";
        timestamp: string;
      };
    }
  | {
      executedWith: "fallback";
      data: unknown;
    };
```

### Send Transaction Response
```typescript
type SendTransactionResponse =
  | {
      executedWith: "minikit" | "wagmi";
      data: {
        userOpHash: string;
        status: "success";
        version: number;
        from: string;
        timestamp: string;
      };
    }
  | {
      executedWith: "fallback";
      data: unknown;
    };
```

---

## ⚠️ Problemas Conocidos

### 1. `getWGoalBalance()` en lib/rewards.ts
**Problema:** Usa `sendTransaction` para una función de lectura (view function)

**Solución temporal:** Retorna 0

**Solución correcta:** Usar un método de lectura de contrato (viem `readContract` o similar)

```typescript
// TODO: Implementar correctamente
import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

const client = createPublicClient({
  chain: worldchain,
  transport: http()
});

const balance = await client.readContract({
  address: WGOAL_ADDRESS,
  abi: WGOAL_ABI,
  functionName: "balanceOf",
  args: [walletAddress]
});
```

### 2. User Operation Hash vs Transaction Hash
**Importante:** `sendTransaction` retorna `userOpHash` (identificador de operación de usuario), NO el hash de transacción final.

Para obtener el hash final:
- Usar `@worldcoin/minikit-react` hook `useUserOperationReceipt`
- O hacer polling al Developer Portal API: `GET /api/v2/minikit/userop/{userOpHash}`

---

## 🔐 Validación Backend

### Wallet Auth
```typescript
import { verifySiweMessage } from "@worldcoin/minikit-js/siwe";

const verification = await verifySiweMessage(
  payload,
  nonce,
  // statement,  — opcional
  // requestId,  — opcional
  // viemClient, — opcional
);
```

### Pay
```typescript
const response = await fetch(
  `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${APP_ID}&type=payment`,
  {
    headers: {
      Authorization: `Bearer ${DEV_PORTAL_API_KEY}`,
    },
  }
);
```

---

## 📝 Checklist de Verificación

- [x] Wallet Auth usa `{ executedWith, data }`
- [x] Pay usa `{ executedWith, data }`
- [x] Send Transaction usa `encodeFunctionData` de viem
- [x] Todas las respuestas validan `executedWith === "fallback"`
- [x] Eliminados todos los `alert()` y reemplazados por toasts
- [x] TypeScript types corregidos
- [x] ModalInicio mejorado y simplificado
- [ ] Build exitoso sin errores
- [ ] Pruebas en World App

---

## 🚀 Próximos Pasos

1. **Ejecutar build:** `npm run build`
2. **Corregir errores de TypeScript** si los hay
3. **Implementar `getWGoalBalance` correctamente** con viem readContract
4. **Probar en World App** el flujo completo:
   - Verificación World ID
   - Wallet Auth
   - Recibir pago de bienvenida
   - Enviar transacciones
5. **Configurar whitelist en Developer Portal:**
   - Tokens Permit2: WGOAL
   - Contract Entrypoints: Contratos que usa la app

---

## 📦 Archivos Modificados

```
components/modals/PaymentModal.tsx
components/modals/ModalInicio.tsx
app/page.tsx
app/my-predictions/page.tsx
lib/rewards.ts
```

---

## 🔗 Referencias Útiles

- [MiniKit Docs](https://docs.world.org/mini-apps)
- [Developer Portal](https://developer.worldcoin.org)
- [Viem Docs](https://viem.sh)
- [Permit2 Docs](https://docs.uniswap.org/contracts/permit2)

---

**Fecha:** 21 de Abril 2026  
**Estado:** ✅ Correcciones aplicadas, pendiente build y pruebas
