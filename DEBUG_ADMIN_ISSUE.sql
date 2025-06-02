-- ========================================
-- DEBUG: VERIFICAR PROBLEMA DE ADMIN
-- ========================================

-- 1. Ver TODOS los usuarios en la tabla admin_users
SELECT * FROM public.admin_users;

-- 2. Verificar específicamente tu usuario
SELECT 
  id,
  email,
  role,
  is_active,
  created_at,
  updated_at
FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';

-- 3. Ver la estructura de la tabla admin_users
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- 4. Verificar si hay algún usuario admin activo
SELECT COUNT(*) as admin_count 
FROM public.admin_users 
WHERE is_active = true;

-- 5. FORZAR la actualización de tu usuario para asegurarnos que esté activo
UPDATE public.admin_users 
SET 
  is_active = true,
  role = 'admin',
  updated_at = NOW()
WHERE email = 'constantinenacheenache@gmail.com';

-- 6. Verificar de nuevo después de la actualización
SELECT 
  'DESPUÉS DE UPDATE:' as status,
  id,
  email,
  role,
  is_active
FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';

-- 7. Si no existe el usuario, crearlo directamente
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
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_active = true,
  updated_at = NOW();

-- 8. Verificación final
SELECT 
  'VERIFICACIÓN FINAL:' as status,
  id,
  email,
  role,
  is_active,
  CASE 
    WHEN is_active = true AND role = 'admin' THEN '✅ LISTO PARA LOGIN'
    ELSE '❌ HAY UN PROBLEMA'
  END as estado
FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';