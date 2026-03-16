import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Regulamin',
}

export default function RegulaminyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Regulamin</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-8">Regulamin serwisu</h1>

      <div className="space-y-6 text-stone-700 leading-relaxed text-sm">
        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">§1 Postanowienia ogólne</h2>
          <p>Serwis Oaza służy do przeglądania profili kotów oraz składania podań o adopcję. Korzystanie z serwisu jest bezpłatne.</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">§2 Konto użytkownika</h2>
          <p>Do złożenia podania wymagane jest posiadanie konta. Użytkownik zobowiązuje się do podania prawdziwych danych. Jedno konto przypadające na jedną osobę.</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">§3 Podania o adopcję</h2>
          <p>Złożenie podania nie jest równoznaczne z zawarciem umowy adopcyjnej. Oaza zastrzega sobie prawo do odrzucenia podania bez podania przyczyny. Decyzja adopcyjna jest ostateczna.</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">§4 Odpowiedzialność</h2>
          <p>Oaza dokłada wszelkich starań, aby informacje o kotach były aktualne i prawdziwe. Nie ponosimy odpowiedzialności za decyzje podjęte na podstawie treści serwisu.</p>
        </section>

        <section>
          <h2 className="font-semibold text-stone-900 text-base mb-2">§5 Zmiany regulaminu</h2>
          <p>Zastrzegamy prawo do zmiany regulaminu. O istotnych zmianach poinformujemy zarejestrowanych użytkowników drogą mailową.</p>
        </section>
      </div>
    </div>
  )
}
