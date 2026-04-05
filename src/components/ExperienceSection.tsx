import { SectionHeader } from '@/components/SectionHeader'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'

type Experience = {
  company: string
  role: string
  period: string
  workMode?: 'remote' | 'hybrid' | 'onsite' | null
  companyUrl?: string | null
  description?: string
  id?: string | number
}

export function ExperienceSection({ items }: { items: Experience[] }) {
  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeader label="Experience" heading="Where I've worked" />
      <ExperienceTimeline items={items} />
    </section>
  )
}
