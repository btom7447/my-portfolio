'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { StatusBadge } from '@/components/StatusBadge'
import { getTechIcon } from '@/lib/tech-icons'

gsap.registerPlugin(ScrollTrigger)

type FeaturedProjectProps = {
  title: string
  slug: string
  summary: string
  coverImage?: {
    url: string
    alt: string
  }
  techStack?: { tech: string }[]
  deviceFrameType?: 'browser' | 'phone' | 'tablet'
  projectStatus?: 'live' | 'development' | 'degraded' | 'down'
}

export function FeaturedProject({
  title,
  slug,
  summary,
  coverImage,
  techStack,
  deviceFrameType = 'browser',
  projectStatus,
}: FeaturedProjectProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Pin the section and animate content in during scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.from('[data-feat="label"]', { x: -30, opacity: 0 }, 0)
        .from('[data-feat="title"]', { y: 40, opacity: 0 }, 0.1)
        .from('[data-feat="summary"]', { y: 30, opacity: 0 }, 0.2)
        .from(
          '[data-feat="mockup"]',
          { y: 80, opacity: 0, scale: 0.9 },
          0.15,
        )
        .from(
          '[data-feat="tag"]',
          { y: 15, opacity: 0, stagger: 0.05 },
          0.4,
        )
        .from('[data-feat="cta"]', { x: -20, opacity: 0 }, 0.5)
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="mx-auto max-w-6xl px-6 py-32">
      <div ref={pinRef}>
        <span
          data-feat="label"
          className="text-sm font-medium uppercase tracking-widest text-accent"
        >
          Featured Project
        </span>

        <div className="mt-2 flex items-center gap-4">
          <h2
            data-feat="title"
            className="font-display text-3xl font-bold sm:text-4xl"
          >
            {title}
          </h2>
          {projectStatus && <StatusBadge status={projectStatus} />}
        </div>

        <p data-feat="summary" className="mt-4 max-w-xl text-lg text-muted">
          {summary}
        </p>

        {/* Device mockup */}
        {deviceFrameType === 'phone' ? (
          <div data-feat="mockup" className="mx-auto mt-12 max-w-xs">
            <div className="overflow-hidden rounded-[2.5rem] border-[3px] border-foreground/20 bg-surface shadow-2xl shadow-accent/5">
              <div className="flex justify-center bg-surface py-2">
                <span className="h-5 w-24 rounded-full bg-foreground/10" />
              </div>
              <div className="relative aspect-9/19.5">
                {coverImage?.url ? (
                  <Image
                    src={coverImage.url}
                    alt={coverImage.alt || title}
                    fill
                    className="object-contain"
                    sizes="320px"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-2xl font-bold text-accent/20">
                      {title}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-center bg-surface py-3">
                <span className="h-1 w-28 rounded-full bg-foreground/10" />
              </div>
            </div>
          </div>
        ) : deviceFrameType === 'tablet' ? (
          <div data-feat="mockup" className="mx-auto mt-12 max-w-2xl">
            <div className="overflow-hidden rounded-3xl border-[3px] border-foreground/20 bg-surface shadow-2xl shadow-accent/5">
              <div className="flex justify-center bg-surface py-2">
                <span className="h-3 w-3 rounded-full bg-foreground/10" />
              </div>
              <div className="relative aspect-3/4">
                {coverImage?.url ? (
                  <Image
                    src={coverImage.url}
                    alt={coverImage.alt || title}
                    fill
                    className="object-contain"
                    sizes="672px"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-3xl font-bold text-accent/20">
                      {title}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-center bg-surface py-3">
                <span className="h-1 w-20 rounded-full bg-foreground/10" />
              </div>
            </div>
          </div>
        ) : (
          <div
            data-feat="mockup"
            className="mt-12 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-accent/5"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted">
                {title.toLowerCase()}.app
              </span>
            </div>
            <div className="relative aspect-16/10 bg-surface">
              {coverImage?.url ? (
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-4xl font-bold text-accent/20">
                    {title}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tech tags + CTA */}
        <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map(({ tech }) => {
                const icon = getTechIcon(tech)
                return (
                  <span
                    key={tech}
                    data-feat="tag"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted"
                  >
                    {icon ? (
                      <img src={icon} alt={tech} className="h-3.5 w-3.5" loading="lazy" />
                    ) : (
                      <span className="flex h-3.5 w-3.5 items-center justify-center text-[9px] font-bold text-accent">
                        {tech.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {tech}
                  </span>
                )
              })}
            </div>
          )}
          <Link
            href={`/work/${slug}`}
            data-feat="cta"
            className="group flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
          >
            View Case Study
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
