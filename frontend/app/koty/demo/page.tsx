/**
 * /koty/demo — hardcoded example cat profile for design review.
 * Shows every section: personality, compatibility, medical, ideal home.
 * Safe to visit without a running API.
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CatTags, CatTagsCompact } from '@/components/CatTags'
import { ageLabel } from '@/lib/format'
import { StickyAdoptCTA } from '@/components/StickyAdoptCTA'

export const metadata: Metadata = {
  title: 'Marchewka — Oaza (demo)',
  description: 'Przykładowy profil kota do podglądu projektu.',
}

// ── Demo cat data ─────────────────────────────────────────────────────────────

const DEMO_CAT = {
  id: 0,
  name: 'Marchewka',
  age_years: 8,
  breed: 'Dachowiec',
  is_adopted: false,
  photo_url: 'https://static.pomagam.pl/media/project_photos/cache/GXTYZ5QBlsmN.jpg',
  description:
    'Marchewka trafiła do nas po wypadku drogowym trzy lata temu. Straciła tylną łapę — ale nie straciła ani grama osobowości. ' +
    'Pierwszego tygodnia chowała się pod łóżkiem. Drugiego zaczęła wychodzić na kolację. Trzeciego usiadła obok ciebie na kanapie i mruczała przez całą noc. ' +
    'Tak już zostało. Nie narzuca się, ale zawsze jest w pobliżu. Lubi obserwować, co robisz. Lubi ciepłe miejsca i spokój. ' +
    'Trójnogi chód wygląda zabawnie — dla niej to po prostu sposób na życie.',
  tags: [
    // personality
    'spokojny', 'czuly', 'niesmialy',
    // compatibility
    'tylko_do_domu', 'dla_poczatkujacych', 'jako_jedynak',
    // health
    'po_wypadku', 'trojnog', 'senior',
    // management
    'wymaga_lekow',
  ],
}

const DEMO_RELATED = [
  {
    id: -1,
    name: 'Dragon',
    age_years: 5,
    breed: 'Dachowiec',
    is_adopted: false,
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/cNb7X85pgsIn.jpg',
    tags: ['fiv', 'spokojny'],
  },
  {
    id: -2,
    name: 'Karmel',
    age_years: 7,
    breed: 'Dachowiec',
    is_adopted: true,
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/qC8KyJ-hffJ-.jpg',
    tags: ['nowotwor', 'w_leczeniu'],
  },
  {
    id: -3,
    name: 'Hugo',
    age_years: 12,
    breed: 'Dachowiec',
    is_adopted: false,
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg',
    tags: ['senior', 'cukrzyca'],
  },
]

// ── Tag sets ──────────────────────────────────────────────────────────────────

const PERSONALITY_TAGS = [
  'przytulasek', 'zabawny', 'spokojny', 'towarzyski', 'ciekawski',
  'gadatliwy', 'niezalezny', 'czuly', 'energiczny', 'zrownowazona',
  'niesmialy', 'plochliwy',
]
const COMPAT_POSITIVE_TAGS = [
  'lubi_koty', 'lubi_psy', 'lubi_dzieci', 'tylko_do_domu',
  'dla_poczatkujacych', 'para_nierozlaczna',
]
const COMPAT_CAUTION_TAGS = [
  'jako_jedynak', 'wymaga_doswiadczenia', 'potrzebuje_ciszy',
  'nie_dla_dzieci', 'agresywny',
]
const HEALTH_SERIOUS_TAGS = ['fiv', 'felv', 'nowotwor', 'terminalnie_chory', 'opieka_paliatywna']
const HEALTH_SPECIAL_TAGS = [
  'senior', 'kociak', 'trojnog', 'niewidomy', 'gluchy', 'choroba_nerek',
  'cukrzyca', 'choroba_serca', 'astma', 'ch_chwiejny', 'po_wypadku',
  'wymaga_lekow', 'po_operacji', 'bezzebny', 'w_leczeniu',
]

const MEDICAL_CONTEXT: Record<string, string> = {
  fiv: 'Kot FIV+ może żyć wiele lat. Wirus nie przenosi się na ludzi. Potrzebuje tylko domu — jak każdy inny.',
  felv: 'FeLV wymaga monitoringu i opieki weterynaryjnej. Nie przenosi się na ludzi ani psy.',
  nowotwor: 'Leczony onkologicznie. Regularnie pod opieką weterynarza.',
  terminalnie_chory: 'Leczenie nieuleczalne — celem jest komfort i jakość ostatnich miesięcy.',
  opieka_paliatywna: 'Wymaga opieki paliatywnej: leki, wizyty weterynaryjne, cisza i spokój.',
  cukrzyca: 'Wymaga regularnych zastrzyków insuliny, dwa razy dziennie. Schemat szybko staje się rutyną.',
  choroba_nerek: 'Wymaga specjalnej diety i regularnych badań krwi.',
  choroba_serca: 'Pod stałą opieką kardiologa weterynaryjnego.',
  astma: 'Wymaga inhalatora przy atakach. Unikamy dymu, zapachów, środków czystości.',
  trojnog: 'Trzy łapy działają tak samo jak cztery. Adaptuje się szybko.',
  niewidomy: 'Niewidomy kot w stabilnym otoczeniu radzi sobie świetnie. Nie przestawiaj mebli.',
  gluchy: 'Głuchota nie przeszkadza w mruczeniu. Komunikacja przez dotyk i wibracje.',
  bezzebny: 'Bez zębów — mokra karma lub namoczona sucha. Nic mu nie brakuje.',
  wymaga_lekow: 'Regularnie przyjmuje leki. Dawkowanie jest proste, po kilku dniach staje się nawykiem.',
  po_wypadku: 'Przeszedł poważny wypadek. Zrehabilitowany — gotowy na spokojny dom.',
  po_operacji: 'Po operacji — w pełni wyleczony. Regularne kontrole weterynaryjne.',
  w_leczeniu: 'Aktualnie w trakcie leczenia. Stabilny i monitorowany.',
  senior: 'Senior potrzebuje ciepłego miejsca i spokojnego rytmu. Nie wymaga dużo — za to daje stabilną obecność.',
}

// ── Helper components ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-10 mt-10 border-t border-stone-100">
      <h2 className="font-display font-bold text-xl text-stone-900 mb-5">{title}</h2>
      {children}
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-stone-100 last:border-0">
      <span className="text-sm text-stone-400 shrink-0">{label}</span>
      <span className="text-sm text-stone-800 font-medium text-right">{value}</span>
    </div>
  )
}

type CompatStatus = 'yes' | 'no' | 'unknown'
function CompatBadge({ status, label }: { status: CompatStatus; label: string }) {
  const styles: Record<CompatStatus, { wrapper: string; icon: string; iconColor: string; labelColor: string }> = {
    yes:     { wrapper: 'bg-emerald-50 border border-emerald-200', icon: '✓', iconColor: 'text-emerald-700', labelColor: 'text-stone-700' },
    no:      { wrapper: 'bg-rose-50 border border-rose-200',       icon: '✗', iconColor: 'text-rose-600',    labelColor: 'text-stone-700' },
    unknown: { wrapper: 'bg-stone-50 border border-stone-200',     icon: '?', iconColor: 'text-stone-400',   labelColor: 'text-stone-400' },
  }
  const s = styles[status]
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${s.wrapper}`}>
      <span className={`text-sm font-bold leading-none ${s.iconColor}`}>{s.icon}</span>
      <span className={`text-sm font-medium ${s.labelColor}`}>{label}</span>
    </div>
  )
}

function getCompatStatus(tags: string[], yesTag?: string, noTag?: string): CompatStatus {
  if (yesTag && tags.includes(yesTag)) return 'yes'
  if (noTag  && tags.includes(noTag))  return 'no'
  return 'unknown'
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DemoKotPage() {
  const cat  = DEMO_CAT
  const tags = cat.tags

  const ageLine = [ageLabel(cat.age_years), cat.breed].filter(Boolean).join(' · ')

  const personalityTags    = tags.filter(t => PERSONALITY_TAGS.includes(t))
  const cautionTags        = tags.filter(t => COMPAT_CAUTION_TAGS.includes(t))
  const hasPersonality     = personalityTags.length > 0 || cautionTags.length > 0
  const hasCompat          = [...COMPAT_POSITIVE_TAGS, ...COMPAT_CAUTION_TAGS].some(t => tags.includes(t))
  const hasPairTag         = tags.includes('para_nierozlaczna')
  const healthSeriousTags  = tags.filter(t => HEALTH_SERIOUS_TAGS.includes(t))
  const healthSpecialTags  = tags.filter(t => HEALTH_SPECIAL_TAGS.includes(t))
  const hasHealth          = healthSeriousTags.length > 0 || healthSpecialTags.length > 0
  const hasSpecialNeeds    = healthSeriousTags.length > 0 || healthSpecialTags.length > 0

  const honestTruth = tags.includes('po_wypadku') || tags.includes('trojnog')
    ? 'Przeżył wypadek. Ciało się goi. Chęć do życia jest nienaruszona.'
    : tags.includes('senior')
    ? 'Dojrzały, spokojny, wdzięczny. Wie, czego chce — i nie będzie Cię tego uczyć.'
    : null

  const idealHomeBullets: string[] = []
  if (tags.includes('niesmialy') || tags.includes('plochliwy') || tags.includes('potrzebuje_ciszy'))
    idealHomeBullets.push('Spokojne, ciche otoczenie — bez głośnej muzyki, bez zamieszania')
  if (tags.includes('jako_jedynak'))
    idealHomeBullets.push('Najlepiej bez innych kotów, przynajmniej na początku')
  if (tags.includes('nie_dla_dzieci'))
    idealHomeBullets.push('Nie dla rodzin z małymi dziećmi')
  if (tags.includes('tylko_do_domu'))
    idealHomeBullets.push('Dom bez wyjścia na zewnątrz — kot wyłącznie domowy')
  if (tags.includes('wymaga_doswiadczenia'))
    idealHomeBullets.push('Opiekun z doświadczeniem w pracy z nieśmiałymi lub chorymi kotami')
  if (tags.includes('dla_poczatkujacych'))
    idealHomeBullets.push('Świetny wybór dla kogoś, kto adoptuje kota po raz pierwszy')
  if (tags.includes('para_nierozlaczna'))
    idealHomeBullets.push('Musi być adoptowany razem ze swoim partnerem — nierozłączna para')
  if (tags.includes('wymaga_lekow') || tags.includes('cukrzyca'))
    idealHomeBullets.push('Właściciel gotowy na codzienną rutynę podawania leków')

  const statusBadge: 'special' | 'available' = hasSpecialNeeds ? 'special' : 'available'

  return (
    <div className="bg-white">

      {/* Demo ribbon */}
      <div className="bg-amber-400 text-amber-950 text-center py-2 px-4">
        <p className="text-xs font-semibold tracking-wide uppercase">
          Podgląd projektu — przykładowy profil kota · <Link href="/koty" className="underline">prawdziwe koty →</Link>
        </p>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-stone-100 overflow-hidden">
        <Image
          src={cat.photo_url}
          alt={cat.name}
          fill
          priority
          sizes="100vw"
          className="object-cover duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-none tracking-[-0.03em]">
            {cat.name}
          </h1>
          {ageLine && (
            <p className="text-white/70 text-base sm:text-lg mt-2 font-sans">{ageLine}</p>
          )}
          {personalityTags.length > 0 && (
            <div className="hidden sm:block mt-3">
              <CatTagsCompact tags={personalityTags.slice(0, 4)} />
            </div>
          )}
        </div>

        <div className="absolute top-5 right-5">
          {statusBadge === 'special' ? (
            <span className="bg-oaza-rust text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Specjalne potrzeby
            </span>
          ) : (
            <span className="bg-oaza-green text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              Szuka domu
            </span>
          )}
        </div>
      </div>

      {/* ── Mobile CTA strip ─────────────────────────────────────────────────── */}
      <div id="mobile-cta-strip" className="lg:hidden px-4 py-4 flex gap-3 border-b border-stone-100">
        <Link
          href="#"
          className="flex-1 flex items-center justify-center bg-oaza-rust text-white font-semibold text-sm px-4 py-3 rounded-full hover:opacity-90 transition-opacity text-center"
        >
          Złóż podanie
        </Link>
        <Link
          href="/kontakt"
          className="flex-1 flex items-center justify-center border border-stone-300 text-stone-600 font-semibold text-sm px-4 py-3 rounded-full hover:border-stone-400 transition-colors text-center"
        >
          Pytania?
        </Link>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] gap-12 lg:gap-16 items-start">

          {/* ── Left column ──────────────────────────────────────────────────── */}
          <article className="min-w-0">
            <p className="text-stone-700 leading-relaxed text-lg">{cat.description}</p>

            {/* Honest truth blockquote */}
            {honestTruth && (
              <blockquote className="mt-10 pl-6 border-l-[3px] border-oaza-green/40 relative">
                <span
                  className="absolute -top-4 left-3 font-display text-7xl text-oaza-green/20 leading-none select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="font-display italic text-xl sm:text-2xl text-stone-700 leading-snug pt-2">
                  {honestTruth}
                </p>
              </blockquote>
            )}

            {/* Quick facts */}
            <Section title="Podstawowe informacje">
              <div className="bg-stone-50 rounded-2xl px-5 py-1">
                <Fact label="Wiek" value={ageLabel(cat.age_years)} />
                <Fact label="Rasa" value={cat.breed} />
                <Fact label="Status" value="Szuka domu" />
                <Fact label="Specjalne potrzeby" value={hasSpecialNeeds ? 'Tak' : 'Nie'} />
                {tags.includes('tylko_do_domu') && <Fact label="Warunki" value="Wyłącznie domowy" />}
              </div>
            </Section>

            {/* Personality */}
            {hasPersonality && (
              <Section title="Osobowość">
                <CatTags tags={[...personalityTags, ...cautionTags]} />
              </Section>
            )}

            {/* Compatibility */}
            {hasCompat && (
              <Section title="Zgodność">
                {hasPairTag && (
                  <div className="mb-4 w-full bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-sm font-medium text-violet-800">
                    ♥ Para nierozłączna — adoptuje się razem
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <CompatBadge status={getCompatStatus(tags, 'lubi_koty', 'jako_jedynak')} label="Inne koty" />
                  <CompatBadge status={getCompatStatus(tags, 'lubi_psy')} label="Psy" />
                  <CompatBadge status={getCompatStatus(tags, 'lubi_dzieci', 'nie_dla_dzieci')} label="Dzieci" />
                  <CompatBadge status={getCompatStatus(tags, 'dla_poczatkujacych', 'wymaga_doswiadczenia')} label="Pierwsze zwierzę" />
                </div>
                <p className="mt-3 text-xs text-stone-400">✓ pasuje · ✗ nie zalecamy · ? nie wiemy jeszcze</p>
              </Section>
            )}

            {/* Medical */}
            {hasHealth && (
              <Section title="Zdrowie">
                <div className="space-y-3">
                  {healthSeriousTags.map(tag => (
                    <div key={tag} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex flex-col gap-2">
                      <CatTags tags={[tag]} size="sm" />
                      {MEDICAL_CONTEXT[tag] && (
                        <p className="text-sm text-stone-600 leading-relaxed">{MEDICAL_CONTEXT[tag]}</p>
                      )}
                    </div>
                  ))}
                  {healthSpecialTags.map(tag => (
                    <div key={tag} className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex flex-col gap-2">
                      <CatTags tags={[tag]} size="sm" />
                      {MEDICAL_CONTEXT[tag] && (
                        <p className="text-sm text-stone-600 leading-relaxed">{MEDICAL_CONTEXT[tag]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-stone-400 leading-relaxed">
                  Wszystkie koty w Oazie przechodzą pełną diagnostykę weterynaryjną przed adopcją.
                </p>
              </Section>
            )}

            {/* Ideal home */}
            {idealHomeBullets.length > 0 && (
              <Section title="Idealny dom">
                <ul className="space-y-3">
                  {idealHomeBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-oaza-green/10 flex items-center justify-center">
                        <span className="text-oaza-green text-xs font-bold leading-none">→</span>
                      </span>
                      <span className="text-sm text-stone-700 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-100">
                <CatTags tags={tags} size="sm" />
              </div>
            )}

            <div className="mt-10">
              <Link href="/koty" className="text-sm text-stone-400 hover:text-oaza-green transition-colors">
                ← Wróć do listy kotów
              </Link>
            </div>
          </article>

          {/* ── Right sidebar ────────────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-8 space-y-4">
              <Link
                href="#"
                className="flex items-center justify-center bg-oaza-rust text-white font-semibold px-6 py-4 rounded-full hover:opacity-90 transition-opacity w-full text-center"
              >
                Złóż podanie o adopcję
              </Link>
              <Link
                href="/jak-adoptowac"
                className="flex items-center justify-center border border-oaza-green text-oaza-green font-semibold px-6 py-3.5 rounded-full hover:bg-oaza-green hover:text-white transition-colors w-full text-center"
              >
                Jak przebiega adopcja?
              </Link>

              <div className="border-l-[3px] border-oaza-rust/30 pl-5 py-1">
                <p className="text-sm text-stone-600 leading-relaxed">
                  Nie możesz adoptować? Twoja wpłata finansuje leczenie{' '}
                  <strong className="text-stone-800">{cat.name}</strong>.
                </p>
                <Link href="/wspieraj" className="mt-2 inline-block text-sm font-semibold text-oaza-rust hover:underline underline-offset-2">
                  Wesprzyj leczenie →
                </Link>
              </div>

              <p className="text-xs text-stone-400 text-center pt-1">
                Masz pytania?{' '}
                <Link href="/kontakt" className="text-oaza-green hover:underline">Napisz do nas</Link>
              </p>

              {tags.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">Tagi</p>
                  <CatTagsCompact tags={tags} />
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* ── Related cats strip ───────────────────────────────────────────────── */}
      <section className="bg-[#FAF9F7] border-t border-stone-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display font-bold text-2xl text-stone-900">Inne koty czekają</h2>
            <Link href="/koty" className="text-sm font-semibold text-oaza-green hover:underline">Wszystkie →</Link>
          </div>
          {/* Horizontal scroll on mobile, 3-col grid on sm+ */}
          <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
            {DEMO_RELATED.map((rc) => {
              const rcAge = rc.age_years !== null ? ageLabel(rc.age_years) : null
              const rcLine = [rcAge, rc.breed].filter(Boolean).join(' · ')
              return (
                <Link
                  key={rc.id}
                  href="/koty"
                  className="group block flex-shrink-0 w-[72vw] sm:w-auto snap-start"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100">
                    {rc.photo_url && (
                      <Image
                        src={rc.photo_url}
                        alt={rc.name}
                        fill
                        sizes="(max-width: 640px) 72vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    )}
                    {rc.is_adopted && (
                      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                          Znalazł dom
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-bold text-sm font-display">{rc.name}</p>
                      {rcLine && <p className="text-white/70 text-xs">{rcLine}</p>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <StickyAdoptCTA catId={cat.id} catName={cat.name} />

    </div>
  )
}
