import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jak adoptować kota',
  description: 'Krok po kroku — jak przebiega adopcja kota z Oazy. Proste, uczciwe, bez tajemnic.',
}

const steps = [
  {
    num: '01',
    title: 'Przeglądaj koty',
    desc: 'Zajrzyj na naszą listę kotów. Każdy profil opisuje historię, charakter i potrzeby zdrowotne. Nie szukaj "idealnego" — szukaj swojego.',
  },
  {
    num: '02',
    title: 'Złóż podanie',
    desc: 'Wypełnij krótki formularz. Nie musisz mieć dużego mieszkania ani doświadczenia. Powiedz nam kto jesteś i jak wygląda Twój dom.',
  },
  {
    num: '03',
    title: 'Rozmowa z opiekunem',
    desc: 'Skontaktujemy się mailowo lub telefonicznie. To nie rozmowa kwalifikacyjna — chcemy poznać Twoją sytuację i odpowiedzieć na pytania.',
  },
  {
    num: '04',
    title: 'Wizyta adaptacyjna',
    desc: 'Zapraszamy Cię do Oazy, żebyś poznał kota osobiście. Możemy też zorganizować wizytę domową — szczególnie przy kotach wymagających stałej opieki medycznej.',
  },
  {
    num: '05',
    title: 'Adopcja i wsparcie',
    desc: 'Podpisujemy umowę adopcyjną. Jesteśmy do dyspozycji po adopcji — szczególnie przy kotach chorych. Nie znikamy razem z papierami.',
  },
]

export default function JakAdoptowaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Jak adoptować</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-4">Jak przebiega adopcja</h1>
      <p className="text-stone-600 text-lg mb-12 leading-relaxed">
        Staramy się, żeby adopcja była prosta i uczciwa. Nie stawiamy nieracjonalnych warunków.
        Zależy nam na dobrym dopasowaniu — nie na odrzuceniu kandydatów.
      </p>

      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-6">
            <div className="text-3xl font-bold text-oaza-green/30 w-12 shrink-0 pt-0.5">
              {step.num}
            </div>
            <div>
              <h2 className="font-semibold text-stone-900 text-lg mb-1">{step.title}</h2>
              <p className="text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 bg-oaza-warm rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-stone-800 mb-3">Gotowy na poznanie kotów?</h2>
        <p className="text-stone-600 mb-6">
          Każdy kot w Oazie ma aktualną dokumentację weterynaryjną. O stanie zdrowia informujemy
          szczerze — zanim złożysz podanie.
        </p>
        <Link href="/koty" className="btn-primary">
          Przeglądaj koty
        </Link>
      </div>
    </div>
  )
}
