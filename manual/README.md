# MANUAL DE WORLDCOIN MINI APPS - ÍNDICE

## 📚 Documentación Completa del Protocolo Worldcoin

Este manual contiene toda la información necesaria para crear, desarrollar y publicar Mini Apps en el ecosistema de Worldcoin.

---

## 📖 CONTENIDO

### 1. [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md)
**Documento principal del protocolo**

Contenido:
- ¿Qué son las Mini Apps?
- Instalación de MiniKit
- Configuración inicial
- Estado de MiniKit
- Permisos
- Ubicación de lanzamiento
- Objeto raw de World App
- Comandos disponibles
- Testing
- Respuestas de comandos
- Mini App Store
- Especificaciones del webview
- Migración
- Recursos adicionales
- Templates disponibles
- FAQ

**Cuándo usar:** Como referencia general del protocolo y arquitectura de Mini Apps.

---

### 2. [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md)
**Guía detallada de todos los comandos de MiniKit**

Contenido:
- Pay (Pagos)
- Wallet Auth (Autenticación)
- Send Transaction (Transacciones)
- Sign Message (Firmar mensajes)
- Sign Typed Data (Firmar datos tipados)
- Share Contacts (Compartir contactos)
- Request Permission (Solicitar permisos)
- Get Permissions (Obtener permisos)
- Send Haptic Feedback (Feedback háptico)
- Share (Compartir)
- World Chat (Chat)
- Attestation (Atestación)
- Close Mini App (Cerrar app)
- Manejo de errores
- Códigos de error comunes

**Cuándo usar:** Para implementar funcionalidades específicas en tu Mini App.

---

### 3. [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md)
**Tutorial paso a paso para crear tu primera Mini App**

Contenido:
- Paso 1: Crear proyecto
- Paso 2: Configurar MiniKit
- Paso 3: Crear componente principal
- Paso 4: Configurar desarrollo local
- Paso 5: Registrar en Developer Portal
- Paso 6: Probar en World App
- Paso 7: Implementar funcionalidades
- Paso 8: Debugging
- Paso 9: Preparar para producción
- Paso 10: Publicar en Mini App Store
- Checklist de lanzamiento
- Recursos útiles
- Próximos pasos

**Cuándo usar:** Para empezar desde cero con tu primera Mini App.

---

### 4. [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md)
**Guía de mejores prácticas y patrones recomendados**

Contenido:
- Arquitectura
  - Separación de responsabilidades
  - Manejo de estado
- Seguridad
  - Validación de comandos
  - Generación de nonces
  - Validación de firmas
  - Rate limiting
- Performance
  - Lazy loading
  - Memoización
  - Optimización de imágenes
  - Code splitting
- UX/UI

---

### 5. [PROTOCOLO_DESARROLLO.md](./PROTOCOLO_DESARROLLO.md)
**Reglas estrictas de desarrollo para Tribia**

Contenido:
- REGLA 1: Prohibido usar `any` en TypeScript
- REGLA 2: Tailwind CSS v4 - Sintaxis estricta
- REGLA 3: Desarrollo Mobile-First obligatorio
- Componentes mobile-first
- Sistema de diseño mobile
- Tipos estrictos de MiniKit
- Reglas de código
- Checklist de desarrollo

**Cuándo usar:** SIEMPRE antes de escribir código. Estas reglas son obligatorias y no negociables.

---

## 🎮 DOCUMENTACIÓN DE TRIBIA

### 6. [DINAMICA_APLICACION.md](./DINAMICA_APLICACION.md)
**Dinámica completa del juego de predicciones del Mundial 2026**

Contenido:
- Concepto general del juego
- Reglas del juego (acceso, login diario, predicciones)
- Sistema de premios (5 WGoal, 10k WGoal, 100k WGoal)
- Fases del Mundial (grupos, eliminatorias, final)
- Flujo de usuario completo
- Lógica de negocio detallada
- Validaciones críticas
- Seguridad y prevención de fraude
- Métricas y analytics
- Casos de uso reales

**Cuándo usar:** Para entender la mecánica completa del juego y la lógica de negocio.

---

### 7. [PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)
**Plan de desarrollo completo con código y arquitectura**

Contenido:
- Timeline del proyecto (7 semanas)
- Arquitectura del sistema (Stack tecnológico)
- Fase 1: MVP Core (Autenticación + Predicciones)
- Fase 2: UI/UX Mobile-First
- Fase 3: Sistema de Premios
- Fase 4: Testing y Optimización
- Fase 5: Deploy y Marketing
- Código completo de componentes
- Schema de base de datos (Prisma)
- API Routes
- Smart Contract (Solidity)
- Checklist de lanzamiento
- Métricas de éxito
- Riesgos y mitigación

**Cuándo usar:** Como guía paso a paso para implementar Tribia desde cero.

---

### 8. [README_TECNICO.md](./README_TECNICO.md)
**Documentación técnica del proyecto Tribia**

Contenido:
- Estructura del proyecto
- Instalación y setup
- Comandos de desarrollo
- Enlaces útiles

**Cuándo usar:** Para referencia rápida de la estructura técnica del proyecto.

---

### 9. [FLUJO_COMPLETO_UI.md](./FLUJO_COMPLETO_UI.md)
**Flujo completo de UI/UX con todos los componentes**

Contenido:
- Tokenomics (100M WGoal)
- Pantalla de carga con carrusel
- Modal de conexión con verificación
- Dashboard principal
- Fase de grupos (tabs A-L)
- Fase eliminatoria (Octavos, Cuartos, Semis, Final)
- Sistema de referidos (10 WGoal para ambos)
- Componentes globales (Header, Footer)
- Base de datos actualizada con referidos
- APIs completas

**Cuándo usar:** Para implementar toda la interfaz de usuario y flujo de navegación.

---
  - Feedback visual
  - Manejo de errores
  - Estados de carga
  - Responsive design
- Testing
  - Testing de componentes
  - Mocking de MiniKit
  - Testing E2E
- Monitoreo
  - Analytics
  - Error tracking
  - Performance monitoring
- Deployment
  - Variables de entorno
  - CI/CD
  - Health checks
- Documentación
- Checklist de calidad

**Cuándo usar:** Para asegurar que tu Mini App siga los estándares de calidad y seguridad.

---

## 🚀 FLUJO DE TRABAJO RECOMENDADO

### Para Principiantes

1. Lee [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Sección "¿Qué son las Mini Apps?"
2. Sigue [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md) - Pasos 1-6
3. Implementa funcionalidades básicas usando [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md)
4. Revisa [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Secciones de UX/UI y Seguridad

### Para Desarrolladores Intermedios

1. Revisa [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Secciones técnicas
2. Implementa comandos avanzados desde [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md)
3. Aplica [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Todas las secciones
4. Sigue [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md) - Pasos 7-10

### Para Desarrolladores Avanzados

1. Usa [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) como referencia
2. Implementa arquitectura compleja siguiendo [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md)
3. Consulta [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) según necesidad
4. Optimiza usando técnicas avanzadas de [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md)

---

## 🔍 BÚSQUEDA RÁPIDA

### Por Funcionalidad

**Pagos:**
- [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Comando Pay
- [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Validación de pagos

**Autenticación:**
- [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Comando Wallet Auth
- [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Validación de firmas

**Transacciones:**
- [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Comando Send Transaction
- [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Especificaciones

**Testing:**
- [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Sección Testing
- [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md) - Paso 6
- [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Sección Testing

**Deployment:**
- [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md) - Pasos 9-10
- [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Sección Deployment

---

## 📋 CASOS DE USO COMUNES

### Caso 1: Crear una Mini App de Pagos

1. [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md) - Pasos 1-6
2. [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Comando Pay
3. [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Validación de pagos y seguridad

### Caso 2: Implementar Autenticación

1. [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Comando Wallet Auth
2. [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Validación de firmas
3. [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Estado de usuario

### Caso 3: Integrar con Smart Contracts

1. [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Comando Send Transaction
2. [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - Manejo de transacciones
3. [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Especificaciones técnicas

### Caso 4: Implementar Notificaciones

1. [PROTOCOLO_WORLDCOIN.md](./PROTOCOLO_WORLDCOIN.md) - Permisos
2. [COMANDOS_DETALLADOS.md](./COMANDOS_DETALLADOS.md) - Request Permission
3. [MEJORES_PRACTICAS.md](./MEJORES_PRACTICAS.md) - UX de permisos

---

## 🛠️ HERRAMIENTAS Y RECURSOS

### Desarrollo
- **MiniKit SDK:** `@worldcoin/minikit-js`
- **React Integration:** `@worldcoin/minikit-react`
- **Templates:** GitHub - worldcoin/minikit-js

### Testing
- **Túneles:** ngrok, zrok, tunnelmole
- **Debugging:** Eruda
- **Faucet:** L2 Faucet (Sepolia)

### Deployment
- **Hosting:** Vercel (recomendado), Netlify, AWS
- **CI/CD:** GitHub Actions, GitLab CI
- **Monitoring:** Sentry, DataDog

### Documentación
- **Oficial:** https://docs.world.org/mini-apps
- **Developer Portal:** https://developer.worldcoin.org
- **Soporte:** https://t.me/worlddevelopersupport

---

## 📞 SOPORTE

### Canales Oficiales
- **Telegram:** https://t.me/worlddevelopersupport
- **Discord:** https://world.org/discord
- **GitHub:** https://github.com/worldcoin
- **Email:** Disponible en Developer Portal

### Comunidad
- **Twitter:** @worldcoin
- **Reddit:** r/worldcoin
- **Stack Overflow:** Tag `worldcoin`

---

## 📝 NOTAS IMPORTANTES

### Requisitos Previos
- Node.js 18+
- pnpm (recomendado) o npm
- World App instalado en dispositivo móvil
- Cuenta en Developer Portal

### Limitaciones
- Las Mini Apps solo funcionan dentro de World App
- Requieren conexión a internet
- Algunas funcionalidades dependen de la versión de World App

### Actualizaciones
Este manual se basa en:
- **MiniKit Version:** 2.0
- **Fecha:** Abril 2026
- **Protocolo:** Worldcoin Mini Apps

Para actualizaciones, consulta la documentación oficial en https://docs.world.org/mini-apps

---

## 🎯 OBJETIVOS DE APRENDIZAJE

### Nivel Básico
- [ ] Entender qué son las Mini Apps
- [ ] Instalar y configurar MiniKit
- [ ] Crear una Mini App básica
- [ ] Probar en World App
- [ ] Implementar un comando simple

### Nivel Intermedio
- [ ] Implementar múltiples comandos
- [ ] Manejar estados y errores
- [ ] Validar en backend
- [ ] Implementar autenticación
- [ ] Deploy a producción

### Nivel Avanzado
- [ ] Arquitectura escalable
- [ ] Integración con smart contracts
- [ ] Testing automatizado
- [ ] Monitoreo y analytics
- [ ] Optimización de performance

---

## 📚 GLOSARIO

- **MiniKit:** SDK oficial para crear Mini Apps
- **World App:** Aplicación móvil de Worldcoin
- **World ID:** Sistema de identidad de Worldcoin
- **WLD:** Token nativo de Worldcoin
- **Nonce:** Número usado una sola vez para seguridad
- **SIWE:** Sign-In with Ethereum
- **UserOpHash:** Hash de operación de usuario
- **Permit2:** Sistema de aprobación de tokens

---

**¡Bienvenido al ecosistema de Worldcoin Mini Apps!**

Para comenzar, abre [GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md) y sigue los pasos.
