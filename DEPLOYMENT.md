# The Pilgrim - Deployment Guide

## 🚀 Production-Ready Deployment

Esta aplicación está **100% lista para producción** sin placeholders ni funcionalidad simulada.

## 📋 Pre-requisitos

### 1. Supabase Setup
1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el schema completo: `database/schema.sql`
3. Configurar Storage bucket llamado `uploads` con políticas públicas
4. Obtener URL del proyecto y API keys

### 2. Stripe Setup
1. Crear cuenta en [Stripe](https://stripe.com)
2. Configurar productos y precios
3. Configurar webhook endpoint: `https://tu-dominio.com/api/webhook/stripe`
4. Obtener API keys y webhook secret

### 3. Resend Setup
1. Crear cuenta en [Resend](https://resend.com)
2. Verificar dominio de email
3. Obtener API key

### 4. Google Analytics (Opcional)
1. Crear propiedad en Google Analytics 4
2. Obtener Measurement ID

## 🔧 Variables de Entorno

Crear `.env.local` con:

```env
# Supabase - OBLIGATORIO
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Stripe - OBLIGATORIO
STRIPE_PUBLIC_KEY=pk_live_... (o pk_test_... para testing)
STRIPE_SECRET_KEY=sk_live_... (o sk_test_... para testing)
STRIPE_WEBHOOK_SECRET=whsec_...

# Email - OBLIGATORIO
RESEND_API_KEY=re_...
EMAIL_FROM_ADDRESS=hola@tu-dominio.com
EMAIL_FROM_NAME=The Pilgrim

# Analytics - OPCIONAL
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Security - OBLIGATORIO
NEXTAUTH_SECRET=tu_secret_super_seguro_de_32_caracteres_minimo
NEXTAUTH_URL=https://tu-dominio.com
```

## 🌐 Deployment en Vercel

### Opción 1: Desde GitHub
1. Hacer fork del repositorio
2. Conectar con Vercel
3. Configurar variables de entorno
4. Deploy automático

### Opción 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

## 🛠️ Configuración Post-Deployment

### 1. Supabase Policies
Verificar que las políticas RLS estén activas:
```sql
-- Verificar en Supabase Dashboard > Authentication > Policies
SELECT * FROM countries WHERE active = true; -- Debe funcionar
```

### 2. Stripe Webhooks
Configurar endpoint en Stripe Dashboard:
- URL: `https://tu-dominio.com/api/webhook/stripe`
- Eventos: `checkout.session.completed`, `checkout.session.expired`

### 3. DNS y Dominio
- Configurar dominio personalizado en Vercel
- Configurar certificado SSL (automático)

### 4. Monitoreo
- Verificar logs en Vercel Dashboard
- Configurar alertas de error
- Monitorear métricas de Core Web Vitals

## 🧪 Testing de Producción

### APIs Funcionales ✅
- ✅ `/api/countries` - Países con datos reales
- ✅ `/api/blog` - Sistema de blog completo
- ✅ `/api/comments` - Comentarios con moderación
- ✅ `/api/contact` - Formulario de contacto
- ✅ `/api/checkout` - Pagos con Stripe
- ✅ `/api/webhook/stripe` - Webhooks de pago
- ✅ `/api/likes` - Sistema de likes
- ✅ `/api/upload` - Subida de archivos

### Funcionalidades ✅
- ✅ Autenticación completa con Supabase
- ✅ Panel administrativo funcional
- ✅ Pagos reales con Stripe
- ✅ Emails transaccionales con Resend
- ✅ Upload de archivos a Supabase Storage
- ✅ Sistema de likes y analytics
- ✅ Comentarios con moderación
- ✅ Blog con CMS completo
- ✅ Explorador de países interactivo
- ✅ Dashboard de usuarios personalizado
- ✅ Tema oscuro/claro con persistencia
- ✅ Diseño 100% responsivo
- ✅ Cumplimiento WCAG AA

## 📊 Métricas de Rendimiento

### Build Output
```
Route (app)                                Size     First Load JS
┌ ○ /                                      5.29 kB         148 kB
├ ○ /admin/dashboard                       5.46 kB         197 kB
├ ○ /explorador                            3.8 kB          146 kB
├ ○ /blog                                  6.51 kB         149 kB
└ + 48 more routes...

○ (Static)   prerendered as static content
● (SSG)      prerendered as static HTML
ƒ (Dynamic)  server-rendered on demand
```

### Core Web Vitals Target
- LCP: < 2.5s ✅
- FID: < 100ms ✅
- CLS: < 0.1 ✅

## 🔐 Seguridad

### Implementadas ✅
- ✅ Row Level Security en Supabase
- ✅ Validación de entrada en todas las APIs
- ✅ Sanitización de datos de usuario
- ✅ Rate limiting en endpoints críticos
- ✅ HTTPS obligatorio
- ✅ Headers de seguridad configurados
- ✅ Autenticación JWT segura
- ✅ Validación de webhooks Stripe

### Recomendaciones Adicionales
- Configurar WAF en Cloudflare/Vercel
- Monitorear intentos de ataque
- Backup automático de base de datos
- Rotación periódica de API keys

## 📞 Soporte Post-Deploy

Si encuentras problemas:
1. Verificar logs en Vercel Dashboard
2. Comprobar Supabase Dashboard para errores DB
3. Validar variables de entorno
4. Revisar configuración de Stripe webhooks

**Esta aplicación está lista para manejar tráfico de producción desde el día 1.**