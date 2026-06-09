# State Display Components

Guía para usar los componentes de estados (empty, loading, error) en la aplicación.

## Componentes disponibles

### 1. `StateDisplay` - Estados: empty, loading, error

Componente reutilizable para mostrar estados de la aplicación.

```tsx
import StateDisplay from "../components/StateDisplay";

// Empty state
<StateDisplay
  state="empty"
  title="No hay datos"
  description="Intenta crear algo nuevo"
  action={{
    label: "Crear ahora",
    onClick: () => navigate("/crear"),
  }}
/>

// Loading state
<StateDisplay
  state="loading"
  title="Cargando..."
/>

// Error state
<StateDisplay
  state="error"
  title="Algo salió mal"
  description="Por favor intenta más tarde"
  action={{
    label: "Reintentar",
    onClick: () => refetch(),
  }}
/>
```

**Props:**
- `state`: `"empty" | "loading" | "error"` (requerido)
- `title`: string (requerido)
- `description`: string (opcional)
- `icon`: LucideIcon (opcional) - icono personalizado
- `action`: { label: string; onClick: () => void } (opcional)

---

### 2. `SkeletonLoader` - Skeleton loaders para loading states

Componente para simular carga de contenido mientras se obtienen datos.

```tsx
import SkeletonLoader from "../components/SkeletonLoader";

// Cards skeleton
<SkeletonLoader variant="card" count={3} />

// Rows skeleton (tabla)
<SkeletonLoader variant="row" count={5} />

// Text skeleton (párrafos)
<SkeletonLoader variant="text" count={3} />
```

**Props:**
- `variant`: `"card" | "row" | "text"` (default: "card")
- `count`: number (default: 3) - cantidad de items

---

## Patrones de uso

### Pattern 1: Carga inicial con skeleton

```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then((res) => {
    setData(res);
    setLoading(false);
  });
}, []);

return loading ? (
  <SkeletonLoader variant="card" count={3} />
) : data.length === 0 ? (
  <StateDisplay state="empty" title="Sin datos" />
) : (
  // Renderizar datos
);
```

### Pattern 2: Manejo de errores

```tsx
const [state, setState] = useState<"idle" | "loading" | "error">("idle");
const [data, setData] = useState([]);

const fetchData = async () => {
  setState("loading");
  try {
    const res = await api.get("/cursos");
    setData(res);
    setState("idle");
  } catch (err) {
    setState("error");
  }
};

return state === "loading" ? (
  <SkeletonLoader />
) : state === "error" ? (
  <StateDisplay
    state="error"
    title="Error al cargar"
    action={{
      label: "Reintentar",
      onClick: fetchData,
    }}
  />
) : data.length === 0 ? (
  <StateDisplay state="empty" title="Sin datos" />
) : (
  // Renderizar datos
);
```

---

## Uso actual (mock data)

Actualmente se usan los empty states en:
- `StudentDashboard` - cuando alumno no tiene cursos
- `TeacherDashboard` - cuando profesor no tiene cursos
- `AdminCourses` - cuando no hay cursos en la tabla

---

## Cuándo implementar loading/error states

**Con DB real:**
1. Reemplazar estados estáticos por states que tracken `loading` y `error`
2. Agregar `<SkeletonLoader />` mientras `loading === true`
3. Agregar `<StateDisplay state="error" ... />` cuando haya error
4. Usar `<StateDisplay state="empty" ... />` cuando no hay datos

**Ejemplo migración a API real:**

```tsx
// ANTES (mock)
const { courses } = useAuth();

// DESPUÉS (con DB)
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchCourses()
    .then(setCourses)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

return loading ? (
  <SkeletonLoader variant="card" count={3} />
) : error ? (
  <StateDisplay state="error" title="Error al cargar cursos" ... />
) : courses.length === 0 ? (
  <StateDisplay state="empty" title="Sin cursos" ... />
) : (
  // Renderizar cursos
);
```
