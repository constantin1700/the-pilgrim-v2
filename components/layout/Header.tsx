'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '📊 Dashboard', href: '/dashboard' },
  { name: '🌍 Explorador', href: '/explorador' },
  { name: '📝 Blog', href: '/blog' },
  { name: '💬 Foro', href: '/foro', badge: 'Pronto' },
  { name: '🌟 Servicios', href: '/servicios' },
  { name: '✨ Conoce más', href: '/conoce-mas' },
  { name: '📧 Contacto', href: '/contacto' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-5">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                🌍 The Pilgrim
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((link) => (
              <div key={link.name} className="relative">
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 inline-block py-2',
                    pathname === link.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {link.name}
                  {link.badge && (
                    <span className="ml-1 text-[9px] bg-amber-500/90 dark:bg-amber-400/90 text-white dark:text-gray-900 px-1 py-0.5 rounded leading-none align-super">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ES
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              type="button"
              className="p-2 text-gray-600 dark:text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 py-4">
            <div className="space-y-1">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium rounded-md transition-colors',
                    pathname === link.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-between">
                    {link.name}
                    {link.badge && (
                      <span className="text-[10px] bg-amber-500/90 dark:bg-amber-400/90 text-white dark:text-gray-900 px-1.5 py-0.5 rounded">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}