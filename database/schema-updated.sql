-- The Pilgrim Database Schema - Actualizado
-- Schema completo con todos los campos necesarios para el dashboard

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Actualizar tabla countries con todos los campos necesarios
DROP TABLE IF EXISTS countries CASCADE;

CREATE TABLE countries (
  id VARCHAR(255) PRIMARY KEY, -- Usando slug como id para URLs amigables
  name VARCHAR(255) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  continent VARCHAR(100) NOT NULL,
  capital VARCHAR(255),
  population BIGINT,
  gdp_per_capita DECIMAL(15,2),
  main_language VARCHAR(100),
  currency VARCHAR(10),
  
  -- Métricas principales del dashboard
  temperature DECIMAL(5,2),
  quality_of_life DECIMAL(8,2),
  average_salary DECIMAL(10,2),
  salary_expense_ratio DECIMAL(5,2),
  social_index DECIMAL(5,2),
  bureaucracy_ease DECIMAL(5,2),
  internet_speed_mbps DECIMAL(8,2),
  internet_connectivity_score INTEGER,
  
  -- Métricas adicionales
  work_life_balance_index DECIMAL(5,2),
  healthcare_quality_index DECIMAL(5,2),
  english_proficiency_score DECIMAL(5,2),
  startup_ecosystem_score DECIMAL(5,2),
  
  -- Flags y características especiales
  digital_nomad_visa BOOLEAN DEFAULT false,
  eu_citizenship_pathway BOOLEAN DEFAULT false,
  tax_advantages BOOLEAN DEFAULT false,
  
  -- Likes y engagement
  likes_total INTEGER DEFAULT 0,
  likes_dashboard INTEGER DEFAULT 0,
  likes_explorer INTEGER DEFAULT 0,
  likes_blog INTEGER DEFAULT 0,
  
  -- Admin flags
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  
  -- Información adicional
  work_visa_info JSONB,
  cost_of_living JSONB,
  climate_info JSONB,
  cultural_tips JSONB,
  job_market JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table actualizada
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name VARCHAR(255) DEFAULT 'The Pilgrim Team',
  author_avatar TEXT,
  category VARCHAR(100),
  tags TEXT[],
  country_id VARCHAR(255) REFERENCES countries(id),
  reading_time INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  seo_title VARCHAR(500),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  country_id VARCHAR(255) REFERENCES countries(id),
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table actualizada con planes específicos
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  duration_days INTEGER,
  monthly_limit INTEGER,
  features JSONB,
  requirements JSONB,
  category VARCHAR(100),
  stripe_price_id VARCHAR(255), -- Para integración con Stripe
  active BOOLEAN DEFAULT true,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service reservations table con integración Stripe completa
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_data JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'completed', 'cancelled', 'refunded')),
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_method VARCHAR(50),
  notes TEXT,
  admin_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  admin_notes TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics table mejorada
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID,
  user_agent TEXT,
  ip_address INET,
  country_code VARCHAR(3),
  page_path VARCHAR(500),
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename VARCHAR(500) NOT NULL,
  original_name VARCHAR(500),
  mime_type VARCHAR(255),
  size_bytes BIGINT,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  uploader_ip INET,
  associated_type VARCHAR(100),
  associated_id VARCHAR(255), -- Cambiado para soportar country slugs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'moderator')),
  permissions JSONB,
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para likes específicos (mejorar tracking)
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_session VARCHAR(255) NOT NULL, -- Session ID o user ID
  country_id VARCHAR(255) REFERENCES countries(id),
  post_id UUID REFERENCES blog_posts(id),
  like_type VARCHAR(50) NOT NULL CHECK (like_type IN ('country_dashboard', 'country_explorer', 'blog_post')),
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_session, country_id, like_type),
  UNIQUE(user_session, post_id, like_type)
);

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_featured ON countries(featured);
CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(active);
CREATE INDEX IF NOT EXISTS idx_countries_continent ON countries(continent);
CREATE INDEX IF NOT EXISTS idx_countries_quality_of_life ON countries(quality_of_life);
CREATE INDEX IF NOT EXISTS idx_countries_salary ON countries(average_salary);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_country_id ON blog_posts(country_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_country_id ON comments(country_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);

CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(popular);
CREATE INDEX IF NOT EXISTS idx_services_stripe_price_id ON services(stripe_price_id);

CREATE INDEX IF NOT EXISTS idx_reservations_service_id ON reservations(service_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_stripe_session_id ON reservations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_analytics_session_id ON user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_page_path ON user_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);

CREATE INDEX IF NOT EXISTS idx_user_likes_country_id ON user_likes(country_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_post_id ON user_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_type ON user_likes(like_type);
CREATE INDEX IF NOT EXISTS idx_user_likes_session ON user_likes(user_session);

CREATE INDEX IF NOT EXISTS idx_file_uploads_associated ON file_uploads(associated_type, associated_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(active);

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acceso público
CREATE POLICY "Allow public read on active countries" ON countries FOR SELECT USING (active = true);
CREATE POLICY "Allow public read on published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow public read on approved comments" ON comments FOR SELECT USING (approved = true);
CREATE POLICY "Allow public read on active services" ON services FOR SELECT USING (active = true);

-- Políticas para escritura pública (con restricciones)
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on analytics" ON user_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert and update on likes" ON user_likes FOR ALL WITH CHECK (true);

-- Política para site settings (solo lectura pública para ciertas keys)
CREATE POLICY "Allow public read on public site settings" ON site_settings FOR SELECT 
USING (key IN ('site_name', 'site_description', 'contact_email', 'maintenance_mode'));

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function para actualizar likes totales automáticamente
CREATE OR REPLACE FUNCTION update_country_likes_total()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE countries 
    SET likes_total = likes_dashboard + likes_explorer + likes_blog
    WHERE id = NEW.country_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE countries 
    SET likes_total = likes_dashboard + likes_explorer + likes_blog
    WHERE id = OLD.country_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_country_likes_trigger 
  AFTER INSERT OR DELETE ON user_likes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_country_likes_total();

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"The Pilgrim"', 'Site name'),
  ('site_description', '"Plataforma profesional para españoles que buscan trabajar en el extranjero"', 'Site description'),
  ('contact_email', '"hola@thepilgrim.com"', 'Main contact email'),
  ('analytics_enabled', 'true', 'Enable analytics tracking'),
  ('maintenance_mode', 'false', 'Maintenance mode toggle'),
  ('max_upload_size', '10485760', 'Max upload size in bytes (10MB)'),
  ('allowed_file_types', '["image/jpeg", "image/png", "image/webp", "application/pdf"]', 'Allowed file types for uploads'),
  ('stripe_enabled', 'true', 'Enable Stripe payments'),
  ('dashboard_filters_enabled', 'true', 'Enable advanced dashboard filters')
ON CONFLICT (key) DO NOTHING;

-- Insert default admin user
INSERT INTO admin_users (email, role, active) VALUES
  ('admin@thepilgrim.com', 'admin', true),
  ('editor@thepilgrim.com', 'editor', true)
ON CONFLICT (email) DO NOTHING;