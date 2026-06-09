# AcademiaCreativa

Plataforma educativa completa para una escuela de diseño gráfico. Incluye landing page, autenticación real con Supabase, dashboards por rol y gestión de contenido.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite 6 |
| Routing | React Router 7 (BrowserRouter) |
| Estilos | Tailwind CSS 4 + CSS Variables |
| Componentes | Shadcn/ui + Radix UI |
| Animaciones | Framer Motion (`motion/react`) |
| Iconos | Lucide React |
| Formularios | React Hook Form |
| Auth + DB | Supabase (Auth + PostgreSQL + RLS) |
| Package manager | pnpm |

## Requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Cuenta en [Supabase](https://supabase.com) con un proyecto activo

## Instalación

```bash
git clone https://github.com/IgnacioAC1/creativos.git
cd creativos
pnpm install
```

Crea el archivo `.env.local` en la raíz con las credenciales de tu proyecto Supabase:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

> La anon key es pública y segura para el frontend. Nunca incluyas la `service_role` key en el cliente.

```bash
pnpm run dev      # http://localhost:5173
pnpm run build    # build de producción
```

## Estructura del proyecto

```
src/
├── main.tsx                          # Entrada: BrowserRouter + AuthProvider + ThemeProvider
├── lib/
│   └── supabase.ts                   # Cliente Supabase (anon key)
├── styles/
│   ├── index.css                     # Import principal
│   ├── fonts.css                     # Google Fonts
│   ├── tailwind.css                  # Directivas Tailwind
│   └── theme.css                     # Variables CSS de color y tipografía
└── app/
    ├── App.tsx                        # Router con todas las rutas
    ├── data.ts                        # Datos estáticos de la landing
    ├── context/
    │   └── AuthContext.tsx            # Auth real con Supabase: sesión, perfil, matrículas
    ├── components/
    │   ├── ProtectedRoute.tsx         # Redirige por rol; sin auth → /login
    │   ├── ScrollToTop.tsx            # Resetea scroll en cada cambio de ruta
    │   ├── EventSignupModal.tsx       # Modal de reserva de eventos
    │   ├── CourseCompletionModal.tsx  # Modal de felicitación + certificado PDF
    │   ├── figma/                     # Secciones de la landing + Nav compartido
    │   └── ui/                        # Shadcn/ui (~50 componentes)
    └── pages/
        ├── LandingPage.tsx
        ├── LoginPage.tsx
        ├── RegisterPage.tsx
        ├── CoursesPage.tsx
        ├── CourseDetailPage.tsx
        ├── EventsPage.tsx
        ├── StudentDashboard.tsx
        ├── TeacherDashboard.tsx
        ├── CourseEditorPage.tsx
        ├── AdminDashboard.tsx
        ├── AdminCourses.tsx
        ├── AdminEvents.tsx
        ├── AdminEventEditor.tsx
        └── AdminTeachers.tsx
```

## Rutas

```
/                          → Landing page
/login                     → Login
/registro                  → Registro de nueva cuenta
/cursos                    → Catálogo de cursos (solo publicados)
/cursos/:slug              → Detalle + reproductor + progreso
/eventos                   → Eventos con filtro online/presencial
/alumno                    → Dashboard alumno            [rol: alumno]
/profesor                  → Dashboard profesor          [rol: profesor]
/profesor/cursos/nuevo     → Editor de curso             [rol: profesor]
/profesor/cursos/:id       → Editor de curso             [rol: profesor]
/admin                     → Dashboard admin + métricas  [rol: admin]
/admin/cursos              → Gestión de cursos           [rol: admin]
/admin/cursos/nuevo        → Editor de curso             [rol: admin]
/admin/cursos/:id/editar   → Editor de curso             [rol: admin]
/admin/eventos             → Gestión de eventos          [rol: admin]
/admin/eventos/nuevo       → Editor de evento            [rol: admin]
/admin/eventos/:id/editar  → Editor de evento            [rol: admin]
/admin/profesores          → Gestión de profesores       [rol: admin]
```

## Base de datos (Supabase)

Migraciones en `supabase/migrations/`. Todas las tablas tienen RLS activo.

| Tabla | Descripción |
|---|---|
| `profiles` | Perfil de usuario: nombre, rol, profesor_slug |
| `courses` | Cursos con slug, nivel, precio, instructor, publicado |
| `modules` | Módulos de cada curso |
| `lessons` | Lecciones con vídeo, duración y descripción |
| `enrollments` | Matrículas alumno → curso |
| `lesson_progress` | Lecciones completadas por alumno |
| `certificates` | Certificados emitidos al completar un curso |
| `events` | Eventos online y presenciales |
| `event_reservations` | Reservas de eventos (anónimas o autenticadas) |

### RLS por rol

- **Admin** — acceso total a todas las tablas
- **Profesor** — lee y edita sus propios cursos; lee matrículas y progreso de sus alumnos
- **Alumno** — lee cursos publicados o en los que está matriculado; escribe su propio progreso y certificados
- **Anónimo** — lee cursos publicados, eventos y puede reservar plazas

## Autenticación

Gestionada con Supabase Auth. Al hacer login, el contexto carga automáticamente el perfil y las matrículas del usuario desde la base de datos.

### Cuentas de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@academiacreativa.com | admin123 | admin |
| marta@academiacreativa.com | profe123 | profesor |
| diego@academiacreativa.com | profe123 | profesor |
| lucia@academiacreativa.com | profe123 | profesor |
| alumno@test.com | alumno123 | alumno |

## Roles y permisos

- **Admin** — publica/despublica cursos, crea/edita/elimina eventos, ve métricas de alumnos
- **Profesor** — ve y edita solo sus cursos; puede crear borradores
- **Alumno** — accede a sus cursos inscritos, marca lecciones completadas, descarga certificado PDF al finalizar
- **Sin cuenta** — puede ver descripción de cursos pero las lecciones aparecen bloqueadas

## Tipografías

- **Krona One** — display, encabezados y títulos
- **DM Mono** — etiquetas, badges, navegación, botones
- **Outfit** — cuerpo de texto y párrafos

## Temas

Dark/Light mode con `next-themes`. El tema por defecto es oscuro (`bg: #0A0A0A`). El toggle está en el Nav.

## Certificados

Al completar todas las lecciones de un curso se abre un modal de felicitación con confetti. Desde ahí se puede previsualizar e imprimir el certificado en PDF (HTML inline + `window.print()`).
