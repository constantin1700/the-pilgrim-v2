import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ServicePlans } from '@/components/services/ServicePlans'
import { ServicesFAQ } from '@/components/services/ServicesFAQ'

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main>
        <div className="bg-gradient-to-br from-blue-600 to-teal-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Únete al Soporte que necesitas
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Asegura tu lugar antes de que se agote. Apoyo profesional para tu aventura internacional.
            </p>
          </div>
        </div>
        
        <ServicePlans />
        <ServicesFAQ />
      </main>
      <Footer />
    </div>
  )
}