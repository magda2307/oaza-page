import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">🐾</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-3">Strona nie istnieje</h1>
      <p className="text-stone-500 mb-8">
        Może kot do niej chodził i potrącił klawiaturę. Wróćmy na stronę główną.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">Strona główna</Link>
        <Link href="/koty" className="btn-secondary">Przeglądaj koty</Link>
        <Link href="/wspieraj" className="btn-secondary">Wesprzyj nas</Link>
      </div>
    </div>
  )
}
