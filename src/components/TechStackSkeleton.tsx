export function TechStackSkeleton() {
  const categories = [
    { name: 'Frontend', count: 5 },
    { name: 'Backend', count: 7 },
    { name: 'Mobile', count: 5 },
    { name: 'Tools', count: 7 },
  ]

  return (
    <div className="grid gap-12 sm:grid-cols-2">
      {categories.map((cat) => (
        <div key={cat.name}>
          {/* Category label skeleton */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-accent/20" />
            <div className="h-5 w-20 animate-pulse rounded bg-border" />
            <div className="h-4 w-8 animate-pulse rounded bg-border/60" />
          </div>

          {/* Tech cards skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: cat.count }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-accent-subtle" />
                <div
                  className="h-4 animate-pulse rounded bg-border"
                  style={{ width: `${50 + (i % 3) * 15}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
