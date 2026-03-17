'use client'

// TODO backend: add ?tags= filter param to GET /cats endpoint

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'
import { CatTagsCompact } from '@/components/CatTags'

// ── Filter definitions ────────────────────────────────────────────────────────

type FilterOption = {
  label: string
  tags: string[]  // cat must have at least one of these tags to match
}

const FILTERS: FilterOption[] = [
  { label: 'Wszystkie', tags: [] },
  { label: 'FIV / FeLV', tags: ['fiv', 'felv'] },
  { label: 'Senior', tags: ['senior'] },
  { label: 'Po wypadku', tags: ['po_wypadku', 'po_operacji', 'trojnog'] },
  { label: 'Terminalnie chore', tags: ['terminalnie_chory', 'opieka_paliatywna', 'nowotwor'] },
]

function ageLabel(years: number | null): string {
  if (years === null) return ''
  if (years === 1) return '1 rok'
  if (years <= 4) return `${years} lata`
  return `${years} lat`
}

// ── Spotlight card (first available cat, full-width horizontal layout) ────────

function SpotlightCard({ cat }: { cat: Cat }) {
  return (
    <Link
      href={`/koty/${cat.id}`}
      className="card group flex flex-col sm:flex-row overflow-hidden"
    >
      {/* Image — 45% width on desktop, full width on mobile */}
      <div className="relative w-full sm:w-[45%] aspect-[4/3] sm:aspect-auto flex-shrink-0 bg-stone-100 overflow-hidden">
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 100vw, 45vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-stone-300">
            <span aria-hidden>🐱</span>
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Tag chips — bottom-left overlay */}
        {cat.tags?.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            <CatTagsCompact tags={cat.tags} />
          </div>
        )}

        {/* Age badge — top-right frosted */}
        {cat.age_years !== null && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {ageLabel(cat.age_years)}
          </div>
        )}
      </div>

      {/* Text — 55% width on desktop */}
      <div className="flex flex-col justify-center px-7 py-8 sm:w-[55%]">
        <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-3">
          Wyróżniony
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          {cat.name}
        </h2>
        {cat.breed && (
          <p className="mt-1 text-sm text-stone-500">{cat.breed}</p>
        )}
        {cat.description && (
          <p className="mt-4 text-stone-600 leading-relaxed line-clamp-3">
            {cat.description}
          </p>
        )}
        <span className="mt-6 text-sm font-semibold text-oaza-rust group-hover:underline">
          Poznaj {cat.name} →
        </span>
      </div>
    </Link>
  )
}

// ── Regular grid card ─────────────────────────────────────────────────────────

function GridCard({ cat }: { cat: Cat }) {
  return (
    <Link href={`/koty/${cat.id}`} className="card group flex flex-col">
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-stone-300">
            <span aria-hidden>🐱</span>
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Tag chips — bottom-left overlay */}
        {cat.tags?.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            <CatTagsCompact tags={cat.tags} />
          </div>
        )}

        {/* Age badge — top-right frosted */}
        {cat.age_years !== null && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {ageLabel(cat.age_years)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <p className="font-bold text-stone-900 text-xl leading-snug">{cat.name}</p>
        {cat.breed && (
          <p className="mt-0.5 text-sm text-stone-400">{cat.breed}</p>
        )}
        {cat.description && (
          <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-2 flex-1">
            {cat.description}
          </p>
        )}
        <span className="mt-4 text-sm font-semibold text-oaza-rust group-hover:underline">
          Poznaj {cat.name} →
        </span>
      </div>
    </Link>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filterLabel }: { filterLabel: string }) {
  return (
    <div className="col-span-full bg-oaza-warm rounded-2xl px-8 py-14 text-center">
      <p className="text-4xl mb-4" aria-hidden>🐾</p>
      <p className="text-lg font-semibold text-stone-700 mb-2">
        Brak kotów w kategorii &ldquo;{filterLabel}&rdquo;
      </p>
      <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
        Wszystkie nasze podopieczne z tej grupy znalazły już dom — to dobra wiadomość.
        Sprawdź inne kategorie lub wróć wkrótce.
      </p>
    </div>
  )
}

// ── Adopted strip ─────────────────────────────────────────────────────────────

function AdoptedStrip({ cats }: { cats: Cat[] }) {
  if (cats.length === 0) return null

  return (
    <section className="mt-20">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl font-bold text-stone-700">Znalazły dom</h2>
        <span className="text-sm text-stone-400">{cats.length} kotów</span>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {cats.map((cat) => (
          <Link
            key={cat.id}
            href={`/koty/${cat.id}`}
            className="group flex-none w-40 snap-start"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
              {cat.photo_url ? (
                <Image
                  src={cat.photo_url}
                  alt={cat.name}
                  fill
                  sizes="160px"
                  className="object-cover grayscale opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-stone-300">
                  <span aria-hidden>🐱</span>
                </div>
              )}

              {/* "Dom znaleziony" overlay badge */}
              <div className="absolute inset-0 flex items-end justify-center pb-3">
                <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Dom znaleziony ✓
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-stone-500 text-center truncate">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CatFilterBar({
  available,
  adopted,
}: {
  available: Cat[]
  adopted: Cat[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeFilter = FILTERS[activeIndex]
  const filtered =
    activeFilter.tags.length === 0
      ? available
      : available.filter((cat) =>
          cat.tags?.some((t) => activeFilter.tags.includes(t)),
        )

  const [spotlight, ...rest] = filtered

  return (
    <>
      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none mb-8"
        role="group"
        aria-label="Filtruj koty"
      >
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActiveIndex(i)}
            className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              i === activeIndex
                ? 'bg-oaza-green text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-oaza-green hover:text-oaza-green'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Count badge ────────────────────────────────────────────────────── */}
      <p className="text-sm text-stone-400 mb-6 tabular-nums">
        {filtered.length === 0
          ? 'Brak kotów w tej kategorii'
          : filtered.length === 1
            ? '1 kot czeka'
            : `${filtered.length} kotów czeka`}
      </p>

      {/* ── Cat grid ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="grid grid-cols-1">
          <EmptyState filterLabel={activeFilter.label} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Spotlight — first cat, full-width */}
          {spotlight && <SpotlightCard cat={spotlight} />}

          {/* 2-col grid for the rest */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((cat) => (
                <GridCard key={cat.id} cat={cat} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Adopted strip ──────────────────────────────────────────────────── */}
      <AdoptedStrip cats={adopted} />
    </>
  )
}
