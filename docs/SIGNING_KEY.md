# 🔐 Worldcoin Signing Key - CONFIDENCIAL

## ⚠️ INFORMACIÓN CRÍTICA DE SEGURIDAD

Esta clave de firma es **EXTREMADAMENTE SENSIBLE** y debe protegerse como una contraseña.

### Clave de Firma
```
0x761b3bb947ca906704be14cfeadb7db7e14a26d1f19aee5f59dd979b6b503e99
```

### Ubicación Segura
✅ Guardada en: `.env.local` (ignorado por Git)

### Uso
Esta clave se utiliza para:
- Firmar operaciones en la aplicación Tribia
- Autenticar requests al Developer Portal de Worldcoin
- Validar transacciones de la Mini App

### Reglas de Seguridad

❌ **NUNCA:**
- Subir a Git/GitHub
- Compartir en mensajes/emails
- Hardcodear en el código
- Exponer en logs o consola
- Incluir en screenshots

✅ **SIEMPRE:**
- Mantener en `.env.local`
- Usar variables de entorno
- Regenerar si se compromete
- Guardar backup en lugar seguro (password manager)

### Variables de Entorno

```bash
# En .env.local
WORLDCOIN_SIGNING_KEY=0x761b3bb947ca906704be14cfeadb7db7e14a26d1f19aee5f59dd979b6b503e99
```

### Acceso en Código

```typescript
// Correcto ✅
const signingKey = process.env.WORLDCOIN_SIGNING_KEY;

// Incorrecto ❌
const signingKey = "0x761b3bb947ca906704be14cfeadb7db7e14a26d1f19aee5f59dd979b6b503e99";
```

### Regeneración
Si la clave se compromete:
1. Ir al Developer Portal de Worldcoin
2. Generar nueva clave
3. Actualizar `.env.local`
4. Revocar clave anterior

---

**Fecha de generación:** 2026-04-19  
**Aplicación:** Tribia - World Cup Prediction Game  
**Portal:** Worldcoin Developer Portal
