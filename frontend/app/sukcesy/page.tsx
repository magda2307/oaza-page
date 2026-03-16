import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { successStories, featuredStory } from '@/lib/successStories'
import SuccessFilter from '@/components/SuccessFilter'

export const metadata: Metadata = {
  title: 'Sukcesy — koty, które znalazły dom',
  description:
    'Historie kotów z Oazy, które trafiły do nowych domów — mimo FIV, FeLV, wypadków, raka i trudnych diagnoz. Prawdziwe adopcje, prawdziwe rodziny.',
}

const STORY_TAG_META: Record<string, { label: string; className: string }> = {
  fiv:               { label: 'FIV+',             className: 'bg-red-100 text-red-800' },
  felv:              { label: 'FeLV+',             className: 'bg-red-100 text-red-800' },
  nowotwor:          { label: 'Nowotwór',          className: 'bg-red-100 text-red-800' },
  opieka_paliatywna: { label: 'Opieka paliatywna', className: 'bg-red-100 text-red-800' },
  senior:            { label: 'Senior',            className: 'bg-violet-100 text-violet-800' },
  trojnog:           { label: 'Trójnóg',           className: 'bg-violet-100 text-violet-800' },
  po_wypadku:        { label: 'Po wypadku',        className: 'bg-violet-100 text-violet-800' },
  wymaga_lekow:      { label: 'Wymaga leków',      className: 'bg-violet-100 text-violet-800' },
  po_operacji:       { label: 'Po operacji',       className: 'bg-violet-100 text-violet-800' },
}

function DiagnosisChip({ tagKey }: { tagKey: string }) {
  const meta = STORY_TAG_META[tagKey]
  if (!meta) return null
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}

export default function SukcesyPage() {
  const featured = featuredStory
  const visibleFeaturedTags = featured.diagnosis_tags.slice(0, 3)

  return (
    <main>
      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-300 mb-4">
            Warszawa · 143 koty zaadoptowane
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-2xl">
            Znalazły dom. Mimo wszystko.
          </h1>
          <p className="text-green-100 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
            Każda historia na tej stronie zaczęła się od diagnozy, wypadku lub wyroku. Każda kończy
            się kanapą, imieniem i człowiekiem, który wybrał właśnie ten kot — nie pomimo historii,
            ale razem z nią.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/koty"
              className="btn-primary"
            >
              Adoptuj trudnego kota
            </Link>
            <Link
              href="/wspieraj"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              Wesprzyj ich leczenie →
            </Link>
          </div>
          <p className="text-xs text-green-300/70">
            Histoire prawdziwe. Imiona opiekunów za zgodą adopcyjnych rodzin.
          </p>
        </div>
      </section>

      {/* ── Section 2: Stats band ───────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 text-center">
            <div className="py-6 sm:py-0 sm:px-8">
              <p className="text-4xl font-bold text-oaza-green mb-1">143</p>
              <p className="text-sm text-stone-500">koty zaadoptowane od 2022 roku</p>
            </div>
            <div className="py-6 sm:py-0 sm:px-8">
              <p className="text-4xl font-bold text-oaza-green mb-1">Ponad 80%</p>
              <p className="text-sm text-stone-500">z trudną diagnozą zdrowotną</p>
            </div>
            <div className="py-6 sm:py-0 sm:px-8">
              <p className="text-4xl font-bold text-oaza-green mb-1">4,8 / 5</p>
              <p className="text-sm text-stone-500">średnia ocena adopcji w ankiecie po roku</p>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-3 text-center">
            Ankieta wysłana po 12 miesiącach, 89 odpowiedzi
          </p>
        </div>
      </section>

      {/* ── Section 3: Story grid with filter ──────────────────────────── */}
      <section className="bg-oaza-warm py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
            Historie adopcji
          </h2>
          <p className="text-stone-600 text-lg mb-10 max-w-2xl">
            Każda historia to prawdziwa osoba i prawdziwy kot. Żadna nie jest łatwa. Wszystkie są
            warte opowiedzenia.
          </p>
          <SuccessFilter stories={successStories} />
        </div>
      </section>

      {/* ── Section 4: Featured spotlight ──────────────────────────────── */}
      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="card bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left photo column */}
              <div className="md:w-[45%] aspect-[4/3] md:aspect-auto md:min-h-[440px] relative overflow-hidden bg-stone-100 shrink-0">
                {featured.cat_photo_url ? (
                  <Image
                    src={featured.cat_photo_url}
                    alt={featured.cat_photo_alt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl bg-oaza-green/10">
                    🐱
                  </div>
                )}
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                {/* Year badge */}
                <span className="absolute top-4 right-4 bg-white/90 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {featured.adoption_year}
                </span>
                {/* Diagnosis chips */}
                {visibleFeaturedTags.length > 0 && (
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                    {visibleFeaturedTags.map((tag) => (
                      <DiagnosisChip key={tag} tagKey={tag} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right text column */}
              <div className="md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
                <div
                  className="text-5xl font-serif leading-none text-oaza-green/40 select-none mb-2"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <blockquote className="text-xl md:text-2xl italic text-stone-800 leading-relaxed mb-6">
                  {featured.quote}
                </blockquote>
                <p className="text-sm font-semibold text-stone-600">
                  — {featured.adopter_name}, {featured.adopter_city}
                </p>
                <hr className="border-t border-stone-100 my-6 w-16" />
                <p className="text-lg font-bold text-stone-900">{featured.cat_name}</p>
                <p className="text-sm text-stone-400">{featured.adoption_year}</p>
                {featured.story_slug && (
                  <Link
                    href={`/blog/${featured.story_slug}`}
                    className="mt-4 text-sm font-semibold text-oaza-rust hover:underline self-start"
                  >
                    Czytaj pełną historię →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Mission restatement ─────────────────────────────── */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-oaza-green mb-6">
            Każda historia zaczyna się od &ldquo;tak&rdquo;.
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed">
            Nigdy nie pytamy, czy warto. FIV, FeLV, rak, trzy nogi, ślepota, podeszły wiek —
            przyjmujemy i szukamy. Większość naszych kotów wylądowała na czyjejś kanapie. Część
            doczekała końca w ludzkim cieple. Wszystkie były ważne.
          </p>
        </div>
      </section>

      {/* ── Section 6: Hesitant adopter CTA ────────────────────────────── */}
      <section className="bg-oaza-warm/40 py-20 border-t border-oaza-warm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                Boisz się, że nie dasz rady?
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Wszyscy adopcyjni rodzice na tej stronie tak samo się bali. Żaden z nich nie żałuje.
                Towarzyszymy Ci przez cały okres adaptacji — szczególnie gdy kot jest chory i wymaga
                opieki.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/koty" className="btn-primary">
                  Poznaj koty do adopcji
                </Link>
                <Link href="/jak-adoptowac" className="btn-secondary">
                  Jak wygląda adopcja?
                </Link>
              </div>
            </div>

            {/* Right — mini quote cards */}
            <div>
              <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
                <p className="text-stone-700 italic text-sm leading-relaxed mb-3">
                  &ldquo;Nie miałam żadnego doświadczenia z chorymi zwierzętami. Oaza była ze mną
                  przez każdy kryzys.&rdquo;
                </p>
                <p className="text-xs font-semibold text-stone-400">— Marta, Gdańsk</p>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
                <p className="text-stone-700 italic text-sm leading-relaxed mb-3">
                  &ldquo;Bałam się kosztów. Oaza od początku była szczera — i pomogła mi planować z
                  głową.&rdquo;
                </p>
                <p className="text-xs font-semibold text-stone-400">— Anna, Łódź</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Donor CTA ────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Twoje pieniądze napisały część tych historii.
          </h2>
          <p className="text-green-100 text-lg leading-relaxed mb-4">
            Każda wizyta weterynaryjna, każda tabletka, każda rehabilitacja po wypadku — to
            darowizny takie jak Twoja. Bez nich tych historii by nie było.
          </p>
          <p className="text-green-300 text-sm mb-10">
            Miesięczna opieka nad jednym kotem kosztuje około 300 zł. Możesz wybrać kwotę
            jednorazową lub stały przelew.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/wspieraj"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-oaza-rust text-white font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Sfinansuj leczenie kota
            </Link>
            <Link
              href="/koty"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              Przeglądaj koty
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
