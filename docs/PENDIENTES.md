# 📋 Tareas Pendientes - Tribia

**Fecha:** 19 de abril de 2026  
**Estado:** En desarrollo

---

## 🔧 Configuración Inmediata

### 1. Configurar APP_ID en Developer Portal

**Pasos:**
1. Ir a [Worldcoin Developer Portal](https://developer.worldcoin.org)
2. Seleccionar tu app "Tribia"
3. Copiar el `App ID` (formato: `app_staging_xxxxxxxxxxxxx`)
4. Actualizar `.env.local`:
   ```bash
   NEXT_PUBLIC_APP_ID=app_staging_tu_id_real_aqui
   ```
5. Reiniciar servidor: `pnpm dev`
6. Testear autenticación en el portal

---

## 🗄️ Base de Datos - Firebase

### Estructura de Datos Recomendada

#### Colección: `users`
```typescript
{
  userId: string;              // walletAddress (Primary Key)
  worldId: string;             // World ID verificado
  username?: string;
  totalWGoal: number;          // Balance total
  pendingWGoal: number;        // WGoal pendiente de pago
  dailyLoginStreak: number;
  lastLoginDate: Timestamp;
  createdAt: Timestamp;
}
```

#### Colección: `predictions`
```typescript
{
  predictionId: string;        // Auto-generated ID
  userId: string;              // Referencia a users
  matchId: string;             // ID del partido
  prediction: "home" | "draw" | "away";
  timestamp: Timestamp;        // Para orden de llegada
  isCorrect: boolean | null;   // null hasta que termine el partido
  rewardAmount: number;        // 5 WGoal por acierto
  rewardStatus: "pending" | "processing" | "paid" | "failed";
  transactionHash?: string;    // Hash de la transacción de pago
  paidAt?: Timestamp;
}
```

#### Colección: `finalPredictions`
```typescript
{
  predictionId: string;
  userId: string;
  champion: string;            // Equipo ganador
  decidedBy: "normal" | "extra" | "penalties";
  homeScore?: number;          // Para premio gordo
  awayScore?: number;          // Para premio gordo
  timestamp: Timestamp;        // Para ranking (primeros 50)
  isCorrect: boolean | null;
  rewardAmount: number;        // 10,000 o 100,000 WGoal
  rewardStatus: "pending" | "processing" | "paid" | "failed";
  transactionHash?: string;
  paidAt?: Timestamp;
}
```

#### Colección: `paymentQueue`
```typescript
{
  queueId: string;
  userId: string;
  predictionId: string;
  amount: number;
  status: "queued" | "processing" | "completed" | "failed";
  attempts: number;            // Reintentos en caso de fallo
  error?: string;
  createdAt: Timestamp;
  processedAt?: Timestamp;
}
```

---

## 💰 Sistema de Pagos Pendientes

### Flujo de Recompensas

#### 1. Cuando un partido termina:
```typescript
// Función: processMatchResults(matchId)
1. Obtener todas las predicciones del partido
2. Verificar cuáles fueron correctas
3. Para cada predicción correcta:
   - Actualizar isCorrect = true
   - Calcular rewardAmount (5 WGoal)
   - Cambiar rewardStatus = "pending"
   - Agregar a paymentQueue
   - Incrementar user.pendingWGoal
```

#### 2. Worker de Pagos (Cloud Function):
```typescript
// Función: processPaymentQueue()
// Se ejecuta cada 5 minutos

1. Obtener pagos con status = "queued" (límite: 10 por batch)
2. Para cada pago:
   - Cambiar status = "processing"
   - Llamar a MiniKit.pay() para enviar WGoal
   - Si éxito:
     * Guardar transactionHash
     * Cambiar status = "completed"
     * Actualizar user.totalWGoal
     * Decrementar user.pendingWGoal
     * Marcar prediction.rewardStatus = "paid"
   - Si fallo:
     * Incrementar attempts
     * Si attempts < 3: volver a "queued"
     * Si attempts >= 3: marcar como "failed" y notificar admin
```

#### 3. Manejo de Fallos:
```typescript
// Casos de error:
- Usuario sin wallet conectada → Reintentar después
- Transacción fallida → Reintentar (máx 3 veces)
- Fondos insuficientes en contrato → Alerta a admin
- Error de red → Reintentar con backoff exponencial
```

---

## 🏆 Premio Final (10k y 100k WGoal)

### Proceso Especial

#### 1. Cuando termina la final:
```typescript
// Función: processFinalResults()

1. Obtener todas las finalPredictions
2. Filtrar por champion correcto
3. Ordenar por timestamp (primeros 50)

// Premio estándar (10,000 WGoal)
4. Tomar primeros 50 usuarios:
   - rewardAmount = 10000
   - rewardStatus = "pending"
   - Agregar a paymentQueue (prioridad alta)

// Premio gordo (100,000 WGoal)
5. Filtrar predicciones con:
   - champion correcto
   - decidedBy correcto
   - homeScore correcto
   - awayScore correcto
6. Si hay ganadores:
   - rewardAmount = 100000 / cantidad_ganadores
   - rewardStatus = "pending"
   - Agregar a paymentQueue (prioridad máxima)
```

#### 2. Prioridades de Pago:
```typescript
enum PaymentPriority {
  LOW = 1,      // Predicciones normales (5 WGoal)
  HIGH = 2,     // Premio final estándar (10k WGoal)
  CRITICAL = 3  // Premio gordo (100k WGoal)
}

// El worker procesa primero los CRITICAL, luego HIGH, luego LOW
```

---

## 📊 Dashboard de Pagos (Admin)

### Métricas a Mostrar:
- Total WGoal pendiente de pago
- Pagos en cola (queued)
- Pagos procesando (processing)
- Pagos fallidos (failed)
- Últimas 100 transacciones
- Usuarios con pagos pendientes

### Acciones de Admin:
- Reintentar pagos fallidos manualmente
- Ver detalles de transacciones
- Pausar/reanudar worker de pagos
- Alertas cuando fondos < 10,000 WGoal

---

## 🔐 Seguridad

### Validaciones Críticas:
1. **Doble pago:** Verificar que prediction.rewardStatus != "paid"
2. **Timestamp:** Validar que predicción fue antes del partido
3. **Balance:** Verificar fondos suficientes antes de pagar
4. **Rate limiting:** Máximo 10 pagos por minuto por usuario
5. **Logs:** Registrar todas las transacciones para auditoría

---

## 🚀 Implementación Sugerida

### Fase 1: Setup Firebase
```bash
# Instalar Firebase
pnpm add firebase firebase-admin

# Configurar Firestore
# Crear colecciones con índices
# Configurar reglas de seguridad
```

### Fase 2: Funciones de Predicción
```typescript
// lib/predictions.ts
- createPrediction()
- getPredictionsByUser()
- getPredictionsByMatch()
```

### Fase 3: Sistema de Pagos
```typescript
// lib/payments.ts
- addToPaymentQueue()
- processPaymentQueue() // Cloud Function
- retryFailedPayment()
```

### Fase 4: Cloud Functions
```typescript
// functions/index.ts
- scheduledPaymentProcessor() // Cada 5 min
- onMatchFinished() // Trigger cuando partido termina
- onFinalFinished() // Trigger cuando final termina
```

---

## 📝 Notas Importantes

### Consideraciones de Costos:
- Firebase Firestore: ~$0.06 por 100k lecturas
- Cloud Functions: ~$0.40 por millón de invocaciones
- Estimar: 10,000 usuarios × 48 partidos = 480k predicciones
- Pagos: ~480k transacciones × 5 WGoal = 2.4M WGoal necesarios

### Optimizaciones:
- Batch payments: Agrupar pagos pequeños
- Cache: Reducir lecturas de Firestore
- Índices: Optimizar queries frecuentes
- Webhooks: Usar eventos en lugar de polling

---

## 🔗 Referencias

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [MiniKit Pay API](https://docs.worldcoin.org/minikit/pay)
- [World Chain Explorer](https://worldscan.org)

---

**Próximos pasos:**
1. ✅ Configurar APP_ID
2. ⏳ Setup Firebase project
3. ⏳ Implementar estructura de datos
4. ⏳ Crear sistema de pagos
5. ⏳ Testear flujo completo
