'use client'

import { useState } from 'react'
import type { SuccessStory } from '@/types'
import SuccessStoryCard from './SuccessStoryCard'

type FilterKey = 'all' | 'fiv_felv' | 'po_wypadku' | 'terminal' | 'senior' | 'specjalne'

const FILTER_LABELS: Record<FilterKey, string> = {
  all:       'Wszystkie',
  fiv_felv:  'FIV / FeLV',
  po_wypadku: 'Po wypadku',
  terminal:  'Terminalnie chore',
  senior:    'Seniory',
  specjalne: 'Specjalne potrzeby',
}

const FILTER_KEYS: FilterKey[] = ['all', 'fiv_felv', 'po_wypadku', 'terminal', 'senior', 'specjalne']

export default function SuccessFilter({ stories }: { stories: SuccessStory[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  function getCount(key: FilterKey): number {
    if (key === 'all') return stories.length
    return stories.filter((s) => s.story_type === key).length
  }

  const filtered =
    activeFilter === 'all'
      ? stories
      : stories.filter((s) => s.story_type === activeFilter)

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTER_KEYS.map((key) => {
          const count = getCount(key)
          const isActive = activeFilter === key
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-oaza-green text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-oaza-green hover:text-oaza-green'
              }`}
            >
              {FILTER_LABELS[key]}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Story grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((story) => (
            <SuccessStoryCard key={story.id} story={story} />
          ))
        ) : (
          <div className="card bg-white text-center py-16 px-8 col-span-full">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-stone-900 mb-3">Brak historii dla tego filtru</h3>
            <p className="text-stone-500 text-sm mb-8">
              Wróć do wszystkich historii lub sprawdź, kto teraz czeka na dom.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
