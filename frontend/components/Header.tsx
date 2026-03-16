'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('oaza_token')
    const admin = localStorage.getItem('oaza_is_admin')
    setToken(t)
    setIsAdmin(admin === 'true')
  }, [])

  const logout = () => {
    localStorage.removeItem('oaza_token')
    localStorage.removeItem('oaza_is_admin')
    setToken(null)
    setIsAdmin(false)
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/koty', label: 'Koty' },
    { href: '/jak-adoptowac', label: 'Jak adoptować' },
    { href: '/o-nas', label: 'O nas' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <header className="bg-stone-50 border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-brand-600 tracking-tight">
          Oaza
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-brand-600 transition-colors"
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="hover:text-brand-600 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/wspieraj"
            className="text-sm font-medium border border-brand-500 text-brand-600 px-4 py-1.5 rounded-full hover:bg-brand-50 transition-colors"
          >
            Wspieraj
          </Link>
          {token ? (
            <div className="flex items-center gap-3">
              <Link
                href="/moje-podania"
                className="text-sm text-stone-600 hover:text-brand-600 transition-colors"
              >
                Moje podania
              </Link>
              <button
                onClick={logout}
                className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <Link
              href="/logowanie"
              className="text-sm font-semibold bg-brand-500 text-white px-4 py-1.5 rounded-full hover:bg-brand-600 transition-colors"
            >
              Zaloguj się
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-stone-700 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-stone-700">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-brand-600"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          <hr className="border-stone-200" />
          <Link href="/wspieraj" onClick={() => setMenuOpen(false)} className="text-brand-600 font-semibold">
            Wspieraj nas
          </Link>
          {token ? (
            <>
              <Link href="/moje-podania" onClick={() => setMenuOpen(false)}>Moje podania</Link>
              <button onClick={logout} className="text-left text-stone-500">Wyloguj</button>
            </>
          ) : (
            <Link href="/logowanie" onClick={() => setMenuOpen(false)}>Zaloguj się</Link>
          )}
        </div>
      )}
    </header>
  )
}
