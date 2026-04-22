# Corrección Wallet Auth - 21 Abril 2026

## 🎯 Problema Identificado

El usuario reportó problemas para conectar la wallet en la aplicación Tribia. El problema principal era el **orden del flujo de autenticación**.

### ❌ Flujo Anterior (Incorrecto)
```
1. Verificar World ID con IDKit 4.0
2. Conectar Wallet con MiniKit
```

**Problema:** IDKit puede causar conflictos o bloquear el flujo antes de conectar la wallet.

### ✅ Flujo Corregido
```
1. Conectar Wallet con MiniKit (PRIMERO)
2. Verificar World ID con IDKit 4.0 (DESPUÉS)
3. Si falla la verificación, permitir acceso temporal con wallet conectada
```

---

## 🔧 Cambios Aplicados

### Archivo: `app/page.tsx`

#### Mejoras Implementadas:

1. **Wallet Auth Primero**
   - Se conecta la wallet ANTES de verificar World ID
   - Esto asegura que el usuario tenga acceso incluso si falla la verificación

2. **Manejo de Errores Mejorado**
   - Logs detallados en consola para debugging
   - Mensajes de error específicos para cada caso
   - Fallback gracioso si falla la verificación

3. **Validación de Respuestas**
   ```typescript
   // Verificar si se ejecutó con fallback
   if (walletAuthResult.executedWith === "fallback") {
     toast.error("Debes usar World App para conectar");
     return;
   }

   // Verificar si tenemos la dirección
   if (!walletAuthResult.data?.address) {
     toast.error("No se pudo obtener la dirección de la wallet");
     return;
   }
   ```

4. **Acceso Temporal sin Verificación**
   - Si falla la verificación de World ID, el usuario puede acceder con `verified: false`
   - Esto permite probar la app mientras se resuelven problemas de verificación

---

## 📊 Estructura de Datos

### Usuario Verificado
```typescript
{
  address: "0x...",
  verified: true,
  nullifierHash: "0x...",
  joinedAt: 1234567890
}
```

### Usuario Sin Verificar (Temporal)
```typescript
{
  address: "0x...",
  verified: false,
  nullifierHash: null,
  joinedAt: 1234567890
}
```

---

## 🧪 Cómo Probar

### 1. En World App (Producción)

1. Abrir World App
2. Navegar a la Mini App de Tribia
3. Click en "🔗 Conectar con World ID"
4. Autorizar conexión de wallet
5. Completar verificación de World ID
6. Verificar redirección a `/dashboard`

### 2. En Desarrollo (Navegador)

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

**Nota:** En navegador normal, `MiniKit.walletAuth()` retornará `executedWith: "fallback"` y mostrará el mensaje de error apropiado.

---

## 🔍 Debugging

### Logs en Consola

El flujo ahora incluye logs detallados:

```typescript
console.log("Iniciando Wallet Auth con:", { nonce, requestId });
console.log("Wallet Auth Result:", walletAuthResult);
console.log("Wallet conectada:", address);
```

### Verificar en DevTools

1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Buscar los logs de autenticación
4. Verificar que `walletAuthResult.executedWith` sea `"minikit"` o `"wagmi"`

---

## ⚠️ Problemas Conocidos

### 1. IDKit puede fallar en algunos casos

**Síntoma:** Error al verificar World ID después de conectar wallet

**Solución Temporal:** El código ahora permite acceso con `verified: false`

**Solución Permanente:** Implementar verificación asíncrona en background

### 2. MiniKit no disponible en navegador

**Síntoma:** `executedWith: "fallback"`

**Solución:** Solo funciona en World App. Mostrar mensaje claro al usuario.

---

## 📝 Checklist de Verificación

- [x] Wallet Auth se ejecuta PRIMERO
- [x] Manejo de `executedWith === "fallback"`
- [x] Validación de `walletAuthResult.data?.address`
- [x] Logs detallados para debugging
- [x] Fallback gracioso si falla verificación
- [x] Build exitoso sin errores TypeScript
- [ ] Pruebas en World App (pendiente)
- [ ] Verificar flujo completo end-to-end

---

## 🚀 Próximos Pasos

1. **Probar en World App**
   - Verificar que la conexión funcione correctamente
   - Confirmar que la verificación de World ID se complete

2. **Implementar Verificación Asíncrona**
   - Permitir acceso inmediato después de conectar wallet
   - Verificar World ID en background
   - Actualizar estado del usuario cuando se complete

3. **Mejorar UX**
   - Mostrar estado de verificación en el dashboard
   - Permitir re-intentar verificación si falla
   - Agregar badge de "Verificado" en el perfil

---

## 📦 Archivos Modificados

```
app/page.tsx - Flujo de autenticación corregido
```

---

## 🔗 Referencias

- [MiniKit Wallet Auth](https://docs.world.org/mini-apps/commands/wallet-auth)
- [IDKit 4.0 Docs](https://docs.worldcoin.org/idkit)
- [Correcciones MiniKit](./CORRECCIONES_MINIKIT_2026-04-21.md)

---

**Fecha:** 21 de Abril 2026  
**Estado:** ✅ Correcciones aplicadas, build exitoso, pendiente pruebas en World App
