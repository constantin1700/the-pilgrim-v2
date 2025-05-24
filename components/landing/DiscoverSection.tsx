'use client'

import { motion } from 'framer-motion'
import { Globe, Users, HeartHandshake } from 'lucide-react'

const discoveries = [
  {
    icon: Globe,
    title: 'Información actualizada de 19 países',
    subtitle: 'Por ahora - la lista crecerá con el tiempo',
  },
  {
    icon: Users,
    title: 'Comunidades por país',
    subtitle: 'Conecta con personas de tu país objetivo',
  },
  {
    icon: HeartHandshake,
    title: 'Servicios de apoyo personalizado',
    subtitle: 'Soporte profesional para tu transición',
  },
]

export function DiscoverSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Descubre lo que tenemos para ti
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Una plataforma en constante crecimiento diseñada para apoyar tu aventura internacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {discoveries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 dark:from-blue-600 dark:to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <item.icon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {item.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}