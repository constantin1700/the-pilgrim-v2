import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPostContent } from '@/components/blog/BlogPostContent'
import { CommentSection } from '@/components/blog/CommentSection'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { supabase } from '@/lib/supabase'
import { mockBlogPosts } from '@/lib/data/blog-posts'
import { BlogPost } from '@/lib/types'

interface Props {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Primero intentar obtener de la base de datos
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!error && data) {
      // Mapear los campos de la base de datos al formato esperado
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        countryId: data.country_id,
        countryName: data.country_id === 'alemania' ? 'Alemania' :
                     data.country_id === 'singapur' ? 'Singapur' :
                     data.country_id === 'noruega' ? 'Noruega' :
                     data.country_id === 'dubai' ? 'Dubái' :
                     data.country_id === 'australia' ? 'Australia' : 'País',
        likes: data.likes || 0,
        readingTime: data.reading_time || 5,
        published: data.published || true,
        publishedAt: data.published_at ? new Date(data.published_at) : new Date(data.created_at),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        coverImage: data.featured_image
      }
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
  }

  // Si no se encuentra en la base de datos, buscar en mock data
  const mockPost = mockBlogPosts.find(p => p.slug === slug)
  return mockPost || null
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main>
        <BlogPostContent post={post} />
        <CommentSection postId={post.id} />
        <RelatedPosts currentPostId={post.id} countryId={post.countryId} />
      </main>
      <Footer />
    </div>
  )
}

// Para generación estática, obtener todos los slugs disponibles
export async function generateStaticParams() {
  try {
    const { data: dbPosts } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')

    const dbSlugs = dbPosts?.map(post => ({ slug: post.slug })) || []
    const mockSlugs = mockBlogPosts.map(post => ({ slug: post.slug }))
    
    // Combinar slugs únicos de ambas fuentes
    const allSlugs = [...dbSlugs, ...mockSlugs]
    const uniqueSlugs = Array.from(new Set(allSlugs.map(s => s.slug)))
      .map(slug => ({ slug }))
    
    return uniqueSlugs
  } catch (error) {
    console.error('Error generating static params:', error)
    // Fallback a mock data si hay error
    return mockBlogPosts.map((post) => ({
      slug: post.slug,
    }))
  }
}