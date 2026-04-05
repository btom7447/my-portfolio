const bentoClasses = [
  'col-span-2 row-span-2',   // hero
  'col-span-1 row-span-2',   // mobile portrait
  'col-span-1 row-span-1',   // web small
  'col-span-1 row-span-1',   // web small
  'col-span-1 row-span-2',   // mobile portrait
  'col-span-2 row-span-2',   // web landscape
  'col-span-1 row-span-2',   // mobile portrait
]

export function BentoGridSkeleton() {
  return (
    <div className="grid auto-rows-[160px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 grid-flow-dense">
      {bentoClasses.map((cls, i) => (
        <div
          key={i}
          className={`${cls} overflow-hidden rounded-2xl border border-border bg-surface`}
        >
          {/* Image area */}
          <div className="relative flex-1 h-[calc(100%-60px)] animate-pulse bg-border/30" />

          {/* Info bar */}
          <div className="border-t border-border p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 flex-1 animate-pulse rounded bg-border" />
              <div className="h-5 w-14 shrink-0 animate-pulse rounded-full bg-accent-subtle" />
            </div>
            <div className="mt-2 flex gap-1">
              <div className="h-4 w-12 animate-pulse rounded-full bg-border/60" />
              <div className="h-4 w-16 animate-pulse rounded-full bg-border/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
