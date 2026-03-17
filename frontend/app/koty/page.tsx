import type { Metadata } from 'next'
import { getCats } from '@/lib/api'
import type { Cat } from '@/types'
import { CatFilterBar } from '@/components/CatFilterBar'

export const metadata: Metadata = {
  title: 'Koty do adopcji — Oaza',
  description:
    'Przeglądaj koty czekające na dom w Oazie — z FIV, FeLV, po wypadkach i chore terminalnie. Każdy z nich zasługuje na szansę.',
}

export default async function KotyPage() {
  let available: Cat[] = []
  let error = false

  try {
    const page = await getCats()
    available = page.items
  } catch {
    error = true
  }

  const adopted: Cat[] = []

  return (
    <div className="bg-oaza-warm min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pt-14 pb-20">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-3">
            Adopcja
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight mb-4">
            Koty szukające domu
          </h1>
          <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
            Każdy z nich ma historię, której nikt inny nie chce słyszeć.
            My mówimy to głośno — żebyś mógł podjąć świadomą decyzję.
          </p>
        </header>

        {/* ── Error state ──────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-white border border-red-200 text-red-700 rounded-2xl p-5 mb-8 text-sm">
            Nie udało się załadować listy kotów. Spróbuj ponownie za chwilę.
          </div>
        )}

        {/* ── Filter bar + grid (client component) ─────────────────────────── */}
        {!error && (
          <CatFilterBar available={available} adopted={adopted} />
        )}
      </div>
    </div>
  )
}
