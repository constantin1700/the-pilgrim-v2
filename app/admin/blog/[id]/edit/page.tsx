'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    country_id: '',
    image_url: '',
    status: 'draft',
    featured: false
  })
  const [countries, setCountries] = useState<any[]>([])

  useEffect(() => {
    loadPost()
    loadCountries()
  }, [params.id])

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error('Error loading post:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    try {
      const response = await fetch('/api/countries')
      if (response.ok) {
        const data = await response.json()
        setCountries(data)
      }
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, ...post })
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        alert('Error al guardar el artículo')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error al guardar el artículo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al listado
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Editar Artículo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Extracto</label>
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contenido</label>
            <ReactQuill
              value={post.content}
              onChange={(content) => setPost({ ...post, content })}
              className="h-64 mb-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Autor</label>
              <input
                type="text"
                value={post.author}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <input
                type="text"
                value={post.category}
                onChange={(e) => setPost({ ...post, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">País</label>
              <select
                value={post.country_id}
                onChange={(e) => setPost({ ...post, country_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              >
                <option value="">Seleccionar país</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={post.status}
                onChange={(e) => setPost({ ...post, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL de imagen</label>
            <input
              type="url"
              value={post.image_url}
              onChange={(e) => setPost({ ...post, image_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={post.featured}
                onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium">Artículo destacado</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </button>
            <Link
              href="/admin/blog"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}