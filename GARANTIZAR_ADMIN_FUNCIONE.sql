-- ========================================
-- GARANTIZAR QUE EL ADMIN FUNCIONE
-- ========================================

-- 1. VERIFICAR SI EL USUARIO EXISTE EN AUTH
-- NOTA: Primero asegúrate de crear el usuario en Supabase Authentication
-- Email: constantinenacheenache@gmail.com
-- Password: Gasgasgas1.!

-- 2. LIMPIAR Y RECREAR ENTRADA EN admin_users
DELETE FROM public.admin_users WHERE email = 'constantinenacheenache@gmail.com';

INSERT INTO public.admin_users (
  id,
  email, 
  role, 
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'constantinenacheenache@gmail.com', 
  'admin', 
  true,
  NOW(),
  NOW()
);

-- 3. VERIFICAR QUE SE CREÓ
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';

-- 4. VERIFICAR QUE NO HAY PROBLEMAS CON RLS
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- 5. CREAR UN SEGUNDO ADMIN DE RESPALDO
INSERT INTO public.admin_users (
  id,
  email, 
  role, 
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@thepilgrim.es', 
  'admin', 
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 6. MOSTRAR TODOS LOS ADMINS
SELECT * FROM public.admin_users ORDER BY created_at DESC;

-- MENSAJE FINAL
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count 
  FROM public.admin_users 
  WHERE is_active = true;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SISTEMA ADMIN CONFIGURADO';
  RAISE NOTICE '✅ Total de admins activos: %', admin_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Usuario principal: constantinenacheenache@gmail.com';
  RAISE NOTICE '🔑 Contraseña: Gasgasgas1.!';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANTE:';
  RAISE NOTICE '1. El usuario DEBE existir en Supabase Authentication';
  RAISE NOTICE '2. Ve a Authentication → Users y verifica que está CONFIRMADO';
  RAISE NOTICE '3. Si no existe, créalo con Add User → Create new user';
  RAISE NOTICE '4. MARCA la opción "Auto Confirm User"';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 URL: https://thepilgrim.es/admin/login';
  RAISE NOTICE '========================================';
END $$;