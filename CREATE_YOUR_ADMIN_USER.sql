-- ========================================
-- CREAR TU USUARIO ADMIN PERSONAL
-- ========================================
-- Ejecuta este SQL en Supabase SQL Editor

-- IMPORTANTE: Primero debes crear el usuario en Supabase Auth
-- Ve a Authentication > Users > New User
-- Email: constantinenacheenache@gmail.com
-- Password: Gasgasgas1.!

-- Después de crear el usuario en Auth, ejecuta este SQL:
INSERT INTO public.admin_users (
  email, 
  role, 
  is_active, 
  permissions,
  created_at,
  updated_at
) VALUES (
  'constantinenacheenache@gmail.com', 
  'admin', 
  true,
  '{
    "dashboard": true,
    "countries": {"read": true, "write": true, "delete": true},
    "blog": {"read": true, "write": true, "delete": true, "publish": true},
    "comments": {"read": true, "moderate": true, "delete": true},
    "services": {"read": true, "write": true, "delete": true},
    "analytics": {"read": true, "export": true},
    "settings": {"read": true, "write": true},
    "admin_users": {"read": true, "write": true}
  }',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Verificar que el usuario se creó correctamente
SELECT email, role, is_active, created_at 
FROM public.admin_users 
WHERE email = 'constantinenacheenache@gmail.com';

-- Mensaje de confirmación
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = 'constantinenacheenache@gmail.com' 
    AND is_active = true
  ) THEN
    RAISE NOTICE '✅ Usuario admin constantinenacheenache@gmail.com creado exitosamente';
    RAISE NOTICE '✅ Ahora puedes hacer login en /admin/login';
  ELSE
    RAISE EXCEPTION '❌ Error al crear el usuario admin';
  END IF;
END $$;