import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thepilgrim.com'
  
  // Static pages
  const staticPages = [
    '',
    '/dashboard',
    '/explorador',
    '/blog',
    '/servicios',
    '/foro',
    '/contacto',
    '/conoce-mas',
  ]

  // Countries (you can fetch from API in production)
  const countries = [
    'alemania', 'canada', 'australia', 'paises-bajos', 'suiza',
    'reino-unido', 'suecia', 'noruega', 'dinamarca', 'francia',
    'italia', 'austria', 'belgica', 'irlanda', 'finlandia',
    'nueva-zelanda', 'estados-unidos', 'singapur', 'japon'
  ]

  // Blog posts (you can fetch from API in production)
  const blogPosts = [
    'guia-completa-trabajar-alemania-espanol',
    'experiencia-trabajando-tech-singapur',
    'oportunidades-sector-sanitario-noruega'
  ]

  const sitemap: MetadataRoute.Sitemap = [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' as const : 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    })),
    
    // Country pages
    ...countries.map((country) => ({
      url: `${baseUrl}/explorador/${country}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    
    // Blog posts
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return sitemap
}