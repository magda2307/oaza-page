'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  /** When set, shows an "Edit cat" button. Omit to show "Add cat" instead. */
  catId?: number
}

/**
 * Floating admin toolbar — visible only when logged in as admin.
 * Rendered client-side to avoid SSR/localStorage mismatch.
 */
export function AdminToolbar({ catId }: Props) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(localStorage.getItem('oaza_is_admin') === 'true')
  }, [])

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 z-50 flex items-center gap-2 select-none">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 bg-stone-800/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-full hover:bg-stone-900 transition-colors shadow-lg"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M7.5 2L3 6l4.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Admin
      </Link>

      {catId !== undefined ? (
        <Link
          href={`/admin/koty/${catId}/edytuj`}
          className="flex items-center gap-1.5 bg-oaza-green text-white text-xs font-medium px-3.5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-lg"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M8.5 1.5a1.414 1.414 0 0 1 2 2L4 10 1 11l1-3 6.5-6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Edytuj kota
        </Link>
      ) : (
        <Link
          href="/admin/koty/nowy"
          className="flex items-center gap-1.5 bg-oaza-green text-white text-xs font-medium px-3.5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-lg"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          Dodaj kota
        </Link>
      )}
    </div>
  )
}
