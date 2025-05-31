'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Globe, DollarSign, Cloud, Users, Briefcase, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditCountryPage({ params }: { params: { countryId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [country, setCountry] = useState<any>({
    // Información básica
    name: '',
    name_es: '',
    code: '',
    country_code: '',
    continent: '',
    capital: '',
    population: 0,
    main_language: '',
    currency: '',
    
    // Métricas del dashboard
    temperature: 0,
    quality_of_life: 0,
    average_salary: 0,
    salary_expense_ratio: 0,
    social_index: 0,
    bureaucracy_ease: 0,
    internet_speed_mbps: 0,
    gdp_per_capita: 0,
    
    // Flags especiales
    digital_nomad_visa: false,
    eu_citizenship_pathway: false,
    tax_advantages: false,
    featured: false,
    active: true,
    
    // Secciones del explorador (JSONB)
    work_visa_info: {
      title: "Información de Visa de Trabajo",
      content: "",
      requirements: [],
      process_time: "",
      difficulty: ""
    },
    cost_of_living: {
      title: "Coste de Vida",
      monthly_budget: 0,
      rent_city_center: 0,
      rent_outside_center: 0,
      food_budget: 0,
      transport_budget: 0,
      details: ""
    },
    climate_info: {
      title: "Clima",
      type: "",
      best_months: [],
      worst_months: [],
      description: ""
    },
    cultural_tips: {
      title: "Cultura y Consejos",
      language_tips: "",
      social_norms: "",
      work_culture: "",
      integration_tips: ""
    },
    job_market: {
      title: "Mercado Laboral",
      in_demand_sectors: [],
      average_salaries_by_sector: {},
      job_search_tips: "",
      networking_advice: ""
    }
  });

  useEffect(() => {
    fetchCountry();
  }, [params.countryId]);

  const fetchCountry = async () => {
    try {
      const response = await fetch(`/api/admin/countries?id=${params.countryId}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setCountry(data[0]);
      }
    } catch (error) {
      console.error('Error fetching country:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(country)
      });

      if (response.ok) {
        alert('País actualizado exitosamente');
        router.push('/admin/countries');
      } else {
        alert('Error al actualizar el país');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el país');
    } finally {
      setSaving(false);
    }
  };

  const updateJsonField = (field: string, subfield: string, value: any) => {
    setCountry({
      ...country,
      [field]: {
        ...country[field],
        [subfield]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/countries" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold">Editar País: {country.name}</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre (Inglés)
              </label>
              <input
                type="text"
                value={country.name || ''}
                onChange={(e) => setCountry({ ...country, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre (Español)
              </label>
              <input
                type="text"
                value={country.name_es || ''}
                onChange={(e) => setCountry({ ...country, name_es: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código País (2 letras)
              </label>
              <input
                type="text"
                value={country.country_code || country.code || ''}
                onChange={(e) => setCountry({ ...country, country_code: e.target.value.toUpperCase() })}
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capital
              </label>
              <input
                type="text"
                value={country.capital || ''}
                onChange={(e) => setCountry({ ...country, capital: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idioma Principal
              </label>
              <input
                type="text"
                value={country.main_language || ''}
                onChange={(e) => setCountry({ ...country, main_language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <input
                type="text"
                value={country.currency || ''}
                onChange={(e) => setCountry({ ...country, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Métricas del Dashboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Métricas del Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperatura Media (°C)
              </label>
              <input
                type="number"
                value={country.temperature || 0}
                onChange={(e) => setCountry({ ...country, temperature: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calidad de Vida (0-100)
              </label>
              <input
                type="number"
                value={country.quality_of_life || 0}
                onChange={(e) => setCountry({ ...country, quality_of_life: parseFloat(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salario Promedio (€/mes)
              </label>
              <input
                type="number"
                value={country.average_salary || 0}
                onChange={(e) => setCountry({ ...country, average_salary: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relación Salario/Gastos
              </label>
              <input
                type="number"
                value={country.salary_expense_ratio || 0}
                onChange={(e) => setCountry({ ...country, salary_expense_ratio: parseFloat(e.target.value) })}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Índice Social (0-100)
              </label>
              <input
                type="number"
                value={country.social_index || 0}
                onChange={(e) => setCountry({ ...country, social_index: parseFloat(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facilidad Burocrática (0-100)
              </label>
              <input
                type="number"
                value={country.bureaucracy_ease || 0}
                onChange={(e) => setCountry({ ...country, bureaucracy_ease: parseFloat(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Velocidad Internet (Mbps)
              </label>
              <input
                type="number"
                value={country.internet_speed_mbps || 0}
                onChange={(e) => setCountry({ ...country, internet_speed_mbps: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIB per Cápita (€)
              </label>
              <input
                type="number"
                value={country.gdp_per_capita || 0}
                onChange={(e) => setCountry({ ...country, gdp_per_capita: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Población
              </label>
              <input
                type="number"
                value={country.population || 0}
                onChange={(e) => setCountry({ ...country, population: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Características Especiales */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Características Especiales</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={country.digital_nomad_visa || false}
                onChange={(e) => setCountry({ ...country, digital_nomad_visa: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Visa de Nómada Digital</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={country.eu_citizenship_pathway || false}
                onChange={(e) => setCountry({ ...country, eu_citizenship_pathway: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Camino a Ciudadanía EU</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={country.tax_advantages || false}
                onChange={(e) => setCountry({ ...country, tax_advantages: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Ventajas Fiscales</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={country.featured || false}
                onChange={(e) => setCountry({ ...country, featured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">País Destacado</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={country.active || false}
                onChange={(e) => setCountry({ ...country, active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">País Activo</span>
            </label>
          </div>
        </div>

        {/* Información General (Explorador) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Información de Visa de Trabajo
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido Principal
              </label>
              <textarea
                value={country.work_visa_info?.content || ''}
                onChange={(e) => updateJsonField('work_visa_info', 'content', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el proceso de visa, requisitos generales, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Proceso
              </label>
              <input
                type="text"
                value={country.work_visa_info?.process_time || ''}
                onChange={(e) => updateJsonField('work_visa_info', 'process_time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 2-3 meses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dificultad
              </label>
              <select
                value={country.work_visa_info?.difficulty || ''}
                onChange={(e) => updateJsonField('work_visa_info', 'difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Fácil">Fácil</option>
                <option value="Moderada">Moderada</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coste de Vida */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Coste de Vida
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto Mensual Total (€)
              </label>
              <input
                type="number"
                value={country.cost_of_living?.monthly_budget || 0}
                onChange={(e) => updateJsonField('cost_of_living', 'monthly_budget', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alquiler Centro Ciudad (€/mes)
              </label>
              <input
                type="number"
                value={country.cost_of_living?.rent_city_center || 0}
                onChange={(e) => updateJsonField('cost_of_living', 'rent_city_center', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alquiler Fuera del Centro (€/mes)
              </label>
              <input
                type="number"
                value={country.cost_of_living?.rent_outside_center || 0}
                onChange={(e) => updateJsonField('cost_of_living', 'rent_outside_center', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto Comida (€/mes)
              </label>
              <input
                type="number"
                value={country.cost_of_living?.food_budget || 0}
                onChange={(e) => updateJsonField('cost_of_living', 'food_budget', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalles Adicionales
              </label>
              <textarea
                value={country.cost_of_living?.details || ''}
                onChange={(e) => updateJsonField('cost_of_living', 'details', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Otros gastos importantes, tips de ahorro, etc."
              />
            </div>
          </div>
        </div>

        {/* Clima */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Información del Clima
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Clima
              </label>
              <input
                type="text"
                value={country.climate_info?.type || ''}
                onChange={(e) => updateJsonField('climate_info', 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Mediterráneo, Continental, Tropical..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Clima
              </label>
              <textarea
                value={country.climate_info?.description || ''}
                onChange={(e) => updateJsonField('climate_info', 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe las estaciones, temperaturas típicas, precipitaciones..."
              />
            </div>
          </div>
        </div>

        {/* Cultura y Consejos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Cultura y Consejos
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tips de Idioma
              </label>
              <textarea
                value={country.cultural_tips?.language_tips || ''}
                onChange={(e) => updateJsonField('cultural_tips', 'language_tips', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Consejos sobre el idioma local, frases útiles..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Normas Sociales
              </label>
              <textarea
                value={country.cultural_tips?.social_norms || ''}
                onChange={(e) => updateJsonField('cultural_tips', 'social_norms', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Costumbres importantes, qué hacer y qué no hacer..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cultura de Trabajo
              </label>
              <textarea
                value={country.cultural_tips?.work_culture || ''}
                onChange={(e) => updateJsonField('cultural_tips', 'work_culture', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Horarios típicos, jerarquía, comunicación profesional..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tips de Integración
              </label>
              <textarea
                value={country.cultural_tips?.integration_tips || ''}
                onChange={(e) => updateJsonField('cultural_tips', 'integration_tips', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Cómo hacer amigos, actividades sociales, grupos de expats..."
              />
            </div>
          </div>
        </div>

        {/* Mercado Laboral */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Mercado Laboral
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sectores en Demanda (separados por comas)
              </label>
              <input
                type="text"
                value={country.job_market?.in_demand_sectors?.join(', ') || ''}
                onChange={(e) => updateJsonField('job_market', 'in_demand_sectors', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="IT, Salud, Ingeniería, Marketing..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tips para Búsqueda de Trabajo
              </label>
              <textarea
                value={country.job_market?.job_search_tips || ''}
                onChange={(e) => updateJsonField('job_market', 'job_search_tips', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Mejores portales de empleo, proceso de aplicación típico..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consejos de Networking
              </label>
              <textarea
                value={country.job_market?.networking_advice || ''}
                onChange={(e) => updateJsonField('job_market', 'networking_advice', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Eventos profesionales, grupos de LinkedIn, asociaciones..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}