import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCat } from '@/lib/api'
import { CatTags } from '@/components/CatTags'

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const cat = await getCat(Number(params.id))
    return {
      title: `${cat.name} — do adopcji`,
      description: cat.description ?? `Poznaj ${cat.name} i złóż podanie o adopcję.`,
    }
  } catch {
    return { title: 'Kot' }
  }
}

export default async function KotPage({ params }: Props) {
  let cat
  try {
    cat = await getCat(Number(params.id))
  } catch {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <Link href="/koty" className="hover:text-oaza-green">Koty</Link>
        {' › '}
        <span className="text-stone-700">{cat.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Photo */}
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-stone-100">
          {cat.photo_url ? (
            <Image src={cat.photo_url} alt={cat.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🐱</div>
          )}
          {cat.is_adopted && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-xl bg-black/60 px-6 py-3 rounded-full">
                Zaadoptowany
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{cat.name}</h1>

          <dl className="mt-4 space-y-2 text-sm text-stone-600">
            {cat.breed && (
              <div className="flex gap-2">
                <dt className="font-medium text-stone-800 w-20">Rasa</dt>
                <dd>{cat.breed}</dd>
              </div>
            )}
            {cat.age_years !== null && (
              <div className="flex gap-2">
                <dt className="font-medium text-stone-800 w-20">Wiek</dt>
                <dd>{cat.age_years} {cat.age_years === 1 ? 'rok' : 'lat'}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="font-medium text-stone-800 w-20">Status</dt>
              <dd className={cat.is_adopted ? 'text-stone-400' : 'text-green-600 font-medium'}>
                {cat.is_adopted ? 'Zaadoptowany' : 'Szuka domu'}
              </dd>
            </div>
          </dl>

          {cat.description && (
            <p className="mt-6 text-stone-700 leading-relaxed">{cat.description}</p>
          )}

          {cat.tags?.length > 0 && (
            <div className="mt-6">
              <CatTags tags={cat.tags} />
            </div>
          )}

          {!cat.is_adopted && (
            <div className="mt-8 space-y-3">
              <Link href={`/koty/${cat.id}/aplikuj`} className="btn-primary block text-center">
                Złóż podanie o adopcję
              </Link>
              <Link href="/jak-adoptowac" className="btn-secondary block text-center">
                Jak przebiega adopcja?
              </Link>
            </div>
          )}

          <p className="mt-6 text-xs text-stone-400">
            Nie możesz adoptować?{' '}
            <Link href="/wspieraj" className="underline hover:text-oaza-rust">
              Wesprzyj finansowo leczenie {cat.name}.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
