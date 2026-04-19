# 🎨 Modales de Tribia - Guía de Uso

Modales mejorados con diseño moderno inspirado en MiniKit de Worldcoin.

## 📦 Componentes Disponibles

### 1. VerificationModal
Modal para conectar World ID

```tsx
import { VerificationModal } from "@/components/modals";

<VerificationModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => {
    console.log("Usuario verificado");
  }}
/>
```

### 2. PaymentModal
Modal para confirmar pagos con WGoal

```tsx
import { PaymentModal } from "@/components/modals";

<PaymentModal
  open={showModal}
  onClose={() => setShowModal(false)}
  amount={5}
  description="Premio por predicción correcta"
/>
```

### 3. DailyRewardModal
Modal para reclamar recompensa diaria

```tsx
import { DailyRewardModal } from "@/components/modals";

<DailyRewardModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => {
    console.log("Recompensa reclamada");
  }}
/>
```

### 4. PredictionModal
Modal para hacer predicciones de partidos

```tsx
import { PredictionModal } from "@/components/modals";

<PredictionModal
  open={showModal}
  onClose={() => setShowModal(false)}
  homeTeam="México"
  awayTeam="Brasil"
  homeFlag="🇲🇽"
  awayFlag="🇧🇷"
  matchDate="11 de junio, 2026 - 15:00"
  onConfirm={(prediction) => {
    console.log("Predicción:", prediction);
  }}
/>
```

### 5. TransactionModal
Modal para mostrar estado de transacciones

```tsx
import { TransactionModal } from "@/components/modals";

<TransactionModal
  open={showModal}
  onClose={() => setShowModal(false)}
  status="success" // "pending" | "success" | "error"
  message="Tu predicción fue guardada exitosamente"
/>
```

### 6. BaseModal
Componente base para crear modales personalizados

```tsx
import { BaseModal } from "@/components/modals";

<BaseModal
  open={showModal}
  onClose={() => setShowModal(false)}
  showCloseButton={true}
  maxWidth={400}
>
  <Box sx={{ p: 4 }}>
    {/* Tu contenido aquí */}
  </Box>
</BaseModal>
```

## 🎨 Características de Diseño

### Colores y Estilos
- **Background**: `#f5f5f5` (gris claro)
- **Botón primario**: `#1a1a1a` (negro)
- **Border radius**: `16px` (redondeado)
- **Sombras**: Suaves y elevadas
- **Animaciones**: Fade + Slide up

### Botones
- **Altura mínima**: 56px
- **Border radius**: 12px
- **Font weight**: 600
- **Text transform**: none (sin mayúsculas)

### Iconos
- **Tamaño contenedor**: 80-100px
- **Border radius**: 12-16px
- **Gradientes**: Colores vibrantes
- **Sombras**: Con color del gradiente

## 🚀 Mejoras Implementadas

### UX
✅ Botón de cerrar consistente (esquina superior derecha)
✅ Animaciones suaves (Fade + Slide)
✅ Backdrop con blur
✅ Estados de loading claros
✅ Feedback visual en selecciones

### Diseño
✅ Paleta de colores moderna
✅ Espaciado consistente
✅ Tipografía clara y legible
✅ Iconos grandes y coloridos
✅ Bordes redondeados

### Accesibilidad
✅ Contraste adecuado
✅ Tamaños de toque mínimos (44px)
✅ Estados disabled claros
✅ Mensajes descriptivos

## 📱 Mobile-First

Todos los modales están optimizados para móvil:
- Máximo ancho: 400px
- Padding responsive
- Botones full-width
- Touch targets grandes

## 🎯 Próximos Pasos

- [ ] Agregar haptic feedback
- [ ] Implementar sonidos de confirmación
- [ ] Agregar más animaciones
- [ ] Crear variantes de color
- [ ] Agregar modo oscuro
