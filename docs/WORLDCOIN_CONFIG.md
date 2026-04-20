# 🔧 Configuración de Tribia en Worldcoin Portal

## ✅ Información Completa

### 📋 Basic Information
- **App Name:** Tribia Futbolera
- **Publisher:** [TU_NOMBRE]
- **App URL:** [TU_URL_DE_PRODUCCION]
- **App Official Website:** [TU_SITIO_WEB]

### ⚙️ Advanced Settings

#### 1. Additional Domains
```
api.football-data.org
worldscan.org
```

#### 2. Whitelisted Payment Addresses
```
0x7400ffa080c63a689e56936d76752d252fc2ce68
```
**⚠️ NO desactives el whitelist**

#### 3. Permit2 Tokens
```
Token Symbol: WGOAL
Contract Address: 0x1a1e80a27093665a2e6e7f3af3b69bb64fe79
Network: World Chain (480)
Decimals: 18
```

#### 4. Contract Entrypoints
```
0x1a1e80a27093665a2e6e7f3af3b69bb64fe79
```
*(El contrato del token WGOAL)*

#### 5. Permissions - Notifications
**Selecciona:** 2 notificaciones por día

**Uso:**
- Recordatorio de partido próximo
- Resultado de predicción

---

## 🎯 Resumen de Configuración

### Token WGOAL
- **Nombre:** WorldGoal2026
- **Símbolo:** WGOAL
- **Supply:** 100,000,000 WGOAL
- **Decimales:** 18
- **Contract:** `0x1a1e80a27093665a2e6e7f3af3b69bb64fe79`
- **Factory:** `0xc301bace6e9409b1876347a3dc94ec24d18c1fe4`

### Wallet de Tesorería
- **Address:** `0x7400ffa080c63a689e56936d76752d252fc2ce68`
- **Balance:** 100,000,000 WGOAL
- **Función:** Distribuir recompensas a usuarios

### Recompensas
| Acción | Cantidad |
|--------|----------|
| Login diario | 1 WGOAL |
| Predicción correcta | 5 WGOAL |
| Referido | 5 WGOAL (cada uno) |
| Premio final | 10,000 WGOAL |
| Premio gordo | 100,000 WGOAL |

---

## 🚀 Cómo Funciona la Distribución

### 1. Usuario reclama recompensa diaria
```
Usuario → Tribia → MiniKit.sendTransaction() → Transfer 1 WGOAL
```

### 2. Usuario acierta predicción
```
Sistema verifica resultado → Transfer 5 WGOAL automático
```

### 3. Usuario refiere a alguien
```
Nuevo usuario usa código → Transfer 5 WGOAL a ambos
```

---

## 📝 Checklist de Publicación

- [x] Token WGOAL creado en PUF
- [x] Wallet de tesorería configurada
- [x] Contract address agregado a código
- [ ] Agregar token en Permit2 Tokens
- [ ] Agregar wallet en Whitelisted Addresses
- [ ] Configurar notificaciones (2/día)
- [ ] Subir imágenes de showcase
- [ ] Completar descripción en español
- [ ] Testear distribución de tokens
- [ ] Publicar en Worldcoin

---

## 🔐 Seguridad

### Validaciones Implementadas
1. ✅ Solo usuarios verificados con World ID
2. ✅ Una recompensa diaria por usuario
3. ✅ Predicciones bloqueadas después del kickoff
4. ✅ Distribución de tokens desde wallet autorizada
5. ✅ Whitelist de addresses habilitada

### Próximos Pasos de Seguridad
- [ ] Implementar rate limiting
- [ ] Agregar sistema de detección de fraude
- [ ] Monitoreo de transacciones sospechosas
- [ ] Backup de wallet de tesorería

---

## 📞 Soporte

**Email:** [TU_EMAIL_DE_SOPORTE]
**Telegram:** @tribia_support

---

**Última actualización:** 20 de abril de 2026
