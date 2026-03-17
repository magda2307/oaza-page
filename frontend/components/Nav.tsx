'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/koty',           label: 'Koty' },
  { href: '/sukcesy',        label: 'Sukcesy' },
  { href: '/jak-adoptowac',  label: 'Jak adoptować' },
  { href: '/wspieraj',       label: 'Wspieraj' },
  { href: '/blog',           label: 'Blog' },
  { href: '/o-nas',          label: 'O nas' },
]

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm15 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5-5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 8c-3.87 0-7 3.13-7 7 0 2.76 2.24 5 5 5h4c2.76 0 5-2.24 5-5 0-3.87-3.13-7-7-7z" />
    </svg>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setIsAdmin(localStorage.getItem('oaza_is_admin') === 'true')
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('oaza_token')
    localStorage.removeItem('oaza_is_admin')
    setIsAdmin(false)
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Transparent only on homepage when not scrolled
  const isHomepage = pathname === '/'
  const isTransparent = isHomepage && !scrolled

  const headerClasses = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-white/95 backdrop-blur-md border-stone-200 shadow-sm'

  const logoClasses = isTransparent
    ? 'text-white'
    : 'text-oaza-green'

  const linkBaseClasses = isTransparent
    ? 'text-white/80 hover:text-white transition-colors'
    : 'text-stone-600 hover:text-oaza-green transition-colors'

  const activeLinkClasses = isTransparent
    ? 'text-white border-b-2 border-white pb-0.5'
    : 'text-oaza-green border-b-2 border-oaza-green pb-0.5'

  const ctaClasses = isTransparent
    ? 'text-sm font-semibold bg-white text-oaza-green px-4 py-2 rounded-full hover:bg-oaza-warm transition-colors'
    : 'text-sm font-semibold bg-oaza-rust text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity'

  const hamburgerClasses = isTransparent
    ? 'text-white p-1'
    : 'text-stone-700 p-1'

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${headerClasses}`}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className={`text-xl font-bold tracking-tight shrink-0 flex items-center ${logoClasses}`}
        >
          <PawIcon className="w-5 h-5 fill-current inline-block mr-1.5 -mt-0.5" />
          Oaza
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? activeLinkClasses : linkBaseClasses}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={isActive('/admin') ? activeLinkClasses : linkBaseClasses}
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
              className={`text-sm transition-colors ${isTransparent ? 'text-white/60 hover:text-white' : 'text-stone-400 hover:text-stone-700'}`}
            >
              Wyloguj
            </button>
          )}
          <Link href="/koty" className={ctaClasses}>
            Poznaj koty
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden ${hamburgerClasses}`}
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

      {/* Mobile menu — always solid white */}
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
