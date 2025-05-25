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
  Heart
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { countriesData } from '@/lib/data/countries'
import { mockBlogPosts } from '@/lib/data/blog-posts'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCountries: 19,
    totalArticles: 0,
    pendingComments: 0,
    monthlyReservations: 0,
    monthlyRevenue: 0,
    totalLikes: 0
  })

  const [topCountries, setTopCountries] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Load stats
    setStats({
      totalCountries: countriesData.length,
      totalArticles: mockBlogPosts.length,
      pendingComments: 5,
      monthlyReservations: 12,
      monthlyRevenue: 1287,
      totalLikes: 847
    })

    // Simulate top countries
    const topCountriesData = countriesData
      .map(country => ({
        name: country.name,
        likes: Math.floor(Math.random() * 200) + 50
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
    
    setTopCountries(topCountriesData)

    // Simulate recent activity
    setRecentActivity([
      { day: 'Lun', likes: 45, comments: 12 },
      { day: 'Mar', likes: 52, comments: 15 },
      { day: 'Mie', likes: 38, comments: 8 },
      { day: 'Jue', likes: 65, comments: 20 },
      { day: 'Vie', likes: 48, comments: 14 },
      { day: 'Sab', likes: 71, comments: 18 },
      { day: 'Dom', likes: 58, comments: 10 }
    ])
  }, [])

  const statCards = [
    { 
      title: 'Países activos', 
      value: stats.totalCountries, 
      icon: Globe, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      title: 'Artículos publicados', 
      value: stats.totalArticles, 
      icon: FileText, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    { 
      title: 'Comentarios pendientes', 
      value: stats.pendingComments, 
      icon: MessageSquare, 
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20'
    },
    { 
      title: 'Servicios este mes', 
      value: stats.monthlyReservations, 
      icon: ShoppingBag, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    { 
      title: 'Ingresos del mes', 
      value: `€${stats.monthlyRevenue}`, 
      icon: DollarSign, 
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20'
    },
    { 
      title: 'Total likes', 
      value: stats.totalLikes, 
      icon: Heart, 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
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
        {/* Activity Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad de la última semana
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Likes"
                />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Comentarios"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Países más populares
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCountries} layout="horizontal">
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
                <Bar dataKey="likes" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comentarios recientes pendientes
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Usuario Anónimo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    Comentó en &ldquo;Guía completa para trabajar en Alemania&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">
                    Hace {i * 2} horas
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Revisar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reservas recientes
          </h3>
          <div className="space-y-4">
            {[
              { plan: 'Personalizado', price: 99, status: 'paid' },
              { plan: 'Premium', price: 149, status: 'paid' },
              { plan: 'Básico', price: 49, status: 'pending' }
            ].map((reservation, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Plan {reservation.plan}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    €{reservation.price}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  reservation.status === 'paid' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                }`}>
                  {reservation.status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}