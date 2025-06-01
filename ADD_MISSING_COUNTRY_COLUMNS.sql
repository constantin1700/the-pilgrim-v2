-- ========================================
-- AGREGAR COLUMNAS FALTANTES A LA TABLA COUNTRIES
-- ========================================
-- Ejecuta este SQL ANTES de POPULATE_COUNTRIES_DETAILED.sql

-- Agregar todas las columnas JSONB faltantes
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS cost_of_living JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS work_visa_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS climate_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cultural_tips JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS job_market JSONB DEFAULT '{}';

-- Verificar que las columnas se agregaron correctamente
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'countries' 
    AND column_name IN ('cost_of_living', 'work_visa_info', 'climate_info', 'cultural_tips', 'job_market')
  ) THEN
    RAISE NOTICE '✅ Columnas JSONB agregadas exitosamente a la tabla countries';
  ELSE
    RAISE EXCEPTION '❌ Error al agregar columnas JSONB';
  END IF;
END $$;

-- Listar todas las columnas de la tabla countries para verificación
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'countries' 
ORDER BY ordinal_position;