import type { Metadata } from 'next'
import { getCats } from '@/lib/api'
import type { Cat } from '@/types'
import { CatFilterBar } from '@/components/CatFilterBar'
import { AdminToolbar } from '@/components/AdminToolbar'

export const metadata: Metadata = {
  title: 'Koty do adopcji — Oaza',
  description:
    'Przeglądaj koty czekające na dom w Oazie — z FIV, FeLV, po wypadkach i chore terminalnie. Każdy z nich zasługuje na szansę.',
}

// Shown when the API is unavailable — keeps the page useful
const STATIC_AVAILABLE: Cat[] = [
  {
    id: -1,
    name: 'Marchewka',
    age_years: 8,
    breed: 'Dachowiec',
    description:
      'Marchewka trafiła do nas po wypadku drogowym. Straciła tylną łapę, ale nie straciła woli życia. Szuka spokojnego domu, gdzie może rządzić z kanapy.',
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/GXTYZ5QBlsmN.jpg',
    is_adopted: false,
    tags: ['po_wypadku', 'trojnog', 'senior'],
    created_at: '',
  },
  {
    id: -2,
    name: 'Dragon',
    age_years: 5,
    breed: 'Dachowiec',
    description:
      'Dragon żyje z FIV od urodzenia. Wbrew nazwie jest wyjątkowo delikatny i przywiązuje się do jednej osoby. Najlepiej jako jedynak.',
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/cNb7X85pgsIn.jpg',
    is_adopted: false,
    tags: ['fiv', 'spokojny', 'tylko_do_domu'],
    created_at: '',
  },
  {
    id: -3,
    name: 'Hugo',
    age_years: 12,
    breed: 'Dachowiec',
    description:
      'Hugo to doświadczony starszy pan z cukrzycą. Wymaga zastrzyków dwa razy dziennie — i oddaje to z nawiązką w czystym kocie mruku.',
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg',
    is_adopted: false,
    tags: ['senior', 'cukrzyca', 'wymaga_lekow'],
    created_at: '',
  },
  {
    id: -4,
    name: 'Fraja',
    age_years: 3,
    breed: 'Dachowiec',
    description:
      'Fraja trafiła do nas jako kociak po śmierci poprzednich opiekunów. Bardzo towarzyska, kocha inne koty. Szuka domu z charakterem.',
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/4I9QOYcIKUYE.jpg',
    is_adopted: false,
    tags: ['towarzyski', 'lubi_koty'],
    created_at: '',
  },
  {
    id: -5,
    name: 'Karmel',
    age_years: 7,
    breed: 'Dachowiec',
    description:
      'Karmel jest w trakcie leczenia onkologicznego. Reaguje dobrze na chemioterapię, rokowania są ostrożnie optymistyczne. Spokojny, nie wymaga dużo.',
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/qC8KyJ-hffJ-.jpg',
    is_adopted: false,
    tags: ['nowotwor', 'w_leczeniu', 'spokojny'],
    created_at: '',
  },
]

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

  // Fall back to static demo cats if the API is down or returns nothing with tags
  if (available.length === 0 || !available.some((c) => c.tags?.length > 0)) {
    available = STATIC_AVAILABLE
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
              Nie udało się połączyć z serwerem. Pokazujemy przykładowe profile — wróć wkrótce.
            </div>
          )}
          <CatFilterBar available={available} adopted={adopted} />
        </div>
      </div>
      <AdminToolbar />
    </>
  )
}
