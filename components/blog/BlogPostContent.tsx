'use client'

import { useState, useEffect } from 'react'
import { Heart, Clock, Calendar, User } from 'lucide-react'
import { BlogPost } from '@/lib/types'
import { getCountryEmoji, formatDate } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Props {
  post: BlogPost
}

export function BlogPostContent({ post }: Props) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  useEffect(() => {
    const likedPosts = localStorage.getItem('likedPosts')
    if (likedPosts) {
      const liked = JSON.parse(likedPosts)
      setIsLiked(liked.includes(post.id))
    }
  }, [post.id])

  const handleLike = () => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    const likesData = JSON.parse(localStorage.getItem('countryLikes') || '{}')
    
    if (!likesData[post.countryId]) {
      likesData[post.countryId] = { dashboard: 0, blog: 0, total: 0 }
    }

    if (isLiked) {
      // Unlike
      const index = likedPosts.indexOf(post.id)
      if (index > -1) likedPosts.splice(index, 1)
      likesData[post.countryId].blog = Math.max(0, likesData[post.countryId].blog - 1)
      setLikes(prev => Math.max(0, prev - 1))
    } else {
      // Like
      likedPosts.push(post.id)
      likesData[post.countryId].blog += 1
      setLikes(prev => prev + 1)
    }

    likesData[post.countryId].total = likesData[post.countryId].dashboard + likesData[post.countryId].blog
    
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    localStorage.setItem('countryLikes', JSON.stringify(likesData))
    
    setIsLiked(!isLiked)
  }

  return (
    <article>
      {/* Hero section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-teal-600">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[20rem]">
            {getCountryEmoji(post.countryId === 'alemania' ? 'DE' : 
                             post.countryId === 'singapur' ? 'SG' : 'NO')}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                <span className="text-2xl">{getCountryEmoji(post.countryId === 'alemania' ? 'DE' : 
                                                              post.countryId === 'singapur' ? 'SG' : 'NO')}</span>
                {post.countryName}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt!)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readingTime} min de lectura
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                The Pilgrim Team
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Like button and CTA */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                isLiked
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likes} likes</span>
            </button>
          </div>

          {/* CTA */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              ¿Necesitas ayuda personalizada para trabajar en {post.countryName}?
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Nuestros servicios premium incluyen revisión de CV, preparación para entrevistas y asesoría completa 
              para tu transición internacional.
            </p>
            <a href="/servicios" className="btn-primary inline-block">
              Ver servicios disponibles
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}