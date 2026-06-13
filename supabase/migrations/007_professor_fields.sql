-- Añade specialty y bio al perfil del profesor
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS specialty TEXT,
  ADD COLUMN IF NOT EXISTS bio       TEXT;

-- Popula los datos de los profesores existentes
UPDATE public.profiles SET
  specialty = 'Directora de Identidad',
  bio       = 'Fundadora de Estudio Solís. Trabaja con marcas culturales en Madrid y Lisboa desde 2012.'
WHERE profesor_slug = 'marta-solis';

UPDATE public.profiles SET
  specialty = 'Tipógrafo & Editor',
  bio       = 'Ex director de arte en Phaidon. Diseñador de tipo con fuentes en uso en más de 30 países.'
WHERE profesor_slug = 'diego-ferran';

UPDATE public.profiles SET
  specialty = 'Diseño Digital & UI',
  bio       = 'Lead designer en productos con millones de usuarios. Ahora enseña lo que le hubiera gustado saber antes.'
WHERE profesor_slug = 'lucia-vega';

-- Bucket público para avatares de profesores
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política: admin puede subir/actualizar/eliminar cualquier avatar
CREATE POLICY "admin puede gestionar avatares"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'avatars'
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Política: lectura pública de avatares
CREATE POLICY "avatares son públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
