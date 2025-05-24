'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { countriesData } from '@/lib/data/countries'
import { getCountryEmoji } from '@/lib/utils'
import { Country } from '@/lib/types'

export function PopularCountries() {
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    // Simulate fetching popular countries with likes
    const popularCountries = countriesData
      .map(country => ({
        ...country,
        likesTotal: Math.floor(Math.random() * 500) + 100 // Simulated likes
      }))
      .sort((a, b) => b.likesTotal - a.likesTotal)
      .slice(0, 6)
    
    setCountries(popularCountries)
  }, [])

  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Países Destacados
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Los destinos más populares según nuestra comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href={`/explorador/${country.id}`}>
                <div className="card card-hover overflow-hidden group">
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-teal-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{getCountryEmoji(country.countryCode)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {country.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Heart className="h-5 w-5 fill-current text-red-500" />
                        <span>{country.likesTotal} likes</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        Ver más →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/explorador" className="btn-primary">
            Ver todos los países
          </Link>
        </div>
      </div>
    </section>
  )
}