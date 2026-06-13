# AcademiaCreativa

Plataforma educativa para una escuela de diseño gráfico. Landing page generada inicialmente con Figma Make y refactorizada; sobre ella se construyó una plataforma completa con autenticación, dashboards por rol y gestión de contenido.

## Stack

- React 18 + TypeScript + Vite
- React Router 7 (library mode, BrowserRouter)
- Tailwind CSS 4
- Framer Motion (`motion/react`)
- Lucide React (iconos)
- Shadcn/ui + Radix UI (Dialog, Progress y otros ya en uso)
- React Hook Form (instalado, disponible)
- **Supabase** (`@supabase/supabase-js`) — Auth + PostgreSQL + RLS
- pnpm como gestor de paquetes

## Infraestructura

- **Supabase project ID:** `qwcvzpniuqkgaxshenya`
- **Supabase URL:** `https://qwcvzpniuqkgaxshenya.supabase.co`
- **Cliente frontend:** `src/lib/supabase.ts` — usa solo la anon key (`VITE_SUPABASE_ANON_KEY`)
- **Variables de entorno:** `.env.local` (gitignoreado) con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- **Vercel:** `https://creativos-gamma.vercel.app` — mismas variables configuradas en Vercel settings
- **GitHub:** `https://github.com/IgnacioAC1/creativos.git` (rama principal: `main`)
- **Migraciones:** `supabase/migrations/` (001–007)
- **Storage:** bucket `avatars` (público, 5 MB, jpg/png/webp) — avatares de profesores; URL pública persiste en `profiles.avatar_url`

> **Seguridad:** La `service_role` key NUNCA va en el frontend ni en variables `VITE_*`. Solo la anon key es aceptable en el cliente.

## Comandos

```bash
pnpm run dev    # servidor de desarrollo (http://localhost:5173)
pnpm run build  # build de producción
```

## Estructura

```
src/
├── main.tsx                          ← entrada; BrowserRouter + AuthProvider
├── lib/
│   └── supabase.ts                   ← cliente Supabase (anon key); importar desde aquí siempre
├── styles/
│   ├── index.css                     ← import principal
│   ├── fonts.css                     ← Google Fonts
│   ├── tailwind.css                  ← directivas Tailwind
│   └── theme.css                     ← variables CSS de color y tipografía
└── app/
    ├── App.tsx                        ← router con todas las rutas + ScrollToTop
    ├── data.ts                        ← datos estáticos (cursos, eventos, métricas mock); faculty[] solo como referencia — Claustro y AdminTeachers leen de Supabase
    ├── context/
    │   └── AuthContext.tsx            ← auth real con Supabase; onAuthStateChange + setTimeout(0); roles: admin / profesor / alumno; expone updateName() para actualizar profiles.name
    ├── components/
    │   ├── ProtectedRoute.tsx         ← redirige por rol; sin auth → /login
    │   ├── ScrollToTop.tsx            ← resetea scroll en cada cambio de ruta
    │   ├── EventSignupModal.tsx       ← Dialog reutilizable: nombre_evento (readonly), nombre, email
    │   ├── CourseCompletionModal.tsx  ← Dialog de felicitación + certificado al completar un curso
    │   ├── EditProfileModal.tsx       ← Dialog solo para rol alumno: editar nombre + cambiar contraseña
    │   ├── figma/                     ← secciones de la landing + Nav compartido
    │   │   ├── Nav.tsx                ← header fijo; Links de router para Cursos/Eventos; menú usuario; dropdown alumno muestra nombre completo + lápiz → EditProfileModal
    │   │   ├── Faculty.tsx            ← sección Claustro; lee profiles WHERE role='profesor' de Supabase; conteo de cursos calculado desde data.ts por profesorSlug
    │   │   ├── EventCard.tsx          ← prop onReservar para abrir EventSignupModal
    │   │   ├── Events.tsx             ← sección landing con modal integrado
    │   │   └── …resto de secciones
    │   └── ui/                        ← Shadcn/ui (~50 componentes)
    └── pages/
        ├── LandingPage.tsx            ← / (landing completa)
        ├── LoginPage.tsx              ← /login
        ├── RegisterPage.tsx           ← /registro
        ├── CoursesPage.tsx            ← /cursos
        ├── CourseDetailPage.tsx       ← /cursos/:slug (reproductor + progreso)
        ├── EventsPage.tsx             ← /eventos
        ├── StudentDashboard.tsx       ← /alumno (rol: alumno)
        ├── TeacherDashboard.tsx       ← /profesor (rol: profesor)
        ├── CourseEditorPage.tsx       ← /profesor/cursos/nuevo  |  /profesor/cursos/:id
        │                                /admin/cursos/:id/editar
        ├── AdminDashboard.tsx         ← /admin (métricas) + exporta AdminNav
        ├── AdminCourses.tsx           ← /admin/cursos (publicar/despublicar cursos)
        ├── AdminEvents.tsx            ← /admin/eventos (eliminar con AlertDialog confirmación)
        ├── AdminEventEditor.tsx       ← /admin/eventos/nuevo  |  /admin/eventos/:id/editar
        └── AdminTeachers.tsx          ← /admin/profesores — lee profiles de Supabase (role='profesor'|'alumno' con profesor_slug); edita nombre/email/especialidad/bio/avatar; toggle acceso (role); "Nuevo profesor": admin introduce email de usuario ya registrado → asigna role='profesor' + genera profesor_slug
```

## Rutas

```
/                          → LandingPage
/login                     → LoginPage
/registro                  → RegisterPage
/cursos                    → CoursesPage                (muestra solo cursos con published: true)
/cursos/:slug              → CourseDetailPage
/eventos                   → EventsPage
/alumno                    → StudentDashboard          [rol: alumno]
/profesor                  → TeacherDashboard          [rol: profesor]
/profesor/cursos/nuevo     → CourseEditorPage          [rol: profesor]
/profesor/cursos/:id       → CourseEditorPage          [rol: profesor]
/admin                     → AdminDashboard            [rol: admin]
/admin/cursos              → AdminCourses              [rol: admin]
/admin/cursos/nuevo        → CourseEditorPage          [rol: admin]
/admin/cursos/:id/editar   → CourseEditorPage          [rol: admin]
/admin/eventos             → AdminEvents               [rol: admin]
/admin/eventos/nuevo       → AdminEventEditor          [rol: admin]
/admin/eventos/:id/editar  → AdminEventEditor          [rol: admin]
/admin/profesores          → AdminTeachers             [rol: admin]
```

## Autenticación (Supabase Auth real)

- Contexto en `src/app/context/AuthContext.tsx` — usa `supabase.auth.onAuthStateChange` con `setTimeout(0)` para evitar deadlock
- `LoginPage` llama a `supabase.auth.signInWithPassword()` directamente y navega al dashboard según el rol
- `RegisterPage` llama a `supabase.auth.signUp()` — el trigger `handle_new_user` crea el perfil automáticamente con `role='alumno'`
- Sesión gestionada por Supabase (JWT); no hay nada en `localStorage` del lado de la app

### Cuentas de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@academiacreativa.com | admin123 | admin |
| marta@academiacreativa.com | profe123 | profesor |
| diego@academiacreativa.com | profe123 | profesor |
| lucia@academiacreativa.com | profe123 | profesor |
| alumno@test.com | alumno123 | alumno |

> Los emails de profesores son ficticios — no existen realmente. No se puede hacer reset por email.

### Slugs de profesores (`profiles.profesor_slug`)

| Email | profesor_slug |
|---|---|
| marta@academiacreativa.com | `marta-solis` |
| diego@academiacreativa.com | `diego-ferran` |
| lucia@academiacreativa.com | `lucia-vega` |

- El alumno de prueba (`alumno@test.com`) tiene matrículas en: `identidad-visual`, `diseno-web-digital`
- Progreso de lecciones en `localStorage` bajo la clave `ac_progress`
- Certificados emitidos en `localStorage` bajo la clave `ac_certificates` → `Record<courseSlug, isoDateString>`

## Roles y permisos

- **Admin** — accede a todos los dashboards; único que puede publicar/despublicar cursos (publicación requerida para que aparezcan en `/cursos`); puede crear/editar cualquier curso; puede crear/editar/eliminar eventos (con confirmación AlertDialog); dashboard incluye sección "Estado de alumnos por curso" con contadores completado / en proceso / sin actividad y barra proporcional tricolor
- **Profesor** — ve y edita solo sus cursos (filtrado por `profesorSlug`); puede crear cursos pero solo guardar como borrador
- **Alumno** — ve sus cursos inscritos y su progreso
- **Sin login o sin pago** — puede ver la descripción del curso pero las lecciones aparecen bloqueadas (icono candado)

## Datos (`src/app/data.ts`)

Exportaciones principales:
- `courses: Course[]` — 4 cursos (AC-01 a AC-04) con `slug`, `modules[]`, `profesorSlug`, `published`
- `events` — 4 eventos con `id`, `type`, `date`, `price`, `location?`
- `faculty: FacultyMember[]` — 3 profesores con `slug`
- `methodology`, `testimonials` — datos de secciones de la landing
- `mockMetrics` — métricas ficticias para el dashboard admin; incluye `studentStatus[]` con desglose por curso: `completado`, `enProceso`, `sinActividad`

Estructura de un curso:
```ts
Course { code, slug, title, level, lessons, hours, price, description,
         image, alt, topics, profesorSlug, published, modules: Module[] }
Module { id, title, lessons: Lesson[] }
Lesson { id, title, duration, description, videoUrl }
```

## Convenciones

- Los datos viven en `src/app/data.ts`, no dentro de los componentes
- Los componentes de sección de la landing van en `src/app/components/figma/`
- Las páginas van en `src/app/pages/`
- Sin comentarios en el código salvo que el motivo sea no obvio
- `navigate(-1)` para botones "Volver" — nunca hardcodear la ruta de retorno
- `ScrollToTop` ya integrado en `App.tsx`; no hace falta añadirlo en páginas individuales

## Estados (Empty, Loading, Error)

Componentes reutilizables en `src/app/components/`:

**`StateDisplay.tsx`** — Maneja estados: `empty`, `loading`, `error`
- Props: `state`, `title`, `description`, `icon`, `action`
- Usado en: StudentDashboard, TeacherDashboard, AdminCourses
- Documentación: `src/app/components/STATE_DISPLAY_GUIDE.md`

**`SkeletonLoader.tsx`** — Skeleton loaders para loading states
- Variants: `"card"` (grid de cards), `"row"` (filas de tabla), `"text"` (párrafos)
- Listo para usar cuando se implemente DB real

**`PasswordInput.tsx`** — Input de contraseña con toggle de visibilidad
- Icon Eye/EyeOff para mostrar/ocultar contraseña
- Usado en: LoginPage, RegisterPage
- Completamente reutilizable

Patrones de uso y ejemplos en `STATE_DISPLAY_GUIDE.md`

## Finalización de curso y certificado

Cuando un alumno marca la última lección de un curso como completada, `CourseDetailPage` detecta que `updatedIds.length === totalLessons` y abre `CourseCompletionModal`.

El modal tiene dos pantallas:
1. **Felicidades** — confetti (`canvas-confetti`, ya instalado), mensaje de éxito y email del alumno
2. **Certificado** — previsualización del certificado con logo tipográfico en negro (fondo blanco), botón "Descargar (PDF)" que abre una ventana popup con HTML inline y llama a `window.print()`

**Logo en el certificado (fondo blanco):** `AcademiaCreativa` en Krona One negro (`#111`) + `Escuela de Diseño Gráfico` en DM Mono `#9E9B96`. Misma tipografía que el Nav pero invertida a oscuro sobre blanco.

El estado "certificado emitido" se guarda en `ac_certificates` (localStorage). El envío real de email queda pendiente (Supabase ya está integrado pero la función de email aún no).

## Responsive

**Todo lo que se construya debe ser responsive.** El proyecto usa Tailwind con breakpoints `sm` / `md` / `lg` / `xl`.

Reglas obligatorias:
- Layouts en grid o flex con colapso a columna única en móvil (`grid-cols-1 md:grid-cols-N`)
- Padding horizontal: siempre `px-8 md:px-12` en los wrappers de sección
- Tipografía de display: usar `clamp()` o `text-4xl md:text-5xl` — nunca tamaño fijo grande sin breakpoint
- Elementos que se ocultan en móvil: `hidden md:block` / `hidden md:flex`
- `flex` horizontal sin `flex-wrap`: añadir siempre `flex-wrap` o confirmar que no hay riesgo de overflow

## Tipografías

- `Krona One` — display, todos los encabezados y títulos. Fuente de un solo peso (400)
- `DM Mono` — monospace, etiquetas, meta, badges, navegación, botones
- `Outfit` — sans-serif, cuerpo de texto, párrafos
- Las fuentes se aplican siempre con `style={{ fontFamily: "..." }}` inline

## Estilo visual

- Sin cursivas (`italic`) en ningún elemento
- Color de acento: variable CSS `--accent` (~#C8420D, naranja rojizo) — igual en ambos temas
- Sin border-radius (`--radius: 0rem`) — todo es rectangular
- Color gris medio de la paleta: `#9E9B96` — usar este valor (no `text-muted-foreground`) cuando se necesite consistencia garantizada; funciona en ambos temas

## Dark / Light mode

El proyecto tiene dos temas gestionados con `next-themes` (ya instalado y conectado en `main.tsx`):

- `ThemeProvider` en `main.tsx` con `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`
- Clase `dark` → fondo `#0A0A0A`, foreground `#EAE6DE`
- Clase `light` → fondo `#EAE6DE`, foreground `#0A0A0A`; las cards y elementos secundarios conservan su paleta oscura (dark-cards-on-cream)
- Variables definidas en `src/styles/theme.css`: `:root` como base oscura, `.dark` con los valores de marca, `.light` con overrides de background/foreground/border/input-background
- `@custom-variant light (&:is(.light *))` disponible en theme.css — usar prefijo `light:` en Tailwind cuando un elemento necesite un valor distinto solo en light mode (ej. `bg-secondary light:bg-background`)
- Toggle Moon/Sun en el Nav (desktop y móvil); dos botones separados, activo resaltado; usa `useTheme()` de `next-themes`

**Reglas de color para componentes:**
- Texto sobre fondo de página (`bg-background`): usar `text-foreground` — se adapta solo
- Texto dentro de tarjetas oscuras (`bg-card`, `bg-secondary`): usar `text-card-foreground` o `text-secondary-foreground` — siempre cream `#EAE6DE`
- Botones outline dentro de tarjetas oscuras: usar `border-card-foreground/30 text-card-foreground` para que sean visibles en ambos modos
- Hover de filas sobre fondo de página: `hover:bg-black/5 dark:hover:bg-secondary/50` — suave en light, oscuro en dark
- Links de navegación (Nav): usar `color: "var(--foreground)"` inline — negro en light, cream en dark
- **Nunca** hardcodear `#EAE6DE` como color de texto o fill visible — es invisible en light mode
- Inputs/textareas/selects: usar `bg-input-background` (blanco en light, `#1C1C1C` en dark)

## Patrones a evitar

- **`<Link>` dentro de `<div onClick>`**: usar `useNavigate` en el `onClick` del elemento hijo con `e.stopPropagation()` — evita conflictos entre el evento del padre y la navegación de React Router
- **Siempre verificar imports** al añadir `<Link>`: una pantalla en blanco sin error visible suele ser `Link` (u otro componente) usado sin importar

## Navegación de CTAs

- **Hero** (`Hero.tsx`): "Ver cursos" → `/cursos`, "Eventos" → `/eventos` — `<Link>` de React Router, no anclas hash
- **Grid de cursos landing** (`Courses.tsx`): "Acceder al curso" → `/registro` si no autenticado, `/cursos/:slug` si autenticado (Stripe pendiente); "Ver temario completo" → `/cursos/:slug`
- **Grid `/cursos`** (`CoursesPage.tsx`): toda la tarjeta es `<Link to="/cursos/:slug">`
- **Detalle de curso** (`CourseDetailPage.tsx`): "Acceder ahora" → `/registro` si no autenticado, `#` placeholder Stripe si autenticado; precio oculto para alumnos inscritos

## Convenciones tipográficas del Nav

- Links de navegación: `letterSpacing: "0.3em"`, `fontWeight: 500`, `color: "#9E9B96"` via `style` inline
- Tagline "Escuela de Diseño Gráfico": `letterSpacing: "0.4em"`, `fontWeight: 500`, `color: "#9E9B96"`
- "Cursos" y "Eventos" usan `<Link to="...">` de React Router
- "Metodología" y "Claustro" usan `href="#metodología"` si `isHome`, `href="/#metodología"` si no
- Botón de usuario autenticado: `color: "#EAE6DE"` (blanco), `hover:text-accent hover:border-accent` (naranja) — no usar `#9E9B96` para texto de usuario logueado

## Secciones de la landing (`/`)

1. Nav — header fijo con scroll effect + menú usuario
2. Hero — título grande, frase en fondo naranja, stats × 4
3. Ticker — marquee de disciplinas
4. Cursos — 4 cursos en grid asimétrico (AC-01 a AC-04); acordeón expandible
5. Eventos — filtro online/presencial; botones RESERVAR abren EventSignupModal
6. Metodología — 4 pilares del método (id="metodología")
7. Claustro — 3 profesores (id="claustro")
8. Testimonios — carrusel con autoplay
9. CTA — fondo crema, llamada a acción; botones "Ver todos los cursos" → `/cursos` y "Próximos eventos" → `/eventos` con `<Link>` de React Router
10. Footer — redes sociales y scroll-to-top

## Seguridad de la BD (RLS)

Auditoría aplicada en migración `006_security_fixes.sql` (2026-06-13). El esquema real de Supabase **difiere** de las migraciones 001-005 — las migraciones son referencia histórica, las políticas activas son las de la BD.

### Reglas críticas a no revertir

- **`handle_new_user`** hardcodea `role = 'alumno'` — nunca leer `role` de `raw_user_meta_data`; un cliente puede enviar `role: 'admin'` en el signUp
- **`profiles: editar el propio sin cambiar rol`** tiene `WITH CHECK` que compara `role` con el valor actual — sin él, cualquier alumno puede hacer `UPDATE profiles SET role='admin'`
- **`profiles: lectura pública` eliminada** — los perfiles no son públicos; cada rol solo ve lo que necesita (propio / admin todo / profesor sus alumnos matriculados en sus cursos)

### Estado actual de políticas por tabla

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | propio ∣ admin todo ∣ profesor→sus alumnos | — | propio sin cambiar rol ∣ admin cualquiera | — |
| `enrollments` | alumno propio ∣ admin ∣ instructor del curso | alumno solo a sí mismo | — | admin |
| `lesson_progress` | alumno propio ∣ admin ∣ instructor del curso | alumno solo a sí mismo | alumno propio | — |
| `certificates` | alumno propio ∣ profesor todos ∣ admin | alumno solo a sí mismo + rol alumno | — | — |
| `courses` | publicados ∣ propio instructor ∣ admin ∣ matriculado | instructor/admin | instructor/admin | instructor/admin |
| `events` | público | admin | admin | admin |

### Integraciones externas pendientes (Stripe / email)

- El webhook de Stripe debe usar la **service_role key** (nunca anon) para insertar en `enrollments`
- La función de email (Supabase Edge Function o Resend) también requiere service_role
- La anon key del cliente **nunca** debe poder insertar matrículas directamente
