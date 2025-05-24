'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Eye, Clock, Users } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Simulated data
  const visitorsData = [
    { date: '01/05', visitors: 1200 },
    { date: '05/05', visitors: 1350 },
    { date: '10/05', visitors: 1100 },
    { date: '15/05', visitors: 1500 },
    { date: '20/05', visitors: 1800 },
    { date: '25/05', visitors: 2100 },
    { date: '30/05', visitors: 1900 }
  ]

  const topPages = [
    { page: '/dashboard', views: 3456, percentage: 28 },
    { page: '/explorador/alemania', views: 2890, percentage: 23 },
    { page: '/blog', views: 2345, percentage: 19 },
    { page: '/servicios', views: 1890, percentage: 15 },
    { page: '/explorador/canada', views: 1234, percentage: 10 },
    { page: '/explorador/australia', views: 890, percentage: 5 }
  ]

  const deviceData = [
    { name: 'Desktop', value: 55, color: '#3b82f6' },
    { name: 'Mobile', value: 35, color: '#10b981' },
    { name: 'Tablet', value: 10, color: '#f59e0b' }
  ]

  const countryLikesData = [
    { country: 'Alemania', likes: 245, trend: 12 },
    { country: 'Canadá', likes: 198, trend: 8 },
    { country: 'Australia', likes: 176, trend: -5 },
    { country: 'Singapur', likes: 156, trend: 15 },
    { country: 'Noruega', likes: 143, trend: 20 }
  ]

  const blogPerformance = [
    { title: 'Guía completa para trabajar en Alemania', views: 1234, likes: 156, comments: 23 },
    { title: 'Mi experiencia en Singapur', views: 987, likes: 89, comments: 15 },
    { title: 'Oportunidades sanitarias en Noruega', views: 876, likes: 124, comments: 18 },
    { title: 'Vivir en Australia: pros y contras', views: 765, likes: 98, comments: 12 }
  ]

  const serviceConversion = [
    { service: 'Básico', conversions: 45, revenue: 2205 },
    { service: 'Personalizado', conversions: 28, revenue: 2772 },
    { service: 'Premium', conversions: 12, revenue: 1788 }
  ]

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics y Estadísticas
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '7d'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '30d'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Últimos 30 días
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '90d'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Últimos 90 días
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            12,456
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visitantes únicos
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            45,678
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Páginas vistas
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-gray-500">Promedio</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            3:45
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tiempo en sitio
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-green-600 dark:text-green-400">+15%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            32%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tasa de rebote
          </p>
        </div>
      </div>

      {/* Visitors Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Evolución de Visitantes
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
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
                dataKey="visitors" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multiple Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Páginas Más Visitadas
          </h3>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{page.page}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{page.views}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                    style={{ width: `${page.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dispositivos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{device.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Country Likes Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Países Trending
          </h3>
          <div className="space-y-3">
            {countryLikesData.map((country) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {country.country}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {country.likes} likes
                  </p>
                </div>
                <span className={`text-sm font-medium ${
                  country.trend > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {country.trend > 0 ? '+' : ''}{country.trend}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rendimiento del Blog
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase pb-2">
                  Artículo
                </th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase pb-2">
                  Vistas
                </th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase pb-2">
                  Likes
                </th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase pb-2">
                  Comentarios
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {blogPerformance.map((post, index) => (
                <tr key={index}>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {post.title}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white text-right">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white text-right">
                    {post.likes}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white text-right">
                    {post.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Conversion */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conversión de Servicios
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="service" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="conversions" fill="#3b82f6" name="Conversiones" />
              <Bar dataKey="revenue" fill="#10b981" name="Ingresos (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}