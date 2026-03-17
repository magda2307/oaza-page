import Link from 'next/link'
import Image from 'next/image'
import type { SuccessStory } from '@/types'

const STORY_TAG_META: Record<string, { label: string; className: string }> = {
  fiv:               { label: 'FIV+',             className: 'bg-red-100 text-red-800' },
  felv:              { label: 'FeLV+',             className: 'bg-red-100 text-red-800' },
  nowotwor:          { label: 'Nowotwór',          className: 'bg-red-100 text-red-800' },
  opieka_paliatywna: { label: 'Opieka paliatywna', className: 'bg-red-100 text-red-800' },
  senior:            { label: 'Senior',            className: 'bg-violet-100 text-violet-800' },
  trojnog:           { label: 'Trójnóg',           className: 'bg-violet-100 text-violet-800' },
  po_wypadku:        { label: 'Po wypadku',        className: 'bg-violet-100 text-violet-800' },
  wymaga_lekow:      { label: 'Wymaga leków',      className: 'bg-violet-100 text-violet-800' },
  po_operacji:       { label: 'Po operacji',       className: 'bg-violet-100 text-violet-800' },
}

export function DiagnosisChip({ tagKey }: { tagKey: string }) {
  const meta = STORY_TAG_META[tagKey]
  if (!meta) return null
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  )
}

export default function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const visibleTags = story.diagnosis_tags.slice(0, 2)
  const extraCount = story.diagnosis_tags.length - visibleTags.length

  return (
    <article className="card group bg-white">
      {/* Photo */}
      <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
        {story.cat_photo_url ? (
          <Image
            src={story.cat_photo_url}
            alt={story.cat_photo_alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-oaza-green/10">
            🐱
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        {/* Year badge */}
        <span className="absolute top-3 right-3 bg-white/90 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {story.adoption_year}
        </span>
        {/* Diagnosis chips */}
        {visibleTags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <DiagnosisChip key={tag} tagKey={tag} />
            ))}
            {extraCount > 0 && (
              <span className="text-xs text-white/80 bg-black/30 rounded-full px-2 py-0.5">
                +{extraCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-stone-900">{story.cat_name}</h3>
          <span className="text-sm text-stone-400">{story.adopter_city}</span>
        </div>
        <div className="relative pl-4">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-oaza-green/30 rounded-full" />
          <p className="text-sm italic text-stone-700 leading-relaxed">
            &ldquo;{story.quote}&rdquo;
          </p>
        </div>
        <p className="text-xs text-stone-400 font-medium">— {story.adopter_name}</p>
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">Adoptowany w {story.adoption_year}</span>
          {story.story_slug && (
            <Link
              href={`/blog/${story.story_slug}`}
              className="text-xs font-semibold text-oaza-rust hover:underline"
            >
              Czytaj historię →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
