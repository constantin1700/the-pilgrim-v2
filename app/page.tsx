import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { DiscoverSection } from '@/components/landing/DiscoverSection'
import { PopularCountries } from '@/components/landing/PopularCountries'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DiscoverSection />
        <PopularCountries />
      </main>
      <Footer />
    </div>
  )
}