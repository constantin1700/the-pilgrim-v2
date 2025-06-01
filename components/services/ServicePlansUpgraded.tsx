'use client'

import { useState, useEffect } from 'react'
import { Check, Crown, Star, Zap, ArrowRight, Users, Clock, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { getStripe, STRIPE_PRODUCTS, formatPrice, StripeProductId } from '@/lib/stripe'

interface ServicePlan {
  id: StripeProductId
  type: 'basic' | 'premium' | 'vip' | 'express'
  title: string
  price: number
  originalPrice?: number
  availability: string
  features: string[]
  idealFor: string
  highlighted?: boolean
  badge?: string
  icon: any
  duration: string
}

const plans: ServicePlan[] = [
  {
    id: 'cv_express',
    type: 'express',
    title: 'Revisión Express de CV',
    price: 29,
    availability: 'Entrega en 48h',
    duration: '3 días',
    features: [...STRIPE_PRODUCTS.cv_express.features],
    idealFor: 'Profesionales que necesitan una mejora rápida y efectiva de su CV',
    icon: Zap,
    badge: 'Más popular'
  },
  {
    id: 'basic_consultation',
    type: 'basic',
    title: 'Plan Básico - Orientación Inicial',
    price: 49,
    availability: 'Disponible todo el mes',
    duration: '7 días',
    features: [...STRIPE_PRODUCTS.basic_consultation.features],
    idealFor: 'Quienes necesitan orientación inicial para empezar su búsqueda laboral',
    icon: Star
  },
  {
    id: 'premium_preparation',
    type: 'premium',
    title: 'Plan Premium - Preparación Completa',
    price: 149,
    originalPrice: 199,
    availability: 'Solo 30 personas al mes',
    duration: '14 días',
    features: [...STRIPE_PRODUCTS.premium_preparation.features],
    idealFor: 'Profesionales que buscan una preparación integral para el mercado internacional',
    highlighted: true,
    icon: Users,
    badge: 'Recomendado'
  }
]

export function ServicePlansUpgraded() {
  const [selectedPlan, setSelectedPlan] = useState<StripeProductId | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [showForm, setShowForm] = useState(false)

  const handleSelectPlan = (planId: StripeProductId) => {
    setSelectedPlan(planId)
    setShowForm(true)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPlan || !customerData.name || !customerData.email) {
      alert('Por favor, completa todos los campos requeridos')
      return
    }

    setIsLoading(selectedPlan)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedPlan,
          customerData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error procesando el pago')
      }

      // Redirigir a Stripe Checkout
      const stripe = await getStripe()
      if (stripe && data.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        })
        
        if (error) {
          console.error('Error redirecting to checkout:', error)
          alert('Error al procesar el pago. Por favor, inténtalo de nuevo.')
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Error al procesar el pago')
    } finally {
      setIsLoading(null)
    }
  }

  const PlanCard = ({ plan, index }: { plan: ServicePlan, index: number }) => {
    const Icon = plan.icon
    const isPopular = plan.badge === 'Más popular'
    const isRecommended = plan.badge === 'Recomendado'
    const isPremium = plan.badge === 'Premium'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          plan.highlighted 
            ? 'border-blue-500 shadow-blue-500/20' 
            : 'border-gray-200 dark:border-slate-700'
        }`}
      >
        {/* Badge */}
        {plan.badge && (
          <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
            isPopular ? 'bg-green-500 text-white' :
            isRecommended ? 'bg-blue-500 text-white' :
            isPremium ? 'bg-purple-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {plan.badge}
          </div>
        )}

        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
              plan.highlighted ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-slate-700'
            }`}>
              <Icon className={`h-8 w-8 ${
                plan.highlighted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.title}
            </h3>
            
            <div className="flex items-center justify-center gap-2">
              {plan.originalPrice && (
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(plan.originalPrice * 100)}
                </span>
              )}
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(plan.price * 100)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {plan.duration}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {plan.availability}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Ideal for */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Ideal para:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {plan.idealFor}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleSelectPlan(plan.id)}
            disabled={isLoading === plan.id}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              plan.highlighted
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading === plan.id ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                Seleccionar Plan
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="py-16 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Elige tu Plan de Éxito Profesional
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Servicios profesionales diseñados por expertos para acelerar tu carrera internacional. 
            Más de 500 profesionales ya han transformado su futuro con nosotros.
          </motion.p>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Pago seguro con Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Resultados garantizados</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>+500 clientes satisfechos</span>
            </div>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Customer Form Modal */}
        {showForm && selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Completa tu reserva
              </h3>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+34 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensaje adicional (opcional)
                  </label>
                  <textarea
                    value={customerData.message}
                    onChange={(e) => setCustomerData({ ...customerData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cuéntanos un poco sobre tu situación actual..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 px-6 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading === selectedPlan}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading === selectedPlan ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        Proceder al pago
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Tienes dudas?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Todos nuestros servicios incluyen garantía de satisfacción. Si no estás completamente satisfecho, 
            te devolvemos el 100% de tu dinero en los primeros 7 días.
          </p>
          <a 
            href="/contacto" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Contactar con el equipo
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}