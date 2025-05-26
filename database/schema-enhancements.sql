-- Enhanced Database Schema for The Pilgrim
-- Additional fields to support real-time, data-rich features

-- Add new columns to countries table
ALTER TABLE countries ADD COLUMN IF NOT EXISTS internet_speed_mbps DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS internet_connectivity_score INTEGER CHECK (internet_connectivity_score >= 0 AND internet_connectivity_score <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS average_salary DECIMAL(15,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS salary_expense_ratio DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS temperature DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS quality_of_life INTEGER CHECK (quality_of_life >= 0 AND quality_of_life <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS social_index DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS bureaucracy_ease INTEGER CHECK (bureaucracy_ease >= 0 AND bureaucracy_ease <= 100);

-- Professional data fields for comprehensive country information
ALTER TABLE countries ADD COLUMN IF NOT EXISTS unemployment_rate DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS crime_rate_index DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS healthcare_quality_index INTEGER CHECK (healthcare_quality_index >= 0 AND healthcare_quality_index <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS education_index INTEGER CHECK (education_index >= 0 AND education_index <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS english_proficiency_score INTEGER CHECK (english_proficiency_score >= 0 AND english_proficiency_score <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS tax_rate_personal_average DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS rent_index DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS groceries_index DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS restaurant_index DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS transport_index DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS utilities_monthly_basic DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS internet_monthly_cost DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS gym_membership_monthly DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS childcare_monthly DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS co2_emissions_per_capita DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS renewable_energy_percentage DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS air_quality_index INTEGER;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS startup_ecosystem_score DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS digital_nomad_visa BOOLEAN DEFAULT false;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS minimum_wage DECIMAL(10,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS work_life_balance_index INTEGER CHECK (work_life_balance_index >= 0 AND work_life_balance_index <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS gender_equality_index DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS happiness_index DECIMAL(5,2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS corruption_perception_index INTEGER CHECK (corruption_perception_index >= 0 AND corruption_perception_index <= 100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS passport_strength_rank INTEGER;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS time_zone VARCHAR(50);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS driving_side VARCHAR(10) CHECK (driving_side IN ('left', 'right'));
ALTER TABLE countries ADD COLUMN IF NOT EXISTS plug_type VARCHAR(50);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS emergency_numbers JSONB;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS public_holidays_count INTEGER;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS paid_vacation_days_minimum INTEGER;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS maternity_leave_weeks INTEGER;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS paternity_leave_weeks INTEGER;

-- Create table for real-time exchange rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  base_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(15,6) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(base_currency, target_currency)
);

-- Create table for job market data
CREATE TABLE IF NOT EXISTS job_market_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  sector VARCHAR(255) NOT NULL,
  average_salary DECIMAL(15,2),
  demand_level VARCHAR(20) CHECK (demand_level IN ('very_low', 'low', 'medium', 'high', 'very_high')),
  growth_rate DECIMAL(5,2),
  job_openings_count INTEGER,
  skills_required TEXT[],
  experience_years_required INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for visa requirements
CREATE TABLE IF NOT EXISTS visa_requirements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  nationality VARCHAR(3) NOT NULL, -- Country code of passport holder
  visa_type VARCHAR(100) NOT NULL,
  visa_required BOOLEAN DEFAULT true,
  visa_on_arrival BOOLEAN DEFAULT false,
  e_visa_available BOOLEAN DEFAULT false,
  max_stay_days INTEGER,
  processing_time_days INTEGER,
  cost_usd DECIMAL(10,2),
  requirements JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_id, nationality, visa_type)
);

-- Create table for city-specific data
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  name VARCHAR(255) NOT NULL,
  population INTEGER,
  is_capital BOOLEAN DEFAULT false,
  average_rent_1br_center DECIMAL(10,2),
  average_rent_1br_outside DECIMAL(10,2),
  average_salary_net DECIMAL(10,2),
  cost_of_living_index DECIMAL(10,2),
  safety_index INTEGER CHECK (safety_index >= 0 AND safety_index <= 100),
  traffic_index INTEGER CHECK (traffic_index >= 0 AND traffic_index <= 100),
  pollution_index INTEGER CHECK (pollution_index >= 0 AND pollution_index <= 100),
  healthcare_index INTEGER CHECK (healthcare_index >= 0 AND healthcare_index <= 100),
  climate_type VARCHAR(100),
  public_transport_monthly DECIMAL(10,2),
  expat_population_percentage DECIMAL(5,2),
  coworking_spaces_count INTEGER,
  international_schools_count INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for seasonal work opportunities
CREATE TABLE IF NOT EXISTS seasonal_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  job_title VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  season VARCHAR(20) CHECK (season IN ('spring', 'summer', 'autumn', 'winter', 'year_round')),
  start_month INTEGER CHECK (start_month >= 1 AND start_month <= 12),
  end_month INTEGER CHECK (end_month >= 1 AND end_month <= 12),
  average_salary DECIMAL(10,2),
  accommodation_provided BOOLEAN DEFAULT false,
  meals_provided BOOLEAN DEFAULT false,
  language_required VARCHAR(100),
  experience_required BOOLEAN DEFAULT false,
  visa_sponsorship BOOLEAN DEFAULT false,
  application_deadline DATE,
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for community groups and resources
CREATE TABLE IF NOT EXISTS community_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  city_id UUID REFERENCES cities(id),
  resource_type VARCHAR(100) CHECK (resource_type IN ('facebook_group', 'telegram_group', 'whatsapp_group', 'association', 'meetup', 'forum', 'other')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT,
  member_count INTEGER,
  language VARCHAR(100),
  is_official BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for real-time alerts and opportunities
CREATE TABLE IF NOT EXISTS opportunity_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  city_id UUID REFERENCES cities(id),
  alert_type VARCHAR(100) CHECK (alert_type IN ('job_opening', 'visa_change', 'cost_update', 'new_program', 'event', 'other')),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  deadline DATE,
  salary_range_min DECIMAL(10,2),
  salary_range_max DECIMAL(10,2),
  requirements TEXT[],
  tags TEXT[],
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tax treaties
CREATE TABLE IF NOT EXISTS tax_treaties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_a VARCHAR(3) NOT NULL,
  country_b VARCHAR(3) NOT NULL,
  treaty_type VARCHAR(100),
  double_taxation_avoided BOOLEAN DEFAULT true,
  withholding_tax_dividends DECIMAL(5,2),
  withholding_tax_interest DECIMAL(5,2),
  withholding_tax_royalties DECIMAL(5,2),
  effective_date DATE,
  document_url TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_a, country_b)
);

-- Create table for healthcare agreements
CREATE TABLE IF NOT EXISTS healthcare_agreements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  agreement_with_country VARCHAR(3) NOT NULL,
  coverage_type VARCHAR(100),
  emergency_care_covered BOOLEAN DEFAULT true,
  routine_care_covered BOOLEAN DEFAULT false,
  prescription_covered BOOLEAN DEFAULT false,
  dental_covered BOOLEAN DEFAULT false,
  requirements TEXT,
  document_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_market_country_sector ON job_market_data(country_id, sector);
CREATE INDEX IF NOT EXISTS idx_visa_requirements_country_nationality ON visa_requirements(country_id, nationality);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_jobs_country_season ON seasonal_jobs(country_id, season);
CREATE INDEX IF NOT EXISTS idx_community_resources_country_city ON community_resources(country_id, city_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_alerts_active ON opportunity_alerts(active, expires_at);
CREATE INDEX IF NOT EXISTS idx_tax_treaties_countries ON tax_treaties(country_a, country_b);
CREATE INDEX IF NOT EXISTS idx_healthcare_agreements_country ON healthcare_agreements(country_id);

-- Create views for common queries
CREATE OR REPLACE VIEW country_comprehensive_data AS
SELECT 
  c.*,
  COUNT(DISTINCT jm.id) as job_sectors_count,
  COUNT(DISTINCT ci.id) as cities_count,
  COUNT(DISTINCT cr.id) as community_resources_count,
  COUNT(DISTINCT sj.id) as seasonal_jobs_count,
  AVG(ci.average_rent_1br_center) as avg_rent_capital
FROM countries c
LEFT JOIN job_market_data jm ON c.id = jm.country_id
LEFT JOIN cities ci ON c.id = ci.country_id AND ci.is_capital = true
LEFT JOIN community_resources cr ON c.id = cr.country_id
LEFT JOIN seasonal_jobs sj ON c.id = sj.country_id AND sj.active = true
GROUP BY c.id;

-- Function to calculate overall opportunity score
CREATE OR REPLACE FUNCTION calculate_opportunity_score(country_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  score DECIMAL := 0;
  country_data RECORD;
BEGIN
  SELECT * INTO country_data FROM countries WHERE id = country_id;
  
  -- Base score from quality of life (0-25 points)
  score := score + (COALESCE(country_data.quality_of_life, 0) * 0.25);
  
  -- Salary to expense ratio (0-25 points)
  score := score + (GREATEST(0, LEAST(25, (COALESCE(country_data.salary_expense_ratio, 1) - 0.5) * 50)));
  
  -- Internet connectivity (0-15 points)
  score := score + (COALESCE(country_data.internet_connectivity_score, 0) * 0.15);
  
  -- Social index (0-15 points)
  score := score + (COALESCE(country_data.social_index, 0) * 0.15);
  
  -- Bureaucracy ease (0-10 points)
  score := score + (COALESCE(country_data.bureaucracy_ease, 0) * 0.10);
  
  -- Healthcare quality (0-10 points)
  score := score + (COALESCE(country_data.healthcare_quality_index, 0) * 0.10);
  
  RETURN ROUND(score, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update opportunity score when country data changes
CREATE OR REPLACE FUNCTION update_opportunity_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.opportunity_score := calculate_opportunity_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_opportunity_score
BEFORE INSERT OR UPDATE ON countries
FOR EACH ROW
EXECUTE FUNCTION update_opportunity_score();

-- Sample data for enhanced features
-- Exchange rates (EUR base)
INSERT INTO exchange_rates (base_currency, target_currency, rate) VALUES
  ('EUR', 'USD', 1.0850),
  ('EUR', 'GBP', 0.8650),
  ('EUR', 'CHF', 0.9750),
  ('EUR', 'SEK', 11.4500),
  ('EUR', 'NOK', 11.6500),
  ('EUR', 'DKK', 7.4600),
  ('EUR', 'CAD', 1.4750),
  ('EUR', 'AUD', 1.6550),
  ('EUR', 'NZD', 1.7850),
  ('EUR', 'JPY', 162.50),
  ('EUR', 'SGD', 1.4650),
  ('EUR', 'AED', 3.9850),
  ('EUR', 'MXN', 18.7500)
ON CONFLICT (base_currency, target_currency) DO UPDATE SET rate = EXCLUDED.rate, updated_at = NOW();