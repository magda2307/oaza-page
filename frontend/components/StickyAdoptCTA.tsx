'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  catId: number
  catName: string
}

/**
 * Fixed bottom CTA bar — mobile only (hidden on lg+).
 * Slides in once the inline mobile strip below the hero scrolls out of view,
 * so there's never a duplicate CTA on screen.
 */
export function StickyAdoptCTA({ catId, catName }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const strip = document.getElementById('mobile-cta-strip')

    // If the inline strip isn't in the DOM (e.g. adopted cat), show immediately
    if (!strip) {
      setShow(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(strip)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-t border-stone-100 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        href={`/koty/${catId}/aplikuj`}
        className="flex items-center justify-center bg-oaza-rust text-white font-semibold text-sm w-full py-3.5 rounded-full hover:opacity-90 transition-opacity"
      >
        Adoptuj {catName}
      </Link>
    </div>
  )
}
