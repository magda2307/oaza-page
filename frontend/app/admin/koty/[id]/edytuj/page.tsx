'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { getCat, updateCat } from '@/lib/api'
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
  is_adopted: boolean
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

export default function EdytujKotaPage() {
  const router = useRouter()
  const params = useParams()
  const catId = Number(params.id)

  const [form, setForm] = useState<FormState>({
    name: '',
    age_years: '',
    sex: 'unknown',
    breed: '',
    description: '',
    photo_url: '',
    is_adopted: false,
  })
  const [tags, setTags] = useState<string[]>([])
  const [catName, setCatName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('oaza_is_admin') !== 'true') {
      router.push('/logowanie')
      return
    }
    getCat(catId)
      .then((cat) => {
        setCatName(cat.name)
        setForm({
          name: cat.name,
          age_years: cat.age_years?.toString() ?? '',
          sex: (cat.sex as Sex) ?? 'unknown',
          breed: cat.breed ?? '',
          description: cat.description ?? '',
          photo_url: cat.photo_url ?? '',
          is_adopted: cat.is_adopted,
        })
        setTags(cat.tags ?? [])
      })
      .catch(() => router.push('/admin/koty'))
      .finally(() => setFetching(false))
  }, [catId, router])

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    const token = localStorage.getItem('oaza_token') ?? ''
    try {
      await updateCat(
        catId,
        {
          name: form.name,
          age_years: form.age_years ? Number(form.age_years) : null,
          sex: form.sex,
          breed: form.breed || null,
          description: form.description || null,
          photo_url: form.photo_url || null,
          is_adopted: form.is_adopted,
          tags,
        },
        token,
      )
      setSaved(true)
      setCatName(form.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zapisać zmian.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-stone-400 text-sm">
        Ładowanie danych kota...
      </div>
    )
  }

  const descLen = form.description.length
  const photoValid = form.photo_url.startsWith('http')

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* ── Breadcrumb + profile link ── */}
      <div className="flex items-center justify-between mb-8">
        <nav className="text-sm text-stone-400">
          <Link href="/admin" className="hover:text-oaza-green transition-colors">Admin</Link>
          {' › '}
          <Link href="/admin/koty" className="hover:text-oaza-green transition-colors">Koty</Link>
          {' › '}
          <span className="text-stone-700">{catName || 'Edytuj'}</span>
        </nav>
        <Link
          href={`/koty/${catId}`}
          target="_blank"
          className="text-xs text-oaza-green hover:underline underline-offset-2 font-medium"
        >
          Podgląd profilu →
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mb-8">
        Edytuj: {catName}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic info ── */}
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

        {/* ── Description ── */}
        <div className="bg-stone-50 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-4">Opis</p>
          <Field
            label="Treść"
            hint={`${descLen} / ${DESC_MAX}`}
          >
            <textarea
              className={`input min-h-[160px] resize-y ${descLen > DESC_MAX ? 'border-red-400 focus:border-red-500' : ''}`}
              value={form.description}
              onChange={set('description')}
              maxLength={DESC_MAX}
              placeholder="Opowiedz historię kota — skąd pochodzi, jaki jest, czego potrzebuje..."
            />
          </Field>
        </div>

        {/* ── Photo ── */}
        <div className="bg-stone-50 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-4">Zdjęcie</p>
          <div className="flex gap-4 items-start">
            {/* Preview */}
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
                  brak zdjęcia
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

        {/* ── Tags ── */}
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

        {/* ── Status ── */}
        <div className="bg-stone-50 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-4">Status adopcji</p>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.is_adopted}
                onChange={(e) => setForm((p) => ({ ...p, is_adopted: e.target.checked }))}
              />
              <div className="w-10 h-6 rounded-full bg-stone-200 peer-checked:bg-oaza-green transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-stone-700 group-hover:text-stone-900">
              {form.is_adopted ? 'Zaadoptowany — profil widoczny, adopcja zamknięta' : 'Szuka domu — przyjmuje podania o adopcję'}
            </span>
          </label>
        </div>

        {/* ── Feedback ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
            Zmiany zapisane.
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
          <Link href="/admin/koty" className="btn-secondary">
            Powrót do listy
          </Link>
        </div>

      </form>
    </div>
  )
}
