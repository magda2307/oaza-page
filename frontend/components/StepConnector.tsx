'use client'

import { useRef, useEffect, useState } from 'react'

export function StepConnector() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="hidden md:block absolute top-[28px] left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-stone-200 overflow-hidden"
      aria-hidden="true"
    >
      {/* The animated fill line */}
      <div
        style={{
          height: '100%',
          width: visible ? '100%' : '0%',
          backgroundColor: '#2D6A4F',
          opacity: 0.3,
          transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 400ms',
        }}
      />
    </div>
  )
}
