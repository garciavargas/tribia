# ⏰ Sistema de Urgencia y Notificaciones - Tribia

## 🎯 Objetivo
Crear sentido de urgencia para que usuarios predigan ANTES de cada partido.

---

## ⏱️ Countdown Timer (Español/English)

### Componente Básico
```typescript
// components/CountdownTimer.tsx
"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  lang?: "es" | "en";
}

export default function CountdownTimer({ targetDate, lang = "es" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTime());

  function calculateTime() {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.expired) {
    return <div className="text-red-600 font-bold">
      {lang === "es" ? "⏰ ¡Tiempo agotado!" : "⏰ Time's up!"}
    </div>;
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 30;

  return (
    <div className={`text-center ${isUrgent ? "text-red-600 animate-pulse" : ""}`}>
      <p className="text-sm text-gray-600 mb-2">
        {lang === "es" ? "⏱️ Tiempo restante" : "⏱️ Time left"}
      </p>
      <div className="flex gap-2 justify-center text-2xl font-bold">
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
        <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
      </div>
      {isUrgent && (
        <p className="text-xs mt-2 font-bold">
          {lang === "es" ? "🚨 ¡Última oportunidad!" : "🚨 Last chance!"}
        </p>
      )}
    </div>
  );
}
```

---

## 🔔 Sistema de Notificaciones

### Tipos de Notificaciones

#### 1. 24 horas antes
**Español:**
```json
{
  "title": "⚽ Partido mañana",
  "body": "México vs Sudáfrica - ¡Haz tu predicción!",
  "icon": "/icono-96x96.png"
}
```

**English:**
```json
{
  "title": "⚽ Match tomorrow",
  "body": "Mexico vs South Africa - Make your prediction!",
  "icon": "/icono-96x96.png"
}
```

#### 2. 1 hora antes
**Español:**
```json
{
  "title": "🚨 ¡Última hora!",
  "body": "México vs Sudáfrica empieza en 1 hora. ¡Predice YA!",
  "icon": "/icono-96x96.png",
  "tag": "urgent"
}
```

**English:**
```json
{
  "title": "🚨 Last hour!",
  "body": "Mexico vs South Africa starts in 1 hour. Predict NOW!",
  "icon": "/icono-96x96.png",
  "tag": "urgent"
}
```

#### 3. 15 minutos antes
**Español:**
```json
{
  "title": "⏰ ¡ÚLTIMA OPORTUNIDAD!",
  "body": "México vs Sudáfrica en 15 min. ¡PREDICE AHORA O PIERDE!",
  "icon": "/icono-96x96.png",
  "tag": "critical",
  "requireInteraction": true,
  "vibrate": [200, 100, 200]
}
```

**English:**
```json
{
  "title": "⏰ LAST CHANCE!",
  "body": "Mexico vs South Africa in 15 min. PREDICT NOW OR LOSE!",
  "icon": "/icono-96x96.png",
  "tag": "critical",
  "requireInteraction": true,
  "vibrate": [200, 100, 200]
}
```

#### 4. Resultado - Ganaste
**Español:**
```json
{
  "title": "🎉 ¡ACERTASTE!",
  "body": "México ganó 2-1. ¡Ganaste 5 WGoal!",
  "icon": "/icono-96x96.png"
}
```

**English:**
```json
{
  "title": "🎉 YOU GOT IT!",
  "body": "Mexico won 2-1. You earned 5 WGoal!",
  "icon": "/icono-96x96.png"
}
```

#### 5. Resultado - Perdiste
**Español:**
```json
{
  "title": "😔 No acertaste",
  "body": "México perdió 1-2. ¡Mejor suerte la próxima!",
  "icon": "/icono-96x96.png"
}
```

**English:**
```json
{
  "title": "😔 Not this time",
  "body": "Mexico lost 1-2. Better luck next time!",
  "icon": "/icono-96x96.png"
}
```

---

## 🌍 Sistema de Idiomas

```typescript
// lib/i18n.ts
export const translations = {
  es: {
    countdown: {
      timeLeft: "⏱️ Tiempo restante",
      timeUp: "⏰ ¡Tiempo agotado!",
      lastChance: "🚨 ¡Última oportunidad!",
      hours: "h",
      minutes: "m",
      seconds: "s"
    },
    notifications: {
      matchTomorrow: "⚽ Partido mañana",
      lastHour: "🚨 ¡Última hora!",
      lastChance: "⏰ ¡ÚLTIMA OPORTUNIDAD!",
      youWon: "🎉 ¡ACERTASTE!",
      youLost: "😔 No acertaste",
      betterLuck: "¡Mejor suerte la próxima!"
    },
    urgency: {
      predictNow: "¡Predice AHORA!",
      hurryUp: "¡Date prisa!",
      closing: "Cerrando en"
    }
  },
  en: {
    countdown: {
      timeLeft: "⏱️ Time left",
      timeUp: "⏰ Time's up!",
      lastChance: "🚨 Last chance!",
      hours: "h",
      minutes: "m",
      seconds: "s"
    },
    notifications: {
      matchTomorrow: "⚽ Match tomorrow",
      lastHour: "🚨 Last hour!",
      lastChance: "⏰ LAST CHANCE!",
      youWon: "🎉 YOU GOT IT!",
      youLost: "😔 Not this time",
      betterLuck: "Better luck next time!"
    },
    urgency: {
      predictNow: "Predict NOW!",
      hurryUp: "Hurry up!",
      closing: "Closing in"
    }
  }
};
```

---

## 🎨 Elementos de Urgencia

### Badge de Urgencia
```typescript
// components/UrgencyBadge.tsx
export function UrgencyBadge({ minutesLeft, lang = "es" }: { minutesLeft: number; lang?: "es" | "en" }) {
  if (minutesLeft > 60) return null;
  
  const isCritical = minutesLeft <= 15;
  const isUrgent = minutesLeft <= 30;
  
  const labels = {
    es: { critical: "🔥 AHORA", urgent: "⚡ URGENTE", soon: "⏰ PRONTO" },
    en: { critical: "🔥 NOW", urgent: "⚡ URGENT", soon: "⏰ SOON" }
  };
  
  const label = isCritical ? labels[lang].critical : isUrgent ? labels[lang].urgent : labels[lang].soon;
  const color = isCritical ? "bg-red-600" : isUrgent ? "bg-orange-500" : "bg-blue-500";
  
  return (
    <span className={`${color} text-white px-3 py-1 rounded-full text-xs font-bold ${isCritical ? "animate-pulse" : ""}`}>
      {label}
    </span>
  );
}
```

---

## 📲 Implementación Push Notifications

### Service Worker
```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction || false,
      vibrate: data.vibrate || [200, 100, 200],
      data: data.data
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/dashboard')
  );
});
```

### Solicitar Permisos
```typescript
// lib/notifications.ts
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}
```

---

## 🔧 Cloud Function: Scheduler

```typescript
// functions/src/notificationScheduler.ts
import * as functions from "firebase-functions";
import { db } from "./firebase-admin";

export const scheduleNotifications = functions
  .pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    
    const now = new Date();
    const in15min = new Date(now.getTime() + 15 * 60 * 1000);
    const in1hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in24hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const matchesSnapshot = await db
      .collection("matches")
      .where("status", "==", "scheduled")
      .where("matchDate", "<=", in24hours)
      .get();
    
    for (const matchDoc of matchesSnapshot.docs) {
      const match = matchDoc.data();
      const matchDate = match.matchDate.toDate();
      const timeUntil = matchDate.getTime() - now.getTime();
      
      // Obtener usuarios sin predicción
      const usersSnapshot = await db.collection("users").get();
      
      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        const lang = user.language || "es";
        
        // Verificar si ya predijo
        const predictionExists = await db
          .collection("predictions")
          .where("userId", "==", userDoc.id)
          .where("matchId", "==", matchDoc.id)
          .get();
        
        if (!predictionExists.empty) continue;
        
        let notification;
        
        // 15 minutos
        if (timeUntil <= 15 * 60 * 1000 && timeUntil > 10 * 60 * 1000) {
          notification = {
            title: lang === "es" ? "⏰ ¡ÚLTIMA OPORTUNIDAD!" : "⏰ LAST CHANCE!",
            body: lang === "es" 
              ? `${match.homeTeam} vs ${match.awayTeam} en 15 min. ¡PREDICE AHORA!`
              : `${match.homeTeam} vs ${match.awayTeam} in 15 min. PREDICT NOW!`,
            tag: "critical",
            requireInteraction: true
          };
        }
        // 1 hora
        else if (timeUntil <= 60 * 60 * 1000 && timeUntil > 55 * 60 * 1000) {
          notification = {
            title: lang === "es" ? "🚨 ¡Última hora!" : "🚨 Last hour!",
            body: lang === "es"
              ? `${match.homeTeam} vs ${match.awayTeam} empieza en 1 hora`
              : `${match.homeTeam} vs ${match.awayTeam} starts in 1 hour`,
            tag: "urgent"
          };
        }
        // 24 horas
        else if (timeUntil <= 24 * 60 * 60 * 1000 && timeUntil > 23.5 * 60 * 60 * 1000) {
          notification = {
            title: lang === "es" ? "⚽ Partido mañana" : "⚽ Match tomorrow",
            body: lang === "es"
              ? `${match.homeTeam} vs ${match.awayTeam} - ¡Haz tu predicción!`
              : `${match.homeTeam} vs ${match.awayTeam} - Make your prediction!`,
            tag: "reminder"
          };
        }
        
        if (notification && user.pushSubscription) {
          await sendPushNotification(user.pushSubscription, {
            ...notification,
            icon: "/icono-96x96.png",
            data: { matchId: matchDoc.id, url: `/groups/${match.group}` }
          });
        }
      }
    }
  });
```

---

## 📊 Calendario de Notificaciones

| Tiempo | Tipo | ES | EN |
|--------|------|----|----|
| -24h | Recordatorio | "⚽ Partido mañana" | "⚽ Match tomorrow" |
| -1h | Urgente | "🚨 ¡Última hora!" | "🚨 Last hour!" |
| -15min | Crítica | "⏰ ¡ÚLTIMA OPORTUNIDAD!" | "⏰ LAST CHANCE!" |
| +90min | Resultado | "🎉 ¡ACERTASTE!" / "😔 No acertaste" | "🎉 YOU GOT IT!" / "😔 Not this time" |

---

## 🎯 Estrategia de Urgencia

### Niveles de Urgencia:
1. **Normal** (>1 hora): Color azul, sin animación
2. **Urgente** (30-60 min): Color naranja, badge "URGENTE"
3. **Crítico** (<30 min): Color rojo, animación pulse, vibración

### Frecuencia:
- Máximo 3 notificaciones por partido
- Máximo 10 notificaciones por día
- Respetar zona horaria del usuario

---

## ✅ Checklist

- [ ] Crear CountdownTimer (ES/EN)
- [ ] Implementar UrgencyBadge
- [ ] Configurar Service Worker
- [ ] Implementar sistema i18n
- [ ] Crear Cloud Function scheduler
- [ ] Solicitar permisos notificaciones
- [ ] Testear en diferentes momentos
- [ ] Configurar VAPID keys

---

**Siguiente paso:** Implementar CountdownTimer y solicitar permisos de notificaciones
