import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { BlogFilters } from '@/components/blog/BlogFilters'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📝 Blog de The Pilgrim
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              🌐 Experiencias, consejos y actualizaciones directas sobre oportunidades internacionales
            </p>
          </div>
          
          <BlogFilters />
          <BlogGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}