# 🔥 Firebase + Tribia - Guía de Integración

## 📦 Instalación

```bash
pnpm add firebase firebase-admin
```

---

## 🔧 Configuración Inicial

### 1. Crear proyecto en Firebase Console
1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear nuevo proyecto: "Tribia"
3. Habilitar Firestore Database
4. Habilitar Cloud Functions
5. Obtener credenciales

### 2. Variables de entorno
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Para Cloud Functions (server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

## 📁 Estructura de Archivos

```
lib/
├── firebase.ts              # Configuración cliente
├── firebase-admin.ts        # Configuración admin (server)
├── predictions.ts           # CRUD predicciones
├── payments.ts              # Sistema de pagos
└── rewards.ts               # Lógica de recompensas

functions/
├── src/
│   ├── index.ts            # Entry point
│   ├── paymentProcessor.ts # Worker de pagos
│   └── matchResults.ts     # Procesar resultados
└── package.json
```

---

## 💾 Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: Solo lectura propia
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Solo server puede escribir
    }
    
    // Predictions: Usuario puede leer sus propias predicciones
    match /predictions/{predictionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.timestamp == request.time;
      allow update, delete: if false; // Solo server
    }
    
    // Final Predictions: Similar a predictions
    match /finalPredictions/{predictionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // Payment Queue: Solo server
    match /paymentQueue/{queueId} {
      allow read, write: if false;
    }
  }
}
```

---

## 🔄 Flujo de Datos

### Crear Predicción
```typescript
// Cliente (Next.js)
1. Usuario hace predicción en UI
2. Validar que partido no haya comenzado
3. Llamar a API route: POST /api/predictions
4. API route valida y guarda en Firestore
5. Retornar confirmación al usuario
```

### Procesar Resultados
```typescript
// Cloud Function (Trigger: onMatchFinished)
1. Partido termina (actualizado manualmente o por webhook)
2. Cloud Function se dispara automáticamente
3. Obtener todas las predicciones del partido
4. Comparar con resultado real
5. Marcar correctas/incorrectas
6. Agregar ganadores a paymentQueue
7. Actualizar user.pendingWGoal
```

### Procesar Pagos
```typescript
// Cloud Function (Scheduled: cada 5 minutos)
1. Obtener primeros 10 pagos en cola (ordenados por prioridad)
2. Para cada pago:
   - Llamar MiniKit.pay()
   - Guardar transactionHash
   - Actualizar balances
3. Manejar errores y reintentos
4. Enviar notificaciones
```

---

## 📊 Índices Necesarios en Firestore

```javascript
// predictions
- userId + timestamp (DESC)
- matchId + timestamp (ASC)
- rewardStatus + timestamp (ASC)

// finalPredictions
- userId + timestamp (DESC)
- champion + timestamp (ASC)
- rewardStatus + timestamp (ASC)

// paymentQueue
- status + priority (DESC) + createdAt (ASC)
- userId + status
```

---

## 🎯 Ejemplo: Crear Predicción

```typescript
// app/api/predictions/route.ts
import { db } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const { userId, matchId, prediction } = await request.json();
  
  // Validar que partido no haya comenzado
  const matchRef = db.collection("matches").doc(matchId);
  const match = await matchRef.get();
  
  if (!match.exists || match.data()?.status !== "scheduled") {
    return Response.json({ error: "Partido no disponible" }, { status: 400 });
  }
  
  // Verificar que no exista predicción previa
  const existingPrediction = await db
    .collection("predictions")
    .where("userId", "==", userId)
    .where("matchId", "==", matchId)
    .get();
  
  if (!existingPrediction.empty) {
    return Response.json({ error: "Ya hiciste una predicción" }, { status: 400 });
  }
  
  // Crear predicción
  const predictionRef = await db.collection("predictions").add({
    userId,
    matchId,
    prediction,
    timestamp: Timestamp.now(),
    isCorrect: null,
    rewardAmount: 0,
    rewardStatus: "pending",
    createdAt: Timestamp.now()
  });
  
  return Response.json({ 
    success: true, 
    predictionId: predictionRef.id 
  });
}
```

---

## 💸 Ejemplo: Worker de Pagos

```typescript
// functions/src/paymentProcessor.ts
import * as functions from "firebase-functions";
import { db } from "./firebase-admin";
import { MiniKit } from "@worldcoin/minikit-js";

export const processPayments = functions
  .pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    
    // Obtener pagos pendientes (máx 10)
    const paymentsSnapshot = await db
      .collection("paymentQueue")
      .where("status", "==", "queued")
      .orderBy("priority", "desc")
      .orderBy("createdAt", "asc")
      .limit(10)
      .get();
    
    const promises = paymentsSnapshot.docs.map(async (doc) => {
      const payment = doc.data();
      
      try {
        // Marcar como procesando
        await doc.ref.update({ status: "processing" });
        
        // Enviar WGoal
        const result = await MiniKit.commandsAsync.pay({
          reference: doc.id,
          to: payment.userId,
          tokens: [{
            symbol: "WGOAL",
            token_amount: payment.amount.toString()
          }],
          description: `Premio por predicción correcta`
        });
        
        if (result.finalPayload.status === "success") {
          // Pago exitoso
          await doc.ref.update({
            status: "completed",
            transactionHash: result.finalPayload.transaction_id,
            processedAt: new Date()
          });
          
          // Actualizar balance del usuario
          const userRef = db.collection("users").doc(payment.userId);
          await userRef.update({
            totalWGoal: admin.firestore.FieldValue.increment(payment.amount),
            pendingWGoal: admin.firestore.FieldValue.increment(-payment.amount)
          });
          
          // Actualizar predicción
          const predictionRef = db.collection("predictions").doc(payment.predictionId);
          await predictionRef.update({
            rewardStatus: "paid",
            transactionHash: result.finalPayload.transaction_id,
            paidAt: new Date()
          });
          
          console.log(`✅ Pago exitoso: ${doc.id}`);
        } else {
          throw new Error("Pago rechazado");
        }
        
      } catch (error) {
        console.error(`❌ Error en pago ${doc.id}:`, error);
        
        // Reintentar o marcar como fallido
        const attempts = payment.attempts + 1;
        
        if (attempts < 3) {
          await doc.ref.update({
            status: "queued",
            attempts,
            error: error.message
          });
        } else {
          await doc.ref.update({
            status: "failed",
            attempts,
            error: error.message
          });
          
          // TODO: Notificar a admin
        }
      }
    });
    
    await Promise.all(promises);
    console.log(`✅ Procesados ${promises.length} pagos`);
  });
```

---

## 🏆 Ejemplo: Procesar Final

```typescript
// functions/src/processFinal.ts
import * as functions from "firebase-functions";
import { db } from "./firebase-admin";

export const processFinalResults = functions
  .firestore
  .document("matches/final")
  .onUpdate(async (change, context) => {
    
    const newData = change.after.data();
    
    // Solo procesar si el partido terminó
    if (newData.status !== "finished") return;
    
    const result = newData.result;
    
    // Obtener todas las predicciones de la final
    const predictionsSnapshot = await db
      .collection("finalPredictions")
      .orderBy("timestamp", "asc")
      .get();
    
    // Filtrar predicciones correctas (campeón)
    const correctPredictions = predictionsSnapshot.docs.filter(doc => 
      doc.data().champion === result.winner
    );
    
    // Premio estándar: Primeros 50
    const standardWinners = correctPredictions.slice(0, 50);
    
    for (const doc of standardWinners) {
      await db.collection("paymentQueue").add({
        userId: doc.data().userId,
        predictionId: doc.id,
        amount: 10000,
        priority: 2, // HIGH
        status: "queued",
        attempts: 0,
        createdAt: new Date()
      });
      
      await doc.ref.update({
        isCorrect: true,
        rewardAmount: 10000,
        rewardStatus: "pending"
      });
    }
    
    // Premio gordo: Predicción exacta
    const jackpotWinners = correctPredictions.filter(doc => {
      const data = doc.data();
      return data.decidedBy === result.decidedBy &&
             data.homeScore === result.homeScore &&
             data.awayScore === result.awayScore;
    });
    
    if (jackpotWinners.length > 0) {
      const jackpotPerWinner = 100000 / jackpotWinners.length;
      
      for (const doc of jackpotWinners) {
        await db.collection("paymentQueue").add({
          userId: doc.data().userId,
          predictionId: doc.id,
          amount: jackpotPerWinner,
          priority: 3, // CRITICAL
          status: "queued",
          attempts: 0,
          createdAt: new Date()
        });
        
        await doc.ref.update({
          isCorrect: true,
          rewardAmount: jackpotPerWinner,
          rewardStatus: "pending"
        });
      }
    }
    
    console.log(`✅ Final procesada: ${standardWinners.length} ganadores estándar, ${jackpotWinners.length} jackpot`);
  });
```

---

## 🚨 Monitoreo y Alertas

### Métricas Clave:
- Pagos fallidos > 5% → Alerta crítica
- Tiempo de procesamiento > 10 min → Alerta
- Balance WGoal < 10,000 → Alerta urgente
- Errores en Cloud Functions → Notificar

### Logs Importantes:
```typescript
// Registrar todas las transacciones
await db.collection("transactionLogs").add({
  type: "payment",
  userId,
  amount,
  status,
  transactionHash,
  timestamp: new Date()
});
```

---

## 📈 Estimación de Costos

### Firebase (10,000 usuarios activos):
- **Firestore:**
  - Escrituras: ~500k/mes → $0.30
  - Lecturas: ~5M/mes → $0.30
  - Storage: ~1GB → $0.18
  
- **Cloud Functions:**
  - Invocaciones: ~1M/mes → $0.40
  - Compute: ~100 GB-s → $0.25

**Total estimado: ~$1.50/mes** (muy económico)

---

## ✅ Checklist de Implementación

- [ ] Crear proyecto Firebase
- [ ] Configurar Firestore
- [ ] Agregar reglas de seguridad
- [ ] Crear índices
- [ ] Instalar dependencias
- [ ] Configurar variables de entorno
- [ ] Implementar lib/firebase.ts
- [ ] Implementar lib/predictions.ts
- [ ] Implementar lib/payments.ts
- [ ] Crear Cloud Functions
- [ ] Testear flujo completo
- [ ] Deploy a producción

---

**Siguiente paso:** Configurar proyecto Firebase y obtener credenciales
