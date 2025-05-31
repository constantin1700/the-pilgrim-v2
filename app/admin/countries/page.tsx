'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit, Eye, ToggleLeft, ToggleRight, Plus } from 'lucide-react'
import { getCountryEmoji } from '@/lib/utils'

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/admin/countries')
      const data = await response.json()
      setCountries(data)
    } catch (error) {
      console.error('Error fetching countries:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCountryStatus = async (countryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: countryId,
          active: !currentStatus
        })
      })
      
      if (response.ok) {
        setCountries(prev => prev.map(country => 
          country.id === countryId ? { ...country, active: !currentStatus } : country
        ))
      }
    } catch (error) {
      console.error('Error updating country status:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Países
          </h2>
          <p className="text-gray-600 dark:text-gray-200">
            Administra la información y contenido de cada país
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Añadir país
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Métricas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
              {countries.map((country: any) => (
              <tr key={country.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getCountryEmoji(country.country_code || '')}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.name_es || country.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {country.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    <div>Salario: €{country.average_salary || 'N/A'}</div>
                    <div>Calidad: {country.quality_of_life || 'N/A'}/100</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {country.likes || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleCountryStatus(country.id, country.active)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      country.active
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {country.active ? (
                      <>
                        <ToggleRight className="h-4 w-4" />
                        Activo
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4" />
                        Inactivo
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/countries/${country.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      title="Editar país"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/explorador/${country.id}`}
                      target="_blank"
                      className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-200"
                      title="Ver en explorador"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}