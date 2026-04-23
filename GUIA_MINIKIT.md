# 🚀 Guía Rápida: Los 3 Componentes Esenciales de Worldcoin MiniApps

## 📋 Checklist para Cualquier MiniApp

### ✅ 1. CONECTAR WALLET
**¿Qué hace?** Conecta la wallet del usuario con tu app
**¿Cuándo usarlo?** Siempre primero, antes que nada

```tsx
import { MiniKit } from '@worldcoin/minikit-js';

const result = await MiniKit.connectWallet();
// ✅ result.success = true/false
// ✅ result.address = dirección del usuario
```

**Estados a manejar:**
- ❌ No conectado → Mostrar botón "Conectar"
- ✅ Conectado → Mostrar dirección + continuar

---

### ✅ 2. VERIFICAR HUMANIDAD
**¿Qué hace?** Verifica que es un humano real con World ID
**¿Cuándo usarlo?** Después de conectar wallet, antes de dar recompensas

```tsx
const result = await MiniKit.verify({
  action: "tu-app-action",        // Nombre único de tu acción
  signal: "datos-extra-opcionales" // Opcional
});
// ✅ result.success = true/false
// ✅ result.proof = prueba criptográfica
```

**Estados a manejar:**
- ❌ No verificado → Mostrar botón "Verificar con World ID"
- ✅ Verificado → Usuario puede usar la app

---

### ✅ 3. PAGAR/RECOMPENSAR
**¿Qué hace?** Envía tokens al usuario como recompensa
**¿Cuándo usarlo?** Después de verificar, cuando el usuario gane algo

```tsx
const result = await MiniKit.pay({
  reference: `reward_${Date.now()}`,  // ID único de transacción
  to: userAddress,                    // Dirección del usuario
  tokens: [{
    symbol: "WLD",                    // Tipo de token
    token_amount: "0.1"               // Cantidad (string)
  }]
});
// ✅ result.success = true/false
// ✅ result.transaction_id = ID de la transacción
```

**Estados a manejar:**
- 🎁 Disponible → Mostrar botón "Reclamar"
- ⏳ Procesando → Mostrar "Enviando..."
- ✅ Enviado → Mostrar confirmación

---

## 🔄 FLUJO TÍPICO DE CUALQUIER MINIAPP

```
1. Usuario abre la app
   ↓
2. [CONECTAR WALLET] → Obtener dirección
   ↓
3. [VERIFICAR HUMANIDAD] → Confirmar que es humano
   ↓
4. Usuario juega/interactúa con la app
   ↓
5. [PAGAR RECOMPENSA] → Enviar tokens ganados
```

---

## 🎯 REGLAS DE ORO

### ❌ NO hagas esto:
- ❌ No crear modales personalizados para wallet/pago/verificación
- ❌ No saltarse la verificación de humanidad
- ❌ No enviar recompensas sin verificar primero
- ❌ No usar `any` en TypeScript

### ✅ SÍ haz esto:
- ✅ Usar solo `MiniKit.connectWallet()`, `MiniKit.verify()`, `MiniKit.pay()`
- ✅ Manejar estados de loading/error en cada componente
- ✅ Verificar `result.success` antes de continuar
- ✅ Guardar la dirección del usuario después de conectar
- ✅ Usar referencias únicas para cada pago

---

## 📱 ESTRUCTURA DE COMPONENTES

```
components/
├── ConnectWallet.tsx    ← Maneja conexión
├── VerifyHuman.tsx      ← Maneja verificación  
├── ClaimReward.tsx      ← Maneja pagos
└── ...tu-logica-app.tsx ← Tu contenido específico
```

---

## 🚨 ERRORES COMUNES

1. **"MiniKit is not defined"**
   - ✅ Solución: Agregar `"use client"` al componente

2. **"Wallet not connected"**
   - ✅ Solución: Verificar que `MiniKit.connectWallet()` fue exitoso

3. **"Verification failed"**
   - ✅ Solución: Usuario debe tener World ID configurado

4. **"Payment failed"**
   - ✅ Solución: Verificar que el usuario esté verificado primero

---

## 💡 TIPS PARA PRINCIPIANTES

- **Siempre** usa `async/await` con MiniKit
- **Siempre** verifica `result.success` 
- **Siempre** maneja errores con `try/catch`
- **Nunca** asumas que el usuario tiene wallet conectada
- **Nunca** envíes recompensas sin verificar humanidad

---

## 🔧 TEMPLATE BÁSICO

```tsx
"use client";
import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';

export default function MiComponente() {
  const [estado, setEstado] = useState(false);
  
  const manejarAccion = async () => {
    try {
      const result = await MiniKit.FUNCION();
      if (result.success) {
        setEstado(true);
        // ✅ Éxito
      }
    } catch (error) {
      console.error('Error:', error);
      // ❌ Error
    }
  };

  return (
    <button onClick={manejarAccion}>
      Hacer Algo
    </button>
  );
}
```

---

**🎯 Con estos 3 componentes puedes crear cualquier MiniApp de Worldcoin**


npm install viem




