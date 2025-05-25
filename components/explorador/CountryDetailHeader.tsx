'use client'

import { useState, useEffect } from 'react'
import { Heart, Thermometer, DollarSign, Users, FileText, TrendingUp } from 'lucide-react'
import { Country } from '@/lib/types'
import { getCountryEmoji, formatCurrency } from '@/lib/utils'

interface Props {
  country: Country
}

export function CountryDetailHeader({ country }: Props) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(country.likesTotal)

  useEffect(() => {
    const likedCountries = localStorage.getItem('likedCountries')
    if (likedCountries) {
      const liked = JSON.parse(likedCountries)
      setIsLiked(liked.includes(country.id))
    }

    const savedLikes = localStorage.getItem('countryLikes')
    if (savedLikes) {
      const likesData = JSON.parse(savedLikes)
      if (likesData[country.id]) {
        setLikes(likesData[country.id].total || 0)
      }
    }
  }, [country.id])

  const handleLike = () => {
    const likedCountries = JSON.parse(localStorage.getItem('likedCountries') || '[]')
    const likesData = JSON.parse(localStorage.getItem('countryLikes') || '{}')
    
    if (!likesData[country.id]) {
      likesData[country.id] = { dashboard: 0, blog: 0, total: 0 }
    }

    if (isLiked) {
      // Unlike
      const index = likedCountries.indexOf(country.id)
      if (index > -1) likedCountries.splice(index, 1)
      likesData[country.id].dashboard = Math.max(0, likesData[country.id].dashboard - 1)
    } else {
      // Like
      likedCountries.push(country.id)
      likesData[country.id].dashboard += 1
    }

    likesData[country.id].total = likesData[country.id].dashboard + likesData[country.id].blog
    
    localStorage.setItem('likedCountries', JSON.stringify(likedCountries))
    localStorage.setItem('countryLikes', JSON.stringify(likesData))
    
    setIsLiked(!isLiked)
    setLikes(likesData[country.id].total)
  }

  return (
    <div className="relative">
      {/* Hero image */}
      <div className="h-80 bg-gradient-to-br from-blue-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[20rem]">{getCountryEmoji(country.code || country.countryCode || '')}</span>
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Country info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20">
          <div className="card p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl">{getCountryEmoji(country.code || country.countryCode || '')}</span>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {country.name}
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-200">
                  Guía completa con información actualizada sobre vida y trabajo en {country.name}
                </p>
              </div>
              
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

            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(country.averageSalary)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Salario promedio</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Thermometer className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {country.temperature}°C
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Temperatura media</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {country.qualityOfLife}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Calidad de vida</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {country.bureaucracyEase}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Facilidad burocrática</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {country.socialIndex}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Índice social</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {country.salaryExpenseRatio.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Ratio salario/gastos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}