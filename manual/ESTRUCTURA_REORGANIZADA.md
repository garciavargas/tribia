# 📁 ESTRUCTURA REORGANIZADA - TRIBIA

## ✅ Errores Corregidos

### 1. Viewport Warning
- ❌ Antes: `viewport` en `metadata`
- ✅ Ahora: `viewport` exportado separadamente

### 2. Next Image Warnings
- ❌ Antes: `<Image fill>` sin sizes
- ✅ Ahora: `backgroundImage` con CSS

### 3. Tailwind CSS
- ✅ Funcionando correctamente
- ✅ Animación marquee agregada

---

## 📦 Nuevas Dependencias

```json
{
  "@mui/material": "^9.0.0",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "react-icons": "^5.6.0"
}
```

---

## 🗂️ Estructura Completa

```
tribia/
├── app/
│   ├── layout.tsx              ✅ Layout raíz (viewport corregido)
│   ├── page.tsx                ✅ Home (usa Material-UI)
│   ├── globals.css             ✅ Tailwind + animaciones
│   ├── dashboard/
│   │   └── page.tsx            ⏳ Pendiente actualizar con MUI
│   ├── groups/
│   │   └── page.tsx            ⏳ Pendiente actualizar con MUI
│   ├── knockout/
│   │   └── page.tsx            ⏳ Pendiente actualizar con MUI
│   └── referrals/
│       └── page.tsx            ⏳ Pendiente actualizar con MUI
│
├── components/
│   ├── LoadingScreen.tsx       ✅ Spinner (sin Next Image)
│   ├── Header.tsx              ✅ Header con Tailwind
│   ├── Footer.tsx              ✅ Footer con Tailwind
│   │
│   ├── modals/                 ✅ NUEVA CARPETA
│   │   ├── VerificationModal.tsx   ✅ Modal de verificación (MUI)
│   │   ├── PaymentModal.tsx        ✅ Modal de pago (MUI)
│   │   └── TransactionModal.tsx    ✅ Modal de transacción (MUI)
│   │
│   └── [DEPRECATED]
│       └── ConnectModal.tsx    ❌ Reemplazado por VerificationModal
│
└── public/
    ├── pagina1.png             ✅ Imagen 1 del carrusel
    ├── pagina2.png             ✅ Imagen 2 del carrusel
    └── paginatoken.png         ✅ Imagen 3 del carrusel
```

---

## 🎯 Responsabilidades por Carpeta

### `/app`
**Responsabilidad:** Páginas y rutas de Next.js
- Cada carpeta = una ruta
- Cada `page.tsx` = página renderizable

### `/components`
**Responsabilidad:** Componentes reutilizables

#### `/components/modals`
**Responsabilidad:** Todos los modals de la aplicación
- `VerificationModal` - Conexión con World ID
- `PaymentModal` - Pagos con WGoal
- `TransactionModal` - Estado de transacciones

### `/public`
**Responsabilidad:** Assets estáticos
- Imágenes del carrusel
- Futuros iconos y logos

---

## 🎨 Material-UI + Tailwind CSS

### Cuándo usar Material-UI
✅ **Modals** - Dialog, DialogTitle, DialogContent
✅ **Botones** - Button con variants
✅ **Inputs** - TextField, Select
✅ **Feedback** - CircularProgress, Alert
✅ **Layout** - Box, Container, Grid

### Cuándo usar Tailwind CSS
✅ **Páginas** - Layout general
✅ **Header/Footer** - Componentes globales
✅ **Animaciones** - marquee, transitions
✅ **Utilidades** - spacing, colors, responsive

---

## 🔧 Modals Creados

### 1. VerificationModal
**Uso:** Conexión con World ID

```tsx
import VerificationModal from "@/components/modals/VerificationModal";

<VerificationModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={handleAuthSuccess}
/>
```

**Props:**
- `open: boolean` - Controla visibilidad
- `onClose: () => void` - Callback al cerrar
- `onSuccess: () => void` - Callback al conectar

### 2. PaymentModal
**Uso:** Confirmar pagos con WGoal

```tsx
import PaymentModal from "@/components/modals/PaymentModal";

<PaymentModal
  open={showPayment}
  onClose={() => setShowPayment(false)}
  amount={5}
  description="Premio por predicción correcta"
/>
```

**Props:**
- `open: boolean`
- `onClose: () => void`
- `amount: number` - Cantidad de WGoal
- `description: string` - Descripción del pago

### 3. TransactionModal
**Uso:** Mostrar estado de transacciones

```tsx
import TransactionModal from "@/components/modals/TransactionModal";

<TransactionModal
  open={showTx}
  onClose={() => setShowTx(false)}
  status="pending" // "pending" | "success" | "error"
  message="Procesando tu predicción..."
/>
```

**Props:**
- `open: boolean`
- `onClose: () => void`
- `status: "pending" | "success" | "error"`
- `message: string`

---

## 🎨 Iconos con React Icons

### Importar iconos

```tsx
import { 
  FaGlobe,      // 🌍 World ID
  FaCoins,      // 💰 WGoal
  FaCheckCircle, // ✅ Éxito
  FaTimesCircle, // ❌ Error
  FaFutbol,     // ⚽ Fútbol
  FaTrophy,     // 🏆 Trofeo
  FaUsers,      // 👥 Referidos
  FaFire        // 🔥 Racha
} from "react-icons/fa";
```

### Usar en componentes

```tsx
<Box sx={{ fontSize: 60, color: "primary.main" }}>
  <FaGlobe />
</Box>
```

---

## 🔄 Flujo de Modals

### Verificación
```
Usuario abre app
    ↓
LoadingScreen (carrusel)
    ↓
VerificationModal
    ↓
Alert: "Wallet conectada"
    ↓
Dashboard
```

### Predicción
```
Usuario selecciona partido
    ↓
Elige resultado
    ↓
TransactionModal (status: "pending")
    ↓
Procesa transacción
    ↓
TransactionModal (status: "success")
    ↓
Predicción guardada
```

### Pago de Premio
```
Usuario gana predicción
    ↓
PaymentModal (amount: 5, description: "Premio...")
    ↓
Alert: "Pago de 5 WGoal"
    ↓
Balance actualizado
```

---

## 📱 Responsive con Material-UI

### Breakpoints
```tsx
sx={{
  fontSize: { xs: 14, sm: 16, md: 18 },
  padding: { xs: 2, sm: 3, md: 4 },
  display: { xs: "block", md: "flex" }
}}
```

### Touch Targets
```tsx
<Button
  size="large"
  sx={{ minHeight: 44 }}  // Mínimo 44px
>
  Botón
</Button>
```

---

## ✅ Checklist de Migración

### Completado
- [x] Viewport corregido
- [x] LoadingScreen sin Next Image
- [x] Material-UI instalado
- [x] React Icons instalado
- [x] VerificationModal creado
- [x] PaymentModal creado
- [x] TransactionModal creado
- [x] Home actualizado con MUI

### Pendiente
- [ ] Dashboard con MUI
- [ ] Groups con MUI
- [ ] Knockout con MUI
- [ ] Referrals con MUI
- [ ] Header con MUI (opcional)
- [ ] Footer con MUI (opcional)

---

## 🚀 Comandos

### Desarrollo
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

### Deploy
```bash
vercel --prod
```

---

## 📝 Notas Importantes

### Material-UI Theme
Por defecto usa el theme de MUI. Para personalizar:

```tsx
// app/layout.tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // blue-600
    },
  },
});

<ThemeProvider theme={theme}>
  {children}
</ThemeProvider>
```

### Tailwind + MUI
Ambos pueden coexistir:
- **MUI:** Para componentes complejos (modals, forms)
- **Tailwind:** Para layout y utilidades

---

**¡Estructura reorganizada y lista! 🎉**
