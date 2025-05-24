'use client'

import { useState, useEffect } from 'react'
import { Check, Crown, Star, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface ServicePlan {
  id: string
  type: 'basic' | 'personalized' | 'premium'
  title: string
  price: number
  availability: string
  monthlyLimit?: number
  availableSlots?: number
  features: string[]
  idealFor: string
  highlighted?: boolean
}

const plans: ServicePlan[] = [
  {
    id: 'basic',
    type: 'basic',
    title: 'Soporte Básico',
    price: 49,
    availability: 'Siempre disponible',
    features: [
      'Revisión del currículum con sugerencias',
      'Revisión de carta de presentación con sugerencias',
      'Guía rápida para optimizar el perfil profesional'
    ],
    idealFor: 'Quienes buscan una revisión puntual y consejos prácticos'
  },
  {
    id: 'personalized',
    type: 'personalized',
    title: 'Soporte Personalizado',
    price: 99,
    availability: 'Solo 20 personas al mes',
    monthlyLimit: 20,
    availableSlots: 14,
    features: [
      'Revisión del currículum con sugerencias',
      'Revisión de carta de presentación con sugerencias',
      'Guía rápida para optimizar el perfil profesional',
      'Currículum hecho a medida, adaptado al destino y sector objetivo',
      'Carta de presentación personalizada',
      'Soporte directo durante un mes'
    ],
    idealFor: 'Profesionales que buscan apoyo integral en su búsqueda',
    highlighted: true
  },
  {
    id: 'premium',
    type: 'premium',
    title: 'Soporte Premium',
    price: 149,
    availability: 'Solo 10 personas al mes',
    monthlyLimit: 10,
    availableSlots: 3,
    features: [
      'Revisión del currículum con sugerencias de mejora',
      'Revisión de carta de presentación personalizada',
      'Guía rápida para optimizar el perfil profesional',
      'Currículum hecho a medida',
      'Carta de presentación hecho a medida',
      'Soporte directo durante dos meses',
      'Reunión personalizada cara a cara vía videollamada',
      'Asesoría directa sobre requisitos y planificación'
    ],
    idealFor: 'Quienes buscan el máximo apoyo y atención personalizada'
  }
]

export function ServicePlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [showWaitlist, setShowWaitlist] = useState(false)

  const handleReservation = async (planId: string, isAvailable: boolean) => {
    if (isAvailable) {
      // Get customer data first
      const customerName = prompt('Nombre completo:')
      const customerEmail = prompt('Email:')
      const customerPhone = prompt('Teléfono (opcional):')
      
      if (!customerName || !customerEmail) {
        alert('Por favor, proporciona tu nombre y email')
        return
      }
      
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: planId,
            customerData: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone || ''
            }
          })
        })
        
        if (response.ok) {
          const { url } = await response.json()
          window.location.href = url
        } else {
          const error = await response.json()
          alert(error.error || 'Error al procesar la reserva')
        }
      } catch (error) {
        console.error('Error creating checkout:', error)
        alert('Error al procesar la reserva')
      }
    } else {
      setSelectedPlan(planId)
      setShowWaitlist(true)
    }
  }

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Te hemos añadido a la lista de espera. Te notificaremos a ${email} cuando haya disponibilidad.`)
    setShowWaitlist(false)
    setEmail('')
  }

  return (
    <section className="py-16 -mt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isAvailable = !plan.monthlyLimit || (plan.availableSlots! > 0)
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.highlighted ? 'md:-mt-8' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-5 left-0 right-0 text-center">
                    <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className={`card h-full flex flex-col ${plan.highlighted ? 'ring-2 ring-amber-500' : ''}`}>
                  <div className="p-8 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {plan.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {plan.availability}
                        </p>
                      </div>
                      {plan.type === 'basic' && <Zap className="h-8 w-8 text-blue-500" />}
                      {plan.type === 'personalized' && <Star className="h-8 w-8 text-amber-500" />}
                      {plan.type === 'premium' && <Crown className="h-8 w-8 text-purple-500" />}
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        €{plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400"> / único pago</span>
                    </div>

                    {plan.monthlyLimit && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Disponibilidad</span>
                          <span className={`font-medium ${
                            plan.availableSlots! > 5 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {plan.availableSlots} de {plan.monthlyLimit} restantes
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              plan.availableSlots! > 5 
                                ? 'bg-green-500' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${(plan.availableSlots! / plan.monthlyLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Ideal para: {plan.idealFor}
                    </p>
                  </div>

                  <div className="p-8 pt-0">
                    <button
                      onClick={() => handleReservation(plan.id, isAvailable)}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                        isAvailable
                          ? plan.highlighted
                            ? 'btn-accent'
                            : 'btn-primary'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!isAvailable}
                    >
                      {isAvailable 
                        ? plan.type === 'basic' 
                          ? 'Solicitar Soporte Básico'
                          : 'Reservar mi lugar'
                        : 'Unirse a lista de espera'
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Waitlist Modal */}
        {showWaitlist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Únete a la lista de espera
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Te notificaremos por email en cuanto haya disponibilidad para el plan seleccionado.
              </p>
              <form onSubmit={handleWaitlistSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="input-primary mb-4"
                />
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex-1">
                    Unirme a la lista
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWaitlist(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}