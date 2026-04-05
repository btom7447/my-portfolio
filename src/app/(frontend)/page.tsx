import { getPayloadClient } from '@/lib/payload'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { FeaturedProject } from '@/components/FeaturedProject'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { ClientLogos } from '@/components/ClientLogos'
import { ExperienceSection } from '@/components/ExperienceSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { CertificationsSection } from '@/components/CertificationsSection'
import { GitHubSection } from '@/components/GitHubSection'
import { AboutTeaser } from '@/components/AboutTeaser'
import { ContactCTA } from '@/components/ContactCTA'
import { GSAPProvider } from '@/components/GSAPProvider'
import { GreetingToast } from '@/components/GreetingToast'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const payload = await getPayloadClient()

  const home = await payload.findGlobal({ slug: 'home-page' })

  const headshot =
    typeof home.headshot === 'object' && home.headshot
      ? { url: home.headshot.url ?? '', alt: home.headshot.alt }
      : null

  const { docs: featuredProjects } = await payload.find({
    collection: 'projects',
    where: {
      featured: { equals: true },
      status: { equals: 'published' },
    },
    limit: 1,
    sort: 'order',
  })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: 'order',
    limit: 7,
  })

  const featured = featuredProjects[0]

  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    where: {
      featured: { equals: true },
      status: { equals: 'published' },
    },
    sort: 'order',
    limit: 10,
  })

  const { docs: certDocs } = await payload.find({
    collection: 'certifications',
    where: { status: { equals: 'published' } },
    sort: '-date',
    limit: 10,
  })

  const certifications = certDocs.map((c) => ({
    id: c.id,
    name: c.name,
    institute: c.institute,
    link: c.link,
    date: c.date,
    credentialId: c.credentialId,
    badge:
      typeof c.badge === 'object' && c.badge
        ? { url: c.badge.url ?? '', alt: c.badge.alt }
        : null,
  }))

  const { docs: experienceDocs } = await payload.find({
    collection: 'experience',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 20,
  })

  const experience = experienceDocs.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    period: e.period,
    workMode: e.workMode as 'remote' | 'hybrid' | 'onsite' | null | undefined,
    companyUrl: e.companyUrl as string | null | undefined,
    description: e.description,
  }))

  const clientLogos =
    (home.clientLogos as {
      name: string
      logo: { url: string; alt: string }
      url?: string
      id?: string
    }[]) || []

  return (
    <GSAPProvider>
      <Navbar />
      <GreetingToast />

      <main>
        <Hero
          headshot={headshot}
          headline={home.heroHeadline}
          subtext={home.heroSubtext}
          availableForWork={home.availableForWork ?? true}
        />

        {featured && (
          <FeaturedProject
            title={featured.title}
            slug={featured.slug}
            summary={featured.summary}
            coverImage={
              typeof featured.coverImage === 'object' && featured.coverImage
                ? { url: featured.coverImage.url ?? '', alt: featured.coverImage.alt }
                : undefined
            }
            techStack={featured.techStack as { tech: string }[] | undefined}
            deviceFrameType={
              (featured.deviceFrameType as 'browser' | 'phone' | 'tablet') || 'browser'
            }
            projectStatus={
              featured.projectStatus as
                | 'live'
                | 'development'
                | 'degraded'
                | 'down'
                | undefined
            }
          />
        )}

        <ProjectsGrid
          projects={projects.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            summary: p.summary,
            category: p.category,
            featured: p.featured ?? false,
            coverImage:
              typeof p.coverImage === 'object' && p.coverImage
                ? { url: p.coverImage.url ?? '', alt: p.coverImage.alt }
                : undefined,
            techStack: p.techStack as { tech: string }[] | undefined,
            tags: p.tags as { tag: string }[] | undefined,
            deviceFrameType:
              (p.deviceFrameType as 'browser' | 'phone' | 'tablet') || 'browser',
            projectStatus: p.projectStatus as
              | 'live'
              | 'development'
              | 'degraded'
              | 'down'
              | undefined,
          }))}
        />

        <ClientLogos logos={clientLogos} />

        <ExperienceSection items={experience} />

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

        <CertificationsSection certifications={certifications} />

        <GitHubSection />

        <AboutTeaser
          headline={home.aboutTeaserHeadline}
          text={home.aboutTeaserText}
        />

        <ContactCTA headline={home.ctaHeadline} text={home.ctaText} />
      </main>

      <Footer />
    </GSAPProvider>
  )
}
