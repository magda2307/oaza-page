'use client'

import Link from 'next/link'

const columns = [
  {
    heading: 'Adoptuj',
    links: [
      { href: '/koty',          label: 'Przeglądaj koty' },
      { href: '/jak-adoptowac', label: 'Jak adoptować' },
      { href: '/sukcesy',       label: 'Sukcesy' },
      { href: '/moje-podania',  label: 'Moje podania' },
    ],
  },
  {
    heading: 'Wsparcie',
    links: [
      { href: '/wspieraj',   label: 'Wspieraj' },
      { href: '/partnerzy',  label: 'Partnerzy' },
      { href: '/kontakt',    label: 'Kontakt' },
    ],
  },
  {
    heading: 'Organizacja',
    links: [
      { href: '/o-nas', label: 'O nas' },
      { href: '/blog',  label: 'Blog' },
    ],
  },
  {
    heading: 'Prawne',
    links: [
      { href: '/prywatnosc', label: 'Prywatność' },
      { href: '/regulamin',  label: 'Regulamin' },
    ],
  },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-oaza-green text-white mt-24">

      {/* Top band: logo · tagline · social */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <span className="text-xl font-bold tracking-tight text-white">Oaza</span>

          {/* Tagline */}
          <p className="text-sm text-green-200/80 italic text-center">
            Koty, których nikt inny nie przyjmie.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              aria-label="Instagram Oazy"
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="Facebook Oazy"
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {columns.map(({ heading, links }) => (
          <div key={heading}>
            <p className="font-semibold text-oaza-warm mb-3">{heading}</p>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter band */}
      <div className="border-t border-oaza-green/30 max-w-5xl mx-auto px-4 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-green-200/80 text-center sm:text-left max-w-sm">
          Chcesz wiedzieć, które koty właśnie trafiły do Oazy?
        </p>
        <form
          className="flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 w-52"
            placeholder="twój@email.pl"
            type="email"
          />
          <button
            type="submit"
            className="bg-oaza-rust text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Zapisz się
          </button>
        </form>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-green-300">
        <span>© {new Date().getFullYear()} Oaza. Wszelkie prawa zastrzeżone.</span>
        <div className="flex items-center gap-3">
          <span className="text-green-300/60">Made with ♥ for cats who deserve a chance</span>
          <Link href="/logowanie?next=/admin" className="text-green-300/30 hover:text-green-300/60 transition-colors">
            admin
          </Link>
        </div>
      </div>

    </footer>
  )
}
