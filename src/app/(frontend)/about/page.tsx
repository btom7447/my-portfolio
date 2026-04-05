import { getPayloadClient } from '@/lib/payload'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { GSAPProvider } from '@/components/GSAPProvider'
import { ScrollReveal } from '@/components/ScrollReveal'
import { SectionHeader } from '@/components/SectionHeader'
import { ClipReveal } from '@/components/ClipReveal'
import { DepthImage } from '@/components/DepthImage'
import { StatCounter } from '@/components/StatCounter'
import { CertificationsSection } from '@/components/CertificationsSection'
import { TechStackSection } from '@/components/TechStackSection'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ExperienceSection } from '@/components/ExperienceSection'

export const metadata: Metadata = {
  title: 'About — Portfolio',
  description: 'Full-stack web and mobile engineer',
}

const defaultTechCategories = [
  { category: 'Frontend', techs: 'React\nNext.js\nTypeScript\nTailwind CSS\nFramer Motion' },
  { category: 'Backend', techs: 'Node.js\nExpress\nPostgreSQL\nMongoDB\nPython\nPayload CMS\nREST APIs' },
  { category: 'Mobile', techs: 'React Native\nExpo\nFlutter\nSwift\nKotlin' },
  { category: 'Tools', techs: 'Git\nFigma\nVercel\nDocker\nVS Code\nPaystack\nClaude Code' },
]

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const about = await payload.findGlobal({ slug: 'about-page' })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const portrait =
    typeof about.portrait === 'object' && about.portrait
      ? { url: about.portrait.url ?? '', alt: about.portrait.alt }
      : null

  const resumeFile =
    typeof settings.resumeFile === 'object' && settings.resumeFile
      ? settings.resumeFile.url
      : null

  const stats = (about.stats as { value: string; label: string; id?: string }[]) || []
  const values = (about.values as { title: string; description: string; id?: string }[]) || []
  const cmsTech = about.techCategories as { category: string; techs: string; id?: string }[] | undefined
  const techCategories = cmsTech && cmsTech.length > 0 ? cmsTech : defaultTechCategories
  const processItems =
    (about.processItems as { title: string; description: string; id?: string }[]) || []

  // Fetch experience
  const { docs: experienceDocs } = await payload.find({
    collection: 'experience',
    where: { status: { equals: 'published' } },
    sort: 'order',
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

  // Fetch certifications
  const { docs: certDocs } = await payload.find({
    collection: 'certifications',
    where: { status: { equals: 'published' } },
    sort: '-date',
    limit: 20,
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

  return (
    <GSAPProvider>
      <Navbar />
      <main className="pt-28 pb-20">
        {/* ── Hero ── */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-accent">
                About
              </span>
              <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                Hey, I&apos;m{' '}
                <span className="text-accent">{about.name}</span>
              </h1>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                {splitParagraphs(about.intro).map((p, i) => (
                  <ClipReveal key={i} delay={i * 0.1}>
                    <p>{p}</p>
                  </ClipReveal>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                >
                  Get in Touch
                </Link>
                {resumeFile && (
                  <a
                    href={resumeFile}
                    download
                    className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:bg-surface"
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </div>

            <ScrollReveal>
              <DepthImage
                src={portrait?.url || '/avatar-placeholder.png'}
                alt={portrait?.alt || 'Profile photo'}
                className="mx-auto aspect-[3/4] w-full max-w-sm"
              />
            </ScrollReveal>
          </div>
        </div>

        {/* ── Stats bar ── */}
        {stats.length > 0 && (
          <section className="mt-24 border-y border-border bg-surface">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.id ?? i} delay={i * 0.08}>
                  <StatCounter value={stat.value} label={stat.label} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ── My Journey ── */}
        <section className="mx-auto mt-32 max-w-3xl px-6">
          <SectionHeader label="Journey" heading="How I got here" />
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted">
            {splitParagraphs(about.journey).map((p, i) => (
              <ClipReveal key={i} delay={i * 0.1}>
                <p>{p}</p>
              </ClipReveal>
            ))}
          </div>
        </section>

        {/* ── What drives me ── */}
        {values.length > 0 && (
          <section className="mx-auto mt-32 max-w-6xl px-6">
            <SectionHeader
              label="Values"
              heading="What I bring to a team"
              description="Technical skills get the job done. But how you work, communicate, and think about problems is what makes someone great to build with."
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {values.map((value, i) => (
                <ScrollReveal key={value.id ?? i} delay={i * 0.08}>
                  <div className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent/20">
                    <h3 className="font-display text-lg font-bold">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        <ExperienceSection items={experience} />

        {/* ── Tech stack ── */}
        {techCategories.length > 0 && (
          <section className="mx-auto mt-32 max-w-6xl px-6">
            <SectionHeader
              label="Stack"
              heading="Technologies I work with"
              description="I pick tools that let me move fast without sacrificing quality. I'm not married to any framework — I learn what the project needs."
            />

            <div className="mt-12">
              <TechStackSection categories={techCategories} />
            </div>
          </section>
        )}

        {/* ── Certifications ── */}
        <CertificationsSection certifications={certifications} />

        {/* ── How I work ── */}
        {processItems.length > 0 && (
          <section className="mx-auto mt-32 max-w-3xl px-6">
            <SectionHeader label="Process" heading="How I approach work" />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted">
              {processItems.map((item, i) => (
                <ClipReveal key={item.id ?? i} delay={i * 0.1}>
                  <p>
                    <strong className="text-foreground">{item.title}</strong>{' '}
                    {item.description}
                  </p>
                </ClipReveal>
              ))}
            </div>
          </section>
        )}

        {/* ── Beyond code ── */}
        <section className="mx-auto mt-32 max-w-3xl px-6">
          <SectionHeader label="Beyond Code" heading="When I'm not building" />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
            {splitParagraphs(about.beyondCode).map((p, i) => (
              <ClipReveal key={i} delay={i * 0.1}>
                <p>{p}</p>
              </ClipReveal>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mt-32 bg-accent-subtle">
          <ScrollReveal className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Like what you see?
            </h2>
            <p className="mt-4 text-lg text-muted">
              I&apos;m always open to interesting projects and conversations.
              Whether you&apos;re a founder building an MVP, a team looking for
              a full-stack engineer, or just want to connect — let&apos;s talk.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                Get in Touch
              </Link>
              <Link
                href="/work"
                className="rounded-full border border-border px-8 py-3 text-sm font-medium transition-colors hover:bg-surface"
              >
                See My Work
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </GSAPProvider>
  )
}
