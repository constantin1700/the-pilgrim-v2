import Link from 'next/link'
import { Instagram, MessageCircle, Phone } from 'lucide-react'

const footerLinks = {
  main: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Explorador', href: '/explorador' },
    { name: 'Blog', href: '/blog' },
    { name: 'Servicios', href: '/servicios' },
  ],
  company: [
    { name: 'Conoce más', href: '/conoce-mas' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Política de privacidad', href: '/privacidad' },
    { name: 'Términos y condiciones', href: '/terminos' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                The Pilgrim
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Explora oportunidades globales, mantente al día. Conecta, infórmate con contenido actualizado y obtén el apoyo que necesitas para tu aventura internacional.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Phone className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Explorar
            </h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Información
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Suscríbete a nuestro newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recibe las últimas noticias y oportunidades directamente en tu correo.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="input-primary flex-1 md:w-64"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 The Pilgrim. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}