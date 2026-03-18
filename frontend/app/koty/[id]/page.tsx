import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCat } from '@/lib/api'
import { CatTags, CatTagsCompact } from '@/components/CatTags'
import { ageLabel } from '@/lib/format'

type Props = { params: Promise<{ id: string }> }

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
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

// ── Honest-truth quote from tags ──────────────────────────────────────────────

function getHonestTruth(tags: string[]): string | null {
  if (tags.includes('fiv') || tags.includes('felv'))
    return 'Żyje z wirusem — nie przez niego. Wiele kotów z FIV dożywa sędziwego wieku.'
  if (tags.includes('terminalnie_chory') || tags.includes('opieka_paliatywna') || tags.includes('nowotwor'))
    return 'Może zostać rok. Może mniej. Każda godzina na miękkiej kanapie jest warta każdego trudu.'
  if (tags.includes('po_wypadku') || tags.includes('trojnog'))
    return 'Przeżył wypadek. Ciało się goi. Chęć do życia jest nienaruszona.'
  if (tags.includes('senior'))
    return 'Dojrzały, spokojny, wdzięczny. Wie, czego chce — i nie będzie Cię tego uczyć.'
  if (tags.includes('cukrzyca') || tags.includes('wymaga_lekow'))
    return 'Wymaga regularnej opieki. Oddaje to z nawiązką — w czystym, mruczącym spokoju.'
  return null
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function KotPage({ params }: Props) {
  const { id } = await params
  let cat
  try {
    cat = await getCat(Number(id))
  } catch {
    notFound()
  }

  const honestTruth = getHonestTruth(cat.tags ?? [])
  const ageLine = [
    cat.age_years !== null ? `${ageLabel(cat.age_years)}` : null,
    cat.breed ?? null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="bg-white">

      {/* ── Adopted banner ──────────────────────────────────────────────────── */}
      {cat.is_adopted && (
        <div className="bg-oaza-green text-white text-center py-3 px-4">
          <p className="text-sm font-medium">
            Ten kot znalazł już swój dom. Może kolejny też czeka na Ciebie —{' '}
            <Link href="/koty" className="underline underline-offset-2 hover:opacity-80">
              przeglądaj koty
            </Link>
            .
          </p>
        </div>
      )}

      {/* ── Full-bleed hero photo ────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-stone-100 overflow-hidden">
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}

        {/* Gradient fade — bottom */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        {/* Cat name + age/breed — bottom-left overlay */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-none tracking-[-0.03em]">
            {cat.name}
          </h1>
          {ageLine && (
            <p className="text-white/70 text-base sm:text-lg mt-2 font-sans">{ageLine}</p>
          )}
          {cat.tags && cat.tags.length > 0 && (
            <div className="mt-3">
              <CatTagsCompact tags={cat.tags.slice(0, 3)} />
            </div>
          )}
        </div>

        {/* Status badge — top-right */}
        <div className="absolute top-5 right-5">
          {cat.is_adopted ? (
            <span className="bg-white/90 backdrop-blur-sm text-stone-500 text-xs font-semibold px-3 py-1.5 rounded-full">
              Zaadoptowany
            </span>
          ) : (
            <span className="bg-oaza-green text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              Szuka domu
            </span>
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] gap-12 lg:gap-16 items-start">

          {/* ── Left: story ───────────────────────────────────────────────── */}
          <article className="min-w-0">

            {/* Description */}
            {cat.description ? (
              <p className="text-stone-700 leading-relaxed text-lg">
                {cat.description}
              </p>
            ) : (
              <p className="text-stone-400 leading-relaxed text-lg italic">
                Opis tego kota jest w przygotowaniu. Skontaktuj się z nami, żeby dowiedzieć się więcej.
              </p>
            )}

            {/* Honest truth blockquote */}
            {honestTruth && (
              <blockquote className="mt-10 pl-6 border-l-[3px] border-oaza-green/40 relative">
                <span
                  className="absolute -top-5 left-3 font-display text-7xl text-oaza-green/20 leading-none select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="font-display italic text-xl sm:text-2xl text-stone-700 leading-snug pt-2">
                  {honestTruth}
                </p>
              </blockquote>
            )}

            {/* Lorem ipsum filler for visual completeness */}
            <div className="mt-10 space-y-4 text-stone-500 text-base leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Każdy kot, który trafia do Oazy, przechodzi
                pełną diagnostykę weterynaryjną. Znamy jego historię medyczną na tyle, na ile pozwala nam to wyjaśnić —
                uczciwie, bez upiększania.
              </p>
              <p>
                Adopcja złożonego kota to nie poświęcenie. To decyzja podjęta z otwartymi oczami, która przynosi
                niezwykłą satysfakcję. Nasi opiekunowie mówią to zgodnie — wróćmy do statystyk adopcji.
              </p>
            </div>

            {/* Tags — footnote, no heading */}
            {cat.tags && cat.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-100">
                <CatTags tags={cat.tags} size="sm" />
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

          {/* ── Right: sticky sidebar ─────────────────────────────────────── */}
          <aside>
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

              {/* Support card — left-border style, no oaza-warm bg */}
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

            </div>
          </aside>

        </div>
      </div>

      {/* ── More cats strip ──────────────────────────────────────────────────── */}
      <section className="bg-[#FAF9F7] border-t border-stone-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display font-bold text-2xl text-stone-900">Inne koty czekają</h2>
            <Link
              href="/koty"
              className="text-sm font-semibold text-oaza-green hover:underline"
            >
              Wszystkie →
            </Link>
          </div>
          {/* Static teasers — always visible regardless of API */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                name: 'Marchewka',
                note: '8 lat · po wypadku',
                photo: 'https://static.pomagam.pl/media/project_photos/cache/GXTYZ5QBlsmN.jpg',
              },
              {
                name: 'Dragon',
                note: '5 lat · FIV+',
                photo: 'https://static.pomagam.pl/media/project_photos/cache/cNb7X85pgsIn.jpg',
              },
              {
                name: 'Karmel',
                note: '7 lat · w leczeniu',
                photo: 'https://static.pomagam.pl/media/project_photos/cache/qC8KyJ-hffJ-.jpg',
              },
            ].map(({ name, note, photo }) => (
              <Link key={name} href="/koty" className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold text-sm font-display">{name}</p>
                    <p className="text-white/70 text-xs">{note}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
