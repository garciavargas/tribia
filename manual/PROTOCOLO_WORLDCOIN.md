# PROTOCOLO WORLDCOIN - MINI APPS

## ¿QUÉ SON LAS MINI APPS?

Las Mini Apps son aplicaciones web de terceros que se ejecutan dentro de World App mediante webview. Utilizando el SDK MiniKit, estas aplicaciones pueden volverse nativas e interactuar con el ecosistema de World.

**Características principales:**
- Aplicaciones web que corren dentro de World App
- Acceso a millones de usuarios
- Integración con World ID y World Wallet
- Contratos inteligentes flexibles

---

## INSTALACIÓN DE MINIKIT

### Opción 1: Quick Start (Recomendado)

```bash
npx @worldcoin/create-mini-app@latest my-first-mini-app
```

Se recomienda usar `pnpm` como gestor de paquetes.

### Opción 2: Instalación Manual

```bash
pnpm install @worldcoin/minikit-js @worldcoin/minikit-react
```

O usar CDN (jsdelivr):
```html
<script src="https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@[version]"></script>
```

---

## CONFIGURACIÓN INICIAL

### 1. Configurar MiniKitProvider (React)

**Archivo: `src/app/providers.tsx`**
```tsx
"use client";

import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MiniKitProvider>{children}</MiniKitProvider>;
}
```

**Archivo: `src/app/layout.tsx`**
```tsx
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2. Inicialización Manual (Sin React)

```javascript
import { MiniKit } from "@worldcoin/minikit-js";

const { success } = MiniKit.install();
```

### 3. Verificar Instalación

```javascript
import { MiniKit } from "@worldcoin/minikit-js";

console.log(MiniKit.isInstalled());
// Retorna true solo si la app está abierta dentro de World App
```

---

## ESTADO DE MINIKIT

Después de `install()`, estos son los accesores públicos disponibles:

```typescript
// MiniKit state
{
  user: {
    walletAddress?: string;
    username?: string;
    profilePictureUrl?: string;
    permissions?: {
      notifications: boolean;
      contacts: boolean;
    };
    optedIntoOptionalAnalytics?: boolean;
    verificationStatus?: {
      isOrbVerified: boolean;
      isDocumentVerified: boolean;
      isSecureDocumentVerified: boolean;
    };
    preferredCurrency?: string;
    pendingNotifications?: number;
  };
  deviceProperties: {
    safeAreaInsets?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    deviceOS?: string;
    worldAppVersion?: number;
  };
  location: "chat" | "home" | "app-store" | "deep-link" | "wallet-tab" | null;
}
```

**Notas importantes:**
- `walletAddress`, `verificationStatus`, `preferredCurrency`, `pendingNotifications` y `optedIntoOptionalAnalytics` están disponibles en la inicialización
- `username` y `profilePictureUrl` se llenan después de `walletAuth()`
- `MiniKit.location` es la ubicación de lanzamiento mapeada

---

## PERMISOS

Para obtener el estado actual de permisos:

```javascript
import { MiniKit } from "@worldcoin/minikit-js";
import type { MiniAppGetPermissionsSuccessPayload } from "@worldcoin/minikit-js/commands";

const result = await MiniKit.getPermissions();
const permissions: MiniAppGetPermissionsSuccessPayload["permissions"] =
  result.data.permissions;
```

**Permisos disponibles:**
- `notifications`
- `contacts`
- `microphone`

**Nota:** `MiniKit.user.permissions` es estado cacheado y debe tratarse como incompleto hasta que se obtengan los permisos.

---

## UBICACIÓN DE LANZAMIENTO

MiniKit normaliza el origen de lanzamiento de World App:

```typescript
type MiniAppLaunchLocation =
  | "chat"
  | "home"
  | "app-store"
  | "deep-link"
  | "wallet-tab"
  | null;
```

**Ejemplo de uso:**
```javascript
import { MiniKit } from "@worldcoin/minikit-js";

if (MiniKit.location === "chat") {
  console.log("Abierto desde chat");
}
```

---

## OBJETO RAW DE WORLD APP

Si necesitas el payload sin transformar de World App:

```typescript
// window.WorldApp
{
  world_app_version: number;
  device_os: "ios" | "android";
  is_optional_analytics: boolean;
  wallet_address: string;
  verification_status: {
    is_orb_verified: boolean;
    is_document_verified: boolean;
    is_secure_document_verified: boolean;
  };
  preferred_currency: string;
  pending_notifications: number;
  supported_commands: Array<{
    name: string;
    supported_versions: number[];
  }>;
  safe_area_insets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  location: {
    open_origin: string;
  } | null | undefined;
}
```

**Recomendación:** Usa `window.WorldApp` solo cuando necesites el payload raw. En código de aplicación, prefiere `MiniKit.user`, `MiniKit.deviceProperties` y `MiniKit.location`.

---

## COMANDOS DISPONIBLES

Los comandos son métodos async en `MiniKit`. Usa `await MiniKit.<command>()` y maneja el resultado `{ executedWith, data }`.

### Lista de Comandos

| Comando | Descripción |
|---------|-------------|
| **Pay** | Solicitar un pago dentro de World App |
| **Wallet Auth** | Autenticar con Sign-In with Ethereum |
| **Send Transaction** | Enviar una o más transacciones de World Chain |
| **Sign Message** | Firmar un mensaje personal EIP-191 |
| **Sign Typed Data** | Firmar un payload tipado EIP-712 |
| **Share Contacts** | Abrir el selector de contactos de World App |
| **Request Permission** | Solicitar acceso a notificaciones o micrófono |
| **Get Permissions** | Leer el estado actual de permisos de la mini app |
| **Send Haptic Feedback** | Activar feedback háptico nativo |
| **Share** | Abrir la hoja de compartir nativa |
| **World Chat** | Abrir World Chat con un mensaje prellenado |
| **Attestation** | Solicitar un token de atestación de app |
| **Close Mini App** | Cerrar programáticamente la mini app |

**Nota:** World ID verification ya no es un comando de MiniKit. Usa `@worldcoin/idkit` para nuevos flujos de verificación.

---

## TESTING

### Configuración de Testing

1. Obtén tu App ID del Developer Portal (formato: `app_xxxxxxxxxx`)
2. Usa herramientas de túnel para testing local:
   - [Ngrok](https://ngrok.com/)
   - [zrok](https://zrok.io/)
   - [tunnelmole](https://tunnelmole.com/)

### Herramientas Útiles

- **[Eruda](https://github.com/liriliri/eruda)**: Para mostrar logs en móvil
- **[L2 Faucet](https://www.l2faucet.com/world)**: Para obtener WLD de testnet en Sepolia

### Proceso de Testing

1. Ingresa tu App ID en el Developer Portal
2. Genera el código QR
3. Escanea el código QR con la cámara de tu teléfono
4. La mini app se abrirá en World App

---

## RESPUESTAS DE COMANDOS

Todos los comandos retornan un objeto con esta estructura:

```typescript
{
  executedWith: "minikit" | "fallback";
  data: CommandSpecificData;
}
```

- `executedWith`: Indica si el comando se ejecutó con MiniKit o con un fallback
- `data`: Datos específicos del comando ejecutado

---

## MINI APP STORE

Después del desarrollo, envía tu Mini App para revisión a través del Developer Portal.

### Requisitos para Publicación

1. App ID válido del Developer Portal
2. URL de la aplicación accesible
3. Cumplir con las guías de la comunidad
4. Pasar el proceso de revisión

---

## ESPECIFICACIONES DEL WEBVIEW

Las Mini Apps se ejecutan en un webview con las siguientes características:

- Soporte para JavaScript moderno
- Acceso a APIs web estándar
- Restricciones de seguridad aplicadas
- Integración con el sistema nativo a través de MiniKit

---

## MIGRACIÓN

### De Web App a Mini App

Para convertir una aplicación Next.js existente:

1. Instalar MiniKit
2. Deshabilitar SSR (MiniKit depende de `window.WorldApp`)
3. Agregar MiniKitProvider
4. Implementar conexión de wallet
5. Manejar aprobaciones y llamadas a contratos
6. Manejar recibos de userOpHash
7. Whitelist de contratos y tokens

### Actualización a MiniKit 2.0

Consulta la guía de migración específica en la documentación oficial.

---

## RECURSOS ADICIONALES

- **Documentación oficial**: https://docs.world.org/mini-apps
- **Developer Portal**: https://developer.worldcoin.org
- **Telegram Support**: https://t.me/worlddevelopersupport
- **GitHub**: https://github.com/worldcoin
- **Discord**: https://world.org/discord

---

## TEMPLATES DISPONIBLES

- [Vanilla JS con CDN (con backend para verificaciones)](https://github.com/new?template_name=minikit-js-template&template_owner=worldcoin)
- [Wallet Auth usando JWT](https://github.com/wlding-blocks/wld-mini-apps-101)
- [Wallet Auth usando NextAuth](https://github.com/supercorp-ai/minikit-wallet-auth-next-auth)

---

## FAQ

### ¿Necesito World App instalado para desarrollar?
Sí, necesitas World App instalado en tu dispositivo móvil para probar tu mini app.

### ¿Puedo usar cualquier framework?
Sí, MiniKit-JS es agnóstico al framework. Hay soporte específico para React con `@worldcoin/minikit-react`.

### ¿Cómo monetizo mi mini app?
Puedes usar el comando Pay para solicitar pagos en WLD o stablecoins locales.

### ¿Hay límites de uso?
Consulta el Developer Portal para información sobre límites y cuotas.

---

**Última actualización:** Abril 2026
**Versión del protocolo:** MiniKit 2.0
