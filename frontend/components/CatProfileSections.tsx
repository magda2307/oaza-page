// Shared layout components for cat profile pages.

import type { ReactNode } from 'react'

export type CompatStatus = 'yes' | 'no' | 'unknown'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-10 mt-10 border-t border-stone-100">
      <h2 className="font-display font-bold text-xl text-stone-900 mb-5">{title}</h2>
      {children}
    </section>
  )
}

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-stone-100 last:border-0">
      <span className="text-sm text-stone-400 shrink-0">{label}</span>
      <span className="text-sm text-stone-800 font-medium text-right">{value}</span>
    </div>
  )
}

const COMPAT_STYLES: Record<CompatStatus, {
  wrapper: string; icon: string; iconColor: string; labelColor: string
}> = {
  yes:     { wrapper: 'bg-emerald-50 border border-emerald-200', icon: '✓', iconColor: 'text-emerald-700', labelColor: 'text-stone-700' },
  no:      { wrapper: 'bg-rose-50 border border-rose-200',       icon: '✗', iconColor: 'text-rose-600',    labelColor: 'text-stone-700' },
  unknown: { wrapper: 'bg-stone-50 border border-stone-200',     icon: '?', iconColor: 'text-stone-400',   labelColor: 'text-stone-400' },
}

export function CompatBadge({ status, label }: { status: CompatStatus; label: string }) {
  const s = COMPAT_STYLES[status]
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${s.wrapper}`}>
      <span className={`text-sm font-bold leading-none ${s.iconColor}`}>{s.icon}</span>
      <span className={`text-sm font-medium ${s.labelColor}`}>{label}</span>
    </div>
  )
}
