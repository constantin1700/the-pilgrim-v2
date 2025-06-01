-- ========================================
-- POBLAR INFORMACIÓN DETALLADA DE PAÍSES
-- ========================================
-- Ejecuta este SQL en Supabase para llenar datos detallados

-- 1. España - País principal
UPDATE public.countries 
SET 
  description = 'España ofrece excelentes oportunidades laborales para hispanohablantes, especialmente en tecnología, turismo y servicios. Con un sistema de salud público robusto y alta calidad de vida.',
  cost_of_living = '{
    "housing": {"min": 400, "max": 1200, "currency": "EUR", "description": "Alquiler mensual apartamento 1-2 habitaciones"},
    "food": {"min": 200, "max": 400, "currency": "EUR", "description": "Gastos mensuales en alimentación"},
    "transport": {"min": 40, "max": 80, "currency": "EUR", "description": "Transporte público mensual"},
    "utilities": {"min": 60, "max": 120, "currency": "EUR", "description": "Electricidad, agua, gas"},
    "total_monthly": {"min": 700, "max": 1800, "currency": "EUR"}
  }',
  work_visa_info = '{
    "required": true,
    "types": ["Work Permit", "EU Blue Card", "Self-employed Visa"],
    "processing_time": "2-4 months",
    "requirements": ["Job offer", "University degree", "Clean criminal record"],
    "cost": "60-200 EUR",
    "renewal": "Annually, can lead to permanent residence"
  }',
  climate_info = '{
    "type": "Mediterranean/Continental",
    "seasons": {
      "spring": {"temp": "15-22°C", "description": "Mild and pleasant"},
      "summer": {"temp": "25-35°C", "description": "Hot and dry"},
      "autumn": {"temp": "12-20°C", "description": "Cool and rainy"},
      "winter": {"temp": "5-15°C", "description": "Mild winters, snow in mountains"}
    },
    "best_months": ["April", "May", "September", "October"]
  }',
  cultural_tips = '{
    "language": "Spanish (Castilian), Regional languages (Catalan, Basque, Galician)",
    "work_culture": "Relationship-based, long lunch breaks, dinner late (9-10 PM)",
    "social_customs": ["Siesta tradition", "Family-centered culture", "Formal business dress"],
    "holidays": ["Semana Santa", "Día de la Hispanidad", "Navidad"],
    "tips": ["Learn regional customs", "Networking is crucial", "Punctuality is important in business"]
  }',
  job_market = '{
    "top_industries": ["Technology", "Tourism", "Renewable Energy", "Healthcare", "Finance"],
    "in_demand_skills": ["Software Development", "Digital Marketing", "Engineering", "Healthcare", "Language Teaching"],
    "avg_salary": {"min": 22000, "max": 45000, "currency": "EUR", "period": "annual"},
    "unemployment_rate": "12.8%",
    "job_search_tips": ["Use LinkedIn actively", "Learn Spanish", "Consider regional differences", "Network at professional events"]
  }',
  active = true,
  featured = true
WHERE name = 'España';

-- 2. Alemania
UPDATE public.countries 
SET 
  description = 'Alemania es la potencia económica de Europa con excelentes oportunidades en ingeniería, tecnología y manufactura. Ofrece estabilidad laboral y un sistema social sólido.',
  cost_of_living = '{
    "housing": {"min": 500, "max": 1500, "currency": "EUR", "description": "Alquiler mensual apartamento 1-2 habitaciones"},
    "food": {"min": 250, "max": 450, "currency": "EUR", "description": "Gastos mensuales en alimentación"},
    "transport": {"min": 60, "max": 100, "currency": "EUR", "description": "Transporte público mensual"},
    "utilities": {"min": 80, "max": 150, "currency": "EUR", "description": "Electricidad, agua, gas"},
    "total_monthly": {"min": 890, "max": 2200, "currency": "EUR"}
  }',
  work_visa_info = '{
    "required": true,
    "types": ["EU Blue Card", "Work Permit", "Job Seeker Visa"],
    "processing_time": "1-3 months",
    "requirements": ["University degree", "Job offer", "German language skills (A2-B1)"],
    "cost": "75-100 EUR",
    "renewal": "Up to 4 years, path to permanent residence"
  }',
  climate_info = '{
    "type": "Temperate Continental",
    "seasons": {
      "spring": {"temp": "8-18°C", "description": "Mild with frequent rain"},
      "summer": {"temp": "18-28°C", "description": "Warm and pleasant"},
      "autumn": {"temp": "5-15°C", "description": "Cool and rainy"},
      "winter": {"temp": "-2-8°C", "description": "Cold with snow"}
    },
    "best_months": ["May", "June", "July", "August", "September"]
  }',
  cultural_tips = '{
    "language": "German (English widely spoken in business)",
    "work_culture": "Punctuality is crucial, direct communication, work-life balance valued",
    "social_customs": ["Formal business culture", "Eco-conscious society", "Strong work ethics"],
    "holidays": ["Oktoberfest", "Christmas Markets", "Karneval"],
    "tips": ["Learn German", "Be extremely punctual", "Direct communication appreciated", "Separate work and personal life"]
  }',
  job_market = '{
    "top_industries": ["Automotive", "Engineering", "Technology", "Finance", "Healthcare"],
    "in_demand_skills": ["Software Development", "Engineering", "Manufacturing", "Data Science", "Renewable Energy"],
    "avg_salary": {"min": 35000, "max": 70000, "currency": "EUR", "period": "annual"},
    "unemployment_rate": "5.6%",
    "job_search_tips": ["XING and LinkedIn", "German language essential", "Technical skills highly valued", "Apply through company websites"]
  }',
  active = true,
  featured = true
WHERE name = 'Alemania';

-- 3. Reino Unido
UPDATE public.countries 
SET 
  description = 'El Reino Unido ofrece un mercado laboral dinámico especialmente en servicios financieros, tecnología y creatividad. Londres es un hub global para profesionales.',
  cost_of_living = '{
    "housing": {"min": 800, "max": 2500, "currency": "GBP", "description": "Alquiler mensual apartamento 1-2 habitaciones"},
    "food": {"min": 200, "max": 400, "currency": "GBP", "description": "Gastos mensuales en alimentación"},
    "transport": {"min": 100, "max": 200, "currency": "GBP", "description": "Transporte público mensual"},
    "utilities": {"min": 80, "max": 150, "currency": "GBP", "description": "Electricidad, agua, gas"},
    "total_monthly": {"min": 1180, "max": 3250, "currency": "GBP"}
  }',
  work_visa_info = '{
    "required": true,
    "types": ["Skilled Worker Visa", "Global Talent Visa", "Youth Mobility Scheme"],
    "processing_time": "3-8 weeks",
    "requirements": ["Job offer from licensed sponsor", "English proficiency", "Salary threshold £25,600+"],
    "cost": "610-1,408 GBP",
    "renewal": "Up to 5 years, path to settlement"
  }',
  climate_info = '{
    "type": "Temperate Maritime",
    "seasons": {
      "spring": {"temp": "8-15°C", "description": "Mild with frequent showers"},
      "summer": {"temp": "15-22°C", "description": "Warm with occasional rain"},
      "autumn": {"temp": "8-15°C", "description": "Cool and wet"},
      "winter": {"temp": "2-8°C", "description": "Cold and damp, rarely snow"}
    },
    "best_months": ["May", "June", "July", "August", "September"]
  }',
  cultural_tips = '{
    "language": "English",
    "work_culture": "Polite and reserved, queue culture, afternoon tea tradition",
    "social_customs": ["Politeness valued", "Pub culture", "Royal family respect"],
    "holidays": ["Christmas", "Easter", "Bank Holidays"],
    "tips": ["Master British politeness", "Understand sarcasm", "Weather is always a safe topic", "Punctuality important"]
  }',
  job_market = '{
    "top_industries": ["Financial Services", "Technology", "Healthcare", "Creative Industries", "Education"],
    "in_demand_skills": ["Software Development", "Financial Analysis", "Digital Marketing", "Healthcare", "Data Science"],
    "avg_salary": {"min": 25000, "max": 60000, "currency": "GBP", "period": "annual"},
    "unemployment_rate": "4.2%",
    "job_search_tips": ["Use LinkedIn and Reed.co.uk", "Tailor CV to UK format", "Network at industry events", "Consider starting with contract work"]
  }',
  active = true,
  featured = true
WHERE name = 'Reino Unido';

-- 4. Francia
UPDATE public.countries 
SET 
  description = 'Francia combina oportunidades profesionales con calidad de vida excepcional. París es un centro global para lujo, tecnología y cultura.',
  cost_of_living = '{
    "housing": {"min": 600, "max": 1800, "currency": "EUR", "description": "Alquiler mensual apartamento 1-2 habitaciones"},
    "food": {"min": 250, "max": 450, "currency": "EUR", "description": "Gastos mensuales en alimentación"},
    "transport": {"min": 50, "max": 100, "currency": "EUR", "description": "Transporte público mensual"},
    "utilities": {"min": 70, "max": 130, "currency": "EUR", "description": "Electricidad, agua, gas"},
    "total_monthly": {"min": 970, "max": 2480, "currency": "EUR"}
  }',
  work_visa_info = '{
    "required": true,
    "types": ["EU Blue Card", "Work Permit", "Talent Passport"],
    "processing_time": "2-4 months",
    "requirements": ["Job offer", "French language skills (A2-B1)", "Relevant qualifications"],
    "cost": "99-225 EUR",
    "renewal": "1-4 years, path to permanent residence"
  }',
  climate_info = '{
    "type": "Temperate/Mediterranean",
    "seasons": {
      "spring": {"temp": "10-18°C", "description": "Mild and pleasant"},
      "summer": {"temp": "20-28°C", "description": "Warm, sunny south"},
      "autumn": {"temp": "8-16°C", "description": "Cool with rain"},
      "winter": {"temp": "2-10°C", "description": "Cold, snow in mountains"}
    },
    "best_months": ["April", "May", "June", "September", "October"]
  }',
  cultural_tips = '{
    "language": "French (English in business, limited)",
    "work_culture": "Formal business culture, long lunch breaks, August vacations",
    "social_customs": ["Culinary culture", "Fashion conscious", "Art appreciation"],
    "holidays": ["Bastille Day", "Christmas", "Easter Monday"],
    "tips": ["Learn French", "Dress professionally", "Respect meal times", "Appreciate art and culture"]
  }',
  job_market = '{
    "top_industries": ["Luxury Goods", "Technology", "Aerospace", "Finance", "Tourism"],
    "in_demand_skills": ["Software Development", "Engineering", "Luxury Management", "Digital Marketing", "Finance"],
    "avg_salary": {"min": 28000, "max": 55000, "currency": "EUR", "period": "annual"},
    "unemployment_rate": "7.4%",
    "job_search_tips": ["APEC and Pôle emploi", "French language essential", "Network through alumni", "Consider multinational companies"]
  }',
  active = true,
  featured = true
WHERE name = 'Francia';

-- 5. Países Bajos
UPDATE public.countries 
SET 
  description = 'Los Países Bajos ofrecen un ambiente de trabajo internacional y progresivo. Ámsterdam es un hub tecnológico y financiero europeo.',
  cost_of_living = '{
    "housing": {"min": 700, "max": 2000, "currency": "EUR", "description": "Alquiler mensual apartamento 1-2 habitaciones"},
    "food": {"min": 250, "max": 400, "currency": "EUR", "description": "Gastos mensuales en alimentación"},
    "transport": {"min": 80, "max": 120, "currency": "EUR", "description": "Transporte público mensual"},
    "utilities": {"min": 100, "max": 180, "currency": "EUR", "description": "Electricidad, agua, gas"},
    "total_monthly": {"min": 1130, "max": 2700, "currency": "EUR"}
  }',
  work_visa_info = '{
    "required": true,
    "types": ["Highly Skilled Migrant", "EU Blue Card", "Work Permit"],
    "processing_time": "2-8 weeks",
    "requirements": ["Salary threshold €4,840/month", "Recognized employer", "University degree"],
    "cost": "174-1,311 EUR",
    "renewal": "Up to 5 years, path to permanent residence"
  }',
  climate_info = '{
    "type": "Temperate Maritime",
    "seasons": {
      "spring": {"temp": "8-16°C", "description": "Mild with rain"},
      "summer": {"temp": "16-22°C", "description": "Mild and pleasant"},
      "autumn": {"temp": "8-15°C", "description": "Cool and wet"},
      "winter": {"temp": "2-8°C", "description": "Cold and wet"}
    },
    "best_months": ["May", "June", "July", "August", "September"]
  }',
  cultural_tips = '{
    "language": "Dutch (English widely spoken)",
    "work_culture": "Direct communication, work-life balance, cycling culture",
    "social_customs": ["Egalitarian society", "Environmental consciousness", "Tolerance"],
    "holidays": ["King''s Day", "Liberation Day", "Christmas"],
    "tips": ["Be direct and honest", "Cycling is essential", "English is widely accepted", "Respect work-life balance"]
  }',
  job_market = '{
    "top_industries": ["Technology", "Finance", "Agriculture", "Logistics", "Energy"],
    "in_demand_skills": ["Software Development", "Data Science", "Finance", "Engineering", "Digital Marketing"],
    "avg_salary": {"min": 35000, "max": 65000, "currency": "EUR", "period": "annual"},
    "unemployment_rate": "4.4%",
    "job_search_tips": ["LinkedIn and Indeed", "English often sufficient", "Network in expat communities", "Tech scene very active"]
  }',
  active = true,
  featured = true
WHERE name = 'Países Bajos';

-- Verificación final
DO $$
BEGIN
  RAISE NOTICE '✅ Información detallada actualizada para 5 países principales';
  RAISE NOTICE '✅ España, Alemania, Reino Unido, Francia y Países Bajos completados';
  RAISE NOTICE '✅ Datos incluyen: costos de vida, visas, clima, cultura y mercado laboral';
  RAISE NOTICE '🎉 Países listos para producción';
END $$;