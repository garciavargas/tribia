# 🚨 Corrección Urgente - Error BigInt

## Problema Identificado

**Error:** `TypeError: Cannot convert undefined to a BigInt`

**Causa:** El signing key en `.env.local` tiene el prefijo `0x` pero `signRequest` de IDKit espera solo el hex sin prefijo.

## Solución Aplicada

### Archivo: `app/api/rp-signature/route.ts`

```typescript
// ANTES (causaba error)
const { sig, nonce, createdAt, expiresAt } = signRequest({
  signingKeyHex: signingKey, // "0xc5bae87f..."
  action,
});

// DESPUÉS (corregido)
const cleanKey = signingKey.startsWith('0x') 
  ? signingKey.slice(2) 
  : signingKey;

const { sig, nonce, createdAt, expiresAt } = signRequest({
  signingKeyHex: cleanKey, // "c5bae87f..."
  action,
});
```

## Corrección de Iconos

### Problema
El manifest.json referenciaba `icono-*.png` pero los archivos correctos son `icon-*.png`

### Solución
- Actualizado `public/manifest.json` con rutas correctas
- Actualizado `app/layout.tsx` con referencias correctas
- Agregados todos los tamaños: 48, 72, 96, 144, 192, 512

## Probar Ahora

1. **Reiniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

2. **Probar en World App:**
   - Click en "Conectar con World ID"
   - Debe funcionar sin error de BigInt
   - Iconos deben cargar correctamente

3. **Verificar en consola:**
   - No debe aparecer error 500 en `/api/rp-signature`
   - Debe aparecer: "Wallet conectada: 0x..."

## Estado

- ✅ Error BigInt corregido
- ✅ Iconos actualizados
- ✅ Build exitoso
- ⏳ Listo para probar en World App

---

**Fecha:** 21 Abril 2026 20:28  
**Prioridad:** 🚨 CRÍTICO - Bloqueaba autenticación
