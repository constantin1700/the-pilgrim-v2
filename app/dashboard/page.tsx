import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { CountryGrid } from '@/components/dashboard/CountryGrid'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📊 Dashboard Global - Datos en Vivo
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              🌍 Explora y compara oportunidades en 19 países con métricas actualizadas
            </p>
          </div>
          
          <DashboardFilters />
          <CountryGrid />
          <DashboardCharts />
        </div>
      </main>
      <Footer />
    </div>
  )
}