'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createCat } from '@/lib/api'
import { TagPicker } from '@/components/CatTags'

const DESC_MAX = 3000

type Sex = 'm' | 'f' | 'unknown'

interface FormState {
  name: string
  age_years: string
  sex: Sex
  breed: string
  description: string
  photo_url: string
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="block text-sm font-medium text-stone-700">{label}</label>
        {hint && <span className="text-xs text-stone-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export default function AdminNowyKotPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    name: '',
    age_years: '',
    sex: 'unknown',
    breed: '',
    description: '',
    photo_url: '',
  })
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('oaza_is_admin') !== 'true') router.push('/logowanie?next=/admin/koty/nowy')
  }, [router])

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const token = localStorage.getItem('oaza_token') ?? ''
    try {
      const cat = await createCat(
        {
          name: form.name,
          age_years: form.age_years ? Number(form.age_years) : null,
          sex: form.sex,
          breed: form.breed || null,
          description: form.description || null,
          photo_url: form.photo_url || null,
          tags,
        },
        token,
      )
      router.push(`/admin/koty/${cat.id}/edytuj`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się dodać kota.')
    } finally {
      setLoading(false)
    }
  }

  const descLen = form.description.length
  const photoValid = form.photo_url.startsWith('http')

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-stone-400 mb-8">
        <Link href="/admin" className="hover:text-oaza-green transition-colors">Admin</Link>
        {' › '}
        <Link href="/admin/koty" className="hover:text-oaza-green transition-colors">Koty</Link>
        {' › '}
        <span className="text-stone-700">Nowy</span>
      </nav>

      <h1 className="text-2xl font-bold text-stone-900 mb-8">Dodaj kota</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic info */}
        <div className="bg-stone-50 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Podstawowe dane</p>

          <Field label="Imię *">
            <input
              type="text"
              className="input"
              value={form.name}
              onChange={set('name')}
              required
              maxLength={100}
              autoFocus
              placeholder="np. Marchewka"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Rasa">
              <input
                type="text"
                className="input"
                value={form.breed}
                onChange={set('breed')}
                placeholder="np. Europejski"
                maxLength={100}
              />
            </Field>
            <Field label="Wiek (lata)">
              <input
                type="number"
                className="input"
                value={form.age_years}
                onChange={set('age_years')}
                min={0}
                max={30}
                step={0.5}
                placeholder="np. 3"
              />
            </Field>
          </div>

          <Field label="Płeć">
            <div className="flex gap-2">
              {([
                { value: 'f', label: 'Kotka' },
                { value: 'm', label: 'Kocur' },
                { value: 'unknown', label: 'Nieznana' },
              ] as { value: Sex; label: string }[]).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, sex: value }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                    form.sex === value
                      ? 'bg-oaza-green text-white border-oaza-green'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Description */}
        <div className="bg-stone-50 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-4">Opis</p>
          <Field label="Treść" hint={`${descLen} / ${DESC_MAX}`}>
            <textarea
              className={`input min-h-[160px] resize-y ${descLen > DESC_MAX ? 'border-red-400 focus:border-red-500' : ''}`}
              value={form.description}
              onChange={set('description')}
              maxLength={DESC_MAX}
              placeholder="Opowiedz historię kota — skąd pochodzi, jaki jest, czego potrzebuje..."
            />
          </Field>
        </div>

        {/* Photo */}
        <div className="bg-stone-50 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-4">Zdjęcie</p>
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-stone-200 border border-stone-200">
              {photoValid ? (
                <Image
                  src={form.photo_url}
                  alt="Podgląd"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs text-center px-2">
                  podgląd
                </div>
              )}
            </div>
            <div className="flex-1">
              <Field label="URL zdjęcia">
                <input
                  type="url"
                  className="input"
                  value={form.photo_url}
                  onChange={set('photo_url')}
                  placeholder="https://..."
                />
              </Field>
              <p className="mt-1.5 text-xs text-stone-400">
                Wklej bezpośredni link do pliku JPG lub PNG.
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-stone-50 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-4">
            Etykiety
            {tags.length > 0 && (
              <span className="ml-2 bg-oaza-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {tags.length}
              </span>
            )}
          </p>
          <TagPicker selected={tags} onChange={setTags} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
            {loading ? 'Zapisywanie...' : 'Dodaj kota'}
          </button>
          <Link href="/admin/koty" className="btn-secondary">Anuluj</Link>
        </div>

      </form>
    </div>
  )
}
