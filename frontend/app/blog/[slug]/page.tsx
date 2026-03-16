import type { Metadata } from 'next'
import Link from 'next/link'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return {
    title: `Blog — ${params.slug}`,
    description: 'Wpis na blogu Oazy.',
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/" className="hover:text-oaza-green">Strona główna</Link>
        {' › '}
        <Link href="/blog" className="hover:text-oaza-green">Blog</Link>
        {' › '}
        <span className="text-stone-700">{params.slug}</span>
      </nav>

      <div className="text-center py-20 text-stone-400">
        <div className="text-4xl mb-4">✍️</div>
        <p className="font-medium text-stone-500 text-lg mb-2">Treść wkrótce</p>
        <p className="text-sm mb-8">Ten wpis jest w przygotowaniu.</p>
        <Link href="/blog" className="btn-secondary">
          ← Wróć do blogu
        </Link>
      </div>
    </div>
  )
}
