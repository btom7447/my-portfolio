import { getPayloadClient } from '@/lib/payload'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProjectFilter } from '@/components/ProjectFilter'
import { HorizontalScroll } from '@/components/HorizontalScroll'
import { SectionHeader } from '@/components/SectionHeader'
import { GitHubSection } from '@/components/GitHubSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { GSAPProvider } from '@/components/GSAPProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Portfolio',
  description: 'Selected web and mobile projects',
}

export default async function WorkPage() {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: 'order',
    limit: 50,
  })

  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    where: {
      featured: { equals: true },
      status: { equals: 'published' },
    },
    sort: 'order',
    limit: 10,
  })

  const projects = docs.map((p) => ({
    id: String(p.id),
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    category: p.category,
    coverImage:
      typeof p.coverImage === 'object' && p.coverImage
        ? { url: p.coverImage.url ?? '', alt: p.coverImage.alt }
        : undefined,
    techStack: p.techStack as { tech: string }[] | undefined,
    tags: p.tags as { tag: string }[] | undefined,
    deviceFrameType: (p.deviceFrameType as 'browser' | 'phone' | 'tablet') || 'browser',
    projectStatus: (p.projectStatus as 'live' | 'development' | 'degraded' | 'down') || undefined,
  }))

  return (
    <GSAPProvider>
      <Navbar />
      <main className="pb-20">
        <div className="mx-auto max-w-6xl px-6 pt-32">
          <SectionHeader
            label="Portfolio"
            heading="All Projects"
            description="A collection of web and mobile projects I've built."
          />
        </div>

        {/* Desktop: horizontal scroll conveyor */}
        <div className="mt-12 hidden md:block">
          <HorizontalScroll projects={projects} />
        </div>

        {/* Mobile: filterable grid */}
        <div className="mx-auto mt-12 max-w-6xl px-6 md:hidden">
          <ProjectFilter projects={projects} />
        </div>

        <GitHubSection />

        <TestimonialsSection
          testimonials={testimonials.map((t) => ({
            id: t.id,
            quote: t.quote,
            authorName: t.authorName,
            authorRole: t.authorRole,
            authorCompany: t.authorCompany,
            authorAvatar:
              typeof t.authorAvatar === 'object' && t.authorAvatar
                ? { url: t.authorAvatar.url ?? '', alt: t.authorAvatar.alt }
                : null,
            linkedinProfileUrl: t.linkedinProfileUrl,
            linkedinRecommendationUrl: t.linkedinRecommendationUrl,
          }))}
        />
      </main>
      <Footer />
    </GSAPProvider>
  )
}
