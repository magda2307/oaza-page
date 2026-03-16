'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createCat } from '@/lib/api'

export default function AdminNowyKotPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    age_years: '',
    breed: '',
    description: '',
    photo_url: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('oaza_is_admin') !== 'true') router.push('/logowanie')
  }, [router])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const token = localStorage.getItem('oaza_token') ?? ''
    try {
      await createCat(
        {
          ...form,
          age_years: form.age_years ? Number(form.age_years) : null,
          photo_url: form.photo_url || null,
          breed: form.breed || null,
          description: form.description || null,
        },
        token,
      )
      router.push('/admin/koty')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się dodać kota.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/admin" className="hover:text-oaza-green">Admin</Link>
        {' › '}
        <Link href="/admin/koty" className="hover:text-oaza-green">Koty</Link>
        {' › '}
        <span className="text-stone-700">Nowy</span>
      </nav>

      <h1 className="text-2xl font-bold text-stone-900 mb-8">Dodaj kota</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Imię *</label>
          <input type="text" className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Rasa</label>
          <input type="text" className="input" value={form.breed} onChange={set('breed')} placeholder="np. Europejski" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Wiek (lata)</label>
          <input type="number" className="input" value={form.age_years} onChange={set('age_years')} min={0} max={30} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Opis</label>
          <textarea className="input min-h-[120px] resize-y" value={form.description} onChange={set('description')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">URL zdjęcia</label>
          <input type="url" className="input" value={form.photo_url} onChange={set('photo_url')} placeholder="https://..." />
        </div>

        {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Zapisywanie...' : 'Dodaj kota'}
          </button>
          <Link href="/admin/koty" className="btn-secondary">Anuluj</Link>
        </div>
      </form>
    </div>
  )
}
