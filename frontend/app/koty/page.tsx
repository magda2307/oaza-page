import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCats } from '@/lib/api'
import type { Cat } from '@/types'
import { CatTagsCompact } from '@/components/CatTags'

export const metadata: Metadata = {
  title: 'Koty do adopcji',
  description: 'Przeglądaj koty czekające na dom w Oazie — z FIV, FeLV, po wypadkach i chore terminalnie.',
}

export default async function KotyPage() {
  let cats: Cat[] = []
  let error = false

  try {
    cats = await getCats()
  } catch {
    error = true
  }

  const available = cats.filter((c) => !c.is_adopted)
  const adopted = cats.filter((c) => c.is_adopted)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Koty szukające domu</h1>
      <p className="text-stone-500 mb-10">
        Każdy z nich ma swoją historię. Każdy zasługuje na szansę.
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-8">
          Nie udało się załadować listy kotów. Spróbuj ponownie za chwilę.
        </div>
      )}

      {available.length === 0 && !error && (
        <p className="text-stone-500">Brak kotów dostępnych do adopcji w tej chwili.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {available.map((cat) => (
          <CatCard key={cat.id} cat={cat} />
        ))}
      </div>

      {adopted.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-stone-700 mb-6">Znalazły dom 🏠</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 opacity-60">
            {adopted.map((cat) => (
              <div key={cat.id} className="card">
                <div className="aspect-square relative bg-stone-100">
                  {cat.photo_url ? (
                    <Image src={cat.photo_url} alt={cat.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🐱</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-stone-700 text-sm">{cat.name}</p>
                  <p className="text-xs text-stone-400">zaadoptowany</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CatCard({ cat }: { cat: Cat }) {
  return (
    <Link href={`/koty/${cat.id}`} className="card group">
      <div className="aspect-[4/3] relative bg-stone-100">
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🐱</div>
        )}
      </div>
      <div className="p-5">
        <p className="font-semibold text-stone-900 text-lg">{cat.name}</p>
        <div className="mt-1 flex gap-3 text-sm text-stone-500">
          {cat.breed && <span>{cat.breed}</span>}
          {cat.age_years !== null && (
            <span>{cat.age_years} {cat.age_years === 1 ? 'rok' : 'lat'}</span>
          )}
        </div>
        {cat.description && (
          <p className="mt-2 text-sm text-stone-600 line-clamp-2">{cat.description}</p>
        )}
        {cat.tags?.length > 0 && (
          <div className="mt-3">
            <CatTagsCompact tags={cat.tags} />
          </div>
        )}
        <span className="mt-4 inline-block text-sm text-oaza-rust font-medium group-hover:underline">
          Poznaj →
        </span>
      </div>
    </Link>
  )
}
