'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, Users, BarChart3 } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-teal-700 dark:from-blue-900 dark:via-slate-900 dark:to-teal-900" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Explora oportunidades globales,
            <br />
            mantente al día
          </h1>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-3xl mx-auto">
            La plataforma definitiva para personas que buscan información, comunidad y apoyo para vivir y trabajar en el extranjero.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard" className="btn-primary bg-white text-blue-800 hover:bg-gray-100">
              Explorar Dashboard
            </Link>
            <Link href="/conoce-mas" className="btn-outline border-white text-white hover:bg-white hover:text-blue-800">
              Conocer Comunidad
            </Link>
          </div>

          {/* Live statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-white"
            >
              <div className="flex items-center justify-center mb-2">
                <Globe className="h-8 w-8 text-blue-300" />
              </div>
              <div className="text-3xl font-bold">19</div>
              <div className="text-blue-200">Países cubiertos</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-white"
            >
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-blue-300" />
              </div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">Artículos actualizados</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-white"
            >
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-300" />
              </div>
              <div className="text-3xl font-bold">1.2K+</div>
              <div className="text-blue-200">Usuarios activos</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}