'use client'

import { useState } from 'react'
import { MessageSquare, Users, Clock, Bell } from 'lucide-react'
import { countriesData } from '@/lib/data/countries'
import { getCountryEmoji } from '@/lib/utils'
import { motion } from 'framer-motion'

export function ForumPlaceholder() {
  const [email, setEmail] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
      setEmail('')
    }, 3000)
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 px-6 py-3 rounded-full mb-6 relative z-10"
          >
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Disponible en aproximadamente 3 semanas</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Foro de la Comunidad - Próximamente
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Conecta con viajeros de todo el mundo, comparte experiencias y encuentra respuestas a tus preguntas
          </p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Discusiones por País
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Foros dedicados para cada uno de los 19 países con hilos organizados por temas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comunidad Activa
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conecta con españoles que ya viven en el extranjero y comparte experiencias
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Notificaciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Recibe alertas cuando alguien responda a tus preguntas o mencione temas de interés
            </p>
          </motion.div>
        </div>

        {/* Countries preview grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Foros disponibles próximamente
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {countriesData.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="card p-4 text-center opacity-75 cursor-not-allowed"
              >
                <div className="text-4xl mb-2">{getCountryEmoji(country.countryCode)}</div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {country.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Próximamente
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notification form */}
        <div className="max-w-md mx-auto">
          <div className="card p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ¿Quieres ser el primero en usar el foro?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Déjanos tu email y te avisaremos en cuanto esté disponible
            </p>
            
            <form onSubmit={handleNotifySubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input-primary"
              />
              <button type="submit" className="btn-primary w-full">
                Notificarme cuando esté disponible
              </button>
            </form>

            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg"
              >
                ¡Perfecto! Te avisaremos cuando el foro esté listo.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}