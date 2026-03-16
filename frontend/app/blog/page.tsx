import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Historie kotów z Oazy, wskazówki dla opiekunów i aktualności ze schroniska.',
}

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-brand-600">Strona główna</Link>
        {' › '}
        <span className="text-stone-700">Blog</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900 mb-4">Blog</h1>
      <p className="text-stone-600 mb-12">
        Historie kotów, które trafiły do Oazy. Wskazówki dla nowych opiekunów zwierząt z FIV i FeLV.
        Aktualności ze schroniska.
      </p>

      {/* Placeholder until CMS/posts are wired up */}
      <div className="text-center py-16 text-stone-400">
        <div className="text-5xl mb-4">✍️</div>
        <p className="font-medium text-stone-500">Pierwsze wpisy wkrótce.</p>
        <p className="text-sm mt-2">
          Śledź nas, żeby nie przegapić historii kotów z Oazy.
        </p>
      </div>
    </div>
  )
}
