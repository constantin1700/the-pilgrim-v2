import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPostContent } from '@/components/blog/BlogPostContent'
import { CommentSection } from '@/components/blog/CommentSection'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { mockBlogPosts } from '@/lib/data/blog-posts'

interface Props {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = mockBlogPosts.find(p => p.slug === params.slug)
  
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

export function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}