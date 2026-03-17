import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCat } from '@/lib/api'
import { CatTags } from '@/components/CatTags'

type Props = { params: { id: string } }

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const cat = await getCat(Number(params.id))
    return {
      title: `${cat.name} — Oaza`,
      description:
        cat.description
          ? cat.description.slice(0, 155)
          : `Poznaj ${cat.name} i złóż podanie o adopcję w Oazie.`,
      openGraph: {
        title: `${cat.name} szuka domu — Oaza`,
        description: cat.description ?? `Poznaj ${cat.name}.`,
        images: cat.photo_url ? [{ url: cat.photo_url }] : [],
      },
    }
  } catch {
    return { title: 'Kot — Oaza' }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ageLabel(years: number | null): string {
  if (years === null) return 'Nieznany'
  if (years === 1) return '1 rok'
  if (years <= 4) return `${years} lata`
  return `${years} lat`
}

/** Derive an honest-truth quote from the cat's tags. Returns null if no match. */
function getHonestTruth(tags: string[]): string | null {
  if (tags.includes('fiv') || tags.includes('felv')) {
    return 'Żyje z FIV — i żyje pełnią.'
  }
  if (tags.includes('terminalnie_chory') || tags.includes('opieka_paliatywna') || tags.includes('nowotwor')) {
    return 'Może zostać rok. Może mniej. Każdy dzień się liczy.'
  }
  if (tags.includes('po_wypadku') || tags.includes('trojnog')) {
    return 'Przeżył wypadek. Nie pytajcie dlaczego tu jest.'
  }
  if (tags.includes('senior')) {
    return 'Dojrzały kot szuka dojrzałego domu.'
  }
  return null
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function KotPage({ params }: Props) {
  let cat
  try {
    cat = await getCat(Number(params.id))
  } catch {
    notFound()
  }

  const honestTruth = getHonestTruth(cat.tags ?? [])

  return (
    <div className="bg-white">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <nav className="text-sm text-stone-400" aria-label="Nawigacja okruszkowa">
          <Link href="/" className="hover:text-oaza-green transition-colors">
            Strona główna
          </Link>
          {' › '}
          <Link href="/koty" className="hover:text-oaza-green transition-colors">
            Koty
          </Link>
          {' › '}
          <span className="text-stone-700">{cat.name}</span>
        </nav>
      </div>

      {/* ── Adopted banner ─────────────────────────────────────────────────── */}
      {cat.is_adopted && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-oaza-green text-white rounded-2xl px-6 py-4 text-center font-medium">
            Ten kot znalazł już swój dom. 🏡
          </div>
        </div>
      )}

      {/* ── Hero photo ─────────────────────────────────────────────────────── */}
      {/* TODO backend: add photo_urls: string[] for gallery support */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
          {cat.photo_url ? (
            <Image
              src={cat.photo_url}
              alt={cat.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl text-stone-200" aria-hidden>🐱</span>
            </div>
          )}

          {/* Cat name overlay — bottom-left frosted */}
          <div className="absolute bottom-5 left-5">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3">
              <p className="text-3xl sm:text-4xl font-bold text-white leading-none">
                {cat.name}
              </p>
              {cat.breed && (
                <p className="text-sm text-white/75 mt-1">{cat.breed}</p>
              )}
            </div>
          </div>

          {/* Tags overlay — bottom-right */}
          {cat.tags?.length > 0 && (
            <div className="absolute bottom-5 right-5 flex flex-wrap gap-1.5 justify-end max-w-[50%]">
              {cat.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Two-column body ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12">

          {/* ── Left: Story ──────────────────────────────────────────────── */}
          <article>
            {/* Name + breed headline */}
            <h1 className="text-3xl font-bold text-stone-900 leading-tight">
              {cat.name}
            </h1>
            {cat.breed && (
              <p className="mt-1 text-stone-400 text-base">{cat.breed}</p>
            )}

            {/* Description */}
            {cat.description && (
              <p className="mt-6 text-stone-700 leading-relaxed text-lg">
                {cat.description}
              </p>
            )}
            {/* TODO backend: add medical_notes: string | null field to Cat */}

            {/* Honest truth blockquote */}
            {honestTruth && (
              <blockquote className="mt-8 pl-5 border-l-4 border-oaza-green relative">
                {/* Ornamental serif quote mark */}
                <span
                  className="absolute -top-4 -left-1 text-6xl font-serif text-oaza-green/40 leading-none select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="text-xl font-semibold text-stone-700 leading-snug pt-2">
                  {honestTruth}
                </p>
              </blockquote>
            )}

            {/* Full tag list */}
            {cat.tags?.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                  Charakterystyka
                </p>
                <CatTags tags={cat.tags} />
              </div>
            )}
          </article>

          {/* ── Right: Sticky sidebar ─────────────────────────────────────── */}
          <aside>
            <div className="lg:sticky lg:top-8 space-y-5">

              {/* Stats table */}
              {/* TODO backend: add gender: 'M' | 'F' | null, weight_kg: number | null, intake_date: string | null */}
              <div className="card p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
                  O kocie
                </p>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center gap-4">
                    <dt className="text-stone-500">Wiek</dt>
                    <dd className="font-semibold text-stone-800 text-right">
                      {ageLabel(cat.age_years)}
                    </dd>
                  </div>
                  {cat.breed && (
                    <div className="flex justify-between items-center gap-4">
                      <dt className="text-stone-500">Rasa</dt>
                      <dd className="font-semibold text-stone-800 text-right">{cat.breed}</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-center gap-4">
                    <dt className="text-stone-500">Status</dt>
                    <dd>
                      {cat.is_adopted ? (
                        <span className="inline-flex items-center gap-1.5 text-stone-400 font-medium">
                          <span className="w-2 h-2 rounded-full bg-stone-300 flex-shrink-0" />
                          Zaadoptowany
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-oaza-green font-semibold">
                          <span className="w-2 h-2 rounded-full bg-oaza-green flex-shrink-0" />
                          Szuka domu
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* CTA buttons — only if not adopted */}
              {!cat.is_adopted && (
                <div className="space-y-3">
                  <Link
                    href={`/koty/${cat.id}/aplikuj`}
                    className="btn-primary w-full text-center"
                  >
                    Złóż podanie o adopcję
                  </Link>
                  <Link
                    href="/jak-adoptowac"
                    className="btn-secondary w-full text-center"
                  >
                    Jak przebiega adopcja?
                  </Link>
                </div>
              )}

              {/* Medical support card */}
              {/* TODO backend: add monthly_cost_pln: number | null for the support card */}
              <div className="bg-oaza-warm rounded-2xl p-5">
                <p className="text-sm text-stone-600 leading-relaxed">
                  Nie możesz adoptować? Twoja wpłata finansuje leczenie{' '}
                  <strong className="text-stone-800">{cat.name}</strong>.
                </p>
                <Link
                  href="/wspieraj"
                  className="mt-3 inline-block text-sm font-semibold text-oaza-rust underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Wesprzyj leczenie →
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
