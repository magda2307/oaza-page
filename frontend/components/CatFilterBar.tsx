'use client'

// TODO backend: add ?tags= filter param to GET /cats endpoint

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Cat } from '@/types'
import { CatTagsCompact } from '@/components/CatTags'
import type { TagKey } from '@/components/CatTags'
import { ageLabel } from '@/lib/format'

// ── Filter definitions ────────────────────────────────────────────────────────

type FilterOption = {
  label: string
  tags: TagKey[] // cat must have at least one of these tags to match
}

const FILTERS: FilterOption[] = [
  { label: 'Wszystkie', tags: [] },
  { label: 'FIV / FeLV', tags: ['fiv', 'felv'] },
  { label: 'Senior', tags: ['senior'] },
  { label: 'Po wypadku', tags: ['po_wypadku', 'po_operacji', 'trojnog'] },
  { label: 'Terminalnie chore', tags: ['terminalnie_chory', 'opieka_paliatywna', 'nowotwor'] },
]

// ── Spotlight card ─────────────────────────────────────────────────────────────
// Editorial: photo bleeds edge-to-edge left, no border-radius on image side.

function SpotlightCard({ cat }: { cat: Cat }) {
  return (
    <Link
      href={`/koty/${cat.id}`}
      className="group flex flex-col sm:flex-row bg-white border border-stone-200/60 rounded-xl overflow-hidden"
    >
      {/* Photo — 55% desktop, full mobile */}
      <div className="relative w-full sm:w-[55%] aspect-[4/3] sm:aspect-auto sm:min-h-[340px] flex-shrink-0 bg-stone-100 overflow-hidden">
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 100vw, 55vw"
            className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
            priority
          />
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

        {cat.tags?.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <CatTagsCompact tags={cat.tags} />
          </div>
        )}

        {cat.age_years !== null && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {ageLabel(cat.age_years)}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center px-7 py-8 sm:w-[45%]">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 leading-tight mb-1">
          {cat.name}
        </h2>
        {cat.breed && (
          <p className="text-sm text-stone-400 mb-4">{cat.breed}</p>
        )}
        {cat.description && (
          <p className="text-stone-600 leading-relaxed line-clamp-4 text-sm mb-6">
            {cat.description}
          </p>
        )}
        <span className="text-sm font-semibold text-oaza-rust group-hover:underline self-start">
          Poznaj {cat.name} →
        </span>
      </div>
    </Link>
  )
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function GridCard({ cat, index }: { cat: Cat; index: number }) {
  // Every 3rd card (0-indexed) gets a wider aspect ratio — breaks the uniform grid
  const aspectClass = index % 3 === 0 ? 'aspect-video' : 'aspect-[4/3]'

  return (
    <Link
      href={`/koty/${cat.id}`}
      className="group flex flex-col bg-white rounded-xl border border-stone-200/60 overflow-hidden"
    >
      <div className={`relative ${aspectClass} bg-stone-100 overflow-hidden`}>
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:brightness-[1.04] transition-[filter] duration-700"
          />
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

        {cat.tags?.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <CatTagsCompact tags={cat.tags.slice(0, 2)} />
          </div>
        )}

        {cat.age_years !== null && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {ageLabel(cat.age_years)}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="font-display font-bold text-stone-900 text-xl leading-snug">{cat.name}</p>
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
    <div className="col-span-full border border-stone-200/60 bg-white rounded-xl px-8 py-14 text-center">
      <p className="text-lg font-semibold text-stone-700 mb-2">
        Brak kotów w kategorii &ldquo;{filterLabel}&rdquo;
      </p>
      <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
        Wszystkie nasze podopieczne z tej grupy znalazły już dom.
        Sprawdź inne kategorie lub wróć wkrótce.
      </p>
    </div>
  )
}

// ── Adopted strip ─────────────────────────────────────────────────────────────

function AdoptedStrip({ cats }: { cats: Cat[] }) {
  if (cats.length === 0) return null

  return (
    <section className="mt-20 border-t border-stone-200/60 pt-12">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="font-display font-bold text-xl text-stone-800">Znalazły dom</h2>
        <span className="text-sm text-stone-400">{cats.length} kotów</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {cats.map((cat) => (
          <Link
            key={cat.id}
            href={`/koty/${cat.id}`}
            className="group flex-none w-40 snap-start"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
              {cat.photo_url ? (
                <Image
                  src={cat.photo_url}
                  alt={cat.name}
                  fill
                  sizes="160px"
                  className="object-cover grayscale opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full bg-stone-100" />
              )}
              <div className="absolute inset-0 flex items-end justify-center pb-3">
                <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Dom znaleziony
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-stone-400 text-center truncate">
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

  const activeFilter = FILTERS[activeIndex]
  const filterSet = new Set<string>(activeFilter.tags)
  const filtered =
    filterSet.size === 0
      ? available
      : available.filter((cat) => cat.tags?.some((t) => filterSet.has(t)))

  const [spotlight, ...rest] = filtered

  return (
    <>
      {/* ── Filter pills ─────────────────────────────────────────────────── */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none mb-4"
        role="group"
        aria-label="Filtruj koty"
      >
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActiveIndex(i)}
            className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              i === activeIndex
                ? 'bg-oaza-rust text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Count line ────────────────────────────────────────────────────── */}
      <p className="text-xs text-stone-400 uppercase tracking-widest mb-8 tabular-nums">
        {filtered.length === 0
          ? 'Brak kotów w tej kategorii'
          : filtered.length === 1
            ? '1 kot szuka domu'
            : `${filtered.length} kotów szuka domu`}
      </p>

      {/* ── Cat grid ──────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="grid grid-cols-1">
          <EmptyState filterLabel={activeFilter.label} />
        </div>
      ) : (
        <div className="space-y-4">
          {spotlight && <SpotlightCard cat={spotlight} />}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rest.map((cat, i) => (
                <GridCard key={cat.id} cat={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Adopted strip ─────────────────────────────────────────────────── */}
      <AdoptedStrip cats={adopted} />
    </>
  )
}
