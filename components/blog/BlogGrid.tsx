'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Clock, Calendar } from 'lucide-react'
import { mockBlogPosts } from '@/lib/data/blog-posts'
import { BlogPost } from '@/lib/types'
import { getCountryEmoji, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

export function BlogGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPosts()
    loadLikedPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      
      const data = await response.json()
      
      if (data && data.length > 0) {
        // Use real data from database
        const publishedPosts = data.filter((post: any) => post.status === 'published' || post.published)
        setFeaturedPost(publishedPosts[0] || null)
        setPosts(publishedPosts.slice(1))
      } else {
        // Fallback to mock data if database is empty
        console.log('No blog posts in database, using mock data')
        setFeaturedPost(mockBlogPosts[0] || null)
        setPosts(mockBlogPosts.slice(1))
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      setError('Error loading blog posts')
      // Fallback to mock data on error
      setFeaturedPost(mockBlogPosts[0] || null)
      setPosts(mockBlogPosts.slice(1))
    } finally {
      setLoading(false)
    }
  }

  const loadLikedPosts = async () => {
    const userId = localStorage.getItem('user_session') || 
                   `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!localStorage.getItem('user_session')) {
      localStorage.setItem('user_session', userId);
    }

    try {
      const response = await fetch(`/api/likes?userId=${userId}&itemType=blog`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.likedItems) {
          setLikedPosts(new Set(result.likedItems));
          return;
        }
      }
    } catch (error) {
      console.log('Database likes not available, using localStorage fallback');
    }
    
    // Fallback to localStorage (always executed if database isn't available)
    const saved = localStorage.getItem('likedPosts');
    if (saved) {
      setLikedPosts(new Set(JSON.parse(saved)));
    }
  }

  const handleLike = async (postId: string, countryId: string) => {
    const userId = localStorage.getItem('user_session') || 
                   `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!localStorage.getItem('user_session')) {
      localStorage.setItem('user_session', userId);
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId: postId,
          itemType: 'blog',
          userId: userId
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (result.liked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          // Also save to localStorage as backup
          localStorage.setItem('likedPosts', JSON.stringify(Array.from(newSet)));
          return newSet;
        });
        return;
      }
    } catch (error) {
      console.log('Database likes not available, using localStorage fallback');
    }
    
    // Fallback to localStorage when database is not available
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      const isLiked = newSet.has(postId);
      
      if (isLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      
      localStorage.setItem('likedPosts', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  }

  // Featured post
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchBlogPosts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (featuredPost) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="card card-hover overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-blue-500 to-teal-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-20">
                      {getCountryEmoji(featuredPost.countryId === 'alemania' ? 'DE' : 
                                       featuredPost.countryId === 'singapur' ? 'SG' : 'NO')}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Destacado
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200 mb-3">
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      {featuredPost.countryName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(featuredPost.publishedAt!)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {featuredPost.readingTime} min
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-200 mb-4">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLike(featuredPost.id, featuredPost.countryId)
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                        likedPosts.has(featuredPost.id)
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedPosts.has(featuredPost.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{featuredPost.likes}</span>
                    </button>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      📖 Leer más →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Regular posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="card card-hover h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-teal-500 relative rounded-t-xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-20">
                        {getCountryEmoji(post.countryId === 'alemania' ? 'DE' : 
                                         post.countryId === 'singapur' ? 'SG' : 'NO')}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200 mb-3">
                      <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        {post.countryName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-200 text-sm flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleLike(post.id, post.countryId)
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                          likedPosts.has(post.id)
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      <span className="text-sm text-gray-500 dark:text-gray-200">
                        {formatDate(post.publishedAt!)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </>
    )
  }

  return null
}