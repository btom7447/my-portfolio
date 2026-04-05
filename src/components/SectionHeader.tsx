import { ScrollReveal } from '@/components/ScrollReveal'

type SectionHeaderProps = {
  label: string
  heading: string
  description?: string
  align?: 'left' | 'center'
  children?: React.ReactNode
}

export function SectionHeader({
  label,
  heading,
  description,
  align = 'left',
  children,
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : ''

  return (
    <ScrollReveal className={alignClass}>
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        {label}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-lg text-muted">
          {description}
        </p>
      )}
      {children}
    </ScrollReveal>
  )
}
