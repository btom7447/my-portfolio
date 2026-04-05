import { SectionHeader } from '@/components/SectionHeader'
import { CertificationTimeline } from '@/components/CertificationTimeline'

type Certification = {
  id: string | number
  name: string
  institute: string
  link?: string | null
  date: string
  credentialId?: string | null
  badge?: { url: string; alt: string } | null
}

export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[]
}) {
  if (certifications.length === 0) return null

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeader label="Credentials" heading="Certifications" />
      <CertificationTimeline items={certifications} />
    </section>
  )
}
