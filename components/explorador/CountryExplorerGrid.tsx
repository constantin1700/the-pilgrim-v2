'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Users, Briefcase } from 'lucide-react'
import { countriesData } from '@/lib/data/countries'
import { getCountryEmoji } from '@/lib/utils'
import { motion } from 'framer-motion'

export function CountryExplorerGrid() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = countriesData.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-primary w-full"
          />
        </div>
      </div>

      {/* Countries grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country, index) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/explorador/${country.id}`}>
              <div className="card card-hover overflow-hidden group">
                {/* Country header with flag */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-20">{getCountryEmoji(country.code || country.countryCode || '')}</span>
                  </div>
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div className="text-5xl">{getCountryEmoji(country.code || country.countryCode || '')}</div>
                    <h3 className="text-2xl font-bold text-white">{country.name}</h3>
                  </div>
                </div>

                {/* Country info */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Guía completa</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{Math.floor(Math.random() * 5000 + 1000)} españoles</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Información actualizada sobre vida, trabajo y oportunidades en {country.name}.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">Múltiples sectores</span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      Explorar →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron países que coincidan con tu búsqueda.
          </p>
        </div>
      )}
    </div>
  )
}