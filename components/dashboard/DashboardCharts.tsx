'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { countriesData } from '@/lib/data/countries'

export function DashboardCharts() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  // Prepare data for scatter plot (Salary vs Cost of Living)
  const scatterData = countriesData.map(country => ({
    name: country.name,
    x: country.averageSalary,
    y: Math.round(country.averageSalary / country.salaryExpenseRatio),
    socialIndex: country.socialIndex
  }))

  // Prepare data for social index heat map
  const socialData = countriesData
    .sort((a, b) => b.socialIndex - a.socialIndex)
    .slice(0, 10)
    .map(country => ({
      name: country.name,
      value: country.socialIndex
    }))

  // Colors for heat map
  const getColor = (value: number) => {
    if (value >= 90) return '#10b981'
    if (value >= 80) return '#3b82f6'
    if (value >= 70) return '#f59e0b'
    if (value >= 60) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Análisis Comparativo
      </h2>

      {/* Scatter Plot: Salary vs Cost of Living */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Salario vs Coste de Vida
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="x"
                name="Salario"
                unit="€"
                stroke="#6b7280"
                label={{ value: 'Salario Promedio (€)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                dataKey="y"
                name="Coste"
                unit="€"
                stroke="#6b7280"
                label={{ value: 'Coste de Vida (€)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                        <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Salario: €{data.x}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Coste: €{data.y}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter
                name="Países"
                data={scatterData}
                fill="#3b82f6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Social Index Heat Map */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 10 Países por Índice Social
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={socialData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                        <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Índice Social: {data.value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {socialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country Comparison Selector */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Comparador de Países
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Selecciona hasta 4 países para comparar sus métricas
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {countriesData.map(country => (
            <label
              key={country.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCountries.includes(country.id)}
                onChange={(e) => {
                  if (e.target.checked && selectedCountries.length < 4) {
                    setSelectedCountries([...selectedCountries, country.id])
                  } else if (!e.target.checked) {
                    setSelectedCountries(selectedCountries.filter(id => id !== country.id))
                  }
                }}
                disabled={!selectedCountries.includes(country.id) && selectedCountries.length >= 4}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {country.name}
              </span>
            </label>
          ))}
        </div>
        
        {selectedCountries.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedCountries.map(countryId => {
              const country = countriesData.find(c => c.id === countryId)!
              return (
                <div key={countryId} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {country.name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Salario:</span>
                      <span className="font-medium text-gray-900 dark:text-white">€{country.averageSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Calidad:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{country.qualityOfLife}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Social:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{country.socialIndex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Clima:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{country.temperature}°C</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}