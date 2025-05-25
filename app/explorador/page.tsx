import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CountryExplorerGrid } from '@/components/explorador/CountryExplorerGrid'

export default function ExploradorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🌍 Explorador Global
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              🗺️ Descubre guías completas de los 19 países disponibles en nuestra plataforma
            </p>
          </div>
          
          <CountryExplorerGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}