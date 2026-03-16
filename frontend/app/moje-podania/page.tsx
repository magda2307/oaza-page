'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getMyApplications } from '@/lib/api'
import type { Application } from '@/types'

const statusLabel: Record<Application['status'], string> = {
  pending: 'Oczekuje',
  approved: 'Zaakceptowane',
  rejected: 'Odrzucone',
}

const statusColor: Record<Application['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-stone-100 text-stone-500',
}

export default function MojePodaniaPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('oaza_token')
    if (!token) {
      router.push('/logowanie?next=/moje-podania')
      return
    }
    getMyApplications(token)
      .then(setApplications)
      .catch(() => setError('Nie udało się załadować podań.'))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-brand-600">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Moje podania</span>
      </nav>

      <h1 className="text-2xl font-bold text-stone-900 mb-8">Moje podania o adopcję</h1>

      {loading && <p className="text-stone-500">Ładowanie...</p>}
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-4">{error}</div>}

      {!loading && applications.length === 0 && !error && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg font-medium text-stone-500 mb-2">Nie masz jeszcze żadnych podań.</p>
          <Link href="/koty" className="btn-primary inline-block mt-4">Przeglądaj koty</Link>
        </div>
      )}

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  href={`/koty/${app.cat_id}`}
                  className="font-semibold text-stone-800 hover:text-brand-600 transition-colors"
                >
                  Kot #{app.cat_id}
                </Link>
                <p className="text-sm text-stone-500 mt-1">
                  {new Date(app.created_at).toLocaleDateString('pl-PL', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${statusColor[app.status]}`}>
                {statusLabel[app.status]}
              </span>
            </div>
            {app.message && (
              <p className="mt-4 text-sm text-stone-600 border-t border-stone-100 pt-4 line-clamp-3">
                {app.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
