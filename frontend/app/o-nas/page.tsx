import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'O nas',
  description: 'Poznaj historię Oazy — schroniska, które nigdy nie mówi nie. FIV, FeLV, rak, wypadki — przyjmujemy każdego kota.',
}

export default function ONasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">O nas</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-6">O Oazie</h1>

      <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed">
        <p className="text-lg">
          Oaza powstała z jednego prostego powodu: inne schroniska odmawiają przyjęcia kotów,
          które są trudne. Z FIV. Z FeLV. Z rakiem. Po wypadku. Terminalnie chore.
          My nie odmawiamy.
        </p>

        <p>
          Nie dlatego, że jesteśmy naiwni — wiemy, że opieka nad chorym kotem wymaga czasu,
          pieniędzy i emocjonalnej odwagi. Robimy to, bo wierzymy, że każde życie — nawet krótkie,
          nawet trudne — zasługuje na godność i ciepło.
        </p>

        <p>
          Pracujemy z wolontariuszami i siecią domów tymczasowych. Mamy stały kontakt z kilkoma
          klinikami weterynaryjnymi, które rozumieją naszą specyfikę. Każdy kot przechodzi
          pełną diagnostykę zanim trafi do adopcji — i dostaje pełną dokumentację.
        </p>

        <p>
          Jeśli chcesz adoptować — powiedz nam o sobie. Jeśli nie możesz adoptować — możesz
          wesprzeć leczenie. Jeśli chcesz pomagać inaczej — napisz do nas.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link href="/koty" className="btn-primary">
          Poznaj koty
        </Link>
        <Link href="/wspieraj" className="btn-secondary">
          Wesprzyj nas
        </Link>
        <Link href="/kontakt" className="btn-secondary">
          Napisz do nas
        </Link>
      </div>
    </div>
  )
}
