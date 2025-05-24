'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: Date
}

interface Props {
  postId: string
}

export function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [useRegistration, setUseRegistration] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load comments from localStorage (simulating database)
    const savedComments = localStorage.getItem(`comments_${postId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })))
    }
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !comment) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        authorName: name,
        content: comment,
        createdAt: new Date()
      }

      const updatedComments = [newComment, ...comments]
      setComments(updatedComments)
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments))

      // Reset form
      setName('')
      setEmail('')
      setComment('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Comentarios ({comments.length})
      </h2>

      {/* Comment form */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Deja un comentario
        </h3>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useRegistration}
              onChange={(e) => setUseRegistration(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Quiero registrarme para recibir actualizaciones
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-primary"
              />
            </div>
            {useRegistration && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={useRegistration}
                  className="input-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comentario *
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="input-primary"
              placeholder="Comparte tu experiencia o pregunta..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
          </button>
        </form>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Sé el primero en comentar
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card p-6">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {comment.authorName}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}