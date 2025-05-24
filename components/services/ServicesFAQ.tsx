'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: '¿Cómo funciona el proceso de reserva?',
    answer: 'Una vez que selecciones tu plan, serás redirigido a nuestra pasarela de pago segura. Después del pago, recibirás un email con los siguientes pasos y un formulario para proporcionarnos la información necesaria para comenzar.'
  },
  {
    question: '¿Cuánto tiempo tarda en completarse el servicio?',
    answer: 'Para el Soporte Básico, recibirás tu revisión en 3-5 días hábiles. El Soporte Personalizado toma 5-7 días hábiles para la entrega inicial. El Soporte Premium incluye una videollamada que programaremos según tu disponibilidad.'
  },
  {
    question: '¿Qué incluye exactamente cada plan?',
    answer: 'Cada plan incluye todo lo listado en su descripción. El Básico se enfoca en revisiones y sugerencias. El Personalizado añade documentos hechos a medida. El Premium incluye además asesoría directa y soporte extendido.'
  },
  {
    question: '¿Por qué hay límites mensuales?',
    answer: 'Para garantizar la máxima calidad y atención personalizada, limitamos el número de clientes que atendemos cada mes. Esto nos permite dedicar el tiempo necesario a cada persona y mantener nuestros altos estándares de servicio.'
  },
  {
    question: '¿Qué pasa si no quedo satisfecho?',
    answer: 'Tu satisfacción es nuestra prioridad. Si no estás contento con el servicio, trabajaremos contigo para hacer las mejoras necesarias. Ofrecemos revisiones ilimitadas dentro del período de soporte de cada plan.'
  },
  {
    question: '¿Puedo cambiar de plan después de comprar?',
    answer: 'Sí, puedes actualizar tu plan pagando la diferencia. Por ejemplo, si compraste el Básico y quieres el Personalizado, solo pagas los 50€ adicionales. No es posible downgrade una vez iniciado el servicio.'
  }
]

export function ServicesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ¿Tienes más preguntas?
          </p>
          <a href="/contacto" className="btn-primary">
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  )
}