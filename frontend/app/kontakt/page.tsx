import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się z Oazą — adopcja, darowizny, wolontariat.',
}

export default function KontaktPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Kontakt</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-4">Kontakt</h1>
      <p className="text-stone-600 mb-10">
        Masz pytania o adopcję, chcesz wesprzeć konkretnego kota albo zostać wolontariuszem?
        Napisz — odpisujemy zazwyczaj w ciągu 48 godzin.
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-1">E-mail</p>
          <a
            href="mailto:kontakt@oaza.pl"
            className="text-oaza-rust font-medium hover:underline text-lg"
          >
            kontakt@oaza.pl
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Tematy</p>
          <ul className="space-y-1 text-stone-600 text-sm">
            <li>🐾 Adopcja — pytania przed złożeniem podania</li>
            <li>💊 Wolontariat i domy tymczasowe</li>
            <li>💛 Darowizny i patronaty</li>
            <li>📷 Media i współpraca</li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-sm text-stone-400">
        Jeśli jesteś w trakcie składania podania — śledź status w{' '}
        <Link href="/moje-podania" className="underline hover:text-oaza-green">
          swoim koncie
        </Link>.
      </p>
    </div>
  )
}
