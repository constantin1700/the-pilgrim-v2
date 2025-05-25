'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import { countriesData } from '@/lib/data/countries'
import { getCountryEmoji } from '@/lib/utils'

interface Props {
  params: {
    countryId: string
  }
}

export default function AdminCountryEditPage({ params }: Props) {
  const router = useRouter()
  const country = countriesData.find(c => c.id === params.countryId)
  
  const [formData, setFormData] = useState({
    temperature: 0,
    qualityOfLife: 0,
    averageSalary: 0,
    salaryExpenseRatio: 0,
    socialIndex: 0,
    bureaucracyEase: 0,
  })

  const [sections, setSections] = useState({
    generalInfo: '',
    opportunities: '',
    costOfLiving: '',
    usefulData: ''
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (country) {
      setFormData({
        temperature: country.temperature || country.temperature || 0,
        qualityOfLife: country.quality_of_life || country.qualityOfLife || 0,
        averageSalary: country.average_salary || country.averageSalary || 0,
        salaryExpenseRatio: country.salary_expense_ratio || country.salaryExpenseRatio || 0,
        socialIndex: country.social_index || country.socialIndex || 0,
        bureaucracyEase: country.bureaucracy_ease || country.bureaucracyEase || 0,
      })
    }
  }, [country])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert('Cambios guardados correctamente')
    }, 1000)
  }

  if (!country) {
    return <div>País no encontrado</div>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">{getCountryEmoji(country.code || country.countryCode || '')}</span>
            Editar {country.name}
          </h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Métricas del Dashboard
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Temperatura media anual (°C)
              </label>
              <input
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                className="input-primary"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Calidad de vida (0-100)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.qualityOfLife}
                  onChange={(e) => setFormData({ ...formData, qualityOfLife: Number(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={formData.qualityOfLife}
                  onChange={(e) => setFormData({ ...formData, qualityOfLife: Number(e.target.value) })}
                  className="w-20 input-primary"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Salario promedio mensual (€)
              </label>
              <input
                type="number"
                value={formData.averageSalary}
                onChange={(e) => setFormData({ ...formData, averageSalary: Number(e.target.value) })}
                className="input-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Ratio salario/gastos
              </label>
              <input
                type="number"
                value={formData.salaryExpenseRatio}
                onChange={(e) => setFormData({ ...formData, salaryExpenseRatio: Number(e.target.value) })}
                className="input-primary"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Índice social (0-100)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.socialIndex}
                  onChange={(e) => setFormData({ ...formData, socialIndex: Number(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={formData.socialIndex}
                  onChange={(e) => setFormData({ ...formData, socialIndex: Number(e.target.value) })}
                  className="w-20 input-primary"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Facilidad burocrática (0-100)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.bureaucracyEase}
                  onChange={(e) => setFormData({ ...formData, bureaucracyEase: Number(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={formData.bureaucracyEase}
                  onChange={(e) => setFormData({ ...formData, bureaucracyEase: Number(e.target.value) })}
                  className="w-20 input-primary"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Management */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Gestión de Imágenes
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Imagen principal
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-200">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <button className="mt-2 text-blue-600 dark:text-blue-400 hover:underline">
                  Seleccionar archivo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Galería de imágenes
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mt-6 space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Contenido de Guías
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Información General y Cultura
              </label>
              <textarea
                rows={6}
                value={sections.generalInfo}
                onChange={(e) => setSections({ ...sections, generalInfo: e.target.value })}
                className="input-primary"
                placeholder="Describe la cultura, costumbres, idiomas y ciudades principales..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Oportunidades que Ofrece
              </label>
              <textarea
                rows={6}
                value={sections.opportunities}
                onChange={(e) => setSections({ ...sections, opportunities: e.target.value })}
                className="input-primary"
                placeholder="Sectores demandados, trabajos de temporada, requisitos de visa..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Coste y Calidad de Vida
              </label>
              <textarea
                rows={6}
                value={sections.costOfLiving}
                onChange={(e) => setSections({ ...sections, costOfLiving: e.target.value })}
                className="input-primary"
                placeholder="Desglose de gastos, salarios por sector, comparativa con España..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Consejos y Datos Útiles
              </label>
              <textarea
                rows={6}
                value={sections.usefulData}
                onChange={(e) => setSections({ ...sections, usefulData: e.target.value })}
                className="input-primary"
                placeholder="Españoles estimados, consejos prácticos, trámites importantes..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}