'use client'

import { useState, useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  LabelList
} from 'recharts'
import { Country } from '@/lib/types'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Award, AlertCircle, Zap, Globe2 } from 'lucide-react'

interface Props {
  countries: Country[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export function ComparativeAnalysis({ countries }: Props) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [activeChart, setActiveChart] = useState<'radar' | 'scatter' | 'ranking' | 'comparison'>('ranking')

  // Top 10 países por diferentes métricas
  const topByQualityOfLife = useMemo(() => 
    [...countries]
      .sort((a, b) => (b.qualityOfLife || 0) - (a.qualityOfLife || 0))
      .slice(0, 10),
    [countries]
  )

  const topBySalaryRatio = useMemo(() => 
    [...countries]
      .sort((a, b) => (b.salaryExpenseRatio || 0) - (a.salaryExpenseRatio || 0))
      .slice(0, 10),
    [countries]
  )

  const topByInternetSpeed = useMemo(() => 
    [...countries]
      .sort((a, b) => (b.internet_speed_mbps || 0) - (a.internet_speed_mbps || 0))
      .slice(0, 10),
    [countries]
  )

  // Datos para el gráfico de radar
  const radarData = useMemo(() => {
    if (selectedCountries.length === 0) return []
    
    const metrics = [
      { key: 'qualityOfLife', label: 'Calidad de Vida', max: 200 },
      { key: 'salaryExpenseRatio', label: 'Ratio Salario/Gasto', max: 2, multiplier: 100 },
      { key: 'internet_speed_mbps', label: 'Internet', max: 300, multiplier: 0.33 },
      { key: 'socialIndex', label: 'Índice Social', max: 100 },
      { key: 'bureaucracyEase', label: 'Facilidad Burocrática', max: 100 },
      { key: 'temperature', label: 'Clima', max: 30, multiplier: 3.33 }
    ]

    return metrics.map(metric => {
      const dataPoint: any = { metric: metric.label }
      selectedCountries.forEach(countryId => {
        const country = countries.find(c => c.id === countryId)
        if (country) {
          const value = country[metric.key as keyof Country] as number || 0
          const normalizedValue = (value * (metric.multiplier || 1)) / metric.max * 100
          dataPoint[country.name] = Math.min(100, Math.max(0, normalizedValue))
        }
      })
      return dataPoint
    })
  }, [selectedCountries, countries])

  // Datos para el scatter plot
  const scatterData = useMemo(() => 
    countries.map(country => ({
      name: country.name,
      x: country.averageSalary || 0,
      y: country.qualityOfLife || 0,
      size: country.population ? Math.sqrt(country.population / 1000000) * 2 : 10,
      continent: country.continent,
      internetSpeed: country.internet_speed_mbps || 0
    })),
    [countries]
  )

  const getContinentColor = (continent: string) => {
    const colors: Record<string, string> = {
      'Europa': '#3b82f6',
      'América del Norte': '#10b981',
      'Asia': '#f59e0b',
      'Oceanía': '#ef4444',
      'América del Sur': '#8b5cf6',
      'África': '#ec4899'
    }
    return colors[continent] || '#6b7280'
  }

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    trend, 
    icon: Icon 
  }: { 
    title: string
    value: string | number
    subtitle: string
    trend?: 'up' | 'down'
    icon: any
  }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        {trend && (
          trend === 'up' 
            ? <TrendingUp className="h-4 w-4 text-green-500" />
            : <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</div>
      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subtitle}</div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Análisis Comparativo Global
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Award}
            title="Mejor calidad de vida"
            value={topByQualityOfLife[0]?.name || 'N/A'}
            subtitle={`Índice: ${topByQualityOfLife[0]?.qualityOfLife?.toFixed(1) || 0}`}
          />
          <MetricCard
            icon={TrendingUp}
            title="Mejor ratio salario/gasto"
            value={topBySalaryRatio[0]?.name || 'N/A'}
            subtitle={`Ratio: ${topBySalaryRatio[0]?.salaryExpenseRatio?.toFixed(2) || 0}x`}
          />
          <MetricCard
            icon={Zap}
            title="Internet más rápido"
            value={topByInternetSpeed[0]?.name || 'N/A'}
            subtitle={`${topByInternetSpeed[0]?.internet_speed_mbps?.toFixed(0) || 0} Mbps`}
          />
          <MetricCard
            icon={Globe2}
            title="Total países analizados"
            value={countries.length}
            subtitle="Con datos completos"
          />
        </div>
      </div>

      {/* Selector de vista */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveChart('ranking')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            activeChart === 'ranking'
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          )}
        >
          📊 Rankings
        </button>
        <button
          onClick={() => setActiveChart('scatter')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            activeChart === 'scatter'
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          )}
        >
          📈 Salario vs Calidad
        </button>
        <button
          onClick={() => setActiveChart('radar')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            activeChart === 'radar'
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          )}
        >
          🎯 Comparación Radar
        </button>
        <button
          onClick={() => setActiveChart('comparison')}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            activeChart === 'comparison'
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          )}
        >
          📋 Tabla Comparativa
        </button>
      </div>

      {/* Rankings */}
      {activeChart === 'ranking' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top por calidad de vida */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏆 Top 10 - Calidad de Vida
            </h3>
            <div className="space-y-3">
              {topByQualityOfLife.map((country, index) => (
                <div key={country.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-lg font-bold w-8",
                      index < 3 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                    )}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {country.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {country.qualityOfLife?.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top por ratio salario/gasto */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💰 Top 10 - Ratio Salario/Gasto
            </h3>
            <div className="space-y-3">
              {topBySalaryRatio.map((country, index) => (
                <div key={country.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-lg font-bold w-8",
                      index < 3 ? "text-green-600 dark:text-green-400" : "text-gray-500"
                    )}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {country.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {country.salaryExpenseRatio?.toFixed(2)}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top por velocidad de internet */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🌐 Top 10 - Velocidad Internet
            </h3>
            <div className="space-y-3">
              {topByInternetSpeed.map((country, index) => (
                <div key={country.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-lg font-bold w-8",
                      index < 3 ? "text-purple-600 dark:text-purple-400" : "text-gray-500"
                    )}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {country.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {country.internet_speed_mbps?.toFixed(0)} Mbps
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scatter Plot */}
      {activeChart === 'scatter' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Salario Promedio vs Calidad de Vida
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 50, left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="x"
                  name="Salario"
                  unit="€"
                  stroke="#6b7280"
                  label={{ value: 'Salario Promedio (€)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis
                  dataKey="y"
                  name="Calidad de Vida"
                  stroke="#6b7280"
                  label={{ value: 'Calidad de Vida', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Salario: €{data.x.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Calidad de vida: {data.y.toFixed(1)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Internet: {data.internetSpeed.toFixed(0)} Mbps
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter name="Países" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getContinentColor(entry.continent)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Leyenda de continentes */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {['Europa', 'América del Norte', 'Asia', 'Oceanía'].map(continent => (
              <div key={continent} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getContinentColor(continent) }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{continent}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Radar Chart */}
      {activeChart === 'radar' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comparación Multidimensional
          </h3>
          
          {/* Selector de países */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Selecciona hasta 4 países para comparar
            </p>
            <div className="flex flex-wrap gap-2">
              {countries.slice(0, 12).map(country => (
                <button
                  key={country.id}
                  onClick={() => {
                    if (selectedCountries.includes(country.id)) {
                      setSelectedCountries(selectedCountries.filter(id => id !== country.id))
                    } else if (selectedCountries.length < 4) {
                      setSelectedCountries([...selectedCountries, country.id])
                    }
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    selectedCountries.includes(country.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  )}
                  disabled={!selectedCountries.includes(country.id) && selectedCountries.length >= 4}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {selectedCountries.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                  {selectedCountries.map((countryId, index) => {
                    const country = countries.find(c => c.id === countryId)
                    return country ? (
                      <Radar
                        key={countryId}
                        name={country.name}
                        dataKey={country.name}
                        stroke={COLORS[index]}
                        fill={COLORS[index]}
                        fillOpacity={0.3}
                      />
                    ) : null
                  })}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Selecciona países para ver la comparación
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tabla comparativa */}
      {activeChart === 'comparison' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    País
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Calidad Vida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Salario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ratio S/G
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Internet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Temperatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Índice Social
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                {countries.slice(0, 10).map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {country.continent}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {country.qualityOfLife?.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        €{country.averageSalary?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={cn(
                        "text-sm font-medium",
                        (country.salaryExpenseRatio || 0) >= 1.5 ? "text-green-600" :
                        (country.salaryExpenseRatio || 0) >= 1.0 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {country.salaryExpenseRatio?.toFixed(2)}x
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {country.internet_speed_mbps?.toFixed(0)} Mbps
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {country.temperature?.toFixed(1)}°C
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {country.socialIndex?.toFixed(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}