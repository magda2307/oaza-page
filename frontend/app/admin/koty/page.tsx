'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCats, deleteCat } from '@/lib/api'
import type { Cat } from '@/types'

export default function AdminKotyPage() {
  const router = useRouter()
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('oaza_is_admin') !== 'true') {
      router.push('/logowanie')
      return
    }
    getCats()
      .then(setCats)
      .catch(() => setError('Nie udało się załadować listy kotów.'))
      .finally(() => setLoading(false))
  }, [router])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Usunąć profil kota „${name}"? Tej operacji nie można cofnąć.`)) return
    const token = localStorage.getItem('oaza_token') ?? ''
    try {
      await deleteCat(id, token)
      setCats((prev) => prev.filter((c) => c.id !== id))
    } catch {
      alert('Nie udało się usunąć kota.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-stone-400 mb-1">
            <Link href="/admin" className="hover:text-brand-600">Admin</Link>
            {' › '}
            <span className="text-stone-700">Koty</span>
          </nav>
          <h1 className="text-2xl font-bold text-stone-900">Zarządzaj kotami</h1>
        </div>
        <Link href="/admin/koty/nowy" className="btn-primary">
          + Dodaj kota
        </Link>
      </div>

      {loading && <p className="text-stone-500">Ładowanie...</p>}
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-4 mb-4">{error}</div>}

      <div className="space-y-3">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-stone-200 px-5 py-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-800">{cat.name}</p>
              <p className="text-sm text-stone-500">
                {cat.breed ?? 'nieznana rasa'}
                {cat.age_years !== null ? ` · ${cat.age_years} lat` : ''}
                {cat.is_adopted ? ' · zaadoptowany' : ' · szuka domu'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/admin/koty/${cat.id}/edytuj`}
                className="text-sm text-oaza-green hover:underline"
              >
                Edytuj
              </Link>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="text-sm text-red-500 hover:underline"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
