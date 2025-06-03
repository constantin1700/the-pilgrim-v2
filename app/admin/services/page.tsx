'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Check, X, Loader2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Service {
  id: string
  name: string
  name_es: string
  description: string
  description_es: string
  price: number
  currency: string
  duration: string
  features: string[]
  features_es: string[]
  popular: boolean
  active: boolean
}

export default function AdminServicesPage() {
  const supabase = createClientComponentClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    name_es: '',
    description: '',
    description_es: '',
    price: 0,
    currency: 'EUR',
    duration: '60 min',
    features: [],
    features_es: [],
    popular: false,
    active: true
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true })
      
      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setEditingService({...service})
  }

  const handleSave = async () => {
    if (!editingService) return

    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: editingService.name,
          name_es: editingService.name_es,
          description: editingService.description,
          description_es: editingService.description_es,
          price: editingService.price,
          currency: editingService.currency,
          duration: editingService.duration,
          features: editingService.features,
          features_es: editingService.features_es,
          popular: editingService.popular,
          active: editingService.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingService.id)

      if (error) throw error

      await loadServices()
      setEditingId(null)
      setEditingService(null)
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error al guardar el servicio')
    }
  }

  const handleCreate = async () => {
    try {
      const { error } = await supabase
        .from('services')
        .insert({
          ...newService,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      await loadServices()
      setShowNewForm(false)
      setNewService({
        name: '',
        name_es: '',
        description: '',
        description_es: '',
        price: 0,
        currency: 'EUR',
        duration: '60 min',
        features: [],
        features_es: [],
        popular: false,
        active: true
      })
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Error al crear el servicio')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error al eliminar el servicio')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Servicios
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Administra los planes de consultoría
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo servicio
        </button>
      </div>

      {/* New Service Form */}
      {showNewForm && (
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Crear nuevo servicio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre (EN)"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              className="input-primary"
            />
            <input
              type="text"
              placeholder="Nombre (ES)"
              value={newService.name_es}
              onChange={(e) => setNewService({...newService, name_es: e.target.value})}
              className="input-primary"
            />
            <textarea
              placeholder="Descripción (EN)"
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              className="input-primary"
              rows={3}
            />
            <textarea
              placeholder="Descripción (ES)"
              value={newService.description_es}
              onChange={(e) => setNewService({...newService, description_es: e.target.value})}
              className="input-primary"
              rows={3}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Precio"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                className="input-primary flex-1"
              />
              <select
                value={newService.currency}
                onChange={(e) => setNewService({...newService, currency: e.target.value})}
                className="input-primary"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Duración"
              value={newService.duration}
              onChange={(e) => setNewService({...newService, duration: e.target.value})}
              className="input-primary"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              className="btn-primary"
            >
              Crear servicio
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            <p>No hay servicios creados</p>
            <p className="text-sm mt-2">Haz clic en "Nuevo servicio" para crear uno</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="card p-6">
              {editingId === service.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingService?.name}
                      onChange={(e) => setEditingService({...editingService!, name: e.target.value})}
                      className="input-primary"
                      placeholder="Nombre (EN)"
                    />
                    <input
                      type="text"
                      value={editingService?.name_es}
                      onChange={(e) => setEditingService({...editingService!, name_es: e.target.value})}
                      className="input-primary"
                      placeholder="Nombre (ES)"
                    />
                    <textarea
                      value={editingService?.description}
                      onChange={(e) => setEditingService({...editingService!, description: e.target.value})}
                      className="input-primary"
                      rows={3}
                      placeholder="Descripción (EN)"
                    />
                    <textarea
                      value={editingService?.description_es}
                      onChange={(e) => setEditingService({...editingService!, description_es: e.target.value})}
                      className="input-primary"
                      rows={3}
                      placeholder="Descripción (ES)"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editingService?.price}
                        onChange={(e) => setEditingService({...editingService!, price: Number(e.target.value)})}
                        className="input-primary flex-1"
                      />
                      <select
                        value={editingService?.currency}
                        onChange={(e) => setEditingService({...editingService!, currency: e.target.value})}
                        className="input-primary"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={editingService?.duration}
                      onChange={(e) => setEditingService({...editingService!, duration: e.target.value})}
                      className="input-primary"
                      placeholder="Duración"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingService?.popular}
                        onChange={(e) => setEditingService({...editingService!, popular: e.target.checked})}
                      />
                      <span>Popular</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingService?.active}
                        onChange={(e) => setEditingService({...editingService!, active: e.target.checked})}
                      />
                      <span>Activo</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditingService(null)
                      }}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.name_es || service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {service.description_es || service.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {service.price} {service.currency}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.duration}
                      </span>
                      {service.popular && (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                          Popular
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.active
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}>
                        {service.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}