const statusConfig = {
  live: { label: 'Live', color: 'bg-emerald-500', pulse: true },
  development: { label: 'In Development', color: 'bg-blue-400', pulse: false },
  degraded: { label: 'Degraded', color: 'bg-yellow-500', pulse: false },
  down: { label: 'Down', color: 'bg-red-500', pulse: false },
} as const

type ProjectStatus = keyof typeof statusConfig

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status] ?? statusConfig.development

  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.color}`}
        />
      </span>
      {config.label}
    </span>
  )
}
