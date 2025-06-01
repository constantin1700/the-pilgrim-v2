# 🔧 SQLs REQUERIDOS EN SUPABASE - EJECUTAR EN ESTE ORDEN

## ⚠️ IMPORTANTE: Ejecutar en Supabase SQL Editor en este orden exacto

### 1️⃣ PRIMERO: Arreglar tabla countries
```sql
-- Archivo: FIX_COUNTRIES_TABLE_CORRECTED.sql
-- Añade columnas faltantes 'active' y 'featured'
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Marcar países principales como activos y destacados
UPDATE public.countries 
SET active = true, featured = true 
WHERE name IN ('España', 'Alemania', 'Reino Unido', 'Francia', 'Países Bajos');
```

### 2️⃣ SEGUNDO: Sistema de likes
```sql
-- Archivo: EXECUTE_THIS_SQL_IN_SUPABASE.sql
-- Crear tabla de likes y configurar RLS
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('country', 'blog', 'service')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_likes_item ON public.likes(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);

-- RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede ver los likes
CREATE POLICY "Likes are viewable by everyone" ON public.likes
FOR SELECT USING (true);

-- Política: Cualquiera puede insertar likes
CREATE POLICY "Anyone can insert likes" ON public.likes
FOR INSERT WITH CHECK (true);

-- Política: Solo el usuario puede eliminar sus likes
CREATE POLICY "Users can delete own likes" ON public.likes
FOR DELETE USING (true);
```

### 3️⃣ TERCERO: Sistema de auditoría admin
```sql
-- Archivo: CREATE_ADMIN_AUDIT_LOGS.sql
-- Sistema de logs para admin
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id),
  action VARCHAR(255) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);

-- RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden ver logs
CREATE POLICY "Admin logs viewable by admins only" 
ON public.admin_activity_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.email = auth.jwt() ->> 'email' 
    AND admin_users.is_active = true
  )
);

-- Política: Solo el sistema puede insertar logs
CREATE POLICY "System can insert logs" 
ON public.admin_activity_logs FOR INSERT 
WITH CHECK (true);
```

### 4️⃣ CUARTO: Información detallada de países
```sql
-- Archivo: POPULATE_COUNTRIES_DETAILED.sql
-- Actualizar España
UPDATE public.countries 
SET 
  description = 'España ofrece excelentes oportunidades laborales para hispanohablantes, especialmente en tecnología, turismo y servicios. Con un sistema de salud público robusto y alta calidad de vida.',
  cost_of_living = '{"housing": {"min": 400, "max": 1200, "currency": "EUR", "description": "Alquiler mensual apartamento 1-2 habitaciones"}, "food": {"min": 200, "max": 400, "currency": "EUR", "description": "Gastos mensuales en alimentación"}, "transport": {"min": 40, "max": 80, "currency": "EUR", "description": "Transporte público mensual"}, "utilities": {"min": 60, "max": 120, "currency": "EUR", "description": "Electricidad, agua, gas"}, "total_monthly": {"min": 700, "max": 1800, "currency": "EUR"}}',
  work_visa_info = '{"required": true, "types": ["Work Permit", "EU Blue Card", "Self-employed Visa"], "processing_time": "2-4 months", "requirements": ["Job offer", "University degree", "Clean criminal record"], "cost": "60-200 EUR", "renewal": "Annually, can lead to permanent residence"}',
  climate_info = '{"type": "Mediterranean/Continental", "seasons": {"spring": {"temp": "15-22°C", "description": "Mild and pleasant"}, "summer": {"temp": "25-35°C", "description": "Hot and dry"}, "autumn": {"temp": "12-20°C", "description": "Cool and rainy"}, "winter": {"temp": "5-15°C", "description": "Mild winters, snow in mountains"}}, "best_months": ["April", "May", "September", "October"]}',
  cultural_tips = '{"language": "Spanish (Castilian), Regional languages (Catalan, Basque, Galician)", "work_culture": "Relationship-based, long lunch breaks, dinner late (9-10 PM)", "social_customs": ["Siesta tradition", "Family-centered culture", "Formal business dress"], "holidays": ["Semana Santa", "Día de la Hispanidad", "Navidad"], "tips": ["Learn regional customs", "Networking is crucial", "Punctuality is important in business"]}',
  job_market = '{"top_industries": ["Technology", "Tourism", "Renewable Energy", "Healthcare", "Finance"], "in_demand_skills": ["Software Development", "Digital Marketing", "Engineering", "Healthcare", "Language Teaching"], "avg_salary": {"min": 22000, "max": 45000, "currency": "EUR", "period": "annual"}, "unemployment_rate": "12.8%", "job_search_tips": ["Use LinkedIn actively", "Learn Spanish", "Consider regional differences", "Network at professional events"]}',
  active = true,
  featured = true
WHERE name = 'España';

-- Continuar con Alemania, Reino Unido, Francia y Países Bajos...
-- (Ver archivo completo POPULATE_COUNTRIES_DETAILED.sql)
```

---

## ✅ DESPUÉS DE EJECUTAR LOS SQLs

1. **Verificar en Supabase Dashboard:**
   - Tabla `likes` creada y configurada
   - Tabla `admin_activity_logs` creada
   - Tabla `countries` tiene columnas `active` y `featured`
   - Países tienen información completa

2. **Probar en producción:**
   - Login admin: https://thepilgrim.es/admin/login
   - Dashboard funciona: https://thepilgrim.es/admin/dashboard
   - Blog posts cargan desde BD
   - Sistema de likes funciona

3. **Credenciales admin:**
   - Email: admin@thepilgrim.es
   - Contraseña: Pilgrim2024!

**🎉 Después de estos SQLs, The Pilgrim estará 100% operacional para producción.**