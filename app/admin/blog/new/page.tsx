'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import { countriesData } from '@/lib/data/countries'
import { generateSlug } from '@/lib/utils'

export default function AdminBlogNewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    countryId: '',
    published: false,
    allowComments: true
  })

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  const handleSave = async (publish = false) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish,
          author_name: 'The Pilgrim Team',
          reading_time: Math.ceil(formData.content.split(' ').length / 200),
          tags: formData.countryId ? [countriesData.find(c => c.id === formData.countryId)?.name] : []
        })
      })

      if (!response.ok) throw new Error('Error saving post')
      
      alert(publish ? 'Artículo publicado exitosamente' : 'Borrador guardado exitosamente')
      router.push('/admin/blog')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el artículo')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nuevo artículo
          </h2>
        </div>
        <button className="btn-outline flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Vista previa
        </button>
        <button
          onClick={() => handleSave(false)}
          className="btn-outline"
        >
          Guardar borrador
        </button>
        <button
          onClick={() => handleSave(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Publicar ahora
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información básica
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título del artículo *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-primary"
                  placeholder="Ej: Guía completa para trabajar en Alemania"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug/URL
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-primary flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  País asociado *
                </label>
                <select
                  value={formData.countryId}
                  onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                  className="input-primary"
                  required
                >
                  <option value="">Selecciona un país</option>
                  {countriesData.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Extracto/resumen *
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="input-primary"
                  placeholder="Breve descripción del artículo (150-300 caracteres)"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.excerpt.length}/300 caracteres
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contenido principal
            </h3>
            
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">
                    <strong>B</strong>
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded italic">
                    I
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">
                    H1
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">
                    H2
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">
                    Lista
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">
                    Link
                  </button>
                </div>
              </div>
              <textarea
                rows={20}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-4 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none"
                placeholder="Escribe el contenido del artículo..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Imagen destacada
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Arrastra una imagen aquí
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Seleccionar archivo
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Configuración
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowComments}
                  onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Permitir comentarios
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Artículo destacado
                </span>
              </label>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO y Metadatos
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta título
                </label>
                <input
                  type="text"
                  className="input-primary"
                  placeholder="Título para SEO (max 60 caracteres)"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta descripción
                </label>
                <textarea
                  rows={3}
                  className="input-primary"
                  placeholder="Descripción para SEO (max 160 caracteres)"
                  maxLength={160}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  className="input-primary"
                  placeholder="Palabras clave separadas por comas"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}