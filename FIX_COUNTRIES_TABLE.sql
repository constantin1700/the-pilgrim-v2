-- ========================================
-- ACTUALIZAR TABLA COUNTRIES CON COLUMNAS FALTANTES
-- ========================================
-- Ejecuta este SQL en Supabase para agregar las columnas que faltan

-- 1. Agregar columna 'active' para filtrar países activos/inactivos
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 2. Agregar columna 'featured' para destacar países
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 3. Agregar columnas adicionales del esquema completo
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS flag_emoji VARCHAR(10),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS visa_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cost_of_living JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS healthcare_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS education_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS transportation_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS culture_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS weather_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS job_market_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Actualizar algunos países como destacados para el dashboard
UPDATE public.countries 
SET featured = true, active = true 
WHERE code IN ('DE', 'ES', 'US', 'GB', 'CA', 'AU', 'NL', 'CH', 'SE', 'NO');

-- 5. Asegurar que todos los países estén activos por defecto
UPDATE public.countries 
SET active = true 
WHERE active IS NULL;

-- 6. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_countries_active ON public.countries(active);
CREATE INDEX IF NOT EXISTS idx_countries_featured ON public.countries(featured);
CREATE INDEX IF NOT EXISTS idx_countries_active_featured ON public.countries(active, featured);

-- 7. Verificación final
DO $$
BEGIN
  RAISE NOTICE '✅ Columnas agregadas exitosamente';
  RAISE NOTICE '✅ Países destacados configurados';
  RAISE NOTICE '✅ Índices creados';
  RAISE NOTICE '🎉 Tabla countries actualizada correctamente';
END $$;