-- Permite lectura pública de perfiles de profesores (para la sección Claustro en la landing)
CREATE POLICY "perfiles de profesores son públicos"
  ON public.profiles FOR SELECT
  USING (role = 'profesor');
