// Mock data for local development
export const mockCountries = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Alemania',
    code: 'DE',
    continent: 'Europa',
    capital: 'Berlín',
    population: 83200000,
    gdp_per_capita: 46208.43,
    main_language: 'Alemán',
    currency: 'EUR',
    featured: true,
    active: true,
    likes_dashboard: 245,
    likes_explorer: 189,
    likes_total: 434,
    flag_url: 'https://flagcdn.com/w320/de.png',
    work_visa_info: {
      types: ['Blue Card EU', 'Visa de trabajo', 'Visa de búsqueda de empleo'],
      requirements: ['Título universitario', 'Oferta de trabajo', 'Seguro médico'],
      processing_time: '4-8 semanas'
    },
    cost_of_living: {
      monthly_average: 1500,
      rent_city_center: 1200,
      groceries: 300,
      transport: 86
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Canadá',
    code: 'CA',
    continent: 'América del Norte',
    capital: 'Ottawa',
    population: 38000000,
    gdp_per_capita: 43241.62,
    main_language: 'Inglés/Francés',
    currency: 'CAD',
    featured: true,
    active: true,
    likes_dashboard: 312,
    likes_explorer: 278,
    likes_total: 590,
    flag_url: 'https://flagcdn.com/w320/ca.png',
    work_visa_info: {
      types: ['Express Entry', 'Provincial Nominee', 'Work Permit'],
      requirements: ['Experiencia laboral', 'Dominio del idioma', 'Fondos suficientes'],
      processing_time: '6-12 meses'
    },
    cost_of_living: {
      monthly_average: 1800,
      rent_city_center: 1400,
      groceries: 350,
      transport: 100
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Australia',
    code: 'AU',
    continent: 'Oceanía',
    capital: 'Canberra',
    population: 25700000,
    gdp_per_capita: 51812.15,
    main_language: 'Inglés',
    currency: 'AUD',
    featured: true,
    active: true,
    likes_dashboard: 289,
    likes_explorer: 234,
    likes_total: 523,
    flag_url: 'https://flagcdn.com/w320/au.png'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Países Bajos',
    code: 'NL',
    continent: 'Europa',
    capital: 'Ámsterdam',
    population: 17400000,
    gdp_per_capita: 52326.80,
    main_language: 'Holandés',
    currency: 'EUR',
    featured: true,
    active: true,
    likes_dashboard: 198,
    likes_explorer: 167,
    likes_total: 365,
    flag_url: 'https://flagcdn.com/w320/nl.png'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Suiza',
    code: 'CH',
    continent: 'Europa',
    capital: 'Berna',
    population: 8700000,
    gdp_per_capita: 81867.46,
    main_language: 'Alemán/Francés/Italiano',
    currency: 'CHF',
    featured: true,
    active: true,
    likes_dashboard: 276,
    likes_explorer: 215,
    likes_total: 491,
    flag_url: 'https://flagcdn.com/w320/ch.png'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Reino Unido',
    code: 'GB',
    continent: 'Europa',
    capital: 'Londres',
    population: 67000000,
    gdp_per_capita: 40284.64,
    main_language: 'Inglés',
    currency: 'GBP',
    featured: true,
    active: true,
    likes_dashboard: 267,
    likes_explorer: 223,
    likes_total: 490,
    flag_url: 'https://flagcdn.com/w320/gb.png'
  }
];

export const mockBlogPosts = [
  {
    id: '770e8400-e29b-41d4-a716-446655440001',
    title: 'Guía Completa para Trabajar en Alemania como Español',
    slug: 'guia-completa-trabajar-alemania-espanol',
    excerpt: 'Todo lo que necesitas saber para conseguir trabajo en Alemania siendo español: visas, idioma, cultura laboral y más.',
    content: 'Contenido completo del artículo...',
    country_id: '550e8400-e29b-41d4-a716-446655440001',
    author_name: 'The Pilgrim Team',
    category: 'Guías',
    tags: ['Alemania', 'Visa', 'Trabajo', 'Español'],
    reading_time: 8,
    views: 3456,
    likes: 234,
    published: true,
    featured: true,
    created_at: new Date('2024-01-15').toISOString(),
    featured_image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    title: 'Mi Experiencia Trabajando en el Sector Tech en Singapur',
    slug: 'experiencia-trabajando-tech-singapur',
    excerpt: 'Relato personal de cómo conseguí trabajo como desarrollador en Singapur y los desafíos que enfrenté.',
    content: 'Contenido completo del artículo...',
    country_id: '550e8400-e29b-41d4-a716-446655440018',
    author_name: 'Carlos Mendoza',
    category: 'Experiencias',
    tags: ['Singapur', 'Tech', 'Desarrollador', 'Experiencia'],
    reading_time: 6,
    views: 2134,
    likes: 178,
    published: true,
    featured: false,
    created_at: new Date('2024-02-20').toISOString(),
    featured_image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd'
  }
];

export const mockServices = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    title: 'Revisión de CV Profesional',
    description: 'Optimización completa de tu CV para el mercado laboral internacional con feedback personalizado.',
    price: 99.00,
    currency: 'EUR',
    duration_days: 7,
    monthly_limit: 50,
    category: 'cv_optimization',
    active: true,
    popular: true,
    features: [
      'Revisión completa por expertos',
      'Adaptación al mercado objetivo',
      '2 rondas de revisiones',
      'Plantilla profesional incluida'
    ]
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    title: 'Asesoría de Visa de Trabajo',
    description: 'Consultoría especializada para obtener tu visa de trabajo en el país de destino.',
    price: 199.00,
    currency: 'EUR',
    duration_days: 14,
    monthly_limit: 20,
    category: 'visa_consulting',
    active: true,
    popular: true,
    features: [
      'Análisis de elegibilidad',
      'Preparación de documentos',
      'Seguimiento del proceso',
      'Consultas ilimitadas'
    ]
  }
];

export const mockComments = [
  {
    id: '1',
    post_id: '770e8400-e29b-41d4-a716-446655440001',
    author_name: 'María García',
    author_email: 'maria@example.com',
    content: '¡Excelente guía! Me ayudó mucho en mi proceso de mudanza a Berlín.',
    approved: true,
    created_at: new Date('2024-01-20').toISOString()
  },
  {
    id: '2',
    post_id: '770e8400-e29b-41d4-a716-446655440001',
    author_name: 'Juan Pérez',
    author_email: 'juan@example.com',
    content: '¿Alguien sabe si el Blue Card aplica también para profesionales del marketing?',
    approved: true,
    created_at: new Date('2024-01-22').toISOString()
  }
];