'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCat, submitApplication } from '@/lib/api'
import type { Cat } from '@/types'

export default function AplikujPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const catId = Number(params.id)
  const [cat, setCat] = useState<Cat | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getCat(catId).then(setCat).catch(() => router.push('/koty'))
  }, [catId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const token = localStorage.getItem('oaza_token')
    if (!token) {
      router.push(`/logowanie?next=/koty/${catId}/aplikuj`)
      return
    }
    setLoading(true)
    try {
      await submitApplication(catId, message, token)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coś poszło nie tak.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Podanie zostało wysłane!</h1>
        <p className="text-stone-600 mb-8">
          Skontaktujemy się z Tobą wkrótce. Możesz śledzić status w swoim koncie.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/moje-podania" className="btn-primary">Zobacz moje podania</Link>
          <Link href="/koty" className="btn-secondary">Przeglądaj inne koty</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/koty" className="hover:text-brand-600">Koty</Link>
        {cat && <>{' › '}<Link href={`/koty/${catId}`} className="hover:text-brand-600">{cat.name}</Link></>}
        {' › '}
        <span className="text-stone-700">Podanie o adopcję</span>
      </nav>

      <h1 className="text-2xl font-bold text-stone-900 mb-2">
        Podanie o adopcję{cat ? ` — ${cat.name}` : ''}
      </h1>
      <p className="text-stone-500 mb-8">
        Powiedz nam kilka słów o sobie i swoim domu. To nie egzamin — chcemy dobrze dopasować parę.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Twoja wiadomość
          </label>
          <textarea
            className="input min-h-[180px] resize-y"
            placeholder="Opowiedz nam o swoim domu, czy masz inne zwierzęta, co przyciągnęło Cię do tego kota..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={20}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Wysyłanie...' : 'Wyślij podanie'}
        </button>
      </form>
    </div>
  )
}
