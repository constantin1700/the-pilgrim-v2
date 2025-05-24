'use client'

import { useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { countriesData } from '@/lib/data/countries'

export function BlogFilters() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <MapPin className="inline-block h-4 w-4 mr-1" />
          País
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="input-primary w-full"
        >
          <option value="">Todos los países</option>
          {countriesData.map(country => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <Calendar className="inline-block h-4 w-4 mr-1" />
          Ordenar por
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
          className="input-primary w-full"
        >
          <option value="recent">Más recientes</option>
          <option value="popular">Más populares</option>
        </select>
      </div>
    </div>
  )
}