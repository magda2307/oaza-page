export default function KotyLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Page title skeleton */}
      <div className="h-8 w-56 bg-stone-200 rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-72 bg-stone-100 rounded animate-pulse mb-10" />

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-stone-200 overflow-hidden">
            {/* Photo area */}
            <div className="aspect-[4/3] bg-stone-200 animate-pulse" />
            {/* Text area */}
            <div className="p-5 space-y-2">
              <div className="h-5 w-28 bg-stone-200 rounded animate-pulse" />
              <div className="h-4 w-40 bg-stone-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
              <div className="h-4 w-16 bg-stone-200 rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
