'use client'

import { useState } from 'react'
import { Edit, Users, DollarSign, AlertCircle } from 'lucide-react'

interface ServicePlan {
  id: string
  name: string
  price: number
  monthlyLimit?: number
  currentReservations: number
  isActive: boolean
}

interface Reservation {
  id: string
  planName: string
  customerName: string
  customerEmail: string
  status: 'pending' | 'paid' | 'completed'
  createdAt: Date
}

export default function AdminServicesPage() {
  const [plans] = useState<ServicePlan[]>([
    {
      id: 'basic',
      name: 'Soporte Básico',
      price: 49,
      currentReservations: 8,
      isActive: true
    },
    {
      id: 'personalized',
      name: 'Soporte Personalizado',
      price: 99,
      monthlyLimit: 20,
      currentReservations: 12,
      isActive: true
    },
    {
      id: 'premium',
      name: 'Soporte Premium',
      price: 149,
      monthlyLimit: 10,
      currentReservations: 7,
      isActive: true
    }
  ])

  const [reservations] = useState<Reservation[]>([
    {
      id: '1',
      planName: 'Soporte Personalizado',
      customerName: 'Ana Martínez',
      customerEmail: 'ana@example.com',
      status: 'paid',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '2',
      planName: 'Soporte Premium',
      customerName: 'Roberto Silva',
      customerEmail: 'roberto@example.com',
      status: 'paid',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '3',
      planName: 'Soporte Básico',
      customerName: 'Laura González',
      customerEmail: 'laura@example.com',
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
    }
  ])

  const totalRevenue = reservations
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => {
      const plan = plans.find(p => p.name === r.planName)
      return sum + (plan?.price || 0)
    }, 0)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            €{totalRevenue}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingresos este mes
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {reservations.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reservas totales
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {reservations.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pagos pendientes
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            15
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            En lista de espera
          </p>
        </div>
      </div>

      {/* Service Plans */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuración de Servicios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    €{plan.price}
                  </p>
                </div>
                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              {plan.monthlyLimit && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Disponibilidad</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {plan.currentReservations}/{plan.monthlyLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(plan.currentReservations / plan.monthlyLimit) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  plan.isActive
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {plan.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.currentReservations} reservas
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reservations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Reservas Recientes
        </h3>
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {reservation.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {reservation.planName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reservation.status === 'paid'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : reservation.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    }`}>
                      {reservation.status === 'paid' && 'Pagado'}
                      {reservation.status === 'pending' && 'Pendiente'}
                      {reservation.status === 'completed' && 'Completado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(reservation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}