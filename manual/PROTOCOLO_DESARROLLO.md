# PROTOCOLO DE DESARROLLO - REGLAS ESTRICTAS

## 🚨 REGLAS OBLIGATORIAS

### REGLA 1: PROHIBIDO USAR `any`

**NUNCA usar `any` en TypeScript. SIEMPRE tipar correctamente.**

❌ **INCORRECTO:**
```typescript
function handleData(data: any) {
  return data.value;
}

const result: any = await fetchData();
```

✅ **CORRECTO:**
```typescript
interface DataResponse {
  value: string;
  timestamp: number;
}

function handleData(data: DataResponse): string {
  return data.value;
}

const result: DataResponse = await fetchData();
```

#### Alternativas a `any`

**Usar `unknown` cuando el tipo es realmente desconocido:**
```typescript
function processUnknown(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }
  if (typeof data === "object" && data !== null && "value" in data) {
    return String((data as { value: unknown }).value);
  }
  return "";
}
```

**Usar genéricos:**
```typescript
function processData<T>(data: T): T {
  return data;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}
```

**Usar tipos de utilidad:**
```typescript
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Record<K extends string | number | symbol, T> = { [P in K]: T };
```

---

### REGLA 2: TAILWIND CSS v4 - SINTAXIS ESTRICTA

**SIEMPRE usar la sintaxis de Tailwind v4 para evitar warnings.**

#### Cambios Principales en v4

❌ **SINTAXIS ANTIGUA (v3):**
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold mb-2">Título</h1>
</div>
```

✅ **SINTAXIS v4:**
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow">
  <h1 className="text-2xl font-bold mb-2">Título</h1>
</div>
```

#### Clases Deprecadas en v4

| v3 (Deprecado) | v4 (Correcto) |
|----------------|---------------|
| `shadow-md` | `shadow` |
| `shadow-lg` | `shadow-lg` |
| `shadow-xl` | `shadow-xl` |
| `ring-offset-{color}` | `ring-offset-{color}` |
| `decoration-{color}` | `underline-{color}` |

#### Configuración Tailwind v4

**tailwind.config.ts:**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
      },
    },
  },
};

export default config;
```

#### Uso de @apply (Evitar)

❌ **EVITAR @apply:**
```css
.button {
  @apply bg-blue-500 text-white px-4 py-2 rounded;
}
```

✅ **USAR COMPONENTES:**
```tsx
const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    {children}
  </button>
);
```

---

### REGLA 3: DESARROLLO MOBILE-FIRST ESTRICTO

**TODO el desarrollo DEBE ser mobile-first. El ecosistema de Worldcoin es 100% móvil.**

#### Breakpoints Mobile-First

```typescript
// Breakpoints estrictos
const BREAKPOINTS = {
  mobile: "320px",   // Móvil pequeño
  tablet: "768px",   // Tablet
  desktop: "1024px", // Desktop (NO prioritario)
} as const;
```

#### Estructura Mobile-First

✅ **CORRECTO - Mobile First:**
```tsx
<div className="
  w-full 
  px-4 
  py-6
  md:px-6 
  md:py-8
  lg:px-8 
  lg:py-10
">
  <h1 className="
    text-2xl 
    font-bold
    md:text-3xl
    lg:text-4xl
  ">
    Título
  </h1>
</div>
```

❌ **INCORRECTO - Desktop First:**
```tsx
<div className="px-8 py-10 md:px-6 md:py-8 sm:px-4 sm:py-6">
  <h1 className="text-4xl md:text-3xl sm:text-2xl">Título</h1>
</div>
```

#### Viewport Meta Tag (Obligatorio)

```tsx
// app/layout.tsx
export const metadata = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};
```

#### Safe Area Insets (iOS)

```tsx
"use client";

import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function SafeAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [insets, setInsets] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    if (MiniKit.isInstalled()) {
      setInsets({
        top: MiniKit.deviceProperties.safeAreaInsets?.top || 0,
        bottom: MiniKit.deviceProperties.safeAreaInsets?.bottom || 0,
      });
    }
  }, []);

  return (
    <div
      style={{
        paddingTop: `${insets.top}px`,
        paddingBottom: `${insets.bottom}px`,
      }}
      className="min-h-screen"
    >
      {children}
    </div>
  );
}
```

#### Tamaños de Fuente Mobile

```tsx
// Tamaños estrictos para móvil
const TEXT_SIZES = {
  xs: "text-xs",    // 12px
  sm: "text-sm",    // 14px
  base: "text-base", // 16px (mínimo legible)
  lg: "text-lg",    // 18px
  xl: "text-xl",    // 20px
  "2xl": "text-2xl", // 24px
} as const;
```

#### Touch Targets (Mínimo 44px)

```tsx
// Botones táctiles - mínimo 44px de altura
<button className="
  min-h-[44px] 
  min-w-[44px] 
  px-4 
  py-2
  active:scale-95
  transition-transform
">
  Botón
</button>
```

#### Gestos Táctiles

```tsx
"use client";

import { useState } from "react";

export default function SwipeableCard() {
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        console.log("Swipe left");
      } else {
        console.log("Swipe right");
      }
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full h-32 bg-blue-500 rounded-lg"
    >
      Swipe me
    </div>
  );
}
```

---

## 📱 COMPONENTES MOBILE-FIRST

### Botón Mobile

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const baseClasses = "min-h-[44px] px-6 py-3 rounded-lg font-medium transition-all active:scale-95";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white active:bg-blue-600",
    secondary: "bg-gray-200 text-gray-900 active:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}
```

### Input Mobile

```tsx
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "number";
}

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full
        min-h-[44px]
        px-4
        py-3
        text-base
        border
        border-gray-300
        rounded-lg
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
      "
    />
  );
}
```

### Card Mobile

```tsx
interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Card({ children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        p-4
        bg-white
        rounded-lg
        shadow
        ${onClick ? "active:scale-98 transition-transform cursor-pointer" : ""}
      `}
    >
      {children}
    </div>
  );
}
```

---

## 🎨 SISTEMA DE DISEÑO MOBILE

### Espaciado

```typescript
const SPACING = {
  xs: "0.25rem",  // 4px
  sm: "0.5rem",   // 8px
  md: "1rem",     // 16px
  lg: "1.5rem",   // 24px
  xl: "2rem",     // 32px
} as const;
```

### Colores

```typescript
const COLORS = {
  primary: {
    50: "#eff6ff",
    500: "#3b82f6",
    900: "#1e3a8a",
  },
  gray: {
    50: "#f9fafb",
    500: "#6b7280",
    900: "#111827",
  },
} as const;
```

### Tipografía

```typescript
const TYPOGRAPHY = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
  },
} as const;
```

---

## 🔒 TIPOS ESTRICTOS

### Tipos de MiniKit

```typescript
import type { MiniKit } from "@worldcoin/minikit-js";

// Usuario
interface User {
  walletAddress: string;
  username?: string;
  profilePictureUrl?: string;
  permissions?: {
    notifications: boolean;
    contacts: boolean;
  };
  verificationStatus?: {
    isOrbVerified: boolean;
    isDocumentVerified: boolean;
    isSecureDocumentVerified: boolean;
  };
}

// Dispositivo
interface DeviceProperties {
  safeAreaInsets?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  deviceOS?: "ios" | "android";
  worldAppVersion?: number;
}

// Ubicación
type Location = "chat" | "home" | "app-store" | "deep-link" | "wallet-tab" | null;
```

### Tipos de Comandos

```typescript
// Pay
interface PayOptions {
  reference: string;
  to: string;
  tokens: Array<{
    symbol: string;
    token_amount: string;
  }>;
  description: string;
}

interface PayResult {
  transactionHash: string;
  status: "success" | "pending" | "failed";
}

// Wallet Auth
interface WalletAuthOptions {
  nonce: string;
  requestId: string;
  expirationTime: Date;
  notBefore?: Date;
  statement?: string;
}

interface WalletAuthResult {
  signature: string;
  message: string;
  address: string;
}
```

---

## 📏 REGLAS DE CÓDIGO

### 1. Componentes

```typescript
// ✅ CORRECTO
interface ComponentProps {
  title: string;
  count: number;
  onAction: () => void;
}

export default function Component({ title, count, onAction }: ComponentProps) {
  return <div>{title}</div>;
}

// ❌ INCORRECTO
export default function Component(props: any) {
  return <div>{props.title}</div>;
}
```

### 2. Hooks

```typescript
// ✅ CORRECTO
function useCounter(initialValue: number): [number, () => void] {
  const [count, setCount] = useState<number>(initialValue);
  const increment = () => setCount((prev) => prev + 1);
  return [count, increment];
}

// ❌ INCORRECTO
function useCounter(initialValue: any): any {
  const [count, setCount] = useState(initialValue);
  return [count, () => setCount(count + 1)];
}
```

### 3. API Calls

```typescript
// ✅ CORRECTO
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// ❌ INCORRECTO
async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}
```

---

## ✅ CHECKLIST DE DESARROLLO

- [ ] Sin uso de `any` en todo el código
- [ ] Tailwind v4 sintaxis correcta
- [ ] Mobile-first en todos los componentes
- [ ] Touch targets mínimo 44px
- [ ] Safe area insets implementados
- [ ] Tipos TypeScript estrictos
- [ ] Componentes tipados correctamente
- [ ] Responsive design mobile-first
- [ ] Gestos táctiles implementados
- [ ] Performance optimizada para móvil

---

**ESTAS REGLAS SON OBLIGATORIAS Y NO NEGOCIABLES.**
