# 📊 RESUMEN EJECUTIVO - TRIBIA

## Para: Analista de Fútbol / Product Owner
## Fecha: 18 de abril de 2026
## Proyecto: Tribia - World Cup Prediction Game

---

## 🎯 ¿Qué es Tribia?

**Tribia** es un **clon digital de Progol** (Lotería Nacional de México) adaptado para el **Mundial de Fútbol 2026**.

### Concepto Simple
- Usuario predice resultados de partidos
- Gana tokens WGoal por aciertos
- Solo usuarios verificados con World ID

---

## ⚽ Mecánica del Juego (Explicación Futbolística)

### Fase de Grupos (48 partidos)

**Predicción:** Gana / Empate / Pierde

```
Ejemplo: México vs. Sudáfrica
┌─────────────────────┐
│ [ ] México gana     │ ← Usuario elige UNA opción
│ [ ] Empate          │
│ [ ] Sudáfrica gana  │
└─────────────────────┘

Si acierta → 5 WGoal
```

**Análisis futbolístico:**
- Similar a apostar al resultado final (1X2)
- No importa el marcador, solo el resultado
- Predicción antes del kickoff

### Fase Eliminatoria (Octavos, Cuartos, Semis)

**Predicción:** ¿Qué equipo avanza?

```
Ejemplo: Brasil vs. Argentina
┌─────────────────────┐
│ [ ] Brasil pasa     │ ← Usuario elige quién avanza
│ [ ] Argentina pasa  │
└─────────────────────┘

Si acierta → 5 WGoal
```

**Análisis futbolístico:**
- No importa si gana en 90', tiempo extra o penales
- Solo importa quién pasa a la siguiente ronda
- Más simple que predecir el resultado exacto

### Final del Mundial

#### Opción A: Predicción Simple

**Predicción:** ¿Quién gana la Copa del Mundo?

```
┌─────────────────────┐
│ [ ] Equipo A        │
│ [ ] Equipo B        │
└─────────────────────┘

Primeros 50 que acierten → 10,000 WGoal cada uno
```

**Regla importante:** Orden de llegada por timestamp blockchain

#### Opción B: Premio Gordo (100,000 WGoal)

**Predicción completa:**

```
1. ¿Quién gana?
   [ ] Equipo A
   [ ] Equipo B

2. ¿Cómo gana?
   [ ] Tiempo normal (90 minutos)
   [ ] Tiempo extra (120 minutos)
   [ ] Penales

3. Marcador final (tiempo reglamentario):
   Equipo A: [__]
   Equipo B: [__]
```

**Ejemplo real:**
```
Usuario predice:
- Campeón: Argentina
- Forma: Penales
- Marcador: 3-3

Final real:
- Argentina gana en penales
- Marcador: 3-3 (después de 120 minutos)

Resultado: ¡PREMIO GORDO! 100,000 WGoal
```

**Análisis futbolístico:**
- Predicción extremadamente difícil
- Requiere acertar 3 variables
- Si hay múltiples ganadores, se divide el premio

---

## 📅 Calendario del Mundial 2026

### Fechas Clave
- **11 junio:** Partido inaugural (México vs. Sudáfrica)
- **11-27 junio:** Fase de grupos (48 partidos)
- **28 junio - 3 julio:** Octavos de final (16 equipos)
- **9-11 julio:** Cuartos de final (8 equipos)
- **14-15 julio:** Semifinales (4 equipos)
- **19 julio:** FINAL (MetLife Stadium, New Jersey)

### Estructura de Grupos

**12 grupos de 4 equipos cada uno:**

| Grupo | Equipos Destacados |
|-------|-------------------|
| A | 🇲🇽 México, 🇿🇦 Sudáfrica, 🇰🇷 Corea del Sur |
| B | 🇨🇦 Canadá, 🇶🇦 Qatar, 🇨🇭 Suiza |
| C | 🇧🇷 Brasil, 🇲🇦 Marruecos, 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia |
| D | 🇺🇸 Estados Unidos, 🇵🇾 Paraguay, 🇦🇺 Australia |
| E | 🇩🇪 Alemania, 🇨🇮 Costa de Marfil, 🇪🇨 Ecuador |
| F | 🇳🇱 Países Bajos, 🇯🇵 Japón, 🇹🇳 Túnez |
| G | 🇧🇪 Bélgica, 🇪🇬 Egipto, 🇮🇷 Irán |
| H | 🇪🇸 España, 🇺🇾 Uruguay, 🇸🇦 Arabia Saudita |
| I | 🇫🇷 Francia, 🇸🇳 Senegal, 🇳🇴 Noruega |
| J | 🇦🇷 Argentina, 🇩🇿 Argelia, 🇦🇹 Austria |
| K | 🇵🇹 Portugal, 🇨🇴 Colombia, 🇺🇿 Uzbekistán |
| L | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra, 🇭🇷 Croacia, 🇬🇭 Ghana |

**Favoritos al título:**
1. 🇧🇷 Brasil
2. 🇦🇷 Argentina (campeón defensor)
3. 🇫🇷 Francia
4. 🇩🇪 Alemania
5. 🇪🇸 España

---

## 💰 Sistema de Premios

### Tabla Completa

| Fase | Predicción | Premio | Total Posible |
|------|-----------|--------|---------------|
| **Fase de Grupos** | Resultado (48 partidos) | 5 WGoal | 240 WGoal |
| **Octavos** | Equipo que avanza (8 partidos) | 5 WGoal | 40 WGoal |
| **Cuartos** | Equipo que avanza (4 partidos) | 5 WGoal | 20 WGoal |
| **Semifinales** | Equipo que avanza (2 partidos) | 5 WGoal | 10 WGoal |
| **Final (Simple)** | Campeón | 10,000 WGoal | 10,000 WGoal |
| **Final (Completa)** | Campeón + Resultado | 100,000 WGoal | 100,000 WGoal |

**Máximo teórico por usuario:** 110,310 WGoal

---

## 🎮 Flujo de Usuario (Paso a Paso)

### 1. Primera Vez

```
1. Usuario descarga World App
2. Se verifica con Orb (obligatorio)
3. Abre Tribia
4. Conecta su wallet
5. Recibe 1 WGoal de bienvenida
6. Ve el calendario de partidos
7. Hace su primera predicción
```

### 2. Uso Diario

```
1. Usuario abre Tribia
2. Recibe 1 WGoal gratis (login diario)
3. Ve próximos partidos
4. Hace predicciones
5. Espera resultados
6. Recibe premios automáticamente
```

### 3. Ejemplo Real

**Día 1 (11 de junio):**
```
- Juan abre Tribia
- Recibe 1 WGoal de login
- Predice: México gana vs. Sudáfrica
- Predice: Corea del Sur gana vs. UEFA Playoff D
```

**Día 2 (12 de junio):**
```
- México ganó 2-1 → Juan recibe 5 WGoal ✅
- Corea empató 1-1 → Juan no recibe nada ❌
- Balance de Juan: 6 WGoal (1 login + 5 premio)
```

---

## 🔐 Seguridad y Reglas

### Reglas Estrictas

1. **Solo usuarios verificados con Orb**
   - Sin verificación = Sin acceso
   - Previene bots y cuentas falsas

2. **Una predicción por partido**
   - No se puede cambiar después de enviar
   - Timestamp registrado en blockchain

3. **Predicciones antes del kickoff**
   - Sistema cierra predicciones al inicio del partido
   - Buffer de 5 minutos antes del partido

4. **Orden de llegada en la final**
   - Primeros 50 usuarios que acierten
   - Timestamp del blockchain (no manipulable)

### Prevención de Fraude

- ✅ Verificación World ID obligatoria
- ✅ Timestamps en blockchain
- ✅ Una predicción por usuario por partido
- ✅ Rate limiting (máximo 10 predicciones por minuto)
- ✅ Monitoreo de patrones sospechosos

---

## 📊 Proyecciones

### Usuarios Esperados

| Fase | Usuarios | Predicciones |
|------|----------|--------------|
| Semana 1 | 10,000 | 50,000 |
| Semana 2 | 50,000 | 300,000 |
| Semana 3 | 100,000 | 800,000 |
| Final | 500,000 | 5,000,000 |

### Distribución de WGoal

**Fase de Grupos:**
- 48 partidos × 5 WGoal × 30% aciertos × 100,000 usuarios
- = 72,000,000 WGoal distribuidos

**Final:**
- 50 ganadores × 10,000 WGoal = 500,000 WGoal
- Premio gordo: 100,000 WGoal

**Total estimado:** ~75,000,000 WGoal

---

## 🎯 Diferencias con Progol Original

| Aspecto | Progol (Lotería Nacional) | Tribia |
|---------|--------------------------|--------|
| **Medio** | Papel físico | Digital (Mini App) |
| **Pago** | Dinero fiat (MXN) | Tokens WGoal |
| **Verificación** | Ninguna | World ID obligatorio |
| **Premios** | Dinero en efectivo | Tokens WGoal |
| **Distribución** | Manual | Automática (blockchain) |
| **Alcance** | Solo México | Global |
| **Transparencia** | Limitada | Total (blockchain) |

---

## ✅ Validación de Datos

### Necesitamos Validar

1. **Calendario de partidos**
   - Fechas exactas
   - Horarios (zonas horarias)
   - Sedes

2. **Grupos confirmados**
   - Equipos clasificados
   - Playoffs pendientes (UEFA, FIFA)

3. **Reglas de clasificación**
   - Top 2 de cada grupo
   - 8 mejores terceros

4. **Formato de eliminatorias**
   - Bracket de 32 equipos
   - Sedes de cada fase

### Fuentes Oficiales

- FIFA.com
- Concacaf.com
- Calendario oficial del Mundial 2026

---

## 🚀 Próximos Pasos

### Inmediatos (Esta Semana)

1. ✅ Validar calendario completo de partidos
2. ✅ Confirmar grupos y equipos
3. ✅ Definir horarios exactos
4. ⏳ Comenzar desarrollo del MVP

### Corto Plazo (2 Semanas)

1. Desarrollar sistema de autenticación
2. Crear base de datos de partidos
3. Implementar predicciones básicas
4. Diseñar UI mobile-first

### Mediano Plazo (4 Semanas)

1. Sistema de premios funcional
2. Testing exhaustivo
3. Beta cerrada (100 usuarios)
4. Optimización de performance

### Largo Plazo (6 Semanas)

1. Launch público
2. Marketing pre-Mundial
3. Partnerships
4. Monitoreo 24/7

---

## 📞 Preguntas Frecuentes

### ¿Por qué solo usuarios verificados?

**Respuesta:** Para prevenir bots, cuentas falsas y fraude. World ID con Orb es la verificación más segura del mundo.

### ¿Qué pasa si dos usuarios predicen exactamente lo mismo en la final?

**Respuesta:** El premio se divide equitativamente. Ejemplo: 2 ganadores = 50,000 WGoal cada uno.

### ¿Se puede cambiar una predicción después de enviarla?

**Respuesta:** NO. Una vez enviada, la predicción es final. Esto previene manipulación.

### ¿Qué pasa si un partido se cancela o pospone?

**Respuesta:** Las predicciones se invalidan y se devuelven los WGoal apostados (si aplicara).

### ¿Cómo se determina el "orden de llegada" en la final?

**Respuesta:** Por el timestamp del blockchain. Es imposible de manipular.

---

## 🎉 Conclusión

**Tribia** es un juego simple, justo y transparente que combina:

- ✅ La emoción del fútbol
- ✅ La mecánica probada de Progol
- ✅ La seguridad de blockchain
- ✅ La verificación de World ID

**Objetivo:** 500,000 usuarios prediciendo el Mundial 2026

**Lanzamiento:** Antes del 11 de junio de 2026

---

**¿Fui claro? ⚽**

---

## 📁 Documentos Relacionados

- [README.md](../README.md) - Documento principal del proyecto
- [DINAMICA_APLICACION.md](./DINAMICA_APLICACION.md) - Dinámica completa del juego
- [PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md) - Plan de desarrollo técnico
- [PROTOCOLO_DESARROLLO.md](./PROTOCOLO_DESARROLLO.md) - Reglas de código
