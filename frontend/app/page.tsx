import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCats } from '@/lib/api'
import type { Cat } from '@/types'
import CatCarousel from '@/components/CatCarousel'
import { CatTagsCompact } from '@/components/CatTags'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { StepConnector } from '@/components/StepConnector'

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
    iconPath: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z',
  },
  {
    num: '02',
    title: 'Złóż podanie online',
    body: 'Krótki formularz. Powiedz nam, kim jesteś i jak wygląda Twój dom. To nie egzamin — chcemy dobrze dobrać parę.',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z',
  },
  {
    num: '03',
    title: 'Spotkaj swojego kota',
    body: 'Umówimy się. Możesz odwiedzić Oazę albo zorganizujemy wizytę u Ciebie. Adopcja to decyzja, którą podejmujesz z otwartymi oczami.',
    iconPath: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  },
]

const trustItems = [
  {
    label: 'Nigdy nie mówimy nie',
    detail: 'FIV, FeLV, nowotwory, wypadki — przyjmujemy każdego',
    icon: (
      <svg className="w-6 h-6 text-oaza-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    label: 'Pełna transparentność',
    detail: 'Publikujemy koszty leczenia każdego kota',
    icon: (
      <svg className="w-6 h-6 text-oaza-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
      </svg>
    ),
  },
  {
    label: 'Dom lub godny koniec',
    detail: 'Każdy kot dostaje miłość, bez względu na prognozy',
    icon: (
      <svg className="w-6 h-6 text-oaza-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Społeczność opiekunów',
    detail: 'Sieć wolontariuszy i adopcyjnych rodzin',
    icon: (
      <svg className="w-6 h-6 text-oaza-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
]

const diagnosisCards = [
  { tag: 'FIV+',              detail: 'Żyje z wirusem — nie przez niego', color: 'bg-red-50 border-red-200' },
  { tag: 'FeLV+',             detail: 'Wymaga uwagi, nie rezygnacji',      color: 'bg-red-50 border-red-200' },
  { tag: 'Nowotwór',          detail: 'Każdy dzień się liczy',             color: 'bg-orange-50 border-orange-200' },
  { tag: 'Senior',            detail: 'Dojrzały, spokojny, wdzięczny',    color: 'bg-violet-50 border-violet-200' },
  { tag: 'Po wypadku',        detail: 'Przeżył — i chce żyć dalej',       color: 'bg-violet-50 border-violet-200' },
  { tag: 'Opieka paliatywna', detail: 'Zasługuje na miłość do końca',     color: 'bg-stone-50 border-stone-200' },
]

const testimonials = [
  {
    quote: 'Bałam się, że nie dam rady. Dragon ma FIV od 4 lat. Śpi teraz na mojej twarzy.',
    name: 'Kasia W.',
    city: 'Warszawa',
    catInfo: 'Dragon, FIV+',
  },
  {
    quote: 'Marchewka straciła łapę. Niczego nie straciła z siebie. Najzuchwalszy kot jakiego znam.',
    name: 'Marek K.',
    city: 'Kraków',
    catInfo: 'Marchewka, trójnóg',
  },
  {
    quote: 'Hugo ma cukrzycę. Wymaga zastrzyków dwa razy dziennie. Warto każdego dnia.',
    name: 'Ania S.',
    city: 'Wrocław',
    catInfo: 'Hugo, cukrzyca',
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
    featuredCats = available.slice(0, 5)
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

  const [spotlightCat, sideCard, ...gridCats] = featuredCats

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            {/* Left: headline + sub */}
            <div className="sm:max-w-[55%]">
              <p className="text-oaza-warm/50 text-[11px] font-semibold uppercase tracking-[0.2em] mb-2 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                Warszawa · Schronisko
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight mb-3 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
                Koty, których nikt inny nie chciał, żyją tutaj.
              </h1>
              <p className="text-green-100/75 text-sm leading-relaxed animate-fade-in-up" style={{ animationDelay: '160ms' }}>
                FIV · FeLV · po wypadkach · terminalnie chore. Każdy zasługuje na szansę.
              </p>
            </div>

            {/* Right: stats + CTAs */}
            <div className="flex flex-col gap-4 animate-fade-in-up sm:items-end" style={{ animationDelay: '240ms' }}>
              {/* Stat pills */}
              <div className="flex gap-4 sm:justify-end">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white leading-none">
                    <AnimatedCounter target={143} className="text-2xl font-bold text-white leading-none" />
                  </p>
                  <p className="text-[10px] text-green-100/55 mt-0.5">adopcji</p>
                </div>
                <div className="w-px bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white leading-none">
                    <AnimatedCounter target={23} className="text-2xl font-bold text-white leading-none" />
                  </p>
                  <p className="text-[10px] text-green-100/55 mt-0.5">czeka</p>
                </div>
                <div className="w-px bg-white/15" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white leading-none">2018</p>
                  <p className="text-[10px] text-green-100/55 mt-0.5">od roku</p>
                </div>
              </div>
              {/* CTAs */}
              <div className="flex gap-2">
                <Link href="/koty" className="inline-flex items-center justify-center bg-oaza-rust text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                  Poznaj koty
                </Link>
                <Link href="/wspieraj" className="inline-flex items-center justify-center border border-white/50 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
                  Wesprzyj →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Featured cats — bento grid ────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Section header */}
          <RevealOnScroll className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-2">Do adopcji</p>
              <h2 className="text-3xl font-bold text-stone-900">Czekają na dom</h2>
            </div>
            <Link
              href="/koty"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-oaza-green hover:underline gap-1"
            >
              Wszystkie koty <span aria-hidden="true">→</span>
            </Link>
          </RevealOnScroll>

          {featuredCats.length > 0 ? (
            <div className="space-y-4">

              {/* Row 1: Spotlight (col-span-2) + Side card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Spotlight — 2 cols */}
                {spotlightCat && (
                  <RevealOnScroll delay={80} className="lg:col-span-2">
                    <Link
                      href={spotlightCat.id > 0 ? `/koty/${spotlightCat.id}` : '/koty'}
                      className="group block card overflow-hidden h-full"
                    >
                      <div className="flex flex-col sm:flex-row h-full">
                        {/* Photo */}
                        <div className="relative w-full sm:w-[50%] aspect-[4/3] sm:aspect-auto sm:min-h-[300px] flex-shrink-0 bg-stone-100 overflow-hidden">
                          {spotlightCat.photo_url ? (
                            <Image
                              src={spotlightCat.photo_url}
                              alt={spotlightCat.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl bg-oaza-green/10">🐱</div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                          {spotlightCat.age_years !== null && (
                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                              {spotlightCat.age_years === 1 ? '1 rok' : spotlightCat.age_years <= 4 ? `${spotlightCat.age_years} lata` : `${spotlightCat.age_years} lat`}
                            </span>
                          )}
                          {spotlightCat.tags && spotlightCat.tags.length > 0 && (
                            <div className="absolute bottom-3 left-3">
                              <CatTagsCompact tags={spotlightCat.tags} />
                            </div>
                          )}
                        </div>
                        {/* Text */}
                        <div className="flex flex-col justify-center p-6 sm:p-8 sm:w-[50%]">
                          <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-2">Wyróżniony</p>
                          <h3 className="text-2xl font-bold text-stone-900 mb-1">{spotlightCat.name}</h3>
                          {spotlightCat.breed && <p className="text-sm text-stone-400 mb-3">{spotlightCat.breed}</p>}
                          {spotlightCat.description && (
                            <p className="text-stone-600 leading-relaxed text-sm line-clamp-3 mb-6">{spotlightCat.description}</p>
                          )}
                          <span className="inline-flex items-center self-start text-sm font-semibold text-oaza-rust group-hover:underline">
                            Poznaj {spotlightCat.name} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealOnScroll>
                )}

                {/* Side card */}
                {sideCard && (
                  <RevealOnScroll delay={160} className="lg:col-span-1">
                    <Link
                      href={sideCard.id > 0 ? `/koty/${sideCard.id}` : '/koty'}
                      className="group block card overflow-hidden h-full"
                    >
                      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[220px] bg-stone-100 overflow-hidden">
                        {sideCard.photo_url ? (
                          <Image
                            src={sideCard.photo_url}
                            alt={sideCard.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-oaza-green/10">🐱</div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                        {sideCard.age_years !== null && (
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {sideCard.age_years === 1 ? '1 rok' : sideCard.age_years <= 4 ? `${sideCard.age_years} lata` : `${sideCard.age_years} lat`}
                          </span>
                        )}
                        {sideCard.tags && sideCard.tags.length > 0 && (
                          <div className="absolute bottom-2 left-3">
                            <CatTagsCompact tags={sideCard.tags.slice(0, 2)} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-stone-900">{sideCard.name}</p>
                        {sideCard.breed && <p className="text-xs text-stone-400 mt-0.5">{sideCard.breed}</p>}
                        {sideCard.description && (
                          <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">{sideCard.description}</p>
                        )}
                        <span className="mt-3 inline-block text-sm font-semibold text-oaza-rust group-hover:underline">
                          Poznaj {sideCard.name} →
                        </span>
                      </div>
                    </Link>
                  </RevealOnScroll>
                )}
              </div>

              {/* Row 2: grid cats — up to 3 */}
              {gridCats.length > 0 && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${gridCats.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
                  {gridCats.map((cat, i) => (
                    <RevealOnScroll key={cat.id} delay={i * 80}>
                      <Link
                        href={cat.id > 0 ? `/koty/${cat.id}` : '/koty'}
                        className="group block card overflow-hidden"
                      >
                        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                          {cat.photo_url ? (
                            <Image
                              src={cat.photo_url}
                              alt={cat.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl bg-oaza-green/10">🐱</div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                          {cat.age_years !== null && (
                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                              {cat.age_years === 1 ? '1 rok' : cat.age_years <= 4 ? `${cat.age_years} lata` : `${cat.age_years} lat`}
                            </span>
                          )}
                          {cat.tags && cat.tags.length > 0 && (
                            <div className="absolute bottom-2 left-3">
                              <CatTagsCompact tags={cat.tags.slice(0, 2)} />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-bold text-stone-900">{cat.name}</p>
                          {cat.breed && <p className="text-xs text-stone-400 mt-0.5">{cat.breed}</p>}
                          {cat.description && (
                            <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                          )}
                          <span className="mt-3 inline-block text-sm font-semibold text-oaza-rust group-hover:underline">
                            Poznaj {cat.name} →
                          </span>
                        </div>
                      </Link>
                    </RevealOnScroll>
                  ))}
                </div>
              )}

              <RevealOnScroll className="pt-4 text-center">
                <Link href="/koty" className="btn-secondary">
                  Zobacz wszystkie koty
                </Link>
              </RevealOnScroll>

            </div>
          ) : (
            <div className="card text-center py-16 px-8">
              <p className="text-4xl mb-4">🏡</p>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Wszystkie koty znalazły dom</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                To najpiękniejsze zdanie, jakie możemy napisać. Możesz pomóc następnym — Twoją wpłatą finansujemy opiekę nad kolejnymi kotami.
              </p>
              <Link href="/wspieraj" className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity">
                Wesprzyj następne koty →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Cat carousel — all available ──────────────────────────────────── */}
      <CatCarousel
        cats={carouselCats}
        eyebrow="Przeglądaj"
        heading="Wszyscy podopieczni"
        linkHref="/koty"
        linkLabel="Pełna lista"
      />

      {/* ── Trust strip ───────────────────────────────────────────────────── */}
      <section className="bg-white py-10 border-b border-stone-100">
        <RevealOnScroll className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustItems.map(({ label, detail, icon }, i) => (
              <RevealOnScroll key={label} delay={i * 80}>
                <div className="group flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-oaza-warm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    {icon}
                  </div>
                  <p className="text-sm font-semibold text-stone-800">{label}</p>
                  <p className="text-xs text-stone-400 leading-snug max-w-[14ch] mx-auto">{detail}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* ── Adopted cats carousel ─────────────────────────────────────────── */}
      <CatCarousel
        cats={adoptedCats}
        eyebrow="Szczęśliwe zakończenia"
        heading="Znalazły dom"
        reverse
      />

      {/* ── Diagnosis section ─────────────────────────────────────────────── */}
      <section className="bg-white py-24 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 md:gap-16 items-start">
            {/* Left: prose */}
            <RevealOnScroll>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-4">
                  Diagnoza to nie wyrok
                </p>
                <h2 className="text-3xl font-bold text-stone-900 leading-tight mb-6">
                  FIV. FeLV. Rak. To słowa, nie zdania.
                </h2>
                <p className="text-stone-600 leading-relaxed mb-5">
                  Wiele kotów żyje z FIV przez całe lata — zdrowo, szczęśliwie, nie zarażając innych
                  kotów przez zwykły kontakt. To wirus, nie wyrok śmierci.
                </p>
                <p className="text-stone-600 leading-relaxed mb-5">
                  Kot terminalnie chory może spędzić u Ciebie rok. Albo dwa. Może cały tydzień. Ale
                  każda godzina spędzona w ciepłym domu, na miękkiej kanapie — jest warta każdego trudu.
                </p>
                <p className="text-stone-600 leading-relaxed mb-8">
                  Adoptując kota z Oazy, nie bierzesz problemu. Bierzesz historię.
                </p>
                <Link
                  href="/jak-adoptowac"
                  className="inline-flex items-center text-sm font-semibold text-oaza-green hover:underline gap-1.5"
                >
                  Dowiedz się więcej o adopcji złożonej <span aria-hidden="true">→</span>
                </Link>
              </div>
            </RevealOnScroll>

            {/* Right: diagnosis tag grid */}
            <RevealOnScroll delay={200} className="grid grid-cols-2 gap-3">
              {diagnosisCards.map(({ tag, detail, color }) => (
                <div
                  key={tag}
                  className={`rounded-xl border p-4 ${color} transition-all duration-300 hover:-translate-y-1 hover:shadow-sm`}
                >
                  <p className="font-semibold text-stone-800 text-sm">{tag}</p>
                  <p className="text-xs text-stone-500 mt-1 leading-snug">{detail}</p>
                </div>
              ))}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── How to adopt ──────────────────────────────────────────────────── */}
      <section className="bg-oaza-warm/40 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Jak przebiega adopcja?</h2>
            <p className="text-stone-500 text-sm">Trzy kroki. Bez zbędnych formalności.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Animated connecting line on desktop */}
            <StepConnector />
            {adoptionSteps.map((step, i) => (
              <RevealOnScroll key={step.num} delay={i * 150}>
                <div className="flex flex-col relative">
                  <span className="text-6xl font-bold text-oaza-green/15 leading-none mb-3">
                    {step.num}
                  </span>
                  <div className="mb-4">
                    <svg
                      className="w-6 h-6 text-oaza-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={step.iconPath} />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/jak-adoptowac" className="btn-secondary">
              Dowiedz się więcej o adopcji
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <RevealOnScroll>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-stone-400 mb-16">
              Co mówią opiekunowie
            </p>
          </RevealOnScroll>
          <div className="border border-stone-100 rounded-3xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-stone-100 grid grid-cols-1 md:grid-cols-3">
            {testimonials.map(({ quote, name, city, catInfo }, i) => (
              <RevealOnScroll key={name} delay={i * 100}>
                <div className="flex flex-col p-8 h-full">
                  <span
                    className="text-6xl font-serif text-oaza-green/20 leading-none select-none mb-4"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="flex-1">
                    <p className="text-stone-700 leading-relaxed text-[1.05rem] italic">{quote}</p>
                  </blockquote>
                  <footer className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-oaza-warm flex items-center justify-center flex-shrink-0">
                      <span className="text-oaza-green font-bold text-sm">{name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{name}</p>
                      <p className="text-xs text-stone-400">{city} · opiekun: {catInfo}</p>
                    </div>
                  </footer>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Donate CTA ────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RevealOnScroll>
            <div>
              <h2 className="text-2xl font-bold mb-4">Nie możesz adoptować? Możesz ocalić.</h2>
              <p className="text-green-100 mb-3 leading-relaxed">
                Wiele naszych kotów wymaga ciągłego leczenia — nie tylko domu.
                Każda złotówka trafia bezpośrednio na weterynarza, leki i opiekę.
              </p>
              <p className="text-green-200/80 text-sm mb-8">
                Miesięczna opieka nad jednym kotem kosztuje około 300 zł — weterynarz, leki,
                jedzenie, miłość.
              </p>

              {/* Cat feature */}
              <div className="mb-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
                <div className="relative w-14 h-14 flex-shrink-0">
                  {/* Pulse ring */}
                  <div className="animate-pulse-ring absolute inset-0 rounded-full" aria-hidden="true" />
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/40 bg-oaza-green/30 relative">
                    <Image
                      src="https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg"
                      alt="Hugo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-green-100 text-sm text-center sm:text-left max-w-xs">
                  <strong className="text-white">Hugo</strong> (cukrzyca) kosztuje ok. 350 zł miesięcznie.
                  Twoja wpłata może pokryć jego leczenie na tydzień.
                </p>
              </div>

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
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}
