import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Polityka prywatności',
}

export default function PrywatnoscPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Polityka prywatności</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-8">Polityka prywatności</h1>

      <div className="space-y-6 text-stone-700 leading-relaxed text-sm">
        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">Administrator danych</h2>
          <p>Administratorem danych jest Oaza z siedzibą w Polsce. Kontakt: kontakt@oaza.pl</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">Jakie dane zbieramy</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Adres e-mail przy rejestracji konta</li>
            <li>Treść podań o adopcję</li>
            <li>Logi dostępu do serwisu</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">Cel przetwarzania</h2>
          <p>Dane są przetwarzane wyłącznie w celu obsługi procesu adopcji oraz kontaktu z użytkownikiem. Nie sprzedajemy danych osobowych.</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">Twoje prawa</h2>
          <p>Masz prawo do dostępu do swoich danych, ich poprawienia, usunięcia oraz przenoszenia. Napisz do nas na kontakt@oaza.pl.</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">Pliki cookie</h2>
          <p>Strona używa wyłącznie technicznie niezbędnych plików cookie do utrzymania sesji. Nie używamy ciasteczek reklamowych.</p>
        </section>
      </div>
    </div>
  )
}
