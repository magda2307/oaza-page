'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'

export default function CatCarousel({ cats }: { cats: Cat[] }) {
  if (cats.length === 0) return null

  // Duplicate so the strip loops seamlessly (translate -50% = exact one set width)
  const items = [...cats, ...cats]

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

      <div className="cat-marquee flex gap-8" style={{ width: 'max-content' }}>
        {items.map((cat, i) => (
          <Link
            key={`${cat.id}-${i}`}
            href={`/koty/${cat.id}`}
            className="flex flex-col items-center gap-3 group flex-shrink-0 w-[120px]"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-oaza-rust transition-all duration-300 bg-stone-100 flex-shrink-0 shadow-md">
              {cat.photo_url ? (
                <Image
                  src={cat.photo_url}
                  alt={cat.name}
                  width={96}
                  height={96}
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
              {cat.age_years !== null && (
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
