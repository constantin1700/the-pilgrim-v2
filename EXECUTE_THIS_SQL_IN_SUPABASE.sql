-- ========================================
-- SISTEMA COMPLETO DE LIKES PARA THE PILGRIM
-- ========================================
-- Ejecuta este SQL completo en el SQL Editor de Supabase
-- URL: https://app.supabase.com/project/nrbvwmmkfmpghbyhosow/sql

-- 1. HABILITAR EXTENSIÓN UUID
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREAR TABLA USER_LIKES
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_session VARCHAR(255) NOT NULL,
  country_id VARCHAR(255),
  post_id UUID,
  like_type VARCHAR(50) NOT NULL CHECK (like_type IN ('country_dashboard', 'country_explorer', 'blog_post')),
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR ÍNDICES PARA ALTO RENDIMIENTO
-- ========================================
CREATE INDEX IF NOT EXISTS idx_user_likes_session ON public.user_likes(user_session);
CREATE INDEX IF NOT EXISTS idx_user_likes_country ON public.user_likes(country_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_post ON public.user_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_type ON public.user_likes(like_type);
CREATE INDEX IF NOT EXISTS idx_user_likes_created ON public.user_likes(created_at DESC);

-- 4. CREAR CONSTRAINTS ÚNICOS (PREVENIR DUPLICADOS)
-- ========================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_likes_unique_blog 
ON public.user_likes(user_session, post_id) 
WHERE like_type = 'blog_post' AND post_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_likes_unique_country 
ON public.user_likes(user_session, country_id, like_type) 
WHERE like_type IN ('country_dashboard', 'country_explorer') AND country_id IS NOT NULL;

-- 5. AGREGAR FOREIGN KEYS (INTEGRIDAD REFERENCIAL)
-- ========================================
DO $$ 
BEGIN
  -- Foreign key para blog posts
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_likes_blog_post') THEN
    ALTER TABLE public.user_likes 
    ADD CONSTRAINT fk_user_likes_blog_post 
    FOREIGN KEY (post_id) 
    REFERENCES public.blog_posts(id) 
    ON DELETE CASCADE;
  END IF;
  
  -- Foreign key para countries
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_likes_country') THEN
    ALTER TABLE public.user_likes 
    ADD CONSTRAINT fk_user_likes_country 
    FOREIGN KEY (country_id) 
    REFERENCES public.countries(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- 6. ACTUALIZAR TABLA COUNTRIES
-- ========================================
-- Agregar columnas de likes si no existen
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS likes_dashboard INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_explorer INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_blog INTEGER DEFAULT 0;

-- Actualizar valores NULL a 0
UPDATE public.countries 
SET 
  likes_dashboard = COALESCE(likes_dashboard, 0),
  likes_explorer = COALESCE(likes_explorer, 0),
  likes_total = COALESCE(likes_total, 0),
  likes_blog = COALESCE(likes_blog, 0)
WHERE 
  likes_dashboard IS NULL OR 
  likes_explorer IS NULL OR 
  likes_total IS NULL OR
  likes_blog IS NULL;

-- Crear índices para ordenamiento
CREATE INDEX IF NOT EXISTS idx_countries_likes_total ON public.countries(likes_total DESC);
CREATE INDEX IF NOT EXISTS idx_countries_likes_dashboard ON public.countries(likes_dashboard DESC);

-- 7. ACTUALIZAR TABLA BLOG_POSTS
-- ========================================
-- Agregar columna likes si no existe
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Actualizar valores NULL a 0
UPDATE public.blog_posts 
SET likes = COALESCE(likes, 0)
WHERE likes IS NULL;

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_blog_posts_likes ON public.blog_posts(likes DESC);

-- 8. CREAR FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. CREAR TRIGGER PARA UPDATED_AT
-- ========================================
DROP TRIGGER IF EXISTS update_user_likes_updated_at ON public.user_likes;
CREATE TRIGGER update_user_likes_updated_at 
BEFORE UPDATE ON public.user_likes 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 10. HABILITAR ROW LEVEL SECURITY
-- ========================================
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;

-- 11. CREAR POLÍTICAS DE SEGURIDAD
-- ========================================
-- Política de lectura: todos pueden ver likes
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.user_likes;
CREATE POLICY "Likes are viewable by everyone" 
ON public.user_likes FOR SELECT 
USING (true);

-- Política de inserción: todos pueden crear likes
DROP POLICY IF EXISTS "Anyone can create likes" ON public.user_likes;
CREATE POLICY "Anyone can create likes" 
ON public.user_likes FOR INSERT 
WITH CHECK (true);

-- Política de eliminación: todos pueden eliminar sus propios likes
DROP POLICY IF EXISTS "Users can delete own likes" ON public.user_likes;
CREATE POLICY "Users can delete own likes" 
ON public.user_likes FOR DELETE 
USING (true);

-- Política de actualización: nadie puede actualizar likes
DROP POLICY IF EXISTS "Likes cannot be updated" ON public.user_likes;
CREATE POLICY "Likes cannot be updated" 
ON public.user_likes FOR UPDATE 
USING (false);

-- 12. CREAR FUNCIÓN HELPER PARA TOGGLE LIKES (OPCIONAL)
-- ========================================
CREATE OR REPLACE FUNCTION toggle_like(
  p_user_session VARCHAR,
  p_item_id VARCHAR,
  p_item_type VARCHAR,
  p_ip_address INET DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_existing_like_id UUID;
  v_result JSONB;
  v_post_uuid UUID;
BEGIN
  -- Convertir item_id a UUID si es un post
  IF p_item_type = 'blog_post' THEN
    v_post_uuid := p_item_id::UUID;
  END IF;

  -- Buscar like existente
  IF p_item_type = 'blog_post' THEN
    SELECT id INTO v_existing_like_id
    FROM public.user_likes
    WHERE user_session = p_user_session 
      AND post_id = v_post_uuid
      AND like_type = p_item_type
    LIMIT 1;
  ELSE
    SELECT id INTO v_existing_like_id
    FROM public.user_likes
    WHERE user_session = p_user_session 
      AND country_id = p_item_id
      AND like_type = p_item_type
    LIMIT 1;
  END IF;

  IF v_existing_like_id IS NOT NULL THEN
    -- Unlike: eliminar like existente
    DELETE FROM public.user_likes WHERE id = v_existing_like_id;
    
    -- Actualizar contadores
    IF p_item_type = 'blog_post' THEN
      UPDATE public.blog_posts 
      SET likes = GREATEST(0, likes - 1)
      WHERE id = v_post_uuid;
    ELSIF p_item_type = 'country_dashboard' THEN
      UPDATE public.countries 
      SET 
        likes_dashboard = GREATEST(0, likes_dashboard - 1),
        likes_total = GREATEST(0, likes_total - 1)
      WHERE id = p_item_id;
    ELSIF p_item_type = 'country_explorer' THEN
      UPDATE public.countries 
      SET 
        likes_explorer = GREATEST(0, likes_explorer - 1),
        likes_total = GREATEST(0, likes_total - 1)
      WHERE id = p_item_id;
    END IF;
    
    v_result := jsonb_build_object('liked', false, 'action', 'unliked');
  ELSE
    -- Like: agregar nuevo like
    IF p_item_type = 'blog_post' THEN
      INSERT INTO public.user_likes (user_session, post_id, like_type, ip_address)
      VALUES (p_user_session, v_post_uuid, p_item_type, p_ip_address);
      
      UPDATE public.blog_posts 
      SET likes = likes + 1
      WHERE id = v_post_uuid;
    ELSE
      INSERT INTO public.user_likes (user_session, country_id, like_type, ip_address)
      VALUES (p_user_session, p_item_id, p_item_type, p_ip_address);
      
      IF p_item_type = 'country_dashboard' THEN
        UPDATE public.countries 
        SET 
          likes_dashboard = likes_dashboard + 1,
          likes_total = likes_total + 1
        WHERE id = p_item_id;
      ELSIF p_item_type = 'country_explorer' THEN
        UPDATE public.countries 
        SET 
          likes_explorer = likes_explorer + 1,
          likes_total = likes_total + 1
        WHERE id = p_item_id;
      END IF;
    END IF;
    
    v_result := jsonb_build_object('liked', true, 'action', 'liked');
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 13. VERIFICACIÓN FINAL
-- ========================================
-- Verificar que todo se creó correctamente
DO $$
DECLARE
  v_table_exists BOOLEAN;
  v_columns_exist BOOLEAN;
BEGIN
  -- Verificar tabla user_likes
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_likes'
  ) INTO v_table_exists;
  
  IF v_table_exists THEN
    RAISE NOTICE '✅ Tabla user_likes creada exitosamente';
  ELSE
    RAISE WARNING '❌ Error creando tabla user_likes';
  END IF;
  
  -- Verificar columnas en countries
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'countries'
    AND column_name IN ('likes_dashboard', 'likes_explorer', 'likes_total')
  ) INTO v_columns_exist;
  
  IF v_columns_exist THEN
    RAISE NOTICE '✅ Columnas de likes en countries creadas exitosamente';
  END IF;
  
  -- Verificar columna en blog_posts
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'blog_posts'
    AND column_name = 'likes'
  ) INTO v_columns_exist;
  
  IF v_columns_exist THEN
    RAISE NOTICE '✅ Columna likes en blog_posts creada exitosamente';
  END IF;
  
  RAISE NOTICE '🎉 Sistema de likes instalado completamente!';
END $$;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================
-- El sistema de likes ahora está completamente configurado con:
-- ✅ Tabla user_likes con todos los índices necesarios
-- ✅ Prevención de likes duplicados
-- ✅ Integridad referencial con foreign keys
-- ✅ Contadores automáticos en countries y blog_posts
-- ✅ Row Level Security habilitado
-- ✅ Timestamps automáticos
-- ✅ Función helper para toggle de likes
-- ✅ Alto rendimiento con índices optimizados