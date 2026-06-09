-- =============================================================
-- 002 — ENROLLMENTS
-- Registro de qué alumno tiene acceso a qué curso.
-- Solo el admin puede gestionar inscripciones (o un webhook de pago futuro).
-- =============================================================

CREATE TABLE public.enrollments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug TEXT        NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_slug)
);

CREATE INDEX enrollments_user_id_idx    ON public.enrollments(user_id);
CREATE INDEX enrollments_course_slug_idx ON public.enrollments(course_slug);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Admin: acceso total
CREATE POLICY "admin — todo" ON public.enrollments
  FOR ALL
  TO authenticated
  USING  (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Alumno: solo puede ver sus propias inscripciones
CREATE POLICY "alumno — leer propias" ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    AND public.get_user_role() = 'alumno'
  );

-- Profesor: puede ver las inscripciones de todos los cursos
-- (para saber qué alumnos tienen acceso a sus cursos)
CREATE POLICY "profesor — leer todas" ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'profesor');
