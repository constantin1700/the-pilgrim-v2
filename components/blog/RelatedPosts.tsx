'use client'

import Link from 'next/link'
import { Heart, Clock } from 'lucide-react'
import { mockBlogPosts } from '@/lib/data/blog-posts'
import { getCountryEmoji } from '@/lib/utils'

interface Props {
  currentPostId: string
  countryId: string
}

export function RelatedPosts({ currentPostId, countryId }: Props) {
  const relatedPosts = mockBlogPosts
    .filter(post => post.id !== currentPostId && post.countryId === countryId)
    .slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 dark:bg-slate-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Más artículos sobre {mockBlogPosts.find(p => p.countryId === countryId)?.countryName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="card card-hover h-full">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-teal-500 relative rounded-t-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-20">
                      {getCountryEmoji(post.countryId === 'alemania' ? 'DE' : 
                                       post.countryId === 'singapur' ? 'SG' : 'NO')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}