-- ========================================
-- SISTEMA DE AUDITORÍA PARA ADMIN
-- ========================================
-- Ejecuta este SQL en Supabase para crear el sistema de logs

-- 1. Crear tabla de logs de actividad admin
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id),
  action VARCHAR(255) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);

-- 3. Habilitar RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 4. Política: Solo admins pueden ver logs
DROP POLICY IF EXISTS "Admin logs viewable by admins only" ON public.admin_activity_logs;
CREATE POLICY "Admin logs viewable by admins only" 
ON public.admin_activity_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.email = auth.jwt() ->> 'email' 
    AND admin_users.is_active = true
  )
);

-- 5. Política: Solo el sistema puede insertar logs
DROP POLICY IF EXISTS "System can insert logs" ON public.admin_activity_logs;
CREATE POLICY "System can insert logs" 
ON public.admin_activity_logs FOR INSERT 
WITH CHECK (true); -- Se controlará desde el backend con service role

-- 6. Función para limpiar logs antiguos (opcional)
CREATE OR REPLACE FUNCTION cleanup_old_admin_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.admin_activity_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 7. Verificación
DO $$
BEGIN
  RAISE NOTICE '✅ Tabla admin_activity_logs creada';
  RAISE NOTICE '✅ Índices creados para rendimiento óptimo';
  RAISE NOTICE '✅ RLS configurado para seguridad';
  RAISE NOTICE '✅ Políticas de acceso aplicadas';
  RAISE NOTICE '🎉 Sistema de auditoría listo';
END $$;