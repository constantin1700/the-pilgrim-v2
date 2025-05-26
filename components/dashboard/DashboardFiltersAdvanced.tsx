'use client'

import { useState, useEffect } from 'react'
import { X, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { DashboardFilters } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  onFiltersChange: (filters: DashboardFilters) => void
  initialFilters?: DashboardFilters
}

const continents = ['Todos', 'Europa', 'América del Norte', 'Asia', 'Oceanía', 'América del Sur', 'África']
const languages = ['Todos', 'Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Italiano', 'Holandés']

export function DashboardFiltersAdvanced({ onFiltersChange, initialFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  
  const [filters, setFilters] = useState<DashboardFilters>({
    search: initialFilters?.search || '',
    continent: initialFilters?.continent || 'Todos',
    language: initialFilters?.language || 'Todos',
    temperature: initialFilters?.temperature || { min: -10, max: 40 },
    qualityOfLife: initialFilters?.qualityOfLife || { min: 100, max: 200 },
    salary: initialFilters?.salary || { min: 500, max: 7000 },
    salaryRatio: initialFilters?.salaryRatio || { min: 0.5, max: 2.0 },
    internetSpeed: initialFilters?.internetSpeed || { min: 0, max: 300 },
    socialIndex: initialFilters?.socialIndex || { min: 60, max: 100 },
    bureaucracy: initialFilters?.bureaucracy || { min: 0, max: 100 }
  })

  // Guardar filtros en localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('dashboardFilters')
    if (savedFilters && !initialFilters) {
      const parsed = JSON.parse(savedFilters)
      setFilters(parsed)
      onFiltersChange(parsed)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dashboardFilters', JSON.stringify(filters))
    
    // Contar filtros activos
    let count = 0
    if (filters.search) count++
    if (filters.continent && filters.continent !== 'Todos') count++
    if (filters.language && filters.language !== 'Todos') count++
    if (filters.temperature?.min !== -10 || filters.temperature?.max !== 40) count++
    if (filters.qualityOfLife?.min !== 100 || filters.qualityOfLife?.max !== 200) count++
    if (filters.salary?.min !== 500 || filters.salary?.max !== 7000) count++
    if (filters.salaryRatio?.min !== 0.5 || filters.salaryRatio?.max !== 2.0) count++
    if (filters.internetSpeed?.min !== 0 || filters.internetSpeed?.max !== 300) count++
    if (filters.socialIndex?.min !== 60 || filters.socialIndex?.max !== 100) count++
    
    setActiveFiltersCount(count)
  }, [filters])

  const handleFilterChange = (newFilters: Partial<DashboardFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const resetFilters = () => {
    const defaultFilters: DashboardFilters = {
      search: '',
      continent: 'Todos',
      language: 'Todos',
      temperature: { min: -10, max: 40 },
      qualityOfLife: { min: 100, max: 200 },
      salary: { min: 500, max: 7000 },
      salaryRatio: { min: 0.5, max: 2.0 },
      internetSpeed: { min: 0, max: 300 },
      socialIndex: { min: 60, max: 100 },
      bureaucracy: { min: 0, max: 100 }
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
    localStorage.removeItem('dashboardFilters')
  }

  const RangeSlider = ({ 
    label, 
    min, 
    max, 
    step = 1, 
    value, 
    onChange,
    format = (v: number) => v.toString(),
    unit = ''
  }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {format(value[0])}{unit} - {format(value[1])}{unit}
        </span>
      </div>
      <div className="relative pt-1">
        <div className="flex gap-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onChange([parseFloat(e.target.value), value[1]])}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={(e) => onChange([value[0], parseFloat(e.target.value)])}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Botón flotante de filtros */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all",
          "bg-blue-600 hover:bg-blue-700 text-white",
          activeFiltersCount > 0 && "ring-2 ring-blue-400 ring-offset-2"
        )}
      >
        <Filter className="h-5 w-5" />
        <span className="font-medium">Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Panel de filtros */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtros avanzados</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                title="Restablecer filtros"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar país
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Ej: Alemania, Francia..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Continente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Continente
              </label>
              <select
                value={filters.continent || 'Todos'}
                onChange={(e) => handleFilterChange({ continent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
              >
                {continents.map(cont => (
                  <option key={cont} value={cont}>{cont}</option>
                ))}
              </select>
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idioma principal
              </label>
              <select
                value={filters.language || 'Todos'}
                onChange={(e) => handleFilterChange({ language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Filtros avanzados */}
            <div>
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center justify-between w-full py-2 text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="font-medium">Filtros avanzados</span>
                {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {isAdvancedOpen && (
                <div className="mt-4 space-y-4">
                  <RangeSlider
                    label="Temperatura media"
                    min={-10}
                    max={40}
                    value={[filters.temperature?.min || -10, filters.temperature?.max || 40]}
                    onChange={(v: number[]) => handleFilterChange({ temperature: { min: v[0], max: v[1] } })}
                    unit="°C"
                  />

                  <RangeSlider
                    label="Calidad de vida"
                    min={100}
                    max={200}
                    value={[filters.qualityOfLife?.min || 100, filters.qualityOfLife?.max || 200]}
                    onChange={(v: number[]) => handleFilterChange({ qualityOfLife: { min: v[0], max: v[1] } })}
                  />

                  <RangeSlider
                    label="Salario promedio"
                    min={500}
                    max={7000}
                    step={100}
                    value={[filters.salary?.min || 500, filters.salary?.max || 7000]}
                    onChange={(v: number[]) => handleFilterChange({ salary: { min: v[0], max: v[1] } })}
                    format={(v: number) => `€${v}`}
                  />

                  <RangeSlider
                    label="Ratio salario/gastos"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={[filters.salaryRatio?.min || 0.5, filters.salaryRatio?.max || 2.0]}
                    onChange={(v: number[]) => handleFilterChange({ salaryRatio: { min: v[0], max: v[1] } })}
                    format={(v: number) => v.toFixed(1)}
                    unit="x"
                  />

                  <RangeSlider
                    label="Velocidad de internet"
                    min={0}
                    max={300}
                    step={10}
                    value={[filters.internetSpeed?.min || 0, filters.internetSpeed?.max || 300]}
                    onChange={(v: number[]) => handleFilterChange({ internetSpeed: { min: v[0], max: v[1] } })}
                    unit=" Mbps"
                  />

                  <RangeSlider
                    label="Índice social"
                    min={60}
                    max={100}
                    value={[filters.socialIndex?.min || 60, filters.socialIndex?.max || 100]}
                    onChange={(v: number[]) => handleFilterChange({ socialIndex: { min: v[0], max: v[1] } })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full btn-primary"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}