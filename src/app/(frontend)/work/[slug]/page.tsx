import { getPayloadClient } from '@/lib/payload'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { GSAPProvider } from '@/components/GSAPProvider'
import { ScrollReveal } from '@/components/ScrollReveal'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { GalleryLightbox } from '@/components/GalleryLightbox'
import { StatusBadge } from '@/components/StatusBadge'
import { ClipReveal } from '@/components/ClipReveal'
import { getTechIcon } from '@/lib/tech-icons'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const project = docs[0]
  if (!project) return { title: 'Project Not Found' }
  const title = project.title
  const description = project.summary
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 100,
  })
  return docs.map((p) => ({ slug: p.slug }))
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const project = docs[0]
  if (!project) notFound()

  const coverImage =
    typeof project.coverImage === 'object' && project.coverImage
      ? project.coverImage
      : null

  return (
    <GSAPProvider>
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header */}
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/work"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            All Projects
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-subtle px-3 py-0.5 text-xs font-medium text-accent">
              {project.category}
            </span>
            {project.tags && (project.tags as { tag: string }[]).map(({ tag }) => (
              <span
                key={tag}
                className="rounded-full bg-accent-muted px-3 py-0.5 text-xs font-medium text-accent"
              >
                {tag}
              </span>
            ))}
          </div>

          <ClipReveal>
            <div className="mt-4 flex items-center gap-4">
              <h1 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              {project.projectStatus && (
                <StatusBadge status={project.projectStatus as 'live' | 'development' | 'degraded' | 'down'} />
              )}
            </div>
          </ClipReveal>

          <ClipReveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-foreground">{project.summary}</p>
          </ClipReveal>

          {/* Links */}
          <div className="mt-6 flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Visit Live Site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View Source
              </a>
            )}
          </div>
        </div>

        {/* Cover image — device frame */}
        {coverImage && project.deviceFrameType === 'phone' && (
          <ScrollReveal className="mx-auto mt-16 max-w-xs px-6">
            <div className="overflow-hidden rounded-[2.5rem] border-[3px] border-foreground/20 bg-surface shadow-2xl shadow-accent/5">
              {/* Phone notch */}
              <div className="flex justify-center bg-surface py-2">
                <span className="h-5 w-24 rounded-full bg-foreground/10" />
              </div>
              <div className="relative aspect-[9/19.5]">
                <Image
                  src={coverImage.url ?? ''}
                  alt={coverImage.alt}
                  fill
                  className="object-contain"
                  sizes="320px"
                  priority
                />
              </div>
              {/* Phone bottom bar */}
              <div className="flex justify-center bg-surface py-3">
                <span className="h-1 w-28 rounded-full bg-foreground/10" />
              </div>
            </div>
          </ScrollReveal>
        )}

        {coverImage && project.deviceFrameType === 'tablet' && (
          <ScrollReveal className="mx-auto mt-16 max-w-2xl px-6">
            <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-foreground/20 bg-surface shadow-2xl shadow-accent/5">
              <div className="flex justify-center bg-surface py-2">
                <span className="h-3 w-3 rounded-full bg-foreground/10" />
              </div>
              <div className="relative aspect-[3/4]">
                <Image
                  src={coverImage.url ?? ''}
                  alt={coverImage.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />
              </div>
              <div className="flex justify-center bg-surface py-3">
                <span className="h-1 w-20 rounded-full bg-foreground/10" />
              </div>
            </div>
          </ScrollReveal>
        )}

        {coverImage && (!project.deviceFrameType || project.deviceFrameType === 'browser') && (
          <ScrollReveal className="mx-auto mt-16 max-w-5xl px-6">
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-accent/5">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted">
                  {project.liveUrl || `${project.title.toLowerCase()}.app`}
                </span>
              </div>
              <div className="relative aspect-16/10">
                <Image
                  src={coverImage.url ?? ''}
                  alt={coverImage.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Tech stack */}
        {project.techStack && project.techStack.length > 0 && (
          <ScrollReveal className="mx-auto mt-16 max-w-4xl px-6">
            <h2 className="mb-4 font-display text-xl font-bold">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {(project.techStack as { tech: string }[]).map(({ tech }) => {
                const icon = getTechIcon(tech)
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {icon ? (
                      <img src={icon} alt={tech} className="h-4 w-4" loading="lazy" />
                    ) : (
                      <span className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold text-accent">
                        {tech.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {tech}
                  </span>
                )
              })}
            </div>
          </ScrollReveal>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (() => {
          const galleryImages = (project.gallery as { image: { url: string; alt: string }; caption?: string; id?: string }[])
            .map((item) => {
              const img = typeof item.image === 'object' && item.image ? item.image : null
              if (!img) return null
              return { url: img.url, alt: img.alt || item.caption || '', caption: item.caption || undefined }
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)

          if (galleryImages.length === 0) return null

          return (
            <ScrollReveal className="mx-auto mt-16 max-w-5xl px-6">
              <h2 className="mb-6 font-display text-xl font-bold">Screenshots</h2>
              <GalleryLightbox
                images={galleryImages}
                deviceType={(project.deviceFrameType as 'browser' | 'phone' | 'tablet') || 'browser'}
              />
            </ScrollReveal>
          )
        })()}

        {/* Rich text content */}
        <ScrollReveal className="mx-auto mt-16 max-w-4xl px-6">
          <div className="prose max-w-none text-foreground prose-headings:text-foreground prose-headings:font-display prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-blockquote:text-foreground prose-a:text-accent prose-code:text-foreground">
            <RichText data={project.description} />
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </GSAPProvider>
  )
}
