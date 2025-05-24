import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/lib/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Pilgrim - Explora oportunidades globales',
  description: 'La plataforma definitiva para personas que buscan información, comunidad y apoyo para vivir y trabajar en el extranjero.',
  keywords: 'trabajo extranjero, emigrar españa, visa trabajo, expatriados españoles, oportunidades internacionales',
  authors: [{ name: 'The Pilgrim Team' }],
  creator: 'The Pilgrim',
  publisher: 'The Pilgrim',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thepilgrim.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Pilgrim - Explora oportunidades globales',
    description: 'La plataforma definitiva para personas que buscan información, comunidad y apoyo para vivir y trabajar en el extranjero.',
    url: 'https://thepilgrim.com',
    siteName: 'The Pilgrim',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Pilgrim - Explora oportunidades globales',
    description: 'La plataforma definitiva para personas que buscan información, comunidad y apoyo para vivir y trabajar en el extranjero.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}