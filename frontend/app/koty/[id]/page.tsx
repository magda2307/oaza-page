import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCat, getRelatedCats } from '@/lib/api'
import type { Cat } from '@/types'
import { CatTags, CatTagsCompact } from '@/components/CatTags'
import { ageLabel } from '@/lib/format'
import { StickyAdoptCTA } from '@/components/StickyAdoptCTA'
import { PhotoCarousel } from '@/components/PhotoCarousel'
import { AdminToolbar } from '@/components/AdminToolbar'
import { Section, Fact, CompatBadge } from '@/components/CatProfileSections'
import {
  PERSONALITY_TAGS,
  COMPAT_POSITIVE_TAGS,
  COMPAT_CAUTION_TAGS,
  HEALTH_SERIOUS_TAGS,
  HEALTH_SPECIAL_TAGS,
  MEDICAL_CONTEXT,
  getHonestTruth,
  hasAnyTag,
  getCompatStatus,
  deriveIdealHomeBullets,
} from '@/lib/catProfile'

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ id: string }> }

// ── Related cats static fallback ──────────────────────────────────────────────

const RELATED_FALLBACK: Cat[] = [
  {
    id: -1,
    name: 'Marchewka',
    age_years: 8,
    breed: 'Dachowiec',
    description: null,
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
    description: null,
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/cNb7X85pgsIn.jpg',
    is_adopted: false,
    tags: ['fiv', 'spokojny', 'tylko_do_domu'],
    created_at: '',
  },
  {
    id: -3,
    name: 'Karmel',
    age_years: 7,
    breed: 'Dachowiec',
    description: null,
    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/qC8KyJ-hffJ-.jpg',
    is_adopted: false,
    tags: ['nowotwor', 'w_leczeniu', 'spokojny'],
    created_at: '',
  },
]

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const cat = await getCat(Number(id))
    return {
      title: `${cat.name} — Oaza`,
      description: cat.description
        ? cat.description.slice(0, 155)
        : `Poznaj ${cat.name} i złóż podanie o adopcję w Oazie.`,
      openGraph: {
        title: `${cat.name} szuka domu — Oaza`,
        description: cat.description ?? `Poznaj ${cat.name}.`,
        images: cat.photo_url ? [{ url: cat.photo_url }] : [],
      },
    }
  } catch {
    return { title: 'Kot — Oaza' }
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function KotPage({ params }: Props) {
  const { id } = await params

  // Fetch cat + related cats in parallel
  const [catResult, relatedResult] = await Promise.allSettled([
    getCat(Number(id)),
    getRelatedCats(Number(id)),
  ])
  if (catResult.status !== 'fulfilled') notFound()
  const cat = catResult.value

  const tags = cat.tags ?? []
  const honestTruth = getHonestTruth(tags)

  const ageLine = [
    cat.age_years !== null ? ageLabel(cat.age_years) : null,
    cat.breed ?? null,
  ]
    .filter(Boolean)
    .join(' · ')

  // Tag group derivations
  const personalityTags   = tags.filter((t) => PERSONALITY_TAGS.includes(t))
  const cautionTags       = tags.filter((t) => COMPAT_CAUTION_TAGS.includes(t))
  const hasPersonality    = personalityTags.length > 0 || cautionTags.length > 0

  const hasCompat         = hasAnyTag(tags, [...COMPAT_POSITIVE_TAGS, ...COMPAT_CAUTION_TAGS])
  const hasPairTag        = tags.includes('para_nierozlaczna')

  const healthSeriousTags = tags.filter((t) => HEALTH_SERIOUS_TAGS.includes(t))
  const healthSpecialTags = tags.filter((t) => HEALTH_SPECIAL_TAGS.includes(t))
  const hasHealth         = healthSeriousTags.length > 0 || healthSpecialTags.length > 0
  const hasSpecialNeeds   = hasHealth

  const idealHomeBullets  = deriveIdealHomeBullets(tags)

  // Related cats — from dedicated endpoint, fallback to static
  let relatedCats: Cat[] =
    relatedResult.status === 'fulfilled' ? relatedResult.value : []
  if (relatedCats.length === 0) {
    relatedCats = RELATED_FALLBACK.filter((c) => c.id !== cat.id).slice(0, 3)
  }

  // Status badge
  const statusBadge: 'adopted' | 'special' | 'available' = cat.is_adopted
    ? 'adopted'
    : hasSpecialNeeds
    ? 'special'
    : 'available'

  // Photos for carousel
  const photos = cat.photos?.length
    ? cat.photos
    : cat.photo_url
    ? [cat.photo_url]
    : []

  return (
    <div className="bg-white">

      {/* ── Adopted banner ──────────────────────────────────────────────────── */}
      {cat.is_adopted && (
        <div className="bg-oaza-green text-white text-center py-3 px-4">
          <p className="text-sm font-medium">
            Ten kot znalazł już swój dom. Może kolejny też czeka na Ciebie —{' '}
            <Link href="/koty" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
              przeglądaj koty
            </Link>
            .
          </p>
        </div>
      )}

      {/* ── Hero — photo left, data right ───────────────────────────────────── */}
      <section className="bg-oaza-warm">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-14 sm:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 lg:gap-12 items-start">

            {/* ── Photo / Carousel ── */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200 shadow-[0_8px_40px_rgba(0,0,0,0.14)]">
              <PhotoCarousel
                photos={photos}
                alt={cat.name}
                overlay={
                  healthSeriousTags.length > 0 || healthSpecialTags.length > 0 ? (
                    <CatTagsCompact tags={[...healthSeriousTags, ...healthSpecialTags].slice(0, 2)} />
                  ) : undefined
                }
              />
            </div>

            {/* ── Text content ── */}
            <div className="lg:pt-2">
              {/* Status badge */}
              <div className="mb-4">
                {statusBadge === 'adopted' && (
                  <span className="bg-stone-200 text-stone-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Zaadoptowany
                  </span>
                )}
                {statusBadge === 'special' && (
                  <span className="bg-oaza-rust text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Specjalne potrzeby
                  </span>
                )}
                {statusBadge === 'available' && (
                  <span className="bg-oaza-green text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                    Szuka domu
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-display font-bold text-5xl sm:text-6xl text-stone-900 leading-[1.0] tracking-[-0.03em]">
                {cat.name}
              </h1>

              {/* Age / breed */}
              {ageLine && (
                <p className="text-stone-500 text-lg mt-3 font-sans">{ageLine}</p>
              )}

              {/* Personality chips */}
              {personalityTags.length > 0 && (
                <div className="mt-5">
                  <CatTagsCompact tags={personalityTags.slice(0, 5)} />
                </div>
              )}

              {/* CTAs — also acts as the StickyAdoptCTA sentinel */}
              {!cat.is_adopted ? (
                <div id="mobile-cta-strip" className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/koty/${cat.id}/aplikuj`}
                    className="flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-4 rounded-full hover:opacity-90 transition-opacity text-center"
                  >
                    Złóż podanie o adopcję
                  </Link>
                  <Link
                    href="/jak-adoptowac"
                    className="flex items-center justify-center border border-oaza-green text-oaza-green font-semibold px-6 py-3.5 rounded-full hover:bg-oaza-green hover:text-white transition-colors text-center"
                  >
                    Jak to działa?
                  </Link>
                </div>
              ) : (
                <div className="mt-8">
                  <Link
                    href="/koty"
                    className="inline-flex items-center justify-center bg-oaza-green text-white font-semibold px-7 py-4 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Przeglądaj inne koty
                  </Link>
                </div>
              )}

              {/* Donate nudge */}
              {!cat.is_adopted && (
                <p className="mt-5 text-sm text-stone-400">
                  Nie możesz adoptować?{' '}
                  <Link href="/wspieraj" className="text-oaza-rust font-semibold hover:underline underline-offset-2">
                    Wesprzyj leczenie →
                  </Link>
                </p>
              )}

              {/* Description */}
              {cat.description ? (
                <p className="mt-8 text-stone-600 leading-relaxed text-base border-t border-stone-200/60 pt-7">
                  {cat.description}
                </p>
              ) : (
                <p className="mt-8 text-stone-400 leading-relaxed text-base italic border-t border-stone-200/60 pt-7">
                  Opis tego kota jest w przygotowaniu. Skontaktuj się z nami, żeby dowiedzieć się więcej.
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] gap-12 lg:gap-16 items-start">

          {/* ── Left column ──────────────────────────────────────────────────── */}
          <article className="min-w-0">

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

            {/* ── Quick Facts ──────────────────────────────────────────────── */}
            <Section title="Podstawowe informacje">
              <div className="bg-stone-50 rounded-2xl px-5 py-1">
                {cat.age_years !== null && (
                  <Fact label="Wiek" value={ageLabel(cat.age_years)} />
                )}
                {cat.breed && (
                  <Fact label="Rasa" value={cat.breed} />
                )}
                <Fact
                  label="Status"
                  value={cat.is_adopted ? 'Zaadoptowany' : 'Szuka domu'}
                />
                <Fact
                  label="Specjalne potrzeby"
                  value={hasSpecialNeeds ? 'Tak' : 'Nie'}
                />
                {tags.includes('tylko_do_domu') && (
                  <Fact label="Warunki" value="Wyłącznie domowy" />
                )}
              </div>
            </Section>

            {/* ── Personality ──────────────────────────────────────────────── */}
            {hasPersonality && (
              <Section title="Osobowość">
                <CatTags tags={[...personalityTags, ...cautionTags]} />
              </Section>
            )}

            {/* ── Compatibility ────────────────────────────────────────────── */}
            {hasCompat && (
              <Section title="Zgodność">
                {hasPairTag && (
                  <div className="mb-4 w-full bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-sm font-medium text-violet-800">
                    ♥ Para nierozłączna — adoptuje się razem
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <CompatBadge
                    status={getCompatStatus(tags, 'lubi_koty', 'jako_jedynak')}
                    label="Inne koty"
                  />
                  <CompatBadge
                    status={getCompatStatus(tags, 'lubi_psy')}
                    label="Psy"
                  />
                  <CompatBadge
                    status={getCompatStatus(tags, 'lubi_dzieci', 'nie_dla_dzieci')}
                    label="Dzieci"
                  />
                  <CompatBadge
                    status={getCompatStatus(tags, 'dla_poczatkujacych', 'wymaga_doswiadczenia')}
                    label="Pierwsze zwierzę"
                  />
                </div>
                <p className="mt-3 text-xs text-stone-400">
                  ✓ pasuje · ✗ nie zalecamy · ? nie wiemy jeszcze
                </p>
              </Section>
            )}

            {/* ── Medical ──────────────────────────────────────────────────── */}
            {hasHealth && (
              <Section title="Zdrowie">
                <div className="space-y-3">
                  {healthSeriousTags.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex flex-col gap-2"
                    >
                      <CatTags tags={[tag]} size="sm" />
                      {MEDICAL_CONTEXT[tag] && (
                        <p className="text-sm text-stone-600 leading-relaxed">
                          {MEDICAL_CONTEXT[tag]}
                        </p>
                      )}
                    </div>
                  ))}
                  {healthSpecialTags.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex flex-col gap-2"
                    >
                      <CatTags tags={[tag]} size="sm" />
                      {MEDICAL_CONTEXT[tag] && (
                        <p className="text-sm text-stone-600 leading-relaxed">
                          {MEDICAL_CONTEXT[tag]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-stone-400 leading-relaxed">
                  Wszystkie koty w Oazie przechodzą pełną diagnostykę weterynaryjną przed adopcją.
                </p>
              </Section>
            )}

            {/* ── Ideal home ───────────────────────────────────────────────── */}
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

            {/* ── All tags footnote ─────────────────────────────────────────── */}
            {tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-100">
                <CatTags tags={tags} size="sm" />
              </div>
            )}

            {/* Back link */}
            <div className="mt-10">
              <Link
                href="/koty"
                className="text-sm text-stone-400 hover:text-oaza-green transition-colors"
              >
                ← Wróć do listy kotów
              </Link>
            </div>
          </article>

          {/* ── Right column — sticky sidebar ────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-8 space-y-4">

              {/* Primary CTA */}
              {!cat.is_adopted ? (
                <>
                  <Link
                    href={`/koty/${cat.id}/aplikuj`}
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
                </>
              ) : (
                <Link
                  href="/koty"
                  className="flex items-center justify-center bg-oaza-green text-white font-semibold px-6 py-4 rounded-full hover:opacity-90 transition-opacity w-full text-center"
                >
                  Przeglądaj inne koty
                </Link>
              )}

              {/* Support card */}
              <div className="border-l-[3px] border-oaza-rust/30 pl-5 py-1">
                <p className="text-sm text-stone-600 leading-relaxed">
                  Nie możesz adoptować? Twoja wpłata finansuje leczenie{' '}
                  <strong className="text-stone-800">{cat.name}</strong>.
                </p>
                <Link
                  href="/wspieraj"
                  className="mt-2 inline-block text-sm font-semibold text-oaza-rust hover:underline underline-offset-2"
                >
                  Wesprzyj leczenie →
                </Link>
              </div>

              {/* Contact link */}
              <p className="text-xs text-stone-400 text-center pt-1">
                Masz pytania?{' '}
                <Link href="/kontakt" className="text-oaza-green hover:underline">
                  Napisz do nas
                </Link>
              </p>

              {/* Tags summary */}
              {tags.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
                    Tagi
                  </p>
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
            <Link href="/koty" className="text-sm font-semibold text-oaza-green hover:underline">
              Wszystkie →
            </Link>
          </div>
          {/* Horizontal scroll on mobile, 3-col grid on sm+ */}
          <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
            {relatedCats.map((rc) => {
              const isStatic  = rc.id < 0
              const rcAgeLine = [
                rc.age_years !== null ? ageLabel(rc.age_years) : null,
                rc.breed ?? null,
              ].filter(Boolean).join(' · ')
              return (
                <Link
                  key={rc.id}
                  href={isStatic ? '/koty' : `/koty/${rc.id}`}
                  className="group block flex-shrink-0 w-[72vw] sm:w-auto snap-start"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100">
                    {rc.photo_url ? (
                      <Image
                        src={rc.photo_url}
                        alt={rc.name}
                        fill
                        sizes="(max-width: 640px) 72vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200" />
                    )}
                    {/* Adopted overlay */}
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
                      {rcAgeLine && <p className="text-white/70 text-xs">{rcAgeLine}</p>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      {!cat.is_adopted && <StickyAdoptCTA catId={cat.id} catName={cat.name} />}
      <AdminToolbar catId={cat.id} />

    </div>
  )
}
