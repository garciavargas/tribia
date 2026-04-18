# 📁 ESTRUCTURA DEL PROYECTO - TRIBIA

## ✅ Archivos Creados

### Layout Principal
```
app/
├── layout.tsx          ✅ Layout raíz (solo spinner y ajustes)
├── page.tsx            ✅ Home (renderiza LoadingScreen y ConnectModal)
└── globals.css         ✅ Estilos globales + animación marquee
```

### Páginas Separadas
```
app/
├── dashboard/
│   └── page.tsx        ✅ Dashboard principal
├── groups/
│   └── page.tsx        ✅ Fase de grupos (tabs A-L)
├── knockout/
│   └── page.tsx        ✅ Eliminatorias (Octavos, Cuartos, Semis, Final)
└── referrals/
    └── page.tsx        ✅ Sistema de referidos
```

### Componentes Separados
```
components/
├── LoadingScreen.tsx   ✅ Spinner con carrusel (3 imágenes)
├── ConnectModal.tsx    ✅ Modal de verificación (con alert)
├── Header.tsx          ✅ Header con anuncios
└── Footer.tsx          ✅ Footer con usuario y referidos
```

---

## 🎯 Responsabilidades por Componente

### 1. `app/layout.tsx`
**Responsabilidad:** Layout raíz mínimo
- Metadata de la app
- Viewport mobile-first
- Solo renderiza {children}

### 2. `app/page.tsx` (Home)
**Responsabilidad:** Orquestador principal
- Renderiza LoadingScreen
- Controla flujo de autenticación
- Muestra ConnectModal
- Redirige a Dashboard

### 3. `components/LoadingScreen.tsx`
**Responsabilidad:** Pantalla de carga
- Carrusel de 3 imágenes
- Barra de progreso (0-100%)
- Indicadores de slides
- Callback onComplete

### 4. `components/ConnectModal.tsx`
**Responsabilidad:** Modal de conexión
- Botón de conexión
- Alert simulado (para desarrollo)
- Callback onSuccess
- Puede cerrarse

### 5. `app/dashboard/page.tsx`
**Responsabilidad:** Dashboard principal
- Muestra balance y racha
- Lista de próximos partidos
- Navegación a otras páginas
- Usa Header y Footer

### 6. `components/Header.tsx`
**Responsabilidad:** Header global
- Anuncio de premios (marquee)
- Logo de Tribia
- Navegación (Grupos, Eliminatorias)

### 7. `components/Footer.tsx`
**Responsabilidad:** Footer global
- ID del usuario conectado
- Botón de referidos
- Copyright

### 8. `app/groups/page.tsx`
**Responsabilidad:** Fase de grupos
- Tabs de grupos A-L
- Lista de partidos por grupo
- Usa Header y Footer

### 9. `app/knockout/page.tsx`
**Responsabilidad:** Fase eliminatoria
- Tabs de fases (Octavos, Cuartos, etc.)
- Lista de partidos por fase
- Usa Header y Footer

### 10. `app/referrals/page.tsx`
**Responsabilidad:** Sistema de referidos
- Código de referido
- Botón copiar
- Botón compartir (alert simulado)
- Estadísticas
- Usa Header y Footer

---

## 🔄 Flujo de Navegación

```
1. Usuario abre app
   ↓
2. app/page.tsx renderiza LoadingScreen
   ↓
3. LoadingScreen muestra carrusel + progreso
   ↓
4. Al llegar a 100%, llama onComplete()
   ↓
5. app/page.tsx muestra ConnectModal
   ↓
6. Usuario hace clic en "Conectar Wallet"
   ↓
7. Alert simulado: "Wallet conectada"
   ↓
8. ConnectModal llama onSuccess()
   ↓
9. app/page.tsx muestra mensaje de bienvenida
   ↓
10. Usuario hace clic en "Ir al Dashboard"
    ↓
11. Navega a /dashboard
    ↓
12. Desde Dashboard puede ir a:
    - /groups (Fase de grupos)
    - /knockout (Eliminatorias)
    - /referrals (Referidos)
```

---

## 📱 Estructura Mobile-First

### Breakpoints
- **Base:** 320px (móvil pequeño)
- **md:** 768px (tablet)
- **lg:** 1024px (desktop)

### Componentes Responsivos
- ✅ Todos los botones: min-h-[44px] (touch target)
- ✅ Padding: p-4 (16px)
- ✅ Texto: text-base mínimo (16px)
- ✅ Tabs: overflow-x-auto (scroll horizontal)

---

## 🎨 Paleta de Colores

```css
/* Primarios */
--blue-600: #2563eb    /* Botones principales */
--purple-600: #9333ea  /* Referidos */
--green-600: #16a34a   /* Éxito */
--orange-600: #ea580c  /* Racha */

/* Gradientes */
--gradient-yellow-orange: from-yellow-400 to-orange-500  /* Header */
--gradient-blue-purple: from-blue-600 to-purple-600     /* Referidos */
--gradient-purple-pink: from-purple-600 to-pink-600     /* Footer */

/* Neutrales */
--gray-50: #f9fafb     /* Fondo */
--gray-100: #f3f4f6    /* Botones secundarios */
--gray-600: #4b5563    /* Texto secundario */
```

---

## 🚀 Para Subir a Vercel

### 1. Verificar estructura
```bash
ls -la app/
ls -la components/
```

### 2. Verificar que existan las imágenes
```bash
ls -la public/
# Debe tener:
# - pagina1.png
# - pagina2.png
# - paginatoken.png
```

### 3. Build local
```bash
pnpm build
```

### 4. Deploy a Vercel
```bash
vercel --prod
```

### 5. Verificar responsividad
- Abrir en móvil
- Probar todos los botones (min 44px)
- Verificar scroll horizontal en tabs
- Probar carrusel de imágenes

---

## ⚠️ Notas Importantes

### Simulaciones (para desarrollo)
1. **ConnectModal:** Usa `alert()` en lugar de MiniKit
2. **Referidos:** Usa `alert()` para compartir
3. **Datos:** Todo hardcoded (balance, racha, etc.)

### Para Producción
1. Reemplazar alerts con MiniKit real
2. Conectar con APIs
3. Agregar base de datos
4. Implementar autenticación real

---

## 📋 Checklist Pre-Deploy

- [x] Layout creado
- [x] Home con LoadingScreen
- [x] ConnectModal con alert
- [x] Dashboard funcional
- [x] Página de Grupos
- [x] Página de Eliminatorias
- [x] Página de Referidos
- [x] Header con marquee
- [x] Footer con usuario
- [x] Estilos globales
- [ ] Imágenes en /public
- [ ] Build exitoso
- [ ] Deploy a Vercel

---

## 🎯 Próximos Pasos

1. **Agregar imágenes** a `/public`:
   - pagina1.png
   - pagina2.png
   - paginatoken.png

2. **Probar localmente:**
   ```bash
   pnpm dev
   ```

3. **Verificar flujo completo:**
   - Spinner → Modal → Dashboard → Grupos/Eliminatorias/Referidos

4. **Deploy a Vercel:**
   ```bash
   vercel --prod
   ```

5. **Probar en móvil real**

6. **Configurar en Portal de Worldcoin:**
   - Agregar URL de Vercel
   - Configurar tokens
   - Probar autenticación real

---

**¡Estructura lista para deploy! 🚀**
