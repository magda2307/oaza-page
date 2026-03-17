'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'
import { getTagLabel } from '@/components/CatTags'

type CarouselItem = {
  key: string
  name: string
  photo_url: string | null
  age_years?: number | null
  tags?: string[]
  href: string
}

// Real Oaza cats from fundraiser photos — shown when the API has no data yet
const STATIC_CATS: CarouselItem[] = [
  { key: 'bielik',   name: 'Bielik',   photo_url: 'https://static.pomagam.pl/media/project_photos/cache/GXTYZ5QBlsmN.jpg', href: '/koty' },
  { key: 'kasia',    name: 'Kasia',    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/9DEZj0adhIrx.jpg', href: '/koty' },
  { key: 'fraja',    name: 'Fraja',    photo_url: 'https://static.pomagam.pl/media/project_photos/cache/4I9QOYcIKUYE.jpg', href: '/koty' },
  { key: 'karmel',   name: 'Karmel',   photo_url: 'https://static.pomagam.pl/media/project_photos/cache/qC8KyJ-hffJ-.jpg', href: '/koty' },
  { key: 'dragon',   name: 'Dragon',   photo_url: 'https://static.pomagam.pl/media/project_photos/cache/cNb7X85pgsIn.jpg', href: '/koty' },
  { key: 'hugo',     name: 'Hugo',     photo_url: 'https://static.pomagam.pl/media/project_photos/cache/TXAM54Avlbaf.jpg', href: '/koty' },
  { key: 'buraska',  name: 'Buraska',  photo_url: 'https://static.pomagam.pl/media/project_photos/cache/ilmK7k0_GAD_.jpg', href: '/koty' },
  { key: 'kociaki',  name: 'Kociaki',  photo_url: 'https://static.pomagam.pl/media/project_photos/cache/B6iXWJUg8B1d.jpg', href: '/koty' },
]

function ageLabel(years: number): string {
  if (years === 1) return 'rok'
  if (years >= 2 && years <= 4) return 'lata'
  return 'lat'
}

export default function CatCarousel({
  cats,
  heading = 'Czekają na nowy dom',
  reverse = false,
}: {
  cats: Cat[]
  heading?: string
  reverse?: boolean
}) {
  const source: CarouselItem[] =
    cats.length > 0
      ? cats.map((c) => ({
          key: String(c.id),
          name: c.name,
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
          animation: marquee 36s linear infinite;
        }
        .cat-marquee-reverse {
          animation: marquee 36s linear infinite reverse;
        }
        .cat-marquee:hover,
        .cat-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      <h2 className="text-center text-3xl font-bold text-stone-900 mb-10 px-4">
        {heading}
      </h2>

      <div
        className={`${reverse ? 'cat-marquee-reverse' : 'cat-marquee'} flex gap-6 px-6`}
        style={{ width: 'max-content' }}
      >
        {items.map((cat, i) => (
          <Link
            key={`${cat.key}-${i}`}
            href={cat.href}
            className="group flex-shrink-0 w-[210px]"
          >
            {/* Photo — tall rectangle */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-md group-hover:shadow-xl transition-shadow duration-300">
              {cat.photo_url ? (
                <Image
                  src={cat.photo_url}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-oaza-green/10">
                  🐱
                </div>
              )}
              <div className="absolute inset-0 bg-oaza-rust/0 group-hover:bg-oaza-rust/10 transition-colors duration-300" />
            </div>

            {/* Info row: Name · age · tags all inline */}
            <div className="mt-3 px-1 flex items-center flex-wrap gap-x-2 gap-y-1">
              <span className="font-bold text-lg text-stone-900 group-hover:text-oaza-rust transition-colors leading-tight">
                {cat.name}
              </span>
              {cat.age_years != null && (
                <span className="text-sm text-stone-400 leading-tight">
                  {cat.age_years} {ageLabel(cat.age_years)}
                </span>
              )}
              {cat.tags && cat.tags.length > 0 && cat.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold bg-oaza-rust/10 text-oaza-rust px-1.5 py-0.5 rounded-full"
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
