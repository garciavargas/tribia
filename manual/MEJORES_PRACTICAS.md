# MEJORES PRÁCTICAS - WORLDCOIN MINI APPS

## ARQUITECTURA

### 1. Separación de Responsabilidades

```
src/
├── app/                    # Páginas de Next.js
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/             # Componentes React
│   ├── minikit/           # Componentes específicos de MiniKit
│   ├── ui/                # Componentes de UI
│   └── shared/            # Componentes compartidos
├── lib/                   # Lógica de negocio
│   ├── minikit/          # Wrappers de MiniKit
│   ├── api/              # Llamadas a API
│   └── utils/            # Utilidades
├── hooks/                 # Custom hooks
├── types/                 # Tipos TypeScript
└── constants/            # Constantes
```

### 2. Manejo de Estado

**Usar Context API para estado global de MiniKit:**

```tsx
// src/contexts/MiniKitContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

interface MiniKitContextType {
  isInstalled: boolean;
  user: typeof MiniKit.user;
  location: typeof MiniKit.location;
  deviceProperties: typeof MiniKit.deviceProperties;
}

const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined);

export function MiniKitContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<MiniKitContextType>({
    isInstalled: false,
    user: MiniKit.user,
    location: MiniKit.location,
    deviceProperties: MiniKit.deviceProperties,
  });

  useEffect(() => {
    if (MiniKit.isInstalled()) {
      setState({
        isInstalled: true,
        user: MiniKit.user,
        location: MiniKit.location,
        deviceProperties: MiniKit.deviceProperties,
      });
    }
  }, []);

  return (
    <MiniKitContext.Provider value={state}>
      {children}
    </MiniKitContext.Provider>
  );
}

export function useMiniKit() {
  const context = useContext(MiniKitContext);
  if (!context) {
    throw new Error("useMiniKit debe usarse dentro de MiniKitContextProvider");
  }
  return context;
}
```

---

## SEGURIDAD

### 1. Validación de Comandos

**Siempre valida en el backend:**

```typescript
// Backend
export async function verifyPayment(
  nonce: string,
  paymentData: PayResult
): Promise<boolean> {
  // 1. Verificar que el nonce existe y no ha sido usado
  const nonceExists = await db.nonce.findUnique({ where: { nonce } });
  if (!nonceExists || nonceExists.used) {
    return false;
  }

  // 2. Verificar la transacción en blockchain
  const tx = await provider.getTransaction(paymentData.transactionHash);
  if (!tx) {
    return false;
  }

  // 3. Verificar que el destinatario es correcto
  if (tx.to?.toLowerCase() !== expectedAddress.toLowerCase()) {
    return false;
  }

  // 4. Verificar el monto
  if (tx.value.toString() !== expectedAmount) {
    return false;
  }

  // 5. Marcar nonce como usado
  await db.nonce.update({
    where: { nonce },
    data: { used: true },
  });

  return true;
}
```

### 2. Generación de Nonces

**Usa nonces criptográficamente seguros:**

```typescript
import { randomBytes } from "crypto";

export function generateNonce(): string {
  return randomBytes(32).toString("hex");
}
```

### 3. Validación de Firmas

**Verifica firmas SIWE correctamente:**

```typescript
import { verifyMessage } from "ethers";

export async function verifyWalletAuth(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Error verificando firma:", error);
    return false;
  }
}
```

### 4. Rate Limiting

**Implementa rate limiting en tu backend:**

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: "Demasiadas solicitudes, intenta más tarde",
});

app.use("/api/", limiter);
```

---

## PERFORMANCE

### 1. Lazy Loading

**Carga componentes pesados solo cuando se necesiten:**

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  loading: () => <p>Cargando...</p>,
  ssr: false,
});
```

### 2. Memoización

**Usa React.memo para componentes que no cambian frecuentemente:**

```tsx
import { memo } from "react";

const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
}: {
  data: any;
}) {
  // Renderizado costoso
  return <div>{/* ... */}</div>;
});
```

### 3. Optimización de Imágenes

**Usa Next.js Image para optimización automática:**

```tsx
import Image from "next/image";

<Image
  src="/imagen.png"
  alt="Descripción"
  width={500}
  height={300}
  priority // Para imágenes above-the-fold
/>
```

### 4. Code Splitting

**Divide tu código en chunks más pequeños:**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@worldcoin/minikit-js"],
  },
};
```

---

## UX/UI

### 1. Feedback Visual

**Siempre proporciona feedback al usuario:**

```tsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await MiniKit.someCommand();
    // Mostrar éxito
    toast.success("¡Operación exitosa!");
  } catch (error) {
    // Mostrar error
    toast.error("Error en la operación");
  } finally {
    setLoading(false);
  }
};

return (
  <button disabled={loading}>
    {loading ? "Procesando..." : "Ejecutar"}
  </button>
);
```

### 2. Manejo de Errores

**Implementa manejo de errores robusto:**

```tsx
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Error capturado:", error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="error-container">
        <h2>Algo salió mal</h2>
        <button onClick={() => setHasError(false)}>Reintentar</button>
      </div>
    );
  }

  return <>{children}</>;
}
```

### 3. Estados de Carga

**Usa skeletons para mejor UX:**

```tsx
function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

function Component() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  if (loading) return <Skeleton />;
  return <div>{/* Contenido */}</div>;
}
```

### 4. Responsive Design

**Asegúrate de que tu app funcione en todos los tamaños:**

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Contenido */}
</div>
```

---

## TESTING

### 1. Testing de Componentes

**Usa Jest y React Testing Library:**

```typescript
import { render, screen } from "@testing-library/react";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import Component from "./Component";

describe("Component", () => {
  it("renderiza correctamente", () => {
    render(
      <MiniKitProvider>
        <Component />
      </MiniKitProvider>
    );
    
    expect(screen.getByText("Texto esperado")).toBeInTheDocument();
  });
});
```

### 2. Mocking de MiniKit

**Mockea MiniKit para tests:**

```typescript
jest.mock("@worldcoin/minikit-js", () => ({
  MiniKit: {
    isInstalled: jest.fn(() => true),
    user: {
      walletAddress: "0x1234567890123456789012345678901234567890",
      username: "testuser",
    },
    pay: jest.fn(() => Promise.resolve({
      executedWith: "minikit",
      data: { transactionHash: "0x..." },
    })),
  },
}));
```

### 3. Testing E2E

**Usa Playwright para tests end-to-end:**

```typescript
import { test, expect } from "@playwright/test";

test("flujo de pago completo", async ({ page }) => {
  await page.goto("http://localhost:3000");
  
  await page.click('button:has-text("Pagar")');
  
  await expect(page.locator(".success-message")).toBeVisible();
});
```

---

## MONITOREO

### 1. Analytics

**Implementa tracking de eventos:**

```typescript
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, properties);
  }
}

// Uso
trackEvent("payment_completed", {
  amount: "0.1",
  token: "WLD",
});
```

### 2. Error Tracking

**Usa Sentry para tracking de errores:**

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Capturar errores
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### 3. Performance Monitoring

**Monitorea métricas de performance:**

```typescript
export function measurePerformance(metricName: string) {
  if (typeof window !== "undefined" && window.performance) {
    const mark = `${metricName}-start`;
    performance.mark(mark);
    
    return () => {
      const endMark = `${metricName}-end`;
      performance.mark(endMark);
      performance.measure(metricName, mark, endMark);
      
      const measure = performance.getEntriesByName(metricName)[0];
      console.log(`${metricName}: ${measure.duration}ms`);
    };
  }
  
  return () => {};
}

// Uso
const endMeasure = measurePerformance("payment-flow");
await MiniKit.pay(options);
endMeasure();
```

---

## DEPLOYMENT

### 1. Variables de Entorno

**Organiza tus variables correctamente:**

```env
# .env.local (desarrollo)
NEXT_PUBLIC_APP_ID=app_dev_xxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# .env.production (producción)
NEXT_PUBLIC_APP_ID=app_prod_xxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### 2. CI/CD

**Configura pipeline de CI/CD:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 3. Health Checks

**Implementa endpoint de health check:**

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

---

## DOCUMENTACIÓN

### 1. Comentarios en Código

**Documenta funciones complejas:**

```typescript
/**
 * Procesa un pago usando MiniKit Pay
 * 
 * @param amount - Cantidad a pagar en tokens
 * @param token - Símbolo del token (WLD, USDC, etc.)
 * @param recipient - Dirección del destinatario
 * @returns Promise con el resultado del pago
 * @throws Error si el pago falla o es cancelado
 * 
 * @example
 * ```typescript
 * const result = await processPayment("0.1", "WLD", "0x...");
 * ```
 */
export async function processPayment(
  amount: string,
  token: string,
  recipient: string
): Promise<PayResult> {
  // Implementación
}
```

### 2. README

**Mantén un README actualizado:**

```markdown
# Tribia - Worldcoin Mini App

## Instalación

\`\`\`bash
pnpm install
\`\`\`

## Desarrollo

\`\`\`bash
pnpm dev
\`\`\`

## Testing

\`\`\`bash
pnpm test
\`\`\`

## Deploy

\`\`\`bash
pnpm build
vercel --prod
\`\`\`

## Variables de Entorno

Ver `.env.example` para configuración requerida.
```

---

## CHECKLIST DE CALIDAD

- [ ] Código TypeScript sin errores
- [ ] Tests con >80% de cobertura
- [ ] Manejo de errores implementado
- [ ] Loading states en todas las acciones
- [ ] Validación en backend
- [ ] Rate limiting configurado
- [ ] Analytics implementado
- [ ] Error tracking configurado
- [ ] Performance optimizada
- [ ] Responsive design
- [ ] Accesibilidad (a11y)
- [ ] SEO optimizado
- [ ] Documentación actualizada
- [ ] CI/CD configurado
- [ ] Health checks implementados

---

**Siguiendo estas mejores prácticas, tu mini app será robusta, segura y escalable.**
