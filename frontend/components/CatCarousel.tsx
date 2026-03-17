'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'

type CarouselItem = {
  key: string
  name: string
  breed?: string | null
  photo_url: string | null
  age_years?: number | null
  tags?: string[]
  href: string
}

// Real Oaza cats from fundraiser photos — shown when the API has no data yet
const STATIC_CATS: CarouselItem[] = [
  { key: 'bielik',   name: 'Bielik',   photo_url: 'https://static.pomagam.pl/media/project_photos/cache/GXTYZ5QBlsmN.jpg', href: '/koty', tags: ['po_wypadku', 'trojnog'] },
  { key: 'kasia',    name: 'Kasia',    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/9DEZj0adhIrx.jpg', href: '/koty', tags: ['fiv'] },
  { key: 'fraja',    name: 'Fraja',    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/4I9QOYcIKUYE.jpg', href: '/koty', tags: ['senior'] },
  { key: 'karmel',   name: 'Karmel',   photo_url: 'https://static.pomagam.pl/media/project_photos/cache/qC8KyJ-hffJ-.jpg', href: '/koty', tags: ['w_leczeniu'] },
  { key: 'dragon',   name: 'Dragon',   photo_url: 'https://static.pomagam.pl/media/project_photos/cache/cNb7X85pgsIn.jpg', href: '/koty', tags: ['fiv', 'spokojny'] },
  { key: 'hugo',     name: 'Hugo',     photo_url: 'https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg', href: '/koty', age_years: 12, tags: ['senior', 'cukrzyca'] },
  { key: 'buraska',  name: 'Buraska',  photo_url: 'https://static.pomagam.pl/media/project_photos/cache/ilmK7k0_GAD_.jpg', href: '/koty', tags: ['terminalnie_chory'] },
  { key: 'kociaki',  name: 'Kociaki',  photo_url: 'https://static.pomagam.pl/media/project_photos/cache/B6iXWJUg8B1d.jpg', href: '/koty', age_years: 1, tags: ['kociak'] },
]

// Tag display labels (health/special-need tags only — shown on carousel)
const TAG_LABELS: Record<string, string> = {
  fiv: 'FIV+', felv: 'FeLV+', nowotwor: 'Nowotwór', terminalnie_chory: 'Terminalnie',
  opieka_paliatywna: 'Paliatywna', senior: 'Senior', kociak: 'Kociak',
  trojnog: 'Trójnóg', niewidomy: 'Niewidomy', gluchy: 'Głuchy',
  po_wypadku: 'Po wypadku', po_operacji: 'Po operacji', cukrzyca: 'Cukrzyca',
  choroba_nerek: 'Nerki', choroba_serca: 'Serce', w_leczeniu: 'W leczeniu',
  wymaga_lekow: 'Wymaga leków',
}

// Priority: show medical/special tags first, then personality
const MEDICAL_TAGS = new Set(Object.keys(TAG_LABELS))

function sortTags(tags: string[]): string[] {
  return [...tags].sort((a, b) => {
    const aM = MEDICAL_TAGS.has(a) ? 0 : 1
    const bM = MEDICAL_TAGS.has(b) ? 0 : 1
    return aM - bM
  })
}

function ageLabel(years: number): string {
  if (years === 1) return '1 rok'
  if (years >= 2 && years <= 4) return `${years} lata`
  return `${years} lat`
}

export default function CatCarousel({
  cats,
  heading = 'Czekają na dom',
  eyebrow,
  linkHref,
  linkLabel,
  reverse = false,
}: {
  cats: Cat[]
  heading?: string
  eyebrow?: string
  linkHref?: string
  linkLabel?: string
  reverse?: boolean
}) {
  const source: CarouselItem[] =
    cats.length > 0
      ? cats.map((c) => ({
          key: String(c.id),
          name: c.name,
          breed: c.breed,
          photo_url: c.photo_url,
          age_years: c.age_years,
          tags: c.tags,
          href: `/koty/${c.id}`,
        }))
      : reverse ? [] : STATIC_CATS

  if (source.length === 0) return null

  // Duplicate so the strip loops seamlessly (translate -50% = exact one set width)
  const items = [...source, ...source]

  return (
    <section className="bg-oaza-warm/30 py-14 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cat-marquee {
          animation: marquee 40s linear infinite;
        }
        .cat-marquee-reverse {
          animation: marquee 40s linear infinite reverse;
        }
        .cat-marquee:hover,
        .cat-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mb-10 flex items-end justify-between">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-2">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold text-stone-900">{heading}</h2>
        </div>
        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className="hidden sm:inline-flex items-center text-sm font-semibold text-oaza-green hover:underline gap-1"
          >
            {linkLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {/* ── Marquee strip ───────────────────────────────────────────────── */}
      <div
        className={`${reverse ? 'cat-marquee-reverse' : 'cat-marquee'} flex gap-5 px-6`}
        style={{ width: 'max-content' }}
      >
        {items.map((cat, i) => {
          const sorted = sortTags(cat.tags ?? [])
          const visibleTags = sorted.slice(0, 2)

          return (
            <Link
              key={`${cat.key}-${i}`}
              href={cat.href}
              className="group flex-shrink-0 w-[200px]"
            >
              {/* Photo */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                {cat.photo_url ? (
                  <Image
                    src={cat.photo_url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100" />
                )}

                {/* Bottom gradient fade */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Age badge — top right frosted */}
                {cat.age_years != null && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {ageLabel(cat.age_years)}
                  </div>
                )}

                {/* Tag chips — bottom left overlaid */}
                {visibleTags.length > 0 && (
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {visibleTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        {TAG_LABELS[tag] ?? tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Name below photo */}
              <div className="mt-3 px-0.5">
                <p className="font-bold text-stone-900 group-hover:text-oaza-rust transition-colors leading-snug truncate">
                  {cat.name}
                </p>
                {cat.breed && (
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{cat.breed}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
