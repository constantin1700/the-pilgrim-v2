'use client'

import { useState, useMemo, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DashboardFiltersAdvanced } from '@/components/dashboard/DashboardFiltersAdvanced'
import { CountryGrid } from '@/components/dashboard/CountryGrid'
import { ComparativeAnalysis } from '@/components/dashboard/ComparativeAnalysis'
import { DashboardFilters } from '@/lib/types'
import { useCountries } from '@/hooks/useCountries'
import { LayoutGrid, TableIcon, ChartBar } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { countries } = useCountries()
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'analysis'>('grid')
  const [filters, setFilters] = useState<DashboardFilters>({})

  // Aplicar filtros a los países
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      // Búsqueda por nombre
      if (filters.search) {
        const search = filters.search.toLowerCase()
        if (!country.name.toLowerCase().includes(search)) return false
      }

      // Filtro por continente
      if (filters.continent && filters.continent !== 'Todos') {
        if (country.continent !== filters.continent) return false
      }

      // Filtro por idioma
      if (filters.language && filters.language !== 'Todos') {
        const lang = filters.language.toLowerCase()
        if (!country.main_language?.toLowerCase().includes(lang)) return false
      }

      // Filtros de rango
      if (filters.temperature) {
        const temp = country.temperature || 0
        if (temp < filters.temperature.min || temp > filters.temperature.max) return false
      }

      if (filters.qualityOfLife) {
        const qol = country.qualityOfLife || 0
        if (qol < filters.qualityOfLife.min || qol > filters.qualityOfLife.max) return false
      }

      if (filters.salary) {
        const salary = country.averageSalary || 0
        if (salary < filters.salary.min || salary > filters.salary.max) return false
      }

      if (filters.salaryRatio) {
        const ratio = country.salaryExpenseRatio || 0
        if (ratio < filters.salaryRatio.min || ratio > filters.salaryRatio.max) return false
      }

      if (filters.internetSpeed) {
        const speed = country.internet_speed_mbps || 0
        if (speed < filters.internetSpeed.min || speed > filters.internetSpeed.max) return false
      }

      if (filters.socialIndex) {
        const social = country.socialIndex || 0
        if (social < filters.socialIndex.min || social > filters.socialIndex.max) return false
      }

      return true
    })
  }, [countries, filters])

  const handleFiltersChange = useCallback((newFilters: DashboardFilters) => {
    setFilters(newFilters)
  }, [])

  // Componente de vista de tabla
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              País
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Salario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Calidad Vida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ratio S/G
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Internet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Idioma
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Temperatura
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCountries.map((country) => (
            <tr key={country.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <a 
                  href={`/explorador/${country.id}`}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {country.name}
                </a>
                <div className="text-xs text-gray-500">{country.continent}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                €{country.averageSalary?.toLocaleString() || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {country.qualityOfLife?.toFixed(1) || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  "text-sm font-medium",
                  (country.salaryExpenseRatio || 0) >= 1.5 ? "text-green-600" :
                  (country.salaryExpenseRatio || 0) >= 1.0 ? "text-yellow-600" : "text-red-600"
                )}>
                  {country.salaryExpenseRatio?.toFixed(2)}x
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {country.internet_speed_mbps?.toFixed(0)} Mbps
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {country.main_language || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {country.temperature?.toFixed(1)}°C
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header con controles de vista */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  📊 Dashboard Global - Datos en Vivo
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-200">
                  🌍 Explora y compara oportunidades en {countries.length} países con métricas actualizadas
                </p>
              </div>
              
              {/* Selector de vista */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-3 py-2 rounded-md flex items-center gap-2 transition-all",
                    viewMode === 'grid'
                      ? "bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="text-sm font-medium">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    "px-3 py-2 rounded-md flex items-center gap-2 transition-all",
                    viewMode === 'table'
                      ? "bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <TableIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Tabla</span>
                </button>
                <button
                  onClick={() => setViewMode('analysis')}
                  className={cn(
                    "px-3 py-2 rounded-md flex items-center gap-2 transition-all",
                    viewMode === 'analysis'
                      ? "bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <ChartBar className="h-4 w-4" />
                  <span className="text-sm font-medium">Análisis</span>
                </button>
              </div>
            </div>
          </div>

          {/* Resultados filtrados */}
          {viewMode !== 'analysis' && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredCountries.length} de {countries.length} países
            </div>
          )}
          
          {/* Contenido según la vista */}
          {viewMode === 'grid' && <CountryGrid />}
          {viewMode === 'table' && (
            <div className="card overflow-hidden">
              <TableView />
            </div>
          )}
          {viewMode === 'analysis' && <ComparativeAnalysis countries={filteredCountries} />}
        </div>
      </main>
      
      {/* Filtros avanzados */}
      <DashboardFiltersAdvanced 
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />
      
      <Footer />
    </div>
  )
}