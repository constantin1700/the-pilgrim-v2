# 🌎 The Pilgrim

**Plataforma profesional para españoles que buscan trabajar en el extranjero**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/the-pilgrim)

## ✨ Características

### 🎯 100% Funcional desde el Día 1
- ✅ **Sin placeholders** - Toda la funcionalidad es real
- ✅ **Base de datos completa** con Supabase
- ✅ **Pagos reales** con Stripe
- ✅ **Emails transaccionales** con Resend
- ✅ **Upload de archivos** a Supabase Storage
- ✅ **Autenticación completa** con middleware
- ✅ **Panel administrativo** funcional

### 🔧 Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Middleware
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe
- **Emails**: Resend
- **Storage**: Supabase Storage
- **Deploy**: Vercel

### 📱 Funcionalidades Principales

#### Para Usuarios
- 🌍 **Explorador de países** con información detallada
- 📊 **Dashboard personalizado** con métricas
- 📝 **Blog** con guías y experiencias
- 💬 **Sistema de comentarios** con moderación
- 💰 **Servicios de pago** con Stripe
- 📧 **Formulario de contacto** con emails automáticos

#### Para Administradores
- 📈 **Dashboard de analytics** en tiempo real
- ✍️ **CMS completo** para blog
- 🗺️ **Gestión de países** con datos actualizados
- 💼 **Gestión de servicios** y reservas
- 💬 **Moderación de comentarios**
- ⚙️ **Configuración del sitio**

### 🎨 Diseño y UX
- 🌓 **Tema oscuro/claro** con persistencia
- 📱 **100% responsivo** en todos los dispositivos
- ♿ **Accesibilidad WCAG AA** completa
- ⚡ **Optimización de rendimiento** (Core Web Vitals)
- 🎯 **SEO optimizado** con meta tags dinámicos

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/the-pilgrim.git
cd the-pilgrim
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### 3. Configurar Supabase
```sql
-- Ejecutar database/schema.sql en tu proyecto Supabase
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 📚 Documentación

- [📋 Guía de Deployment](./DEPLOYMENT.md)
- [🗄️ Esquema de Base de Datos](./database/schema.sql)
- [⚙️ Variables de Entorno](./.env.example)

## 🎯 Performance

```
Route (app)                                Size     First Load JS
┌ ○ /                                      5.29 kB         148 kB
├ ○ /dashboard                             11 kB           288 kB
├ ○ /explorador                            3.8 kB          146 kB
├ ○ /blog                                  6.51 kB         149 kB
└ + 48 more routes...

○ (Static)   prerendered as static content
● (SSG)      prerendered as static HTML
ƒ (Dynamic)  server-rendered on demand
```

## 🔐 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Validación de entrada en todas las APIs
- ✅ Sanitización de datos de usuario
- ✅ Headers de seguridad configurados
- ✅ Autenticación JWT segura
- ✅ Validación de webhooks Stripe

## 🌐 Deploy en Producción

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Otras plataformas
- **Netlify**: Compatible con adaptaciones menores
- **Railway**: Soporte nativo para Next.js
- **AWS Amplify**: Deploy directo desde GitHub

## 📧 Soporte

Para soporte técnico o consultas:
- 📧 Email: hola@thepilgrim.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/the-pilgrim/issues)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

---

**Desarrollado con ❤️ para la comunidad española en el extranjero**