-- =============================================================
-- 003 — LESSON_PROGRESS
-- Registra qué lecciones ha marcado como completadas cada alumno.
-- Reemplaza el localStorage "ac_progress".
-- =============================================================

CREATE TABLE public.lesson_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug  TEXT        NOT NULL,
  lesson_id    TEXT        NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX lesson_progress_user_id_idx     ON public.lesson_progress(user_id);
CREATE INDEX lesson_progress_course_slug_idx ON public.lesson_progress(course_slug);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Admin: acceso total (para ver estadísticas de completado)
CREATE POLICY "admin — todo" ON public.lesson_progress
  FOR ALL
  TO authenticated
  USING  (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Alumno: lectura de su propio progreso
CREATE POLICY "alumno — leer propio" ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    AND public.get_user_role() = 'alumno'
  );

-- Alumno: marcar lección como completada
CREATE POLICY "alumno — insertar propio" ON public.lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.get_user_role() = 'alumno'
  );

-- Alumno: desmarcar lección (eliminar registro)
CREATE POLICY "alumno — eliminar propio" ON public.lesson_progress
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND public.get_user_role() = 'alumno'
  );

-- Profesor: puede leer el progreso de los alumnos en sus cursos
CREATE POLICY "profesor — leer progreso alumnos" ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'profesor');
