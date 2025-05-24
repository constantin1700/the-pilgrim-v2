'use client'

import { useState } from 'react'
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterState {
  climate: [number, number]
  qualityOfLife: [number, number]
  salary: [number, number]
  salaryRatio: [number, number]
  socialIndex: [number, number]
  bureaucracy: [number, number]
  search: string
  viewMode: 'grid' | 'list'
}

export function DashboardFilters() {
  const [filters, setFilters] = useState<FilterState>({
    climate: [-10, 40],
    qualityOfLife: [0, 100],
    salary: [0, 10000],
    salaryRatio: [0, 2],
    socialIndex: [0, 100],
    bureaucracy: [0, 100],
    search: '',
    viewMode: 'grid'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const filterOptions = [
    { key: 'climate', label: '🌡️ Clima', unit: '°C', range: [-10, 40] },
    { key: 'qualityOfLife', label: '🎆 Calidad de vida', unit: '', range: [0, 100] },
    { key: 'salary', label: '💰 Salario', unit: '€', range: [0, 10000] },
    { key: 'salaryRatio', label: '📊 Ratio salario/gastos', unit: '', range: [0, 2] },
    { key: 'socialIndex', label: '👥 Índice social', unit: '', range: [0, 100] },
    { key: 'bureaucracy', label: '📝 Papeleos', unit: '', range: [0, 100] },
  ]

  return (
    <div className="mb-8 space-y-4">
      {/* Search and view toggle */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="🔍 Buscar países..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10 input-primary w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors flex items-center gap-2",
              showAdvanced 
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            🎯 Filtros
          </button>
          
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setFilters({ ...filters, viewMode: 'grid' })}
              className={cn(
                "px-3 py-2 transition-colors",
                filters.viewMode === 'grid'
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFilters({ ...filters, viewMode: 'list' })}
              className={cn(
                "px-3 py-2 transition-colors",
                filters.viewMode === 'list'
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterOptions.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {filter.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={filter.range[0]}
                  max={filter.range[1]}
                  value={filters[filter.key as keyof FilterState][0]}
                  onChange={(e) => {
                    const newFilters = { ...filters }
                    const key = filter.key as keyof FilterState
                    if (Array.isArray(newFilters[key])) {
                      ;(newFilters[key] as [number, number])[0] = Number(e.target.value)
                    }
                    setFilters(newFilters)
                  }}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                  {filters[filter.key as keyof FilterState][0]}{filter.unit}
                </span>
              </div>
            </div>
          ))}
          
          <div className="col-span-full flex justify-end gap-2">
            <button
              onClick={() => setFilters({
                ...filters,
                climate: [-10, 40],
                qualityOfLife: [0, 100],
                salary: [0, 10000],
                salaryRatio: [0, 2],
                socialIndex: [0, 100],
                bureaucracy: [0, 100],
              })}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              🔄 Restablecer filtros
            </button>
            <button className="btn-primary">
              ✅ Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}