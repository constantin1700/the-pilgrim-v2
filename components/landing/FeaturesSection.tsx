'use client'

import { motion } from 'framer-motion'
import { Database, Globe, Star } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: '📈 Información Viva y Actualizada',
    description: 'Contenido fresco y diverso sobre oportunidades laborales en 19 países, actualizado constantemente.',
  },
  {
    icon: Globe,
    title: '🌐 Comunidad Global Activa',
    description: 'Conecta con personas que comparten tus mismos intereses y objetivos internacionales.',
  },
  {
    icon: Star,
    title: '⭐ Servicios Premium Opcionales',
    description: 'Apoyo personalizado para hacer tu transición al extranjero más fácil y exitosa.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🤔 ¿Por qué elegir The Pilgrim?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
            Tu plataforma de confianza para explorar oportunidades laborales internacionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}