-- Script para crear un usuario admin en Supabase
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- 1. Primero, crea el usuario en Supabase Auth (esto se hace desde la interfaz de Supabase o usando las funciones de auth)
-- Email: admin@thepilgrim.com
-- Password: PilgrimAdmin2024!

-- 2. Luego ejecuta este SQL para agregar el usuario a la tabla admin_users
INSERT INTO admin_users (email, role, active, permissions) VALUES 
(
  'admin@thepilgrim.com', 
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
  }'
)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  active = EXCLUDED.active,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- 3. También podemos crear un usuario editor de prueba
INSERT INTO admin_users (email, role, active, permissions) VALUES 
(
  'editor@thepilgrim.com', 
  'editor', 
  true,
  '{
    "dashboard": true,
    "countries": {"read": true, "write": true},
    "blog": {"read": true, "write": true, "publish": false},
    "comments": {"read": true, "moderate": true},
    "services": {"read": true},
    "analytics": {"read": true},
    "settings": {"read": true}
  }'
)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  active = EXCLUDED.active,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Verificar que los usuarios se crearon correctamente
SELECT email, role, active, created_at FROM admin_users;