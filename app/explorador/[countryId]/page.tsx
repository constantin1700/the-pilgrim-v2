import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CountryDetailHeader } from '@/components/explorador/CountryDetailHeader'
import { CountryDetailTabs } from '@/components/explorador/CountryDetailTabs'
import { countriesData } from '@/lib/data/countries'

interface Props {
  params: {
    countryId: string
  }
}

export default function CountryDetailPage({ params }: Props) {
  const country = countriesData.find(c => c.id === params.countryId)
  
  if (!country) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main>
        <CountryDetailHeader country={country} />
        <CountryDetailTabs country={country} />
      </main>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return countriesData.map((country) => ({
    countryId: country.id,
  }))
}