import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Globe, Target, Heart, Rocket } from 'lucide-react'

export default function ConoceMasPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sobre The Pilgrim
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              La plataforma definitiva para tu aventura internacional
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <div className="card p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Nuestra Historia</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  The Pilgrim nació de la experiencia personal de vivir y trabajar en el extranjero. 
                  Entendemos los desafíos, las dudas y las oportunidades que surgen cuando decides 
                  dar el salto a otro país. Por eso creamos esta plataforma: para que tu camino 
                  sea más claro, más fácil y más exitoso.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Desde nuestro lanzamiento, hemos ayudado a miles de españoles a encontrar su 
                  lugar en el mundo, proporcionando información actualizada, creando comunidad 
                  y ofreciendo apoyo personalizado cuando más lo necesitan.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <div className="card p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Misión y Visión</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nuestra Misión</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Empoderar a los españoles que buscan oportunidades internacionales con 
                      información confiable, herramientas prácticas y una comunidad de apoyo 
                      que les ayude a alcanzar sus objetivos profesionales y personales en el extranjero.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nuestra Visión</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ser la plataforma de referencia para cualquier español que considere vivir 
                      y trabajar fuera de España, creando el ecosistema más completo de información, 
                      servicios y comunidad para la movilidad internacional.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="card p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Valores de la Comunidad</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Colaboración</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Creemos en el poder de compartir experiencias y conocimientos para 
                      el beneficio de todos.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Transparencia</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Información clara, honesta y actualizada sobre la realidad de vivir 
                      en cada país.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Apoyo Mutuo</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Una comunidad donde cada miembro puede encontrar ayuda y ofrecer 
                      su experiencia a otros.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Innovación</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Constantemente mejorando nuestra plataforma para ofrecer las mejores 
                      herramientas y recursos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="card p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Rocket className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Futuras Características</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Estamos trabajando constantemente para mejorar The Pilgrim. Algunas de las 
                  características que estamos desarrollando incluyen:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Foro comunitario interactivo (próximamente)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Calculadora de costos de vida personalizada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Sistema de mentorías entre usuarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Guías de visa interactivas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>App móvil para iOS y Android</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Listo para comenzar tu aventura internacional?
            </p>
            <a href="/dashboard" className="btn-primary">
              Explorar oportunidades
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}