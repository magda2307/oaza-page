'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { ReactNode } from 'react'

interface Props {
  photos: string[]
  alt: string
  /** Rendered bottom-left above the dot strip (e.g. health tag chips) */
  overlay?: ReactNode
}

/**
 * Full-bleed photo carousel for the cat profile hero.
 * Renders as `absolute inset-0` — place inside a `relative overflow-hidden` sized container.
 * With a single photo the controls are hidden; keyboard ← / → works for multiple.
 */
export function PhotoCarousel({ photos, alt, overlay }: Props) {
  const [current, setCurrent] = useState(0)
  const multi = photos.length > 1

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  )
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % photos.length),
    [photos.length],
  )

  useEffect(() => {
    if (!multi) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [multi, prev, next])

  if (photos.length === 0) return null

  return (
    <>
      {/* ── Photos ─────────────────────────────────────────────────────── */}
      {photos.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={src}
            alt={i === 0 ? alt : `${alt} — zdjęcie ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* ── Gradient ───────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />

      {/* ── Overlay slot (health chips, etc.) ──────────────────────────── */}
      {overlay && (
        <div className={`absolute left-4 z-20 ${multi ? 'bottom-10' : 'bottom-4'}`}>
          {overlay}
        </div>
      )}

      {/* ── Counter badge ──────────────────────────────────────────────── */}
      {multi && (
        <div className="absolute top-3 right-3 z-20 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full tabular-nums">
          {current + 1} / {photos.length}
        </div>
      )}

      {/* ── Arrow buttons ──────────────────────────────────────────────── */}
      {multi && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Poprzednie zdjęcie"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Następne zdjęcie"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dot strip ──────────────────────────────────────────────────── */}
      {multi && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Zdjęcie ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? 'w-4 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}
