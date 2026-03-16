'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/lib/api'

export default function LogowaniePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/moje-podania'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { access_token } = await login(email, password)
      localStorage.setItem('oaza_token', access_token)

      // Decode token to check is_admin (JWT payload is base64)
      try {
        const payload = JSON.parse(atob(access_token.split('.')[1]))
        localStorage.setItem('oaza_is_admin', payload.is_admin ? 'true' : 'false')
      } catch {
        // ignore decode errors
      }

      router.push(next)
    } catch {
      setError('Nieprawidłowy e-mail lub hasło.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-stone-900 mb-2">Zaloguj się</h1>
      <p className="text-stone-500 mb-8">
        Nie masz konta?{' '}
        <Link href="/rejestracja" className="text-brand-600 hover:underline">
          Zarejestruj się
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Hasło</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  )
}
