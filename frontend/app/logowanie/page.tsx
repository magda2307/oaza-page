'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/lib/api'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/moje-podania'
  const isAdmin = next.startsWith('/admin')

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
    <div className="min-h-screen bg-oaza-warm flex flex-col items-center justify-center px-4 py-16">

      {/* Brand mark */}
      <Link href="/" className="font-display font-bold text-3xl text-oaza-green mb-10 tracking-tight hover:opacity-80 transition-opacity">
        Oaza
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] px-8 py-9">

        {/* Admin badge */}
        {isAdmin && (
          <div className="mb-6 flex items-center gap-2 bg-oaza-green/8 border border-oaza-green/20 rounded-xl px-3 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-oaza-green flex-shrink-0" />
            <span className="text-xs font-medium text-oaza-green">Panel administracyjny</span>
          </div>
        )}

        <h1 className="font-display font-bold text-2xl text-stone-900 mb-1">
          {isAdmin ? 'Logowanie' : 'Witaj z powrotem'}
        </h1>
        {!isAdmin && (
          <p className="text-sm text-stone-500 mb-6">
            Nie masz konta?{' '}
            <Link href="/rejestracja" className="text-oaza-rust font-medium hover:underline underline-offset-2">
              Zarejestruj się
            </Link>
          </p>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 ${!isAdmin ? '' : 'mt-6'}`}>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
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
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-oaza-rust text-white font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-stone-400 text-center">
        <Link href="/" className="hover:text-stone-600 transition-colors">← Wróć na stronę główną</Link>
      </p>

    </div>
  )
}

export default function LogowaniePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-oaza-warm flex items-center justify-center text-stone-400 text-sm">
        Ładowanie...
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
