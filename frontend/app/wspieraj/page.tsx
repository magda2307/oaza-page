import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wesprzyj Oazę',
  description: 'Sfinansuj leczenie kotów z FIV, FeLV, rakiem i po wypadkach. Każda złotówka trafia bezpośrednio do weterynarza.',
}

export default function WspierajPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-brand-600">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Wspieraj</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-4">Wesprzyj leczenie</h1>
      <p className="text-stone-600 text-lg leading-relaxed mb-10">
        Nasze koty często nie potrzebują tylko domu — potrzebują leków, operacji i stałej opieki
        weterynaryjnej. Twoja darowizna trafia bezpośrednio na konto schroniska
        i jest przeznaczana wyłącznie na leczenie zwierząt.
      </p>

      <div className="space-y-6 mb-12">
        {[
          { amount: '20 zł', what: 'pokrywa tygodniową dawkę leków antyretrowirusowych dla kota z FIV' },
          { amount: '50 zł', what: 'finansuje wizytę kontrolną u specjalisty' },
          { amount: '150 zł', what: 'pokrywa koszt podstawowych badań krwi i moczu' },
          { amount: '500 zł', what: 'pozwala sfinansować drobny zabieg chirurgiczny' },
        ].map(({ amount, what }) => (
          <div key={amount} className="flex gap-4 items-start bg-white rounded-xl border border-stone-200 p-5">
            <span className="text-xl font-bold text-brand-600 w-20 shrink-0">{amount}</span>
            <p className="text-stone-600">{what}</p>
          </div>
        ))}
      </div>

      <div className="bg-brand-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-3">Jak wpłacić?</h2>
        <p className="text-stone-600 mb-4">
          Darowizny przyjmujemy przelewem na konto organizacji. Skontaktuj się z nami,
          żebyśmy mogli potwierdzić i wystawić zaświadczenie do odliczenia od podatku.
        </p>
        <Link href="/kontakt" className="btn-primary inline-block">
          Napisz do nas
        </Link>
        <p className="mt-4 text-xs text-stone-400">
          Oaza jest organizacją non-profit. Darowizny podlegają odliczeniu od podstawy opodatkowania.
        </p>
      </div>
    </div>
  )
}
