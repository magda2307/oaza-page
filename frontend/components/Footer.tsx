import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-24">
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-stone-600">
        <div>
          <p className="font-semibold text-stone-800 mb-3">Adopcja</p>
          <ul className="space-y-2">
            <li><Link href="/koty" className="hover:text-brand-600 transition-colors">Przeglądaj koty</Link></li>
            <li><Link href="/jak-adoptowac" className="hover:text-brand-600 transition-colors">Jak adoptować</Link></li>
            <li><Link href="/moje-podania" className="hover:text-brand-600 transition-colors">Moje podania</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-stone-800 mb-3">Wsparcie</p>
          <ul className="space-y-2">
            <li><Link href="/wspieraj" className="hover:text-brand-600 transition-colors">Wspieraj nas</Link></li>
            <li><Link href="/kontakt" className="hover:text-brand-600 transition-colors">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-stone-800 mb-3">Organizacja</p>
          <ul className="space-y-2">
            <li><Link href="/o-nas" className="hover:text-brand-600 transition-colors">O nas</Link></li>
            <li><Link href="/blog" className="hover:text-brand-600 transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-stone-800 mb-3">Prawne</p>
          <ul className="space-y-2">
            <li><Link href="/prywatnosc" className="hover:text-brand-600 transition-colors">Polityka prywatności</Link></li>
            <li><Link href="/regulamin" className="hover:text-brand-600 transition-colors">Regulamin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 max-w-5xl mx-auto px-4 py-4 text-xs text-stone-400">
        © {new Date().getFullYear()} Oaza — schronisko dla kotów, których nikt inny nie przyjmie.
      </div>
    </footer>
  )
}
