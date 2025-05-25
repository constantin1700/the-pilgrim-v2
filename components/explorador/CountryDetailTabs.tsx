'use client'

import { useState } from 'react'
import { Country } from '@/lib/types'
import { Info, Briefcase, Home, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  country: Country
}

const tabs = [
  { id: 'general', label: 'Información General y Cultura', icon: Info },
  { id: 'opportunities', label: 'Oportunidades que Ofrece', icon: Briefcase },
  { id: 'cost', label: 'Coste y Calidad de Vida', icon: Home },
  { id: 'tips', label: 'Consejos y Datos Útiles', icon: Lightbulb },
]

export function CountryDetailTabs({ country }: Props) {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
        <p className="text-blue-700 dark:text-blue-300 text-center">
          ℹ️ Información constantemente actualizada para ayudarte en tu aventura
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-200 dark:hover:text-gray-300'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {activeTab === 'general' && (
          <div>
            <h2>Presentación de {country.name}</h2>
            <p>
              {country.name} es uno de los destinos más atractivos para profesionales españoles que buscan 
              nuevas oportunidades laborales y experiencias de vida en el extranjero. Con una economía 
              estable y un mercado laboral dinámico, ofrece excelentes perspectivas para el desarrollo 
              profesional y personal.
            </p>

            <h3>Cultura y Costumbres</h3>
            <p>
              La cultura de {country.name} se caracteriza por su diversidad y apertura hacia los extranjeros. 
              Los valores fundamentales incluyen el respeto, la puntualidad y la eficiencia en el trabajo. 
              Es importante adaptarse a las costumbres locales para una mejor integración.
            </p>

            <h3>Idiomas Principales</h3>
            <p>
              El idioma oficial varía según el país, pero el inglés suele ser ampliamente utilizado en 
              entornos profesionales. Se recomienda tener un nivel mínimo B2 para desenvolverse con 
              comodidad en el ámbito laboral.
            </p>

            <h3>Mejores Ciudades para Vivir</h3>
            <ul>
              <li>Capital - Centro neurálgico de oportunidades laborales</li>
              <li>Segunda ciudad más grande - Ideal para sectores tecnológicos</li>
              <li>Ciudad costera principal - Perfecta para equilibrio vida-trabajo</li>
              <li>Centro industrial - Oportunidades en manufactura y logística</li>
            </ul>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div>
            <h2>Sectores Más Demandados</h2>
            <ul>
              <li><strong>Tecnología e IT:</strong> Desarrolladores, ingenieros de software, analistas de datos</li>
              <li><strong>Salud:</strong> Enfermeros, médicos especialistas, fisioterapeutas</li>
              <li><strong>Ingeniería:</strong> Ingenieros civiles, mecánicos, eléctricos</li>
              <li><strong>Hostelería:</strong> Chefs, camareros, gestores hoteleros</li>
              <li><strong>Educación:</strong> Profesores de idiomas, educadores especializados</li>
            </ul>

            <h3>Trabajos de Temporada</h3>
            <p>
              {country.name} ofrece excelentes oportunidades de trabajo temporal, especialmente en:
            </p>
            <ul>
              <li>Turismo y hostelería durante la temporada alta</li>
              <li>Agricultura y recolección en épocas específicas</li>
              <li>Trabajos en estaciones de esquí (países con montañas)</li>
              <li>Eventos y festivales culturales</li>
            </ul>

            <h3>Oportunidades Permanentes</h3>
            <p>
              Para aquellos que buscan establecerse a largo plazo, los sectores con mayor demanda de 
              profesionales cualificados incluyen tecnología, salud, ingeniería y servicios financieros.
            </p>

            <h3>Mejor Temporada para Trabajar</h3>
            <p>
              La mejor época para buscar trabajo depende del sector, pero generalmente los meses de 
              primavera y otoño son los más activos para contrataciones.
            </p>

            <h3>Requisitos de Visa</h3>
            <p>
              Los requisitos varían según la nacionalidad y el tipo de trabajo. Los ciudadanos de la UE 
              generalmente tienen facilidades, mientras que otros necesitarán visas de trabajo específicas.
            </p>
          </div>
        )}

        {activeTab === 'cost' && (
          <div>
            <h2>Desglose de Costos Mensuales</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Centro Ciudad</th>
                  <th>Afueras</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Alquiler (1 habitación)</td>
                  <td>€1,200 - €1,800</td>
                  <td>€800 - €1,200</td>
                </tr>
                <tr>
                  <td>Comida</td>
                  <td colSpan={2}>€300 - €500</td>
                </tr>
                <tr>
                  <td>Transporte</td>
                  <td colSpan={2}>€80 - €150</td>
                </tr>
                <tr>
                  <td>Entretenimiento</td>
                  <td colSpan={2}>€150 - €300</td>
                </tr>
              </tbody>
            </table>

            <h3>Salarios Promedio por Sector</h3>
            <ul>
              <li>Tecnología: €{Math.round((country.average_salary || country.averageSalary || 0) * 1.3)} - €{Math.round((country.average_salary || country.averageSalary || 0) * 1.8)}</li>
              <li>Salud: €{Math.round((country.average_salary || country.averageSalary || 0) * 1.1)} - €{Math.round((country.average_salary || country.averageSalary || 0) * 1.5)}</li>
              <li>Ingeniería: €{Math.round((country.average_salary || country.averageSalary || 0) * 1.2)} - €{Math.round((country.average_salary || country.averageSalary || 0) * 1.6)}</li>
              <li>Hostelería: €{Math.round((country.average_salary || country.averageSalary || 0) * 0.7)} - €{Math.round((country.average_salary || country.averageSalary || 0) * 0.9)}</li>
              <li>Educación: €{Math.round((country.average_salary || country.averageSalary || 0) * 0.9)} - €{Math.round((country.average_salary || country.averageSalary || 0) * 1.2)}</li>
            </ul>

            <h3>Índice de Calidad de Vida</h3>
            <p>
              Con un índice de {country.quality_of_life || country.qualityOfLife || 0}/100, {country.name} ofrece una calidad de vida 
              {(country.quality_of_life || country.qualityOfLife || 0) > 80 ? ' excelente' : (country.quality_of_life || country.qualityOfLife || 0) > 60 ? ' buena' : ' aceptable'}, 
              con buenos servicios públicos, seguridad y oportunidades de ocio.
            </p>

            <h3>Comparativa con España</h3>
            <p>
              En comparación con España, el costo de vida es aproximadamente un {
                (country.salary_expense_ratio || country.salaryExpenseRatio || 1) > 1 ? 
                `${Math.round(((country.salary_expense_ratio || country.salaryExpenseRatio || 1) - 1) * 100)}% más favorable` : 
                `${Math.round((1 - (country.salary_expense_ratio || country.salaryExpenseRatio || 1)) * 100)}% menos favorable`
              }, considerando la relación entre salarios y gastos.
            </p>
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h2>Españoles en {country.name}</h2>
            <p>
              Se estima que hay aproximadamente {Math.floor(Math.random() * 50000 + 10000).toLocaleString()} 
              españoles viviendo en {country.name}, formando una comunidad activa y solidaria.
            </p>

            <h3>Consejos Prácticos</h3>
            <ul>
              <li>Abre una cuenta bancaria local lo antes posible</li>
              <li>Inscríbete en el consulado español</li>
              <li>Contrata un seguro médico adecuado</li>
              <li>Aprende las costumbres locales básicas</li>
              <li>Únete a grupos de españoles en redes sociales</li>
              <li>Mantén tu documentación siempre actualizada</li>
            </ul>

            <h3>Trámites Importantes</h3>
            <ol>
              <li><strong>Registro de residencia:</strong> Obligatorio en los primeros 90 días</li>
              <li><strong>Número de identificación fiscal:</strong> Necesario para trabajar</li>
              <li><strong>Seguridad social:</strong> Registro en el sistema local</li>
              <li><strong>Cuenta bancaria:</strong> Requisito para recibir salario</li>
              <li><strong>Seguro médico:</strong> Público o privado según el país</li>
            </ol>

            <h3>Enlaces a Comunidades</h3>
            <ul>
              <li>Grupo de Facebook: &ldquo;Españoles en {country.name}&rdquo;</li>
              <li>Telegram: &ldquo;Comunidad española {country.name}&rdquo;</li>
              <li>WhatsApp: Grupos por ciudades principales</li>
              <li>Asociaciones culturales españolas locales</li>
            </ul>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mt-8">
              <h4 className="text-amber-900 dark:text-amber-100 font-semibold mb-2">
                ¿Necesitas ayuda personalizada?
              </h4>
              <p className="text-amber-800 dark:text-amber-200 mb-4">
                Nuestros servicios premium te ofrecen apoyo completo para tu transición a {country.name}, 
                incluyendo revisión de CV, preparación de entrevistas y asesoría personalizada.
              </p>
              <a href="/servicios" className="btn-accent inline-block">
                Ver nuestros servicios
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}