-- =============================================================
-- 006 — SECURITY FIXES
-- Corrige vulnerabilidades RLS detectadas en auditoría:
-- 1. Perfiles públicos sin autenticación
-- 2. Escalada de rol via UPDATE sin WITH CHECK
-- 3. Trigger handle_new_user acepta role del cliente
-- 4. Rol 'student' inexistente en políticas de enrollments y lesson_progress
-- 5. Certificates insertables por cualquier usuario autenticado
-- =============================================================

-- ---------------------------------------------------------------
-- FIX 1 + FIX 2: profiles
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "profiles: lectura pública" ON public.profiles;
DROP POLICY IF EXISTS "profiles: editar el propio" ON public.profiles;

-- Cada usuario lee solo su propio perfil
CREATE POLICY "profiles: leer propio" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Admin lee todo
CREATE POLICY "profiles: admin lee todo" ON public.profiles
  FOR SELECT TO authenticated
  USING (get_user_role() = 'admin');

-- Profesor lee solo perfiles de alumnos matriculados en sus cursos
CREATE POLICY "profiles: profesor lee sus alumnos" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'profesor'
    AND EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.student_id = profiles.id
        AND c.instructor_id = auth.uid()
    )
  );

-- UPDATE propio sin poder cambiar el rol
CREATE POLICY "profiles: editar el propio sin cambiar rol" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- ---------------------------------------------------------------
-- FIX 3: handle_new_user — hardcodear role = 'alumno'
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
    'alumno',
    NULL
  );
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------
-- FIX 4a: enrollments — 'student' → 'alumno'
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "enrollments: student se matricula" ON public.enrollments;

CREATE POLICY "enrollments: alumno se matricula" ON public.enrollments
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND get_user_role() = 'alumno'
  );

-- ---------------------------------------------------------------
-- FIX 4b: lesson_progress — 'student' → 'alumno'
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "progress: student crea" ON public.lesson_progress;

CREATE POLICY "progress: alumno crea" ON public.lesson_progress
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND get_user_role() = 'alumno'
  );

-- ---------------------------------------------------------------
-- FIX 5: certificates — añadir restricción de rol
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "alumno_insert_own" ON public.certificates;

CREATE POLICY "alumno_insert_own" ON public.certificates
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND get_user_role() = 'alumno'
  );
