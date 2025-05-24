import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ForumPlaceholder } from '@/components/foro/ForumPlaceholder'

export default function ForoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main>
        <ForumPlaceholder />
      </main>
      <Footer />
    </div>
  )
}