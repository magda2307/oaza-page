'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const isAdmin = localStorage.getItem('oaza_is_admin')
    if (isAdmin !== 'true') {
      router.push('/logowanie')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Panel administratora</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/koty" className="card p-8 hover:border-brand-300 transition-colors">
          <div className="text-3xl mb-3">🐱</div>
          <h2 className="font-semibold text-stone-800 text-lg">Zarządzaj kotami</h2>
          <p className="text-sm text-stone-500 mt-1">Dodaj, edytuj lub usuń profile kotów.</p>
        </Link>
        <Link href="/admin/podania" className="card p-8 hover:border-brand-300 transition-colors">
          <div className="text-3xl mb-3">📋</div>
          <h2 className="font-semibold text-stone-800 text-lg">Podania o adopcję</h2>
          <p className="text-sm text-stone-500 mt-1">Przeglądaj i rozpatruj złożone podania.</p>
        </Link>
      </div>
    </div>
  )
}
