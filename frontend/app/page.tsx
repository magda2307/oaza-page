import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCats } from '@/lib/api'
import type { Cat } from '@/types'
import CatCarousel from '@/components/CatCarousel'
import { CatTagsCompact } from '@/components/CatTags'

export const metadata: Metadata = {
  title: 'Oaza — koty, których nikt inny nie przyjmie',
  description:
    'Oaza to schronisko dla kotów z FIV, FeLV, po wypadkach, w trakcie leczenia. Adoptuj lub wesprzyj ich leczenie.',
}

// Shown when live cats have no tags yet — real-looking demo data
const STATIC_FEATURED: Cat[] = [
  {
    id: -1,
    name: 'Marchewka',
    age_years: 8,
    breed: 'Dachowiec',
    description: 'Marchewka trafiła do nas po wypadku drogowym. Straciła tylną łapę, ale nie straciła woli życia. Szuka spokojnego domu, gdzie może rządzić z kanapy.',
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
    description: 'Dragon żyje z FIV od urodzenia. Wbrew nazwie jest wyjątkowo delikatny i przywiązuje się do jednej osoby.',
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
    description: 'Hugo to doświadczony starszy pan z cukrzycą. Wymaga zastrzyków dwa razy dziennie — i oddaje to z nawiązką w czystym kocie mruku.',
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg',
    is_adopted: false,
    tags: ['senior', 'cukrzyca', 'wymaga_lekow'],
    created_at: '',
  },
]

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
  let carouselCats: Cat[] = []
  let adoptedCats: Cat[] = []
  try {
    const all = await getCats()
    const available = all.filter((c) => !c.is_adopted)
    const adopted = all.filter((c) => c.is_adopted)
    featuredCats = available.slice(0, 3)
    // Fall back to static demo cats if real cats have no tags yet
    if (!featuredCats.some((c) => c.tags?.length > 0)) {
      featuredCats = STATIC_FEATURED
    }
    carouselCats = available
    adoptedCats = adopted
  } catch {
    // API unavailable — use static demo data so the featured section still renders
    featuredCats = STATIC_FEATURED
  }

  if (featuredCats.length === 0) featuredCats = STATIC_FEATURED

  const spotlightCat = featuredCats[0] ?? null
  const secondaryCats = featuredCats.slice(1)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white relative overflow-hidden min-h-[520px]">
        {/* Cat image — desktop only, right side, fades into bg via gradient */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-[46%]">
          <Image
            src="https://static.pomagam.pl/media/project_photos/cache/GXTYZ5QBlsmN.jpg"
            alt="Kot w Oazie szuka domu"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient: left edge fades into green background — the "cutout" effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-oaza-green via-oaza-green/50 to-transparent" />
        </div>

        {/* Text content — left side */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 flex items-center min-h-[520px]">
          <div className="w-full md:w-[55%]">
            <p className="text-oaza-warm/70 text-xs font-semibold uppercase tracking-widest mb-5">
              Warszawa · Przytulisko dla kotów
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Koty, których nikt inny nie chciał, żyją tutaj.
            </h1>
            <p className="text-green-100 text-lg leading-relaxed mb-10 max-w-xl">
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
          </div>
        </div>
      </section>

      {/* ── Cat carousel ──────────────────────────────────────────────────── */}
      <CatCarousel cats={carouselCats} />

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      {/* TODO: pull from API or CMS */}
      <section className="bg-white border-b border-stone-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 text-center">
            <div className="py-6 sm:py-0 sm:px-8">
              <p className="text-4xl font-bold text-oaza-green">Ponad 200</p>
              <p className="mt-2 text-sm text-stone-500 leading-snug max-w-[16ch] mx-auto">
                razy powiedzieliśmy tak, kiedy inni powiedzieli nie
              </p>
            </div>
            <div className="py-6 sm:py-0 sm:px-8">
              <p className="text-4xl font-bold text-oaza-green">143</p>
              <p className="mt-2 text-sm text-stone-500 leading-snug max-w-[16ch] mx-auto">
                koty znalazły prawdziwy dom
              </p>
            </div>
            <div className="py-6 sm:py-0 sm:px-8">
              <p className="text-4xl font-bold text-oaza-green">23</p>
              <p className="mt-2 text-sm text-stone-500 leading-snug max-w-[16ch] mx-auto">
                koty są teraz pod naszą opieką
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Adopted cats carousel ─────────────────────────────────────────── */}
      <CatCarousel cats={adoptedCats} heading="Znalazły dom" reverse />

      {/* ── Featured cats ─────────────────────────────────────────────────── */}
      <section className="bg-oaza-warm py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Czekają na dom</h2>
          <p className="text-stone-600 mb-10 text-sm">
            Każdy z nich ma swoją historię. Każdy zasługuje na szansę.
          </p>

          {featuredCats.length > 0 ? (
            <>
              {/* Spotlight card — first cat, full-width horizontal layout */}
              {spotlightCat && (
                <div className="card bg-white overflow-hidden mb-8">
                  <div className="flex flex-col md:flex-row">
                    {/* Photo — 40% width on desktop */}
                    <div className="relative w-full md:w-[40%] aspect-[4/3] md:aspect-auto md:min-h-[340px] bg-stone-100 flex-shrink-0 overflow-hidden">
                      {spotlightCat.photo_url ? (
                        <Image
                          src={spotlightCat.photo_url}
                          alt={spotlightCat.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-7xl bg-oaza-green/10">
                          🐱
                        </div>
                      )}
                      {/* Bottom gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      {/* Age badge */}
                      {spotlightCat.age_years !== null && (
                        <span className="absolute top-4 right-4 bg-white/90 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {spotlightCat.age_years}{' '}
                          {spotlightCat.age_years === 1 ? 'rok' : spotlightCat.age_years <= 4 ? 'lata' : 'lat'}
                        </span>
                      )}
                      {/* Tags overlay */}
                      {spotlightCat.tags?.length > 0 && (
                        <div className="absolute bottom-4 left-4">
                          <CatTagsCompact tags={spotlightCat.tags} />
                        </div>
                      )}
                    </div>
                    {/* Story — 60% width on desktop */}
                    <div className="flex flex-col justify-center p-8 md:p-10 md:w-[60%]">
                      <span className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-3">
                        Wyróżniony kot
                      </span>
                      <h3 className="text-3xl font-bold text-stone-900 mb-2">
                        {spotlightCat.name}
                      </h3>
                      {spotlightCat.breed && (
                        <p className="text-sm text-stone-400 mb-4">{spotlightCat.breed}</p>
                      )}
                      {spotlightCat.description && (
                        <p className="text-stone-600 leading-relaxed mb-8 line-clamp-4">
                          {spotlightCat.description}
                        </p>
                      )}
                      <Link
                        href={spotlightCat.id > 0 ? `/koty/${spotlightCat.id}` : '/koty'}
                        className="inline-flex items-center justify-center self-start bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity text-base"
                      >
                        Daj {spotlightCat.name} szansę →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {secondaryCats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {secondaryCats.map((cat) => (
                    <Link key={cat.id} href={cat.id > 0 ? `/koty/${cat.id}` : '/koty'} className="card group bg-white">
                      <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
                        {cat.photo_url ? (
                          <Image
                            src={cat.photo_url}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl bg-oaza-green/10">
                            🐱
                          </div>
                        )}
                        {/* Bottom gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        {/* Age badge */}
                        {cat.age_years !== null && (
                          <span className="absolute top-3 right-3 bg-white/90 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {cat.age_years}{' '}
                            {cat.age_years === 1 ? 'rok' : cat.age_years <= 4 ? 'lata' : 'lat'}
                          </span>
                        )}
                        {/* Tags overlay */}
                        {cat.tags?.length > 0 && (
                          <div className="absolute bottom-3 left-3">
                            <CatTagsCompact tags={cat.tags} />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-baseline justify-between">
                          <p className="font-bold text-stone-900 text-lg">{cat.name}</p>
                          {cat.breed && <span className="text-sm text-stone-400">{cat.breed}</span>}
                        </div>
                        {cat.description && (
                          <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                        <span className="mt-4 inline-block text-sm text-oaza-rust font-medium group-hover:underline">
                          Poznaj {cat.name} →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-10 text-center">
                <Link href="/koty" className="btn-secondary">
                  Zobacz wszystkie koty
                </Link>
              </div>
            </>
          ) : (
            /* Empty state — all cats adopted */
            <div className="card bg-white text-center py-16 px-8">
              <p className="text-4xl mb-4">🏡</p>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Wszystkie koty znalazły dom
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                To najpiękniejsze zdanie, jakie możemy napisać. Aktualnie wszystkie nasze koty
                mają już swoją rodzinę. Możesz pomóc następnym — Twoją wpłatą finansujemy opiekę
                nad kolejnymi kotami, które do nas trafią.
              </p>
              <Link
                href="/wspieraj"
                className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Wesprzyj następne koty →
              </Link>
            </div>
          )}
        </div>
      </section>

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

      {/* ── Testimonial ───────────────────────────────────────────────────── */}
      {/* TODO: replace with real testimonial */}
      <section className="bg-oaza-warm/40 py-20 border-t border-oaza-warm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span
              aria-hidden="true"
              className="block text-7xl font-serif leading-none text-oaza-green mb-6 select-none"
            >
              &ldquo;
            </span>
            <blockquote>
              <p className="text-xl italic text-stone-700 leading-relaxed mb-6">
                Bałam się, że nie dam rady zaopiekować się chorym kotem. Wzięłam Marchewkę z FIV
                trzy lata temu. Śpi teraz na moich nogach.
              </p>
              <footer className="text-sm text-stone-500 font-medium not-italic">
                — Kasia, Warszawa
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Donate CTA ────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Nie możesz adoptować? Możesz ocalić.</h2>
          <p className="text-green-100 mb-3 leading-relaxed">
            Wiele naszych kotów wymaga ciągłego leczenia — nie tylko domu.
            Każda złotówka trafia bezpośrednio na weterynarza, leki i opiekę.
          </p>
          <p className="text-green-200/80 text-sm mb-8">
            Miesięczna opieka nad jednym kotem kosztuje około 300 zł — weterynarz, leki,
            jedzenie, miłość.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wspieraj"
              className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Wesprzyj leczenie
            </Link>
            <Link
              href="/koty"
              className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white hover:text-oaza-green transition-colors"
            >
              Przeglądaj koty
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
