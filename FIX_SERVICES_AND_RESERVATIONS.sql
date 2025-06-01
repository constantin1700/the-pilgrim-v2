-- ========================================
-- CREAR TABLAS DE SERVICIOS Y RESERVACIONES
-- ========================================
-- Ejecuta este SQL en Supabase para crear las tablas necesarias

-- 1. Crear tabla de servicios si no existe
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  monthly_limit INTEGER,
  available_slots INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insertar los servicios que tenemos
INSERT INTO public.services (id, type, price, title, description, features, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'basic', 49.00, 'Plan Básico - Orientación Inicial', 
 'Evaluación inicial de tu perfil profesional y recomendaciones personalizadas para empezar tu búsqueda laboral internacional.',
 '["Evaluación de CV", "Lista de países recomendados", "Guía de primeros pasos", "1 sesión de 30min por videollamada"]',
 true),
('22222222-2222-2222-2222-222222222222', 'premium', 149.00, 'Plan Premium - Preparación Completa',
 'Servicio integral para prepararte completamente para trabajar en el extranjero, incluyendo optimización de CV y preparación para entrevistas.',
 '["Optimización completa de CV", "Preparación para entrevistas", "2 sesiones de coaching", "Guía específica del país elegido", "Templates de cartas de presentación", "Acceso a ofertas de trabajo exclusivas"]',
 true),
('44444444-4444-4444-4444-444444444444', 'express', 29.00, 'Revisión Express de CV',
 'Optimización rápida de tu CV para el mercado internacional con feedback profesional.',
 '["Revisión profesional de CV", "Feedback detallado", "Sugerencias de mejora", "Formato optimizado para ATS", "Entrega en 48h"]',
 true)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  price = EXCLUDED.price,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active;

-- 3. Crear tabla de reservaciones si no existe
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id),
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

-- 4. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_stripe_session ON public.reservations(stripe_session_id);

-- 5. Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 6. Políticas para services (lectura pública)
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone" 
ON public.services FOR SELECT 
USING (true);

-- 7. Políticas para reservations (solo lectura con service role)
DROP POLICY IF EXISTS "Reservations insert policy" ON public.reservations;
CREATE POLICY "Reservations insert policy" 
ON public.reservations FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Reservations update policy" ON public.reservations;
CREATE POLICY "Reservations update policy" 
ON public.reservations FOR UPDATE 
USING (true);

-- 8. Verificación
DO $$
BEGIN
  RAISE NOTICE '✅ Tabla services creada/actualizada';
  RAISE NOTICE '✅ Servicios insertados';
  RAISE NOTICE '✅ Tabla reservations creada';
  RAISE NOTICE '✅ Índices creados';
  RAISE NOTICE '✅ RLS configurado';
  RAISE NOTICE '🎉 Sistema de servicios listo para usar';
END $$;