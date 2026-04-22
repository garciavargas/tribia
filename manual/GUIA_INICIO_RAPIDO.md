# GUÍA DE INICIO RÁPIDO - WORLDCOIN MINI APP

## PASO 1: CREAR PROYECTO

### Opción A: Usar Template Oficial (Recomendado)

```bash
npx @worldcoin/create-mini-app@latest tribia
cd tribia
pnpm install
```

### Opción B: Proyecto Existente

Si ya tienes un proyecto Next.js:

```bash
pnpm install @worldcoin/minikit-js @worldcoin/minikit-react
```

---

## PASO 2: CONFIGURAR MINIKIT

### 2.1 Crear Providers Component

Crea `src/app/providers.tsx`:

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

### 2.2 Actualizar Layout

Modifica `src/app/layout.tsx`:

```tsx
import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Tribia - Worldcoin Mini App",
  description: "Mini app para el ecosistema de Worldcoin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2.3 Deshabilitar SSR (Importante)

MiniKit depende de `window.WorldApp`, por lo que debes deshabilitar SSR para componentes que usen MiniKit.

En `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

---

## PASO 3: CREAR COMPONENTE PRINCIPAL

Crea `src/app/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>();

  useEffect(() => {
    setIsInstalled(MiniKit.isInstalled());
    
    if (MiniKit.isInstalled()) {
      setWalletAddress(MiniKit.user.walletAddress);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tribia</h1>
      
      {isInstalled ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">✓ MiniKit instalado</p>
          {walletAddress && (
            <p className="text-sm">
              Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          )}
        </div>
      ) : (
        <p className="text-red-600">
          Esta app debe abrirse dentro de World App
        </p>
      )}
    </main>
  );
}
```

---

## PASO 4: CONFIGURAR DESARROLLO LOCAL

### 4.1 Instalar Túnel (Ngrok)

```bash
# Instalar ngrok
brew install ngrok  # macOS
# o descargar de https://ngrok.com/download

# Autenticar (obtén tu token en ngrok.com)
ngrok config add-authtoken TU_TOKEN
```

### 4.2 Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

### 4.3 Crear Túnel

En otra terminal:

```bash
ngrok http 3000
```

Copia la URL HTTPS que te proporciona ngrok (ej: `https://abc123.ngrok.io`)

---

## PASO 5: REGISTRAR EN DEVELOPER PORTAL

1. Ve a [Developer Portal](https://developer.worldcoin.org)
2. Crea una nueva Mini App
3. Ingresa la URL de ngrok
4. Guarda tu App ID (formato: `app_xxxxxxxxxx`)

---

## PASO 6: PROBAR EN WORLD APP

### 6.1 Generar QR de Testing

1. Ve a [Testing Page](https://docs.world.org/mini-apps/quick-start/testing)
2. Ingresa tu App ID
3. Escanea el QR con tu teléfono

### 6.2 Verificar Funcionamiento

Tu mini app debería:
- Abrirse dentro de World App
- Mostrar "MiniKit instalado"
- Mostrar tu dirección de wallet

---

## PASO 7: IMPLEMENTAR FUNCIONALIDADES

### 7.1 Autenticación de Wallet

Crea `src/components/WalletAuth.tsx`:

```tsx
"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";

export default function WalletAuth() {
  const [username, setUsername] = useState<string | undefined>();

  const handleAuth = async () => {
    try {
      const nonce = Math.random().toString(36).substring(7);
      
      const result = await MiniKit.walletAuth({
        nonce,
        requestId: `auth-${Date.now()}`,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia",
      });

      if (result.executedWith === "minikit") {
        setUsername(MiniKit.user.username);
        alert("¡Autenticación exitosa!");
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      alert("Error al autenticar");
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Autenticar Wallet
      </button>
      
      {username && (
        <p className="mt-4">Usuario: @{username}</p>
      )}
    </div>
  );
}
```

### 7.2 Solicitar Pago

Crea `src/components/PayButton.tsx`:

```tsx
"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { Tokens, tokenToDecimals } from "@worldcoin/minikit-js/commands";

export default function PayButton() {
  const handlePay = async () => {
    try {
      const result = await MiniKit.pay({
        reference: `pay-${Date.now()}`,
        to: "0x...", // Tu dirección
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
          },
        ],
        description: "Pago de prueba en Tribia",
      });

      if (result.executedWith === "minikit") {
        alert("¡Pago exitoso!");
      }
    } catch (error) {
      console.error("Error en pago:", error);
      alert("Error al procesar pago");
    }
  };

  return (
    <button
      onClick={handlePay}
      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
    >
      Pagar 0.1 WLD
    </button>
  );
}
```

### 7.3 Integrar Componentes

Actualiza `src/app/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import WalletAuth from "@/components/WalletAuth";
import PayButton from "@/components/PayButton";

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(MiniKit.isInstalled());
  }, []);

  if (!isInstalled) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="text-red-600">
          Esta app debe abrirse dentro de World App
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tribia</h1>
      
      <div className="space-y-4">
        <WalletAuth />
        <PayButton />
      </div>
    </main>
  );
}
```

---

## PASO 8: DEBUGGING

### 8.1 Instalar Eruda (Logs en Móvil)

```bash
pnpm add eruda
```

En `src/app/layout.tsx`:

```tsx
"use client";

import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      import("eruda").then((eruda) => eruda.default.init());
    }
  }, []);

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

### 8.2 Verificar Estado de MiniKit

```tsx
console.log("MiniKit instalado:", MiniKit.isInstalled());
console.log("Usuario:", MiniKit.user);
console.log("Ubicación:", MiniKit.location);
console.log("Dispositivo:", MiniKit.deviceProperties);
```

---

## PASO 9: PREPARAR PARA PRODUCCIÓN

### 9.1 Configurar Variables de Entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_APP_ID=app_xxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 9.2 Actualizar Configuración

```tsx
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
```

### 9.3 Deploy

```bash
# Vercel (recomendado)
pnpm build
vercel --prod

# O cualquier otro servicio de hosting
```

### 9.4 Actualizar Developer Portal

1. Ve al Developer Portal
2. Actualiza la URL de producción
3. Solicita revisión para publicación

---

## PASO 10: PUBLICAR EN MINI APP STORE

1. Completa toda la información en Developer Portal:
   - Nombre de la app
   - Descripción
   - Iconos y screenshots
   - Categoría
   - URL de producción

2. Envía para revisión

3. Espera aprobación (usualmente 1-3 días)

4. ¡Tu mini app estará disponible en World App!

---

## CHECKLIST DE LANZAMIENTO

- [ ] MiniKit instalado y configurado
- [ ] Providers configurado correctamente
- [ ] SSR deshabilitado donde sea necesario
- [ ] Funcionalidades principales implementadas
- [ ] Testing completo en World App
- [ ] Manejo de errores implementado
- [ ] UI responsive y accesible
- [ ] Variables de entorno configuradas
- [ ] Deploy en producción
- [ ] Developer Portal actualizado
- [ ] Documentación de usuario creada
- [ ] Enviado para revisión

---

## RECURSOS ÚTILES

- **Documentación**: https://docs.world.org/mini-apps
- **Developer Portal**: https://developer.worldcoin.org
- **Templates**: https://github.com/worldcoin/minikit-js
- **Soporte**: https://t.me/worlddevelopersupport
- **Discord**: https://world.org/discord

---

## PRÓXIMOS PASOS

1. Implementar más comandos de MiniKit
2. Agregar backend para verificaciones
3. Implementar notificaciones push
4. Integrar con contratos inteligentes
5. Optimizar UX y performance
6. Agregar analytics
7. Implementar tests automatizados

---

**¡Felicidades! Tu mini app de Worldcoin está lista para empezar.**
