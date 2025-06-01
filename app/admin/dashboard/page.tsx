'use client'

import { useEffect, useState } from 'react'
import { 
  Globe, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  AlertCircle
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardStats {
  overview: {
    countries_count: number
    blog_posts_total: number
    blog_posts_published: number
    comments_total: number
    comments_pending: number
    services_total: number
    services_active: number
    reservations_total: number
    reservations_revenue: number
    contact_messages_total: number
    contact_messages_unread: number
    user_sessions_total: number
    user_sessions_today: number
  }
  popular_items: {
    top_countries: Array<{name: string, likes: number}>
    top_blog_posts: Array<{title: string, views: number}>
  }
  recent_activity: {
    recent_reservations: Array<{
      id: string
      service_type: string
      amount: number
      status: string
      created_at: string
    }>
    recent_admin_logs: Array<{
      action: string
      details: any
      created_at: string
      admin_email: string
    }>
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        setError('')
        
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
        setError(err instanceof Error ? err.message : 'Error loading dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-200">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Error al cargar el dashboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    { 
      title: 'Países activos', 
      value: stats.overview.countries_count, 
      icon: Globe, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      title: 'Artículos publicados', 
      value: `${stats.overview.blog_posts_published}/${stats.overview.blog_posts_total}`, 
      icon: FileText, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    { 
      title: 'Comentarios pendientes', 
      value: stats.overview.comments_pending, 
      icon: MessageSquare, 
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20'
    },
    { 
      title: 'Servicios activos', 
      value: `${stats.overview.services_active}/${stats.overview.services_total}`, 
      icon: ShoppingBag, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    { 
      title: 'Ingresos totales', 
      value: `€${stats.overview.reservations_revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20'
    },
    { 
      title: 'Sesiones hoy', 
      value: `${stats.overview.user_sessions_today}/${stats.overview.user_sessions_total}`, 
      icon: Users, 
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Países más populares
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.popular_items.top_countries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="likes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Blog Posts */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Artículos más vistos
          </h3>
          <div className="space-y-4">
            {stats.popular_items.top_blog_posts.map((post, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-200">
                    {post.views} visualizaciones
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reservas recientes
          </h3>
          <div className="space-y-4">
            {stats.recent_activity.recent_reservations.map((reservation, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {reservation.service_type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    €{reservation.amount} - {new Date(reservation.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  reservation.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : reservation.status === 'pending'
                    ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {reservation.status === 'completed' ? 'Completado' : 
                   reservation.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad de administradores
          </h3>
          <div className="space-y-4">
            {stats.recent_activity.recent_admin_logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {log.admin_email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {log.action.replace('_', ' ').toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}