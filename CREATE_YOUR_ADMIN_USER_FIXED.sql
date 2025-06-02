-- ========================================
-- CREAR TU USUARIO ADMIN (VERSIÓN CORREGIDA)
-- ========================================
-- Ejecuta este SQL en Supabase SQL Editor

-- Primero, veamos qué columnas tiene la tabla admin_users
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- Insertar tu usuario admin (sin la columna permissions que no existe)
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
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verificar que el usuario se creó correctamente
SELECT id, email, role, is_active, created_at 
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
    RAISE NOTICE '📌 Email: constantinenacheenache@gmail.com';
    RAISE NOTICE '📌 Password: Gasgasgas1.!';
  ELSE
    RAISE EXCEPTION '❌ Error al crear el usuario admin';
  END IF;
END $$;