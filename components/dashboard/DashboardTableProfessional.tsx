'use client'

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowUpDown, ChevronDown, ChevronUp, Heart, ExternalLink, 
  Filter, Download, TrendingUp, TrendingDown, Minus, 
  ChevronLeft, ChevronRight, Search, Eye, MoreHorizontal
} from 'lucide-react'
import { Country, DashboardFilters } from '@/lib/types'
import { cn, formatCurrency } from '@/lib/utils'
import { useLikes } from '@/hooks/useLikes'

type SortField = 'name' | 'averageSalary' | 'qualityOfLife' | 'salaryExpenseRatio' | 
                  'internetSpeed' | 'temperature' | 'socialIndex' | 'likes'
type SortDirection = 'asc' | 'desc'

interface Props {
  countries: Country[]
  filters: DashboardFilters
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function DashboardTableProfessional({ countries, filters }: Props) {
  const { toggleLike, isLiked } = useLikes()
  const [sortField, setSortField] = useState<SortField>('qualityOfLife')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [searchTerm, setSearchTerm] = useState('')

  // Aplicar filtros y búsqueda
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      // Búsqueda por término
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesSearch = 
          country.name.toLowerCase().includes(search) ||
          country.continent.toLowerCase().includes(search) ||
          country.capital?.toLowerCase().includes(search) ||
          country.main_language?.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Aplicar filtros del dashboard
      if (filters.search) {
        const search = filters.search.toLowerCase()
        if (!country.name.toLowerCase().includes(search)) return false
      }

      if (filters.continent && filters.continent !== 'Todos') {
        if (country.continent !== filters.continent) return false
      }

      if (filters.language && filters.language !== 'Todos') {
        const lang = filters.language.toLowerCase()
        if (!country.main_language?.toLowerCase().includes(lang)) return false
      }

      // Filtros de rango numéricos
      const checkRange = (value: number | undefined, range: { min: number; max: number } | undefined) => {
        if (!range || value === undefined) return true
        return value >= range.min && value <= range.max
      }

      if (!checkRange(country.temperature, filters.temperature)) return false
      if (!checkRange(country.qualityOfLife || country.quality_of_life, filters.qualityOfLife)) return false
      if (!checkRange(country.averageSalary || country.average_salary, filters.salary)) return false
      if (!checkRange(country.salaryExpenseRatio || country.salary_expense_ratio, filters.salaryRatio)) return false
      if (!checkRange(country.internet_speed_mbps, filters.internetSpeed)) return false
      if (!checkRange(country.socialIndex || country.social_index, filters.socialIndex)) return false

      return true
    })
  }, [countries, filters, searchTerm])

  // Ordenar países
  const sortedCountries = useMemo(() => {
    const sorted = [...filteredCountries].sort((a, b) => {
      let aValue, bValue

      switch (sortField) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'averageSalary':
          aValue = a.averageSalary || a.average_salary || 0
          bValue = b.averageSalary || b.average_salary || 0
          break
        case 'qualityOfLife':
          aValue = a.qualityOfLife || a.quality_of_life || 0
          bValue = b.qualityOfLife || b.quality_of_life || 0
          break
        case 'salaryExpenseRatio':
          aValue = a.salaryExpenseRatio || a.salary_expense_ratio || 0
          bValue = b.salaryExpenseRatio || b.salary_expense_ratio || 0
          break
        case 'internetSpeed':
          aValue = a.internet_speed_mbps || 0
          bValue = b.internet_speed_mbps || 0
          break
        case 'temperature':
          aValue = a.temperature || 0
          bValue = b.temperature || 0
          break
        case 'socialIndex':
          aValue = a.socialIndex || a.social_index || 0
          bValue = b.socialIndex || b.social_index || 0
          break
        case 'likes':
          aValue = (a.likesDashboard || a.likes_dashboard || 0) + (a.likesExplorer || a.likes_explorer || 0)
          bValue = (b.likesDashboard || b.likes_dashboard || 0) + (b.likesExplorer || b.likes_explorer || 0)
          break
        default:
          return 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    return sorted
  }, [filteredCountries, sortField, sortDirection])

  // Paginación
  const totalPages = Math.ceil(sortedCountries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCountries = sortedCountries.slice(startIndex, endIndex)

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }, [sortField, sortDirection])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }, [])

  const toggleRow = useCallback((countryId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(countryId)) {
      newExpanded.delete(countryId)
    } else {
      newExpanded.add(countryId)
    }
    setExpandedRows(newExpanded)
  }, [expandedRows])

  const toggleSelection = useCallback((countryId: string) => {
    const newSelected = new Set(selectedCountries)
    if (newSelected.has(countryId)) {
      newSelected.delete(countryId)
    } else {
      newSelected.add(countryId)
    }
    setSelectedCountries(newSelected)
  }, [selectedCountries])

  const selectAll = useCallback(() => {
    if (selectedCountries.size === paginatedCountries.length && paginatedCountries.length > 0) {
      setSelectedCountries(new Set())
    } else {
      setSelectedCountries(new Set(paginatedCountries.map(c => c.id)))
    }
  }, [selectedCountries.size, paginatedCountries])

  const exportToCSV = useCallback(() => {
    const headers = ['País', 'Continente', 'Capital', 'Salario Medio', 'Calidad de Vida', 'Ratio S/G', 'Internet', 'Temperatura', 'Índice Social']
    const rows = (selectedCountries.size > 0 ? 
      sortedCountries.filter(c => selectedCountries.has(c.id)) : 
      sortedCountries
    ).map(country => [
      country.name,
      country.continent,
      country.capital || 'N/A',
      country.averageSalary || country.average_salary || 'N/A',
      country.qualityOfLife || country.quality_of_life || 'N/A',
      country.salaryExpenseRatio || country.salary_expense_ratio || 'N/A',
      country.internet_speed_mbps || 'N/A',
      country.temperature || 'N/A',
      country.socialIndex || country.social_index || 'N/A'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `the-pilgrim-countries-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [selectedCountries, sortedCountries])

  const getQualityBadge = (value: number) => {
    if (value >= 180) return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Excelente' }
    if (value >= 160) return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Muy buena' }
    if (value >= 140) return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', label: 'Buena' }
    return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', label: 'Media' }
  }

  const getRatioBadge = (value: number) => {
    if (value >= 1.5) return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: TrendingUp }
    if (value >= 1.0) return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Minus }
    return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: TrendingDown }
  }

  const SortableHeader = ({ field, children, className = "" }: { field: SortField, children: React.ReactNode, className?: string }) => (
    <th 
      className={cn(
        "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2 group">
        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {children}
        </span>
        <ArrowUpDown className={cn(
          "h-3 w-3 transition-all duration-200",
          sortField === field ? "text-blue-600 dark:text-blue-400 scale-110" : "text-gray-400 group-hover:text-blue-500"
        )} />
        {sortField === field && (
          <div className={cn(
            "w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400",
            sortDirection === 'desc' ? 'animate-pulse' : ''
          )} />
        )}
      </div>
    </th>
  )

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header con controles */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-b border-gray-200 dark:border-slate-600">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Mostrando <span className="font-bold text-blue-600 dark:text-blue-400">{startIndex + 1}-{Math.min(endIndex, sortedCountries.length)}</span> de <span className="font-bold">{sortedCountries.length}</span> países
              </span>
            </div>
            
            {selectedCountries.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedCountries.size} seleccionados
                </span>
                <button
                  onClick={() => setSelectedCountries(new Set())}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Búsqueda y controles */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar países..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  checked={selectedCountries.size === paginatedCountries.length && paginatedCountries.length > 0}
                  onChange={selectAll}
                />
              </th>
              <SortableHeader field="name" className="min-w-[200px]">País</SortableHeader>
              <SortableHeader field="averageSalary" className="min-w-[120px]">Salario</SortableHeader>
              <SortableHeader field="qualityOfLife" className="min-w-[140px]">Calidad de Vida</SortableHeader>
              <SortableHeader field="salaryExpenseRatio" className="min-w-[100px]">Ratio S/G</SortableHeader>
              <SortableHeader field="internetSpeed" className="min-w-[100px]">Internet</SortableHeader>
              <SortableHeader field="temperature" className="min-w-[100px]">Clima</SortableHeader>
              <SortableHeader field="socialIndex" className="min-w-[120px]">Índice Social</SortableHeader>
              <SortableHeader field="likes" className="min-w-[100px]">Popularidad</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedCountries.map((country, index) => {
              const qualityBadge = getQualityBadge(country.qualityOfLife || country.quality_of_life || 0)
              const ratioBadge = getRatioBadge(country.salaryExpenseRatio || country.salary_expense_ratio || 0)
              const RatioIcon = ratioBadge.icon
              const isExpanded = expandedRows.has(country.id)
              const totalLikes = (country.likesDashboard || country.likes_dashboard || 0) + 
                                (country.likesExplorer || country.likes_explorer || 0)
              const isSelected = selectedCountries.has(country.id)
              const rowIndex = startIndex + index + 1

              return (
                <React.Fragment key={country.id}>
                  <tr className={cn(
                    "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200",
                    isSelected && "bg-blue-50 dark:bg-blue-900/20",
                    isExpanded && "bg-gray-50 dark:bg-slate-800/30"
                  )}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => toggleSelection(country.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 w-6">#{rowIndex}</span>
                        <button
                          onClick={() => toggleRow(country.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl" title={`Bandera de ${country.name}`}>
                              {country.code === 'DE' && '🇩🇪'}
                              {country.code === 'AU' && '🇦🇺'}
                              {country.code === 'CA' && '🇨🇦'}
                              {country.code === 'CH' && '🇨🇭'}
                              {country.code === 'NL' && '🇳🇱'}
                              {country.code === 'SG' && '🇸🇬'}
                              {country.code === 'GB' && '🇬🇧'}
                              {country.code === 'SE' && '🇸🇪'}
                              {country.code === 'NO' && '🇳🇴'}
                              {country.code === 'DK' && '🇩🇰'}
                              {country.code === 'NZ' && '🇳🇿'}
                              {country.code === 'FI' && '🇫🇮'}
                              {country.code === 'AT' && '🇦🇹'}
                              {country.code === 'IE' && '🇮🇪'}
                              {country.code === 'BE' && '🇧🇪'}
                              {country.code === 'FR' && '🇫🇷'}
                              {country.code === 'IT' && '🇮🇹'}
                              {country.code === 'US' && '🇺🇸'}
                              {country.code === 'JP' && '🇯🇵'}
                            </span>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {country.name}
                                {country.featured && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    ⭐ Destacado
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {country.continent} • {country.capital}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(country.averageSalary || country.average_salary || 0)}€
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        neto/mes
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {(country.qualityOfLife || country.quality_of_life || 0).toFixed(1)}
                        </div>
                        <span className={cn(
                          "inline-flex px-2 py-0.5 text-xs font-medium rounded-full",
                          qualityBadge.color
                        )}>
                          {qualityBadge.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold rounded-lg",
                        ratioBadge.color
                      )}>
                        <RatioIcon className="h-3 w-3" />
                        {(country.salaryExpenseRatio || country.salary_expense_ratio || 0).toFixed(2)}x
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {(country.internet_speed_mbps || 0).toFixed(0)} Mbps
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (country.internet_speed_mbps || 0) / 3)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {(country.temperature || 0).toFixed(1)}°C
                        </div>
                        <div className="text-lg">
                          {country.temperature > 20 ? '☀️' : 
                           country.temperature > 10 ? '⛅' : '❄️'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {(country.socialIndex || country.social_index || 0).toFixed(1)}/100
                        </div>
                        <div className="text-lg">
                          {(country.socialIndex || country.social_index || 0) >= 90 ? '😄' :
                           (country.socialIndex || country.social_index || 0) >= 80 ? '😊' :
                           (country.socialIndex || country.social_index || 0) >= 70 ? '🙂' : '😐'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(country.id, 'country_dashboard')
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 transform hover:scale-105",
                          isLiked(country.id)
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        <Heart className={cn(
                          "h-4 w-4 transition-all duration-200",
                          isLiked(country.id) && "fill-current scale-110"
                        )} />
                        <span className="text-sm font-medium">{totalLikes}</span>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/explorador/${country.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                        >
                          <Eye className="h-3 w-3" />
                          Ver
                        </Link>
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                          title="Más opciones"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Fila expandida */}
                  {isExpanded && (
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-700/50">
                      <td colSpan={10} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              Información General
                            </h4>
                            <dl className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Idioma principal:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">{country.main_language || 'N/A'}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Moneda:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">{country.currency || 'N/A'}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Población:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                  {country.population ? (country.population / 1000000).toFixed(1) + 'M hab.' : 'N/A'}
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">PIB per cápita:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                  {country.gdp_per_capita ? `$${country.gdp_per_capita.toLocaleString()}` : 'N/A'}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Métricas Laborales
                            </h4>
                            <dl className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Balance vida-trabajo:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                  {country.work_life_balance_index || 'N/A'}/100
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Facilidad burocrática:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                  {country.bureaucracy_ease || country.bureaucracyEase || 'N/A'}/100
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Inglés (proficiencia):</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                  {country.english_proficiency_score || 'N/A'}/100
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Sanidad:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                  {country.healthcare_quality_index || 'N/A'}/100
                                </dd>
                              </div>
                            </dl>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              Características Especiales
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {country.digital_nomad_visa && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                  💻 Visa nómada digital
                                </span>
                              )}
                              {country.eu_citizenship_pathway && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  🇪🇺 Ciudadanía UE
                                </span>
                              )}
                              {country.featured && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                  ⭐ Destacado
                                </span>
                              )}
                              {(country.healthcare_quality_index || 0) >= 85 && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  🏥 Sanidad excelente
                                </span>
                              )}
                              {(country.internet_speed_mbps || 0) >= 200 && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                  🚀 Internet súper rápido
                                </span>
                              )}
                            </div>
                            
                            <div className="pt-3">
                              <Link
                                href={`/explorador/${country.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Explorar a fondo
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">por página</span>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-1.5 text-sm text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"
                        )}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {paginatedCountries.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron países
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Intenta ajustar los filtros o la búsqueda para encontrar lo que buscas.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setCurrentPage(1)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  )
}