-- =============================================================
-- 001 — PROFILES
-- Extiende auth.users con rol, nombre y slug de profesor.
-- Se crea automáticamente via trigger al registrar un usuario.
-- =============================================================

CREATE TABLE public.profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'alumno'
                            CHECK (role IN ('admin', 'profesor', 'alumno')),
  profesor_slug TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Función auxiliar: devuelve el rol del usuario autenticado.
-- SECURITY DEFINER para saltarse el RLS sin recursión.
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ---------------------------------------------------------------
-- Trigger: updated_at automático
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- Trigger: crea perfil automáticamente al registrar usuario
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, profesor_slug)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'alumno'),
    NEW.raw_user_meta_data->>'profesor_slug'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Admin: acceso total
CREATE POLICY "admin — todo" ON public.profiles
  FOR ALL
  TO authenticated
  USING  (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Cualquier usuario autenticado: leer su propio perfil
CREATE POLICY "usuario — leer propio" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Profesor: puede leer todos los perfiles (para ver alumnos de sus cursos)
CREATE POLICY "profesor — leer todos los perfiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'profesor');

-- Cualquier usuario: actualizar sus propios datos (no puede cambiar el rol)
CREATE POLICY "usuario — actualizar propio sin cambiar rol" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
