-- =============================================================
-- 009 — FUNCIÓN get_inactive_students
-- Retorna alumnos que llevan N días sin actividad en cursos
-- que tienen contratados hace al menos N días.
-- Usa SECURITY DEFINER para poder acceder a auth.users.
-- Solo admins tienen EXECUTE (controlado en el Edge Function).
-- =============================================================

CREATE OR REPLACE FUNCTION public.get_inactive_students(days_threshold INTEGER DEFAULT 14)
RETURNS TABLE (
  user_id      UUID,
  user_name    TEXT,
  user_email   TEXT,
  course_slug  TEXT,
  enrolled_at  TIMESTAMPTZ,
  last_activity TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE SQL
AS $$
  SELECT
    p.id                    AS user_id,
    p.name                  AS user_name,
    u.email                 AS user_email,
    e.course_slug,
    e.enrolled_at,
    MAX(lp.completed_at)    AS last_activity
  FROM public.enrollments e
  JOIN public.profiles   p  ON p.id = e.user_id
  JOIN auth.users        u  ON u.id = p.id
  LEFT JOIN public.lesson_progress lp
         ON lp.user_id = e.user_id AND lp.course_slug = e.course_slug
  WHERE
    p.role = 'alumno'
    AND e.enrolled_at < NOW() - (days_threshold || ' days')::INTERVAL
  GROUP BY p.id, p.name, u.email, e.course_slug, e.enrolled_at
  HAVING
    MAX(lp.completed_at) IS NULL
    OR MAX(lp.completed_at) < NOW() - (days_threshold || ' days')::INTERVAL
  ORDER BY last_activity ASC NULLS FIRST;
$$;

-- Revoca acceso público; el Edge Function usa service_role y verifica el rol admin
REVOKE ALL ON FUNCTION public.get_inactive_students(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_inactive_students(INTEGER) TO service_role;
