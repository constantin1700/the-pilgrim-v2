'use client'

import Link from 'next/link'
import { Heart, Thermometer, DollarSign, Users, FileText, TrendingUp } from 'lucide-react'
import { getCountryEmoji, formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useCountries } from '@/hooks/useCountries'
import { useLikes } from '@/hooks/useLikes'

export function CountryGrid() {
  const { countries, loading, error } = useCountries()
  const { toggleLike, isLiked } = useLikes()

  const handleLike = async (countryId: string) => {
    await toggleLike(countryId, 'country_dashboard')
  }

  const getQualityStars = (value: number) => {
    const stars = Math.round(value / 20)
    return '⭐'.repeat(stars)
  }

  const getSocialEmoji = (value: number) => {
    if (value >= 90) return '😄'
    if (value >= 80) return '😊'
    if (value >= 70) return '🙂'
    if (value >= 60) return '😐'
    return '😕'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card h-96 animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {countries.map((country, index) => (
        <motion.div
          key={country.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card card-hover overflow-hidden group"
        >
          <Link href={`/explorador/${country.id}`}>
            <div className="relative h-40 bg-gradient-to-br from-blue-500 to-teal-500">
              <div className="absolute top-4 left-4 text-4xl">
                {getCountryEmoji(country.countryCode)}
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                <span className="text-white font-semibold">#{index + 1}</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-bold text-white">{country.name}</h3>
              </div>
            </div>
          </Link>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Salario</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(country.averageSalary)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Clima</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {country.temperature}°C
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Papeleos</p>
                  <p className="text-sm">{getQualityStars(country.bureaucracyEase)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Calidad vida</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {country.qualityOfLife}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Social</p>
                  <p className="text-lg">
                    {getSocialEmoji(country.socialIndex)} {country.socialIndex}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ratio S/G</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {country.salaryExpenseRatio.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleLike(country.id)
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  isLiked(country.id)
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked(country.id) ? 'fill-current' : ''
                  }`}
                />
                <span className="text-sm font-medium">{country.likesDashboard || 0}</span>
              </button>
              
              <Link
                href={`/explorador/${country.id}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Ver más →
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}