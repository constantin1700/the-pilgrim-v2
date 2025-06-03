-- ========================================
-- CONFIGURACIÓN FINAL DEL SISTEMA ADMIN
-- ========================================

-- PASO 1: Verificar estructura de la tabla admin_users
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- PASO 2: Limpiar cualquier registro anterior
DELETE FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';

-- PASO 3: Insertar tu usuario admin
INSERT INTO public.admin_users (
  email, 
  role, 
  is_active,
  created_at,
  updated_at
) VALUES (
  'constantinenacheenache@gmail.com', 
  'admin', 
  true,
  NOW(),
  NOW()
);

-- PASO 4: Verificar que se creó correctamente
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';

-- PASO 5: Verificar que no hay otros admins que puedan causar conflictos
SELECT * FROM public.admin_users ORDER BY created_at DESC;

-- MENSAJE FINAL
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.admin_users 
    WHERE email = 'constantinenacheenache@gmail.com' 
    AND is_active = true
  ) INTO user_exists;
  
  IF user_exists THEN
    RAISE NOTICE '';
    RAISE NOTICE '✅ ¡ÉXITO! Usuario admin configurado correctamente';
    RAISE NOTICE '📧 Email: constantinenacheenache@gmail.com';
    RAISE NOTICE '🔑 Password: Gasgasgas1.!';
    RAISE NOTICE '🌐 URL: https://thepilgrim.es/admin/login';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE: Asegúrate de que el usuario existe en Supabase Authentication';
    RAISE NOTICE '   Ve a Authentication → Users y verifica que esté creado y confirmado';
  ELSE
    RAISE EXCEPTION '❌ ERROR: No se pudo crear el usuario admin';
  END IF;
END $$;