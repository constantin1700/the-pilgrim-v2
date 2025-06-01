-- ========================================
-- CREAR/ACTUALIZAR TABLA DE RESERVACIONES
-- ========================================
-- Este SQL solo crea la tabla de reservaciones ya que services parece existir con estructura diferente

-- 1. Primero verifiquemos la estructura actual de services
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'services';

-- 2. Crear tabla de reservaciones si no existe
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_data JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending',
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_stripe_session ON public.reservations(stripe_session_id);

-- 4. Habilitar RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para reservations
DROP POLICY IF EXISTS "Reservations insert policy" ON public.reservations;
CREATE POLICY "Reservations insert policy" 
ON public.reservations FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Reservations update policy" ON public.reservations;
CREATE POLICY "Reservations update policy" 
ON public.reservations FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Reservations select policy" ON public.reservations;
CREATE POLICY "Reservations select policy" 
ON public.reservations FOR SELECT 
USING (true);

-- 6. Verificación
DO $$
BEGIN
  RAISE NOTICE '✅ Tabla reservations creada/actualizada';
  RAISE NOTICE '✅ Índices creados';
  RAISE NOTICE '✅ RLS configurado';
  RAISE NOTICE '🎉 Sistema de reservaciones listo';
END $$;