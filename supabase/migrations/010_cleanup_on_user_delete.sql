-- =============================================================
-- 010 — TRIGGER on_auth_user_deleted
-- Cuando Supabase elimina un usuario de auth.users, la cascada
-- cross-schema (auth → public) no siempre se dispara desde el
-- panel de Supabase. Este trigger garantiza la limpieza completa:
-- borra el perfil, que por CASCADE elimina enrollments,
-- lesson_progress, certificates y event_reservations.
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_user_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deleted();
