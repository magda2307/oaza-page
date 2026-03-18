'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { register, login } from '@/lib/api'

export default function RejestracjaPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordMismatch = password2.length > 0 && password !== password2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== password2) {
      setError('Hasła nie są identyczne.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(email, password)
      const { access_token } = await login(email, password)
      localStorage.setItem('oaza_token', access_token)
      localStorage.setItem('oaza_is_admin', 'false')
      router.push('/koty')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rejestracja nie powiodła się.')
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

        <h1 className="font-display font-bold text-2xl text-stone-900 mb-1">Utwórz konto</h1>
        <p className="text-sm text-stone-500 mb-6">
          Masz już konto?{' '}
          <Link href="/logowanie" className="text-oaza-rust font-medium hover:underline underline-offset-2">
            Zaloguj się
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
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Hasło
              <span className="ml-1 text-xs font-normal text-stone-400">(min. 8 znaków)</span>
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Powtórz hasło</label>
            <input
              type="password"
              className={`input ${passwordMismatch ? 'border-red-400 focus:border-red-500' : ''}`}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
            />
            {passwordMismatch && (
              <p className="mt-1 text-xs text-red-500">Hasła nie są identyczne.</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || passwordMismatch}
            className="w-full flex items-center justify-center bg-oaza-rust text-white font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
          >
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </button>

          <p className="text-xs text-stone-400 text-center pt-1">
            Rejestrując się, akceptujesz{' '}
            <Link href="/regulamin" className="underline hover:text-stone-600">regulamin</Link>
            {' '}i{' '}
            <Link href="/prywatnosc" className="underline hover:text-stone-600">politykę prywatności</Link>.
          </p>
        </form>

      </div>

      <p className="mt-8 text-xs text-stone-400 text-center">
        <Link href="/" className="hover:text-stone-600 transition-colors">← Wróć na stronę główną</Link>
      </p>

    </div>
  )
}
