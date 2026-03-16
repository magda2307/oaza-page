'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'

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

export default function CatCarousel({ cats }: { cats: Cat[] }) {
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
      : STATIC_CATS

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
        .cat-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <p className="text-center text-xs font-semibold uppercase tracking-widest text-oaza-rust/70 mb-10">
        Czekają na nowy dom
      </p>

      <div className="cat-marquee flex gap-6 px-6" style={{ width: 'max-content' }}>
        {items.map((cat, i) => (
          <Link
            key={`${cat.key}-${i}`}
            href={cat.href}
            className="group flex-shrink-0 w-[190px]"
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

            {/* Info below photo */}
            <div className="mt-3 px-1">
              <p className="font-bold text-[15px] text-stone-900 group-hover:text-oaza-rust transition-colors leading-tight">
                {cat.name}
              </p>
              {cat.age_years != null && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {cat.age_years} {ageLabel(cat.age_years)}
                </p>
              )}
              {cat.tags && cat.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {cat.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold bg-oaza-rust/10 text-oaza-rust px-1.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
