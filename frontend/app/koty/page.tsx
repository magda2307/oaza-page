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
  let adopted: Cat[] = []
  let error = false

  try {
    const page = await getCats()
    available = page.items.filter((c) => !c.is_adopted)
    adopted = page.items.filter((c) => c.is_adopted)
  } catch {
    error = true
  }

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-14">
          <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.0] tracking-[-0.03em] mb-4">
            Koty szukające
            <br className="hidden sm:block" /> domu
          </h1>
          <p className="text-green-100/70 text-base sm:text-lg leading-relaxed max-w-md mb-8">
            Każdy z nich ma historię, której nikt inny nie chce słyszeć.
            My mówimy to głośno — żebyś mógł podjąć świadomą decyzję.
          </p>
          {!error && (
            <div className="flex items-center gap-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-3xl font-black font-display text-white leading-none">
                  {available.length > 0 ? available.length : '—'}
                </p>
                <p className="text-[11px] text-green-200/50 mt-1.5 uppercase tracking-widest">
                  szuka domu
                </p>
              </div>
              <div className="w-px h-7 bg-white/15" />
              <div>
                <p className="text-3xl font-black font-display text-white leading-none">
                  {adopted.length > 0 ? adopted.length : '—'}
                </p>
                <p className="text-[11px] text-green-200/50 mt-1.5 uppercase tracking-widest">
                  znalazło dom
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Filter + grid ────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF9F7] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-24">

          {error && (
            <div className="border border-red-200 text-red-700 rounded-xl p-5 mb-8 text-sm bg-white">
              Nie udało się załadować listy kotów. Spróbuj ponownie za chwilę.
            </div>
          )}

          {!error && (
            <CatFilterBar available={available} adopted={adopted} />
          )}
        </div>
      </div>
    </>
  )
}
