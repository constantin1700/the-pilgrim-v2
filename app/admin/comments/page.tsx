'use client'

import { useState } from 'react'
import { Check, X, Trash2, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: string
  postTitle: string
  authorName: string
  authorEmail?: string
  content: string
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
  ipAddress: string
}

export default function AdminCommentsPage() {
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      postTitle: 'Guía completa para trabajar en Alemania como español',
      authorName: 'Juan García',
      authorEmail: 'juan@example.com',
      content: 'Excelente artículo! Me ha sido muy útil para preparar mi mudanza a Berlín. ¿Podrías añadir información sobre el seguro médico?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'pending',
      ipAddress: '192.168.1.1'
    },
    {
      id: '2',
      postTitle: 'Mi experiencia trabajando en tech en Singapur',
      authorName: 'María López',
      content: 'Gracias por compartir tu experiencia. Estoy considerando una oferta en Singapur y esto me ayuda mucho.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: 'pending',
      ipAddress: '192.168.1.2'
    },
    {
      id: '3',
      postTitle: 'Oportunidades en el sector sanitario de Noruega',
      authorName: 'Carlos Ruiz',
      authorEmail: 'carlos@example.com',
      content: '¿Sabes si también buscan auxiliares de enfermería? Tengo el título pero no sé si es suficiente.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'approved',
      ipAddress: '192.168.1.3'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  const filteredComments = comments.filter(comment => 
    filter === 'all' || comment.status === filter
  )

  const handleApprove = (commentId: string) => {
    alert(`Comentario ${commentId} aprobado`)
  }

  const handleReject = (commentId: string) => {
    alert(`Comentario ${commentId} rechazado`)
  }

  const handleDelete = (commentId: string) => {
    if (confirm('¿Estás seguro de eliminar este comentario permanentemente?')) {
      alert(`Comentario ${commentId} eliminado`)
    }
  }

  const getStatusBadge = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Moderación de Comentarios
        </h2>
        <p className="text-gray-600 dark:text-gray-200">
          Revisa y modera los comentarios de los usuarios
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Todos ({comments.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Pendientes ({comments.filter(c => c.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'approved'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Aprobados ({comments.filter(c => c.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'rejected'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Rechazados ({comments.filter(c => c.status === 'rejected').length})
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {comment.authorName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-200">
                  {comment.authorEmail && (
                    <span>{comment.authorEmail}</span>
                  )}
                  <span>IP: {comment.ipAddress}</span>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(comment.status)}`}>
                {comment.status === 'pending' && 'Pendiente'}
                {comment.status === 'approved' && 'Aprobado'}
                {comment.status === 'rejected' && 'Rechazado'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                En: {comment.postTitle}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                {comment.content}
              </p>
            </div>

            {comment.status === 'pending' && (
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleApprove(comment.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Aprobar
                </button>
                <button
                  onClick={() => handleReject(comment.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Rechazar
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-200">
            No hay comentarios {filter !== 'all' && filter} para mostrar
          </p>
        </div>
      )}
    </div>
  )
}