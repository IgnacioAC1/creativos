-- =============================================================
-- 004 — CERTIFICATES
-- Un certificado por alumno por curso, emitido al completar el 100%.
-- Reemplaza el localStorage "ac_certificates".
-- =============================================================

CREATE TABLE public.certificates (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug TEXT        NOT NULL,
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_slug)
);

CREATE INDEX certificates_user_id_idx     ON public.certificates(user_id);
CREATE INDEX certificates_course_slug_idx ON public.certificates(course_slug);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Admin: acceso total
CREATE POLICY "admin — todo" ON public.certificates
  FOR ALL
  TO authenticated
  USING  (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Alumno: leer sus propios certificados
CREATE POLICY "alumno — leer propios" ON public.certificates
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    AND public.get_user_role() = 'alumno'
  );

-- Alumno: crear su propio certificado al completar el curso
-- El RLS garantiza que no pueda crear certificados de otros usuarios.
CREATE POLICY "alumno — insertar propio" ON public.certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.get_user_role() = 'alumno'
  );

-- Profesor: puede ver los certificados emitidos en sus cursos
CREATE POLICY "profesor — leer todos" ON public.certificates
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'profesor');

-- Los certificados son inmutables: no hay UPDATE para nadie excepto admin.
