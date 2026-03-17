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

const STATIC_FEATURED: Cat[] = [
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
      'Dragon żyje z FIV od urodzenia. Wbrew nazwie jest wyjątkowo delikatny i przywiązuje się do jednej osoby.',
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
]

const diagnosisItems = [
  {
    tag: 'FIV+',
    sentence:
      'Wiele kotów żyje z FIV przez całe lata — zdrowo, szczęśliwie, nie zarażając innych przez zwykły kontakt.',
  },
  {
    tag: 'FeLV+',
    sentence: 'Wymaga wyłącznie zamkniętego domu. Poza tym — kocha jak każdy inny, może mocniej.',
  },
  {
    tag: 'Nowotwór',
    sentence:
      'Rok, może dwa, może tydzień. Każda godzina na miękkiej kanapie jest warta każdego trudu.',
  },
  {
    tag: 'Senior',
    sentence: 'Dojrzały, spokojny, wdzięczny. Wie, czego chce. Nie musisz go już wychowywać.',
  },
  {
    tag: 'Po wypadku',
    sentence: 'Przeżył. Ciało się goi, chęć do życia jest nienaruszona.',
  },
  {
    tag: 'Paliatywna',
    sentence:
      'Zasługuje na miłość do końca. Jego koniec będzie spokojny, jeśli mu to dasz.',
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

function ageLabel(years: number): string {
  if (years === 1) return '1 rok'
  if (years >= 2 && years <= 4) return `${years} lata`
  return `${years} lat`
}

export default async function HomePage() {
  let featuredCats: Cat[] = []
  let carouselCats: Cat[] = []
  let adoptedCats: Cat[] = []
  try {
    const page = await getCats()
    const all = page.items
    const available = all.filter((c) => !c.is_adopted)
    const adopted = all.filter((c) => c.is_adopted)
    featuredCats = available.slice(0, 5)
    if (!featuredCats.some((c) => c.tags?.length > 0)) featuredCats = STATIC_FEATURED
    carouselCats = available
    adoptedCats = adopted
  } catch {
    featuredCats = STATIC_FEATURED
  }
  if (featuredCats.length === 0) featuredCats = STATIC_FEATURED

  const [spotlightCat, sideCard, ...gridCats] = featuredCats

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16 items-center">

            {/* Left: headline + stats + CTA */}
            <div>
              <h1 className="font-display font-bold leading-[1.0] tracking-[-0.03em] text-5xl sm:text-6xl lg:text-7xl mb-6 animate-fade-in-up">
                Koty,{' '}
                <br className="hidden sm:block" />
                których nikt{' '}
                <br className="hidden sm:block" />
                inny nie chciał.
              </h1>
              <p className="text-green-100/75 text-base sm:text-lg leading-relaxed max-w-sm mb-10">
                FIV · FeLV · po wypadkach · terminalnie chore.
                Każdy zasługuje na szansę.
              </p>

              {/* Stats row */}
              <div className="flex items-baseline gap-8 mb-10 border-t border-white/10 pt-8">
                <div>
                  <p className="text-4xl font-black text-white leading-none tracking-tight font-display">
                    <AnimatedCounter target={143} />
                  </p>
                  <p className="text-[11px] text-green-200/50 mt-1.5 uppercase tracking-widest">adopcji</p>
                </div>
                <div className="w-px h-8 bg-white/15 self-center" />
                <div>
                  <p className="text-4xl font-black text-white leading-none tracking-tight font-display">
                    <AnimatedCounter target={23} />
                  </p>
                  <p className="text-[11px] text-green-200/50 mt-1.5 uppercase tracking-widest">czeka</p>
                </div>
                <div className="w-px h-8 bg-white/15 self-center" />
                <div>
                  <p className="text-4xl font-black text-white leading-none tracking-tight font-display">2018</p>
                  <p className="text-[11px] text-green-200/50 mt-1.5 uppercase tracking-widest">od roku</p>
                </div>
              </div>

              <Link
                href="/koty"
                className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Poznaj koty →
              </Link>
            </div>

            {/* Right: spotlight cat photo */}
            <div className="hidden lg:block relative h-[460px]">
              {spotlightCat?.photo_url ? (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src={spotlightCat.photo_url}
                    alt={spotlightCat.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 0px, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-oaza-green/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-white font-bold text-lg font-display">{spotlightCat.name}</p>
                    {spotlightCat.tags && spotlightCat.tags.length > 0 && (
                      <div className="mt-2">
                        <CatTagsCompact tags={spotlightCat.tags.slice(0, 2)} />
                      </div>
                    )}
                  </div>
                  {spotlightCat.age_years !== null && (
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {ageLabel(spotlightCat.age_years)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 rounded-2xl bg-oaza-green/30" />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Featured cats bento grid ──────────────────────────────────────── */}
      <section className="bg-[#FAF9F7] py-20">
        <div className="max-w-5xl mx-auto px-4">

          <RevealOnScroll className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Do adopcji</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">Czekają na dom</h2>
            </div>
            <Link
              href="/koty"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-oaza-green hover:underline gap-1"
            >
              Wszystkie koty <span aria-hidden="true">→</span>
            </Link>
          </RevealOnScroll>

          <div className="space-y-4">
            {/* Row 1: spotlight (2 cols) + side card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {spotlightCat && (
                <RevealOnScroll delay={80} className="lg:col-span-2">
                  <Link
                    href={spotlightCat.id > 0 ? `/koty/${spotlightCat.id}` : '/koty'}
                    className="group block bg-white rounded-xl border border-stone-200/60 overflow-hidden h-full"
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="relative w-full sm:w-[55%] aspect-[4/3] sm:aspect-auto sm:min-h-[320px] flex-shrink-0 bg-stone-100 overflow-hidden">
                        {spotlightCat.photo_url ? (
                          <Image
                            src={spotlightCat.photo_url}
                            alt={spotlightCat.name}
                            fill
                            className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
                            priority
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 400px"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100" />
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                        {spotlightCat.age_years !== null && (
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {ageLabel(spotlightCat.age_years)}
                          </span>
                        )}
                        {spotlightCat.tags && spotlightCat.tags.length > 0 && (
                          <div className="absolute bottom-3 left-3">
                            <CatTagsCompact tags={spotlightCat.tags} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-6 sm:p-8">
                        <h3 className="text-2xl font-bold text-stone-900 mb-1 font-display">{spotlightCat.name}</h3>
                        {spotlightCat.breed && (
                          <p className="text-sm text-stone-400 mb-4">{spotlightCat.breed}</p>
                        )}
                        {spotlightCat.description && (
                          <p className="text-stone-600 leading-relaxed text-sm line-clamp-4 mb-6">
                            {spotlightCat.description}
                          </p>
                        )}
                        <span className="inline-flex items-center self-start text-sm font-semibold text-oaza-rust group-hover:underline">
                          Poznaj {spotlightCat.name} →
                        </span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              )}

              {sideCard && (
                <RevealOnScroll delay={160}>
                  <Link
                    href={sideCard.id > 0 ? `/koty/${sideCard.id}` : '/koty'}
                    className="group block bg-white rounded-xl border border-stone-200/60 overflow-hidden h-full"
                  >
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[240px] bg-stone-100 overflow-hidden">
                      {sideCard.photo_url ? (
                        <Image
                          src={sideCard.photo_url}
                          alt={sideCard.name}
                          fill
                          className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
                          sizes="(max-width: 1024px) 100vw, 340px"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-100" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                      {sideCard.age_years !== null && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {ageLabel(sideCard.age_years)}
                        </span>
                      )}
                      {sideCard.tags && sideCard.tags.length > 0 && (
                        <div className="absolute bottom-2 left-3">
                          <CatTagsCompact tags={sideCard.tags.slice(0, 2)} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-stone-900 font-display">{sideCard.name}</p>
                      {sideCard.breed && (
                        <p className="text-xs text-stone-400 mt-0.5">{sideCard.breed}</p>
                      )}
                      {sideCard.description && (
                        <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {sideCard.description}
                        </p>
                      )}
                      <span className="mt-3 inline-block text-sm font-semibold text-oaza-rust group-hover:underline">
                        Poznaj {sideCard.name} →
                      </span>
                    </div>
                  </Link>
                </RevealOnScroll>
              )}
            </div>

            {/* Row 2: grid cats with varied aspect ratios */}
            {gridCats.length > 0 && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${gridCats.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
                {gridCats.map((cat, i) => (
                  <RevealOnScroll key={cat.id} delay={i * 80}>
                    <Link
                      href={cat.id > 0 ? `/koty/${cat.id}` : '/koty'}
                      className="group block bg-white rounded-xl border border-stone-200/60 overflow-hidden"
                    >
                      <div className={`relative bg-stone-100 overflow-hidden ${i % 3 === 0 ? 'aspect-video' : 'aspect-[4/3]'}`}>
                        {cat.photo_url ? (
                          <Image
                            src={cat.photo_url}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100" />
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                        {cat.age_years !== null && (
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {ageLabel(cat.age_years)}
                          </span>
                        )}
                        {cat.tags && cat.tags.length > 0 && (
                          <div className="absolute bottom-2 left-3">
                            <CatTagsCompact tags={cat.tags.slice(0, 2)} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-stone-900 font-display">{cat.name}</p>
                        {cat.breed && (
                          <p className="text-xs text-stone-400 mt-0.5">{cat.breed}</p>
                        )}
                        {cat.description && (
                          <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
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
        </div>
      </section>

      {/* ── 3. Values strip — divide-x text row, no icons ────────────────────── */}
      <section className="border-y border-stone-100 bg-white">
        <RevealOnScroll className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            {[
              { label: 'Nigdy nie mówimy nie', detail: 'FIV, FeLV, nowotwory, wypadki — przyjmujemy każdego' },
              { label: 'Pełna transparentność', detail: 'Publikujemy koszty leczenia każdego podopiecznego' },
              { label: 'Dom lub godny koniec', detail: 'Każdy kot dostaje miłość, bez względu na prognozy' },
              { label: 'Sieć opiekunów', detail: 'Wolontariusze i adopcyjne rodziny po całej Polsce' },
            ].map(({ label, detail }) => (
              <div key={label} className="flex-1 py-7 sm:px-8 first:pl-0 last:pr-0">
                <p className="font-semibold text-stone-800 text-sm">{label}</p>
                <p className="text-xs text-stone-400 leading-snug mt-1 max-w-[20ch]">{detail}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* ── 4. All cats marquee ───────────────────────────────────────────────── */}
      <CatCarousel
        cats={carouselCats}
        eyebrow="Przeglądaj"
        heading="Wszyscy podopieczni"
        linkHref="/koty"
        linkLabel="Pełna lista"
      />

      {/* ── 5. Diagnosis list ─────────────────────────────────────────────────── */}
      <section className="bg-white py-24 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-20 items-start">

            <RevealOnScroll>
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Diagnoza to nie wyrok</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 leading-tight mb-6">
                FIV. FeLV. Rak.
                <br />
                To słowa,
                <br className="hidden sm:block" /> nie zdania.
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Adoptując kota z Oazy, nie bierzesz problemu.
                Bierzesz historię.
              </p>
              <Link
                href="/jak-adoptowac"
                className="inline-flex items-center text-sm font-semibold text-oaza-green hover:underline gap-1.5"
              >
                Jak wygląda adopcja złożonego kota <span aria-hidden="true">→</span>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="divide-y divide-stone-100">
                {diagnosisItems.map(({ tag, sentence }) => (
                  <div key={tag} className="flex items-baseline gap-6 py-5">
                    <p className="font-display italic text-xl text-stone-900 w-28 shrink-0 leading-snug">{tag}</p>
                    <p className="text-stone-500 text-sm leading-relaxed">{sentence}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* ── 6. How to adopt — steps without icons ────────────────────────────── */}
      <section className="bg-oaza-warm/40 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <RevealOnScroll className="mb-14">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 mb-2">Jak przebiega adopcja?</h2>
            <p className="text-stone-500 text-sm">Trzy kroki. Bez zbędnych formalności.</p>
          </RevealOnScroll>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepConnector />
            {adoptionSteps.map((step, i) => (
              <RevealOnScroll key={step.num} delay={i * 150}>
                <div className="flex flex-col">
                  <span className="font-display font-black text-7xl text-oaza-green/15 leading-none mb-4 select-none">
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/jak-adoptowac" className="btn-secondary">
              Więcej o procesie adopcji
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Testimonials — 5:3 asymmetric layout ──────────────────────────── */}
      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <RevealOnScroll>
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-16">Co mówią opiekunowie</p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] border border-stone-100 rounded-2xl overflow-hidden">
            {/* Large featured quote */}
            <RevealOnScroll className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-stone-100">
              <span className="block font-display text-[72px] leading-none text-oaza-green/20 select-none mb-4" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>
                <p className="font-display italic text-stone-800 text-xl sm:text-2xl leading-relaxed">
                  {testimonials[0].quote}
                </p>
              </blockquote>
              <footer className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-oaza-warm flex items-center justify-center flex-shrink-0">
                  <span className="text-oaza-green font-bold text-sm">{testimonials[0].name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{testimonials[0].name}</p>
                  <p className="text-xs text-stone-400">
                    {testimonials[0].city} · opiekun: {testimonials[0].catInfo}
                  </p>
                </div>
              </footer>
            </RevealOnScroll>

            {/* Two smaller quotes */}
            <div className="divide-y divide-stone-100">
              {testimonials.slice(1).map(({ quote, name, city, catInfo }, i) => (
                <RevealOnScroll key={name} delay={(i + 1) * 100} className="p-6 md:p-8">
                  <span className="block font-display text-4xl leading-none text-oaza-green/20 select-none mb-3" aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote>
                    <p className="font-display italic text-stone-600 text-sm leading-relaxed">{quote}</p>
                  </blockquote>
                  <footer className="mt-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-oaza-warm flex items-center justify-center flex-shrink-0">
                      <span className="text-oaza-green font-bold text-xs">{name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 text-xs">{name}</p>
                      <p className="text-[11px] text-stone-400">
                        {city} · {catInfo}
                      </p>
                    </div>
                  </footer>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Adopted cats carousel ─────────────────────────────────────────── */}
      <CatCarousel
        cats={adoptedCats}
        eyebrow="Szczęśliwe zakończenia"
        heading="Znalazły dom"
        reverse
      />

      {/* ── 9. Editorial quote section ───────────────────────────────────────── */}
      <section className="bg-oaza-warm py-24">
        <div className="max-w-3xl mx-auto px-8">
          <span
            className="block font-display text-[120px] leading-none text-oaza-green/15 select-none -mb-6"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote>
            <p className="font-display italic text-3xl lg:text-4xl text-stone-900 leading-snug">
              Adoptując kota z Oazy, nie bierzesz problemu. Bierzesz historię.
            </p>
          </blockquote>
          <p className="mt-8 text-sm text-stone-400 not-italic">— od 2018 roku, Warszawa</p>
        </div>
      </section>

      {/* ── 10. Donate CTA ───────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 items-center">

            <RevealOnScroll>
              <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-4">
                Nie możesz adoptować?
                <br />
                Możesz ocalić.
              </h2>
              <p className="text-green-100/80 leading-relaxed mb-3">
                Wiele naszych kotów wymaga ciągłego leczenia — nie tylko domu.
                Każda złotówka trafia bezpośrednio na weterynarza, leki i opiekę.
              </p>
              <p className="text-green-200/60 text-sm mb-8 leading-relaxed">
                22 zł — tydzień leków.<br />
                50 zł — wizyta kontrolna.<br />
                150 zł — pełne badania krwi.
              </p>
              <Link
                href="/wspieraj"
                className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Wesprzyj leczenie
              </Link>
            </RevealOnScroll>

            <RevealOnScroll delay={120}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-oaza-green/40">
                <Image
                  src="https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg"
                  alt="Hugo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-white font-bold text-lg font-display">Hugo</p>
                  <p className="text-white/70 text-xs mt-0.5">12 lat · cukrzyca · ok. 350 zł / mies.</p>
                </div>
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>
    </>
  )
}
