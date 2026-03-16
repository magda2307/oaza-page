'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'

type CarouselItem = {
  key: string
  name: string
  photo_url: string | null
  age_years?: number | null
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

export default function CatCarousel({ cats }: { cats: Cat[] }) {
  const source: CarouselItem[] =
    cats.length > 0
      ? cats.map((c) => ({
          key: String(c.id),
          name: c.name,
          photo_url: c.photo_url,
          age_years: c.age_years,
          href: `/koty/${c.id}`,
        }))
      : STATIC_CATS

  // Duplicate so the strip loops seamlessly (translate -50% = exact one set width)
  const items = [...source, ...source]

  return (
    <section className="bg-oaza-warm/30 py-10 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cat-marquee {
          animation: marquee 32s linear infinite;
        }
        .cat-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <p className="text-center text-xs font-semibold uppercase tracking-widest text-oaza-rust/70 mb-8">
        Czekają na nowy dom
      </p>

      <div className="cat-marquee flex gap-10" style={{ width: 'max-content' }}>
        {items.map((cat, i) => (
          <Link
            key={`${cat.key}-${i}`}
            href={cat.href}
            className="flex flex-col items-center gap-3 group flex-shrink-0 w-[160px]"
          >
            <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-transparent group-hover:ring-oaza-rust transition-all duration-300 bg-stone-100 flex-shrink-0 shadow-lg">
              {cat.photo_url ? (
                <Image
                  src={cat.photo_url}
                  alt={cat.name}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl bg-oaza-green/10">
                  🐱
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-stone-800 group-hover:text-oaza-rust transition-colors leading-tight">
                {cat.name}
              </p>
              {cat.age_years != null && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {cat.age_years} {cat.age_years === 1 ? 'rok' : 'lat'}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
