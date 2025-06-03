'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestLoginPage() {
  const router = useRouter()
  const [results, setResults] = useState<Record<string, any>>({})

  const testEnvironment = async () => {
    const response = await fetch('/api/test-env')
    const data = await response.json()
    setResults((prev: Record<string, any>) => ({ ...prev, env: data }))
  }

  const testDirectAccess = () => {
    // Forzar acceso directo al dashboard
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Test de Login Admin</h1>
        
        <div className="space-y-4">
          <button
            onClick={testEnvironment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test Variables de Entorno
          </button>

          <button
            onClick={testDirectAccess}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Acceso Directo al Dashboard (bypass)
          </button>
        </div>

        {results.env && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">Variables de Entorno:</h2>
            <pre>{JSON.stringify(results.env, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}