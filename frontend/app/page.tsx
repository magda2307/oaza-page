import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCats } from '@/lib/api'
import type { Cat } from '@/types'

export const metadata: Metadata = {
  title: 'Oaza — koty, których nikt inny nie przyjmie',
  description:
    'Oaza to schronisko dla kotów z FIV, FeLV, po wypadkach, w trakcie leczenia. Adoptuj lub wesprzyj ich leczenie.',
}

const adoptionSteps = [
  {
    num: '01',
    title: 'Przeglądaj profile kotów',
    body: 'Każdy profil opisuje historię, charakter i potrzeby zdrowotne — uczciwie, bez upiększania. Szukaj swojego, nie idealnego.',
  },
  {
    num: '02',
    title: 'Złóż podanie online',
    body: 'Krótki formularz. Powiedz nam, kim jesteś i jak wygląda Twój dom. To nie egzamin — chcemy dobrze dobrać parę.',
  },
  {
    num: '03',
    title: 'Spotkaj swojego kota',
    body: 'Umówimy się. Możesz odwiedzić Oazę albo zorganizujemy wizytę u Ciebie. Adopcja to decyzja, którą podejmujesz z otwartymi oczami.',
  },
]

export default async function HomePage() {
  let featuredCats: Cat[] = []
  try {
    const all = await getCats()
    featuredCats = all.filter((c) => !c.is_adopted).slice(0, 3)
  } catch {
    // API unavailable at build time — render without live cats
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24">
          <p className="text-oaza-warm/70 text-xs font-semibold uppercase tracking-widest mb-5">
            Warszawa · Przytulisko dla kotów
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Koty, których nikt inny nie chciał, żyją tutaj.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed mb-10 max-w-2xl">
            Oaza to schronisko dla kotów, których nikt inny nie przyjmie. Terminalnie chore,
            z FIV i FeLV, po wypadkach, w trakcie leczenia — tygodnie przed końcem.
            Nie mierzymy życia tym, jak długo może trwać.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/koty"
              className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Poznaj koty
            </Link>
            <Link
              href="/wspieraj"
              className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-oaza-green transition-colors"
            >
              Pomóż sfinansować ich leczenie →
            </Link>
          </div>
          <p className="mt-8 text-green-200/70 text-sm">
            Uratowane koty — włącznie z tymi z diagnozą, blizną lub odliczaniem.
          </p>
        </div>
      </section>

      {/* ── Featured cats ─────────────────────────────────────────────────── */}
      {featuredCats.length > 0 && (
        <section className="bg-oaza-warm py-20">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Czekają na dom</h2>
            <p className="text-stone-600 mb-10 text-sm">
              Każdy z nich ma swoją historię. Każdy zasługuje na szansę.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {featuredCats.map((cat) => (
                <Link key={cat.id} href={`/koty/${cat.id}`} className="card group bg-white">
                  <div className="aspect-[4/3] relative bg-stone-100">
                    {cat.photo_url ? (
                      <Image
                        src={cat.photo_url}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-oaza-green/10">
                        🐱
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-stone-900 text-lg">{cat.name}</p>
                    <div className="mt-1 flex gap-3 text-sm text-stone-500">
                      {cat.breed && <span>{cat.breed}</span>}
                      {cat.age_years !== null && (
                        <span>{cat.age_years} {cat.age_years === 1 ? 'rok' : 'lat'}</span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="mt-2 text-sm text-stone-600 line-clamp-2">{cat.description}</p>
                    )}
                    <span className="mt-4 inline-block text-sm text-oaza-rust font-medium group-hover:underline">
                      Poznaj {cat.name} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/koty" className="btn-secondary">
                Zobacz wszystkie koty
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Mission band ──────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-3xl font-bold text-oaza-green leading-snug mb-4">
            Nigdy nie mówimy nie.
          </p>
          <p className="text-stone-600 text-lg leading-relaxed">
            FIV. FeLV. Rak. Potrącony przez auto. Tydzień przed końcem. Mówimy tak.
            Dla każdego kota, który do nas trafi, szukamy ciepłego domu — albo zapewniamy godny
            koniec życia wśród ludzi, którym na nim zależy.
          </p>
        </div>
      </section>

      {/* ── How to adopt ──────────────────────────────────────────────────── */}
      <section className="bg-oaza-warm/40 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Jak przebiega adopcja?</h2>
            <p className="text-stone-500 text-sm">Trzy kroki. Bez zbędnych formalności.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {adoptionSteps.map((step) => (
              <div key={step.num} className="flex flex-col">
                <span className="text-5xl font-bold text-oaza-green/20 leading-none mb-4">
                  {step.num}
                </span>
                <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/jak-adoptowac" className="btn-secondary">
              Dowiedz się więcej o adopcji
            </Link>
          </div>
        </div>
      </section>

      {/* ── Donate CTA band ───────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Nie możesz adoptować? Możesz ocalić.</h2>
          <p className="text-green-100 mb-8 leading-relaxed">
            Wiele naszych kotów wymaga ciągłego leczenia — nie tylko domu.
            Każda złotówka trafia bezpośrednio na weterynaryję, leki i opiekę.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/wspieraj" className="btn-ghost">
              Wesprzyj leczenie
            </Link>
            <Link href="/koty" className="btn-ghost">
              Przeglądaj koty
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
