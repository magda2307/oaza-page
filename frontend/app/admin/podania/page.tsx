'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAdminApplications, updateApplicationStatus } from '@/lib/api'
import type { AdminApplication } from '@/types'

const statusLabel = { pending: 'Oczekuje', approved: 'Zaakceptowane', rejected: 'Odrzucone' }
const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-stone-100 text-stone-500',
}

export default function AdminPodaniaPage() {
  const router = useRouter()
  const [apps, setApps] = useState<AdminApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('oaza_is_admin') !== 'true') {
      router.push('/logowanie')
      return
    }
    const token = localStorage.getItem('oaza_token') ?? ''
    getAdminApplications(token)
      .then(setApps)
      .catch(() => setError('Nie udało się załadować podań.'))
      .finally(() => setLoading(false))
  }, [router])

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    const token = localStorage.getItem('oaza_token') ?? ''
    try {
      const updated = await updateApplicationStatus(id, status, token)
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)))
    } catch {
      alert('Nie udało się zaktualizować statusu.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/admin" className="hover:text-oaza-green">Admin</Link>
        {' › '}
        <span className="text-stone-700">Podania</span>
      </nav>

      <h1 className="text-2xl font-bold text-stone-900 mb-8">Podania o adopcję</h1>

      {loading && <p className="text-stone-500">Ładowanie...</p>}
      {error && <div className="bg-red-50 text-red-700 rounded-xl p-4">{error}</div>}

      <div className="space-y-4">
        {apps.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-stone-800">
                  {app.user_email}{' '}
                  <span className="text-stone-400 font-normal">→</span>{' '}
                  <Link href={`/koty/${app.cat_id}`} className="text-oaza-rust hover:underline">
                    {app.cat_name ?? `Kot #${app.cat_id}`}
                  </Link>
                </p>
                <p className="text-sm text-stone-400 mt-0.5">
                  {new Date(app.created_at).toLocaleDateString('pl-PL', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[app.status]}`}>
                {statusLabel[app.status]}
              </span>
            </div>

            {app.message && (
              <p className="mt-4 text-sm text-stone-600 border-t border-stone-100 pt-4">
                {app.message}
              </p>
            )}

            {app.status === 'pending' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => updateStatus(app.id, 'approved')}
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                >
                  Zaakceptuj
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'rejected')}
                  className="text-sm font-medium border border-stone-300 text-stone-600 px-4 py-2 rounded-full hover:bg-stone-50 transition-colors"
                >
                  Odrzuć
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
