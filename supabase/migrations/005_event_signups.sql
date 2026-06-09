-- =============================================================
-- 005 — EVENT_SIGNUPS
-- Reservas de eventos. Permite inscripción anónima (sin cuenta)
-- y también de usuarios autenticados.
-- =============================================================

CREATE TABLE public.event_signups (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   INTEGER     NOT NULL,
  user_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, email)
);

CREATE INDEX event_signups_event_id_idx ON public.event_signups(event_id);
CREATE INDEX event_signups_email_idx    ON public.event_signups(email);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;

-- Admin: acceso total
CREATE POLICY "admin — todo" ON public.event_signups
  FOR ALL
  TO authenticated
  USING  (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Profesor: puede ver todas las inscripciones (para gestionar sus eventos)
CREATE POLICY "profesor — leer todas" ON public.event_signups
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'profesor');

-- Alumno autenticado: leer sus propias inscripciones
CREATE POLICY "alumno — leer propias" ON public.event_signups
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Cualquiera (incluso anónimo): puede inscribirse a un evento
-- La clave anon de Supabase se usa desde el frontend.
CREATE POLICY "cualquiera — insertar" ON public.event_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
