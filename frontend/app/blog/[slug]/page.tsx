import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Wpis nie istnieje' }

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-brand-600">Strona główna</Link>
        {' › '}
        <Link href="/blog" className="hover:text-brand-600">Blog</Link>
        {' › '}
        <span className="text-stone-700">{params.slug}</span>
      </nav>
      <p className="text-stone-500">Ten wpis jest jeszcze niedostępny.</p>
      <Link href="/blog" className="btn-secondary inline-block mt-6">← Wróć do bloga</Link>
    </div>
  )
}
