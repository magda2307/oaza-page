'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/koty',           label: 'Koty' },
  { href: '/jak-adoptowac',  label: 'Jak adoptować' },
  { href: '/wspieraj',       label: 'Wspieraj' },
  { href: '/blog',           label: 'Blog' },
  { href: '/o-nas',          label: 'O nas' },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(localStorage.getItem('oaza_is_admin') === 'true')
  }, [])

  const logout = () => {
    localStorage.removeItem('oaza_token')
    localStorage.removeItem('oaza_is_admin')
    setIsAdmin(false)
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-oaza-green tracking-tight shrink-0"
        >
          Oaza
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                isActive(href)
                  ? 'text-oaza-green border-b-2 border-oaza-green pb-0.5'
                  : 'text-stone-600 hover:text-oaza-green transition-colors'
              }
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={
                isActive('/admin')
                  ? 'text-oaza-green border-b-2 border-oaza-green pb-0.5'
                  : 'text-stone-600 hover:text-oaza-green transition-colors'
              }
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={logout}
              className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
            >
              Wyloguj
            </button>
          )}
          <Link
            href="/koty"
            className="text-sm font-semibold bg-oaza-rust text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Poznaj koty
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-700 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Otwórz menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-5 pt-3 flex flex-col gap-1 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={
                isActive(href)
                  ? 'px-3 py-2 rounded-lg bg-oaza-green/10 text-oaza-green'
                  : 'px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50'
              }
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                Admin
              </Link>
              <hr className="border-stone-100 my-2" />
              <button
                onClick={() => { setMenuOpen(false); logout() }}
                className="text-left px-3 py-2 rounded-lg text-stone-400 hover:bg-stone-50"
              >
                Wyloguj
              </button>
            </>
          )}
          <hr className="border-stone-100 my-2" />
          <Link
            href="/koty"
            onClick={() => setMenuOpen(false)}
            className="mt-1 px-3 py-2.5 rounded-full bg-oaza-rust text-white font-semibold text-center"
          >
            Poznaj koty
          </Link>
        </div>
      )}
    </header>
  )
}
