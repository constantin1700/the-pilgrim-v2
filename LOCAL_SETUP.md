# 🚀 Configuración Local Completa - The Pilgrim

## Opción 1: Prueba Rápida (Sin servicios externos)

Para probar la UI y navegación sin configurar servicios:

```bash
npm run dev
```

Visita http://localhost:3000

## Opción 2: Configuración Completa Local

### 1. Supabase Local

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar Supabase local
supabase start

# Esto te dará:
# API URL: http://localhost:54321
# ANON KEY: [generada automáticamente]
# SERVICE KEY: [generada automáticamente]
```

### 2. Configurar Base de Datos

```bash
# Ejecutar el esquema
supabase db reset

# O manualmente:
psql -h localhost -p 54322 -U postgres -d postgres -f database/schema.sql
```

### 3. Stripe CLI (para pagos)

```bash
# Instalar Stripe CLI
# En Mac: brew install stripe/stripe-cli/stripe
# En Linux: https://stripe.com/docs/stripe-cli#install

# Login
stripe login

# Escuchar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### 4. Variables de Entorno Local

Crea `.env.local` con los valores de Supabase local:

```env
# Supabase Local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key-local]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-key-local]

# Stripe Test Keys
STRIPE_PUBLIC_KEY=pk_test_[tu-clave-publica-test]
STRIPE_SECRET_KEY=sk_test_[tu-clave-secreta-test]
STRIPE_WEBHOOK_SECRET=[generado-por-stripe-cli]

# Email (usa Resend en modo test o configura un servicio SMTP local)
RESEND_API_KEY=re_test_[opcional]
EMAIL_FROM_ADDRESS=test@localhost
EMAIL_FROM_NAME=The Pilgrim Local

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Security
NEXTAUTH_SECRET=local-development-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

## 🧪 Datos de Prueba

### Crear usuario admin:

```sql
-- En Supabase local
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at) 
VALUES ('admin@localhost', crypt('admin123', gen_salt('bf')), now());

-- Agregar a admin_users
INSERT INTO admin_users (email, role, active) 
VALUES ('admin@localhost', 'admin', true);
```

### Cargar datos de ejemplo:

```bash
# Los datos ya están en el schema.sql
# Incluye: países, servicios, posts de blog
```

## 🎯 Probar Funcionalidades

### 1. Usuario Normal:
- Explorar países
- Leer blog
- Usar dashboard
- Enviar formulario de contacto

### 2. Admin:
- Login: http://localhost:3000/admin
- Gestionar países
- Crear posts de blog
- Moderar comentarios
- Ver analytics

### 3. Pagos (Stripe Test):
- Usar tarjeta: 4242 4242 4242 4242
- Fecha: Cualquier futura
- CVC: Cualquier 3 dígitos

## 🐛 Solución de Problemas

### Error de conexión a Supabase:
```bash
# Verificar que Supabase esté corriendo
supabase status
```

### Error de permisos:
```bash
# Reiniciar servicios
supabase stop
supabase start
```

### Logs en tiempo real:
```bash
# Ver logs de Next.js
npm run dev

# Ver logs de Supabase
supabase logs --follow
```

## 📱 Testing Responsivo

Usa las herramientas de desarrollo del navegador:
- Chrome: F12 → Toggle device toolbar
- Firefox: F12 → Responsive Design Mode

## 🔧 Scripts Útiles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:reset": "supabase db reset",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhook/stripe"
  }
}
```