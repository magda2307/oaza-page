import Link from 'next/link'

const columns = [
  {
    heading: 'Adoptuj',
    links: [
      { href: '/koty',          label: 'Przeglądaj koty' },
      { href: '/jak-adoptowac', label: 'Jak adoptować' },
      { href: '/moje-podania',  label: 'Moje podania' },
    ],
  },
  {
    heading: 'Wsparcie',
    links: [
      { href: '/wspieraj', label: 'Wspieraj' },
      { href: '/kontakt',  label: 'Kontakt' },
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

export default function Footer() {
  return (
    <footer className="bg-oaza-green text-white mt-24">
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
      <div className="border-t border-oaza-green/50 max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-green-300">
        <span>© {new Date().getFullYear()} Oaza. Wszelkie prawa zastrzeżone.</span>
        <span>Schronisko dla kotów, których nikt inny nie przyjmie.</span>
      </div>
    </footer>
  )
}
