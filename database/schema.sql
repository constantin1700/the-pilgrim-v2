-- The Pilgrim Database Schema
-- Complete SQL schema for production deployment

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  continent VARCHAR(100) NOT NULL,
  flag_url TEXT,
  capital VARCHAR(255),
  population BIGINT,
  gdp_per_capita DECIMAL(15,2),
  main_language VARCHAR(100),
  currency VARCHAR(10),
  work_visa_info JSONB,
  cost_of_living JSONB,
  climate_info JSONB,
  cultural_tips JSONB,
  job_market JSONB,
  likes_dashboard INTEGER DEFAULT 0,
  likes_explorer INTEGER DEFAULT 0,
  likes_total INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
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
  country_id UUID REFERENCES countries(id),
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
  country_id UUID REFERENCES countries(id),
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
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
  active BOOLEAN DEFAULT true,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_data JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled', 'refunded')),
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  notes TEXT,
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

-- User analytics table
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
  event_type VARCHAR(100),
  event_data JSONB,
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
  associated_type VARCHAR(100), -- 'blog', 'service', 'country', etc.
  associated_id UUID,
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_featured ON countries(featured);
CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(active);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_country_id ON blog_posts(country_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_country_id ON comments(country_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(popular);

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

CREATE INDEX IF NOT EXISTS idx_file_uploads_associated ON file_uploads(associated_type, associated_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(active);

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"The Pilgrim"', 'Site name'),
  ('site_description', '"Plataforma profesional para españoles que buscan trabajar en el extranjero"', 'Site description'),
  ('contact_email', '"hola@thepilgrim.com"', 'Main contact email'),
  ('analytics_enabled', 'true', 'Enable analytics tracking'),
  ('maintenance_mode', 'false', 'Maintenance mode toggle'),
  ('max_upload_size', '10485760', 'Max upload size in bytes (10MB)'),
  ('allowed_file_types', '["image/jpeg", "image/png", "image/webp", "application/pdf"]', 'Allowed file types for uploads')
ON CONFLICT (key) DO NOTHING;

-- Insert sample countries data
INSERT INTO countries (id, name, code, continent, capital, population, gdp_per_capita, main_language, currency, featured, active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Alemania', 'DE', 'Europa', 'Berlín', 83200000, 46208.43, 'Alemán', 'EUR', true, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Canadá', 'CA', 'América del Norte', 'Ottawa', 38000000, 43241.62, 'Inglés/Francés', 'CAD', true, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Australia', 'AU', 'Oceanía', 'Canberra', 25700000, 51812.15, 'Inglés', 'AUD', true, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Países Bajos', 'NL', 'Europa', 'Ámsterdam', 17400000, 52326.80, 'Holandés', 'EUR', true, true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Suiza', 'CH', 'Europa', 'Berna', 8700000, 81867.46, 'Alemán/Francés/Italiano', 'CHF', true, true),
  ('550e8400-e29b-41d4-a716-446655440006', 'Reino Unido', 'GB', 'Europa', 'Londres', 67000000, 40284.64, 'Inglés', 'GBP', true, true),
  ('550e8400-e29b-41d4-a716-446655440007', 'Suecia', 'SE', 'Europa', 'Estocolmo', 10400000, 51648.05, 'Sueco', 'SEK', true, true),
  ('550e8400-e29b-41d4-a716-446655440008', 'Noruega', 'NO', 'Europa', 'Oslo', 5400000, 75419.63, 'Noruego', 'NOK', true, true),
  ('550e8400-e29b-41d4-a716-446655440009', 'Dinamarca', 'DK', 'Europa', 'Copenhague', 5800000, 60170.35, 'Danés', 'DKK', true, true),
  ('550e8400-e29b-41d4-a716-446655440010', 'Francia', 'FR', 'Europa', 'París', 67500000, 40492.68, 'Francés', 'EUR', false, true),
  ('550e8400-e29b-41d4-a716-446655440011', 'Italia', 'IT', 'Europa', 'Roma', 60000000, 31952.98, 'Italiano', 'EUR', false, true),
  ('550e8400-e29b-41d4-a716-446655440012', 'Austria', 'AT', 'Europa', 'Viena', 9000000, 48104.37, 'Alemán', 'EUR', false, true),
  ('550e8400-e29b-41d4-a716-446655440013', 'Bélgica', 'BE', 'Europa', 'Bruselas', 11500000, 46553.31, 'Holandés/Francés', 'EUR', false, true),
  ('550e8400-e29b-41d4-a716-446655440014', 'Irlanda', 'IE', 'Europa', 'Dublín', 5000000, 79924.73, 'Inglés', 'EUR', false, true),
  ('550e8400-e29b-41d4-a716-446655440015', 'Finlandia', 'FI', 'Europa', 'Helsinki', 5500000, 48810.16, 'Finés', 'EUR', false, true),
  ('550e8400-e29b-41d4-a716-446655440016', 'Nueva Zelanda', 'NZ', 'Oceanía', 'Wellington', 5100000, 42018.61, 'Inglés', 'NZD', false, true),
  ('550e8400-e29b-41d4-a716-446655440017', 'Estados Unidos', 'US', 'América del Norte', 'Washington D.C.', 331000000, 63543.58, 'Inglés', 'USD', false, true),
  ('550e8400-e29b-41d4-a716-446655440018', 'Singapur', 'SG', 'Asia', 'Singapur', 5900000, 59797.75, 'Inglés/Mandarín/Malayo', 'SGD', false, true),
  ('550e8400-e29b-41d4-a716-446655440019', 'Japón', 'JP', 'Asia', 'Tokio', 125000000, 39285.18, 'Japonés', 'JPY', false, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample services
INSERT INTO services (id, title, description, price, currency, duration_days, monthly_limit, category, active, popular) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Revisión de CV Profesional', 'Optimización completa de tu CV para el mercado laboral internacional con feedback personalizado.', 99.00, 'EUR', 7, 50, 'cv_optimization', true, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Asesoría de Visa de Trabajo', 'Consultoría especializada para obtener tu visa de trabajo en el país de destino.', 199.00, 'EUR', 14, 20, 'visa_consulting', true, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Preparación para Entrevistas', 'Sesiones de coaching para prepararte para entrevistas en empresas internacionales.', 149.00, 'EUR', 10, 30, 'interview_prep', true, false),
  ('660e8400-e29b-41d4-a716-446655440004', 'Plan de Reubicación Completo', 'Planificación integral de tu mudanza incluyendo aspectos legales, financieros y culturales.', 599.00, 'EUR', 30, 10, 'relocation_planning', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (id, title, slug, excerpt, content, country_id, reading_time, published, featured, category) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Guía Completa para Trabajar en Alemania como Español', 'guia-completa-trabajar-alemania-espanol', 'Todo lo que necesitas saber para conseguir trabajo en Alemania siendo español: visas, idioma, cultura laboral y más.', 'Alemania se ha convertido en uno de los destinos más atractivos para profesionales españoles...', '550e8400-e29b-41d4-a716-446655440001', 8, true, true, 'Guías'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Mi Experiencia Trabajando en el Sector Tech en Singapur', 'experiencia-trabajando-tech-singapur', 'Relato personal de cómo conseguí trabajo como desarrollador en Singapur y los desafíos que enfrenté.', 'Hace dos años tomé la decisión de buscar oportunidades laborales fuera de España...', '550e8400-e29b-41d4-a716-446655440018', 6, true, false, 'Experiencias'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Oportunidades en el Sector Sanitario en Noruega', 'oportunidades-sector-sanitario-noruega', 'Análisis de las oportunidades laborales para profesionales de la salud españoles en Noruega.', 'El sistema sanitario noruego ofrece excelentes oportunidades para profesionales españoles...', '550e8400-e29b-41d4-a716-446655440008', 5, true, false, 'Sectores')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on all tables
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

-- Create policies for public read access
CREATE POLICY "Allow public read on countries" ON countries FOR SELECT USING (active = true);
CREATE POLICY "Allow public read on published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow public read on approved comments" ON comments FOR SELECT USING (approved = true);
CREATE POLICY "Allow public read on active services" ON services FOR SELECT USING (active = true);

-- Create policies for public write access (with restrictions)
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on analytics" ON user_analytics FOR INSERT WITH CHECK (true);

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

-- Insert default admin user (change email and add via Supabase auth)
INSERT INTO admin_users (email, role, active) VALUES
  ('admin@thepilgrim.com', 'admin', true)
ON CONFLICT (email) DO NOTHING;