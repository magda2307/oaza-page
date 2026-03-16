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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== password2) {
      setError('Hasła nie są identyczne.')
      return
    }
    setLoading(true)
    try {
      await register(email, password)
      // Auto-login after registration
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
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-stone-900 mb-2">Utwórz konto</h1>
      <p className="text-stone-500 mb-8">
        Masz już konto?{' '}
        <Link href="/logowanie" className="text-brand-600 hover:underline">
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
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Powtórz hasło</label>
          <input
            type="password"
            className="input"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
        </button>

        <p className="text-xs text-stone-400 text-center">
          Rejestrując się, akceptujesz{' '}
          <Link href="/regulamin" className="underline">regulamin</Link>
          {' '}i{' '}
          <Link href="/prywatnosc" className="underline">politykę prywatności</Link>.
        </p>
      </form>
    </div>
  )
}
