import { SectionHeader } from '@/components/SectionHeader'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'

type Testimonial = {
  id: string | number
  quote: string
  authorName: string
  authorRole: string
  authorCompany: string
  authorAvatar?: { url: string; alt: string } | null
  linkedinProfileUrl?: string | null
  linkedinRecommendationUrl?: string | null
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  if (testimonials.length === 0) return null

  return (
    <section className="border-t border-border bg-surface">
      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader label="Testimonials" heading="What people say" />
        </div>
        <div className="mt-12">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
