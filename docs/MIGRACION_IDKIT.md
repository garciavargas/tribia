# ✅ Migración a World ID 4.0 (IDKit) - COMPLETADA

**Fecha:** 20 de abril de 2026  
**RP ID:** `rp_2392e525d07f07ec`

---

## 🎯 Cambios Implementados

### 1. Dependencias Actualizadas

**package.json:**
```json
"@worldcoin/idkit-core": "^4.0.0"
```

⚠️ **Pendiente:** Ejecutar `npm install --legacy-peer-deps` para instalar la dependencia.

---

### 2. Variables de Entorno

**Agregado a `.env.local`:**
```bash
NEXT_PUBLIC_RP_ID=rp_2392e525d07f07ec
```

---

### 3. Nuevos API Routes

#### `/api/rp-signature` (POST)
- **Función:** Genera firmas RP para solicitudes de verificación
- **Input:** `{ action: string }`
- **Output:** `{ sig, nonce, created_at, expires_at }`
- **Seguridad:** Usa `WORLDCOIN_SIGNING_KEY` (nunca expuesta al cliente)

#### `/api/verify-proof` (POST)
- **Función:** Verifica proofs con Developer Portal
- **Input:** `{ idkitResponse: IDKitResult }`
- **Output:** `{ success: boolean, nullifier: string }`
- **Validaciones:**
  - Verifica proof con `https://developer.world.org/api/v4/verify/{rp_id}`
  - Previene duplicados verificando nullifiers en Firebase
  - Retorna error 409 si el nullifier ya existe

---

### 4. Sistema de Nullifiers

**Nuevo archivo:** `lib/database/nullifiers.ts`

**Funciones:**
- `saveNullifier(nullifier, action, walletAddress?)` - Guarda nullifier en Firebase
- `checkNullifier(nullifier, action)` - Verifica si ya existe
- `getNullifiersByWallet(walletAddress)` - Obtiene nullifiers de un usuario
- `getNullifiersByAction(action)` - Obtiene nullifiers de una acción

**Estructura Firebase:**
```
nullifiers/
  {action}_{nullifier}/
    nullifier: string
    action: string
    walletAddress: string (opcional)
    verifiedAt: number
```

---

### 5. Frontend Actualizado

**`app/page.tsx` - Función `handleConnect()`:**

**Antes (MiniKit deprecado):**
```typescript
const verifyResult = await MiniKit.verify({
  action: "tribia-signup",
  signal: crypto.randomUUID(),
  verification_level: "orb"
});
```

**Después (IDKit 4.0):**
```typescript
// 1. Obtener RP signature del backend
const rpSig = await fetch("/api/rp-signature", {
  method: "POST",
  body: JSON.stringify({ action: "tribia-signup" }),
}).then(r => r.json());

// 2. Crear request con IDKit
const { IDKit, orbLegacy } = await import("@worldcoin/idkit-core");
const request = await IDKit.request({
  app_id: process.env.NEXT_PUBLIC_APP_ID!,
  action: "tribia-signup",
  rp_context: {
    rp_id: process.env.NEXT_PUBLIC_RP_ID!,
    nonce: rpSig.nonce,
    created_at: rpSig.created_at,
    expires_at: rpSig.expires_at,
    signature: rpSig.sig,
  },
  allow_legacy_proofs: true,
  environment: "production",
}).preset(orbLegacy({ signal: crypto.randomUUID() }));

// 3. Obtener proof
const idkitResponse = await request.pollUntilCompletion();

// 4. Verificar en backend
const verifyResult = await fetch("/api/verify-proof", {
  method: "POST",
  body: JSON.stringify({ idkitResponse }),
}).then(r => r.json());
```

---

## 🔒 Mejoras de Seguridad

### ✅ Antes vs Después

| Aspecto | Antes (MiniKit) | Después (IDKit) |
|---------|----------------|-----------------|
| **Verificación** | Solo frontend ❌ | Frontend + Backend ✅ |
| **Validación de proofs** | No ❌ | Sí, con Developer Portal ✅ |
| **Prevención de duplicados** | No ❌ | Sí, con nullifiers ✅ |
| **Firmas RP** | No ❌ | Sí, generadas en backend ✅ |
| **Exposición de keys** | N/A | Nunca expuestas ✅ |

---

## 📋 Checklist de Producción

- [x] Migrar a IDKit 4.0
- [x] Crear API routes de verificación
- [x] Implementar sistema de nullifiers
- [x] Actualizar frontend
- [x] Agregar RP ID a variables de entorno
- [ ] **Ejecutar `npm install --legacy-peer-deps`**
- [ ] **Probar flujo completo de verificación**
- [ ] **Verificar que nullifiers se guarden correctamente**
- [ ] **Probar prevención de duplicados**

---

## 🧪 Cómo Probar

### 1. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 2. Verificar variables de entorno
```bash
# .env.local debe tener:
NEXT_PUBLIC_APP_ID=app_afe38c34cfb308b51290a00fdf3b58e4
NEXT_PUBLIC_RP_ID=rp_2392e525d07f07ec
WORLDCOIN_SIGNING_KEY=0x761b3bb947ca906704be14cfeadb7db7e14a26d1f19aee5f59dd979b6b503e99
```

### 3. Iniciar servidor
```bash
npm run dev
```

### 4. Probar verificación
1. Abrir app desde World App
2. Click en "Empezar a Jugar"
3. Completar verificación World ID
4. Verificar que se guarde nullifier en Firebase
5. Intentar verificar de nuevo → Debe fallar con error 409

---

## 🚨 Errores Comunes

### Error: "Cannot read properties of null"
**Causa:** Problema con npm/Firebase  
**Solución:** Ejecutar `npm cache clean --force && npm install --legacy-peer-deps`

### Error: "WORLDCOIN_SIGNING_KEY not configured"
**Causa:** Variable de entorno faltante  
**Solución:** Verificar que `.env.local` tenga la clave

### Error: "This World ID has already been used"
**Causa:** Nullifier duplicado (comportamiento esperado)  
**Solución:** Usar otra World ID o cambiar el `action`

---

## 📚 Referencias

- [IDKit Integration Guide](https://docs.world.org/world-id/idkit/integrate)
- [RP Signatures](https://docs.world.org/world-id/idkit/signatures)
- [Verify API Reference](https://docs.world.org/api-reference/developer-portal/verify)
- [World ID 4.0 Migration](https://docs.world.org/world-id/4-0-migration)

---

## ✅ Estado Final

**Migración:** ✅ COMPLETADA  
**Seguridad:** ✅ MEJORADA  
**Producción:** ⚠️ PENDIENTE PRUEBAS

**Próximos pasos:**
1. Instalar dependencias
2. Probar flujo completo
3. Verificar nullifiers en Firebase
4. Desplegar a producción

---

**Implementado por:** Kiro AI  
**Fecha:** 20/04/2026 22:37 UTC
