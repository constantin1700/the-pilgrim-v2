-- Migración de datos reales actualizados a Supabase
-- Datos de países con métricas reales 2024

-- Limpiar datos existentes
DELETE FROM user_likes;
DELETE FROM comments;
DELETE FROM blog_posts;
DELETE FROM countries;

-- Insertar países con datos reales actualizados
INSERT INTO countries (
  id, name, code, continent, capital, population, gdp_per_capita, main_language, currency,
  temperature, quality_of_life, average_salary, salary_expense_ratio, social_index,
  bureaucracy_ease, internet_speed_mbps, internet_connectivity_score, work_life_balance_index,
  healthcare_quality_index, english_proficiency_score, digital_nomad_visa, eu_citizenship_pathway,
  featured, active
) VALUES
-- Países top tier
('alemania', 'Alemania', 'DE', 'Europa', 'Berlín', 83200000, 48717.29, 'Alemán', 'EUR',
  9.6, 176.48, 3975, 1.42, 81.3, 72, 89.90, 94, 74.5, 84.2, 62.8, false, true, true, true),

('australia', 'Australia', 'AU', 'Oceanía', 'Canberra', 26000000, 65099.85, 'Inglés', 'AUD',
  21.8, 185.03, 4235, 1.38, 85.7, 81, 119.34, 96, 78.3, 88.1, 95.2, true, false, true, true),

('canada', 'Canadá', 'CA', 'América del Norte', 'Ottawa', 38000000, 52051.35, 'Inglés/Francés', 'CAD',
  5.8, 163.47, 3890, 1.28, 82.1, 79, 147.82, 95, 76.8, 89.4, 92.7, false, false, true, true),

('suiza', 'Suiza', 'CH', 'Europa', 'Berna', 8700000, 94696.07, 'Alemán/Francés/Italiano', 'CHF',
  8.2, 189.07, 6842, 1.89, 86.2, 76, 275.17, 97, 81.2, 92.7, 84.3, false, false, true, true),

('paises-bajos', 'Países Bajos', 'NL', 'Europa', 'Ámsterdam', 17400000, 56489.01, 'Holandés', 'EUR',
  10.8, 178.52, 3654, 1.33, 83.9, 88, 156.45, 96, 80.1, 86.3, 89.4, true, true, true, true),

('singapur', 'Singapur', 'SG', 'Asia', 'Singapur', 5900000, 82807.65, 'Inglés/Mandarín/Malayo', 'SGD',
  27.3, 154.89, 4967, 1.78, 78.4, 92, 298.45, 98, 68.2, 91.8, 98.1, true, false, true, true),

('reino-unido', 'Reino Unido', 'GB', 'Europa', 'Londres', 67000000, 45225.15, 'Inglés', 'GBP',
  9.8, 159.87, 3421, 1.18, 79.6, 68, 71.25, 94, 71.4, 82.7, 99.2, true, false, true, true),

('suecia', 'Suecia', 'SE', 'Europa', 'Estocolmo', 10400000, 51648.05, 'Sueco', 'SEK',
  5.4, 177.95, 3289, 1.24, 85.1, 83, 187.91, 97, 82.4, 87.9, 91.3, false, true, true, true),

('noruega', 'Noruega', 'NO', 'Europa', 'Oslo', 5400000, 89154.32, 'Noruego', 'NOK',
  1.8, 172.64, 4758, 1.68, 86.8, 71, 203.47, 96, 85.2, 89.7, 92.6, false, false, true, true),

('dinamarca', 'Dinamarca', 'DK', 'Europa', 'Copenhague', 5800000, 68037.98, 'Danés', 'DKK',
  8.7, 175.83, 3987, 1.45, 84.7, 85, 189.32, 97, 79.6, 85.4, 93.1, true, true, true, true),

-- Países tier 2
('nueva-zelanda', 'Nueva Zelanda', 'NZ', 'Oceanía', 'Wellington', 5100000, 48781.47, 'Inglés', 'NZD',
  12.2, 168.93, 3456, 1.22, 81.8, 74, 89.47, 93, 77.2, 83.6, 94.8, true, false, true, true),

('finlandia', 'Finlandia', 'FI', 'Europa', 'Helsinki', 5500000, 53982.48, 'Finés', 'EUR',
  1.2, 179.42, 3245, 1.31, 87.3, 78, 156.78, 96, 83.7, 88.2, 87.4, false, true, true, true),

('austria', 'Austria', 'AT', 'Europa', 'Viena', 9000000, 50123.85, 'Alemán', 'EUR',
  7.1, 172.84, 3178, 1.28, 82.4, 73, 78.92, 94, 75.8, 84.1, 72.9, false, true, true, true),

('irlanda', 'Irlanda', 'IE', 'Europa', 'Dublín', 5000000, 99013.22, 'Inglés', 'EUR',
  9.4, 167.52, 4123, 1.42, 79.7, 77, 89.65, 95, 73.2, 81.8, 98.7, false, true, true, true),

('belgica', 'Bélgica', 'BE', 'Europa', 'Bruselas', 11500000, 47244.25, 'Holandés/Francés', 'EUR',
  10.3, 164.29, 3245, 1.19, 78.9, 69, 94.38, 94, 72.6, 83.4, 78.2, false, true, false, true),

('francia', 'Francia', 'FR', 'Europa', 'París', 67500000, 40492.68, 'Francés', 'EUR',
  12.8, 158.74, 2987, 1.15, 77.8, 66, 123.47, 93, 74.1, 85.7, 69.3, true, true, false, true),

('italia', 'Italia', 'IT', 'Europa', 'Roma', 60000000, 31952.98, 'Italiano', 'EUR',
  14.2, 149.36, 2456, 1.08, 74.2, 58, 87.21, 91, 68.4, 79.8, 56.7, true, true, false, true),

('estados-unidos', 'Estados Unidos', 'US', 'América del Norte', 'Washington D.C.', 331000000, 70248.63, 'Inglés', 'USD',
  13.1, 172.85, 5487, 1.52, 80.3, 84, 203.85, 95, 69.7, 76.2, 99.8, true, false, false, true),

('japon', 'Japón', 'JP', 'Asia', 'Tokio', 125000000, 34017.12, 'Japonés', 'JPY',
  15.4, 166.82, 3124, 1.26, 85.4, 75, 89.34, 96, 71.8, 92.1, 78.9, false, false, false, true);

-- Insertar servicios actualizados con precios Stripe
INSERT INTO services (
  id, title, description, price, currency, duration_days, monthly_limit, category, 
  stripe_price_id, active, popular, features
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Plan Básico - Orientación Inicial',
  'Evaluación inicial de tu perfil profesional y recomendaciones personalizadas para empezar tu búsqueda laboral internacional.',
  49.00,
  'EUR',
  7,
  100,
  'consultation',
  'price_basic_consultation',
  true,
  false,
  '["Evaluación de CV", "Lista de países recomendados", "Guía de primeros pasos", "1 sesión de 30min por videollamada"]'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Plan Premium - Preparación Completa',
  'Servicio integral para prepararte completamente para trabajar en el extranjero, incluyendo optimización de CV y preparación para entrevistas.',
  149.00,
  'EUR',
  14,
  50,
  'premium_preparation',
  'price_premium_preparation',
  true,
  true,
  '["Optimización completa de CV", "Preparación para entrevistas", "2 sesiones de coaching", "Guía específica del país elegido", "Templates de cartas de presentación", "Acceso a ofertas de trabajo exclusivas"]'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Plan Personalizado - Acompañamiento VIP',
  'Servicio de acompañamiento personalizado durante todo el proceso de búsqueda y reubicación, con mentor dedicado.',
  299.00,
  'EUR',
  30,
  20,
  'vip_mentoring',
  'price_vip_mentoring',
  true,
  true,
  '["Mentor personal dedicado", "Plan de reubicación personalizado", "Asesoría legal y fiscal", "Networking con profesionales", "4 sesiones de coaching", "Soporte 24/7 durante 30 días", "Revisión de documentos oficiales"]'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Revisión Express de CV',
  'Optimización rápida de tu CV para el mercado internacional con feedback profesional.',
  29.00,
  'EUR',
  3,
  200,
  'cv_review',
  'price_cv_express',
  true,
  false,
  '["Revisión profesional de CV", "Feedback detallado", "Sugerencias de mejora", "Formato optimizado para ATS", "Entrega en 48h"]'
);

-- Insertar posts de blog actualizados
INSERT INTO blog_posts (
  id, title, slug, excerpt, content, country_id, reading_time, published, featured, category,
  author_name, tags, seo_title, seo_description
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Guía Completa 2024: Trabajar en Alemania como Español',
  'guia-completa-trabajar-alemania-2024',
  'Todo lo que necesitas saber para conseguir trabajo en Alemania en 2024: visas, salarios, proceso de solicitud y experiencias reales.',
  'Alemania se ha consolidado como uno de los destinos más atractivos para profesionales españoles en busca de nuevas oportunidades laborales...',
  'alemania',
  12,
  true,
  true,
  'Guías',
  'María González - Experta en Migración Laboral',
  ARRAY['alemania', 'trabajo', 'visa', 'europa', 'guia'],
  'Trabajar en Alemania 2024: Guía Completa para Españoles | The Pilgrim',
  'Descubre cómo conseguir trabajo en Alemania en 2024. Guía completa con requisitos de visa, salarios, proceso de solicitud y consejos prácticos.'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Australia vs Canadá: ¿Cuál Elegir para tu Carrera Tech?',
  'australia-vs-canada-carrera-tech-2024',
  'Comparativa detallada entre Australia y Canadá para profesionales del sector tecnológico: salarios, visas, calidad de vida y oportunidades.',
  'Si eres un profesional del sector tecnológico considerando emigrar, Australia y Canadá son dos de los destinos más atractivos...',
  'australia',
  8,
  true,
  true,
  'Comparativas',
  'Carlos Martín - Tech Lead',
  ARRAY['australia', 'canada', 'tecnologia', 'comparativa', 'programacion'],
  'Australia vs Canadá para Tech: Comparativa 2024 | The Pilgrim',
  'Compara Australia y Canadá para tu carrera tech: salarios, visas, coste de vida y oportunidades laborales en 2024.'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Mi Experiencia: De Madrid a Singapur en el Sector Fintech',
  'experiencia-madrid-singapur-fintech',
  'Relato personal de cómo conseguí trabajo en Singapur en el sector fintech, los desafíos superados y lo que he aprendido.',
  'Hace dos años tomé una de las decisiones más importantes de mi vida profesional: mudarme de Madrid a Singapur...',
  'singapur',
  6,
  true,
  false,
  'Experiencias',
  'Ana Rodríguez - Fintech Professional',
  ARRAY['singapur', 'fintech', 'experiencia', 'asia', 'startup'],
  'De Madrid a Singapur: Mi Experiencia en Fintech | The Pilgrim',
  'Experiencia real de trabajar en Singapur en el sector fintech. Proceso, desafíos y consejos para españoles.'
);

-- Insertar comentarios de ejemplo
INSERT INTO comments (
  id, post_id, author_name, author_email, content, approved
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Pedro Sánchez',
  'pedro@email.com',
  '¡Excelente guía! Me ha ayudado mucho a entender el proceso. ¿Tenéis información sobre el sector de la ingeniería en Alemania?',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'Laura Fernández',
  'laura@email.com',
  'Muy útil la comparativa. Me inclino más por Canadá por el tema del idioma, pero Australia también se ve muy atractiva.',
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'Miguel Torres',
  'miguel@email.com',
  '¡Gracias por compartir tu experiencia! ¿Cómo fue el proceso de adaptación cultural en Singapur?',
  true
);

-- Insertar algunos contactos de ejemplo
INSERT INTO contact_messages (
  id, name, email, subject, message, status
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Roberto Martínez',
  'roberto@email.com',
  'Consulta sobre servicios para Alemania',
  'Hola, estoy interesado en obtener más información sobre vuestros servicios para buscar trabajo en Alemania. Soy ingeniero industrial con 5 años de experiencia.',
  'unread'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Carmen López',
  'carmen@email.com',
  'Duda sobre visas para Australia',
  'Buenos días, tengo dudas sobre el proceso de visa para Australia. ¿Ofrecéis asesoramiento específico para este país?',
  'read'
);

-- Insertar algunos registros de analytics
INSERT INTO user_analytics (
  session_id, page_path, event_type, event_data, country_code
) VALUES
(
  uuid_generate_v4(),
  '/dashboard',
  'page_view',
  '{"referrer": "google.com", "user_agent": "Mozilla/5.0"}',
  'ES'
),
(
  uuid_generate_v4(),
  '/explorador/alemania',
  'country_view',
  '{"country_id": "alemania", "time_spent": 120}',
  'ES'
),
(
  uuid_generate_v4(),
  '/blog/guia-completa-trabajar-alemania-2024',
  'blog_view',
  '{"post_id": "11111111-1111-1111-1111-111111111111", "reading_progress": 75}',
  'ES'
);