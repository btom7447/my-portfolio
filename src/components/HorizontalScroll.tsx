'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { StatusBadge } from '@/components/StatusBadge'
import { getTechIcon } from '@/lib/tech-icons'

gsap.registerPlugin(ScrollTrigger)

type Project = {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  coverImage?: { url: string; alt: string }
  techStack?: { tech: string }[]
  tags?: { tag: string }[]
  deviceFrameType?: 'browser' | 'phone' | 'tablet'
  projectStatus?: 'live' | 'development' | 'degraded' | 'down'
}

// Staggered stair-step pattern: a triangle wave so cards rise and fall in steps
// as the track scrolls, instead of sitting on one flat baseline. Centered on 0 so
// the offsets stay balanced (±) and the row never drifts off-screen.
const STEP_LEVELS = [0, 1, 2, 3, 2, 1]
const STEP_PX = 40
function stepOffset(i: number) {
  const level = STEP_LEVELS[i % STEP_LEVELS.length]
  return (level - 1.5) * STEP_PX // -60 … +60
}

export function HorizontalScroll({ projects }: { projects: Project[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const wrapper = wrapperRef.current
      if (!track || !wrapper) return

      const cards = Array.from(
        wrapper.querySelectorAll<HTMLElement>('[data-card]'),
      )

      // Fade cards in as they enter from the right edge and out as they approach
      // the left edge, based on each card's horizontal position on screen.
      const updateFades = () => {
        const vw = window.innerWidth
        const zone = vw * 0.22 // fade band at each edge
        for (const el of cards) {
          const rect = el.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          let o = 1
          if (cx < zone) o = cx / zone // exiting left
          else if (cx > vw - zone) o = (vw - cx) / zone // entering right
          o = Math.min(1, Math.max(0, o))
          el.style.opacity = String(o * o * (3 - 2 * o)) // smoothstep
        }
      }

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: updateFades,
          onRefresh: updateFades,
        },
      })

      updateFades()
    },
    { scope: wrapperRef, dependencies: [projects] },
  )

  if (projects.length === 0) {
    return (
      <p className="py-20 text-center text-muted">
        No projects in this category yet.
      </p>
    )
  }

  return (
    <div ref={wrapperRef} className="relative pt-16">
      <div
        ref={trackRef}
        className="flex gap-8 px-6 py-20"
        style={{ width: `${projects.length * 720 + 48}px` }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            data-card
            className="shrink-0"
            style={{ transform: `translateY(${stepOffset(i)}px)` }}
          >
            <Link
              href={`/work/${project.slug}`}
              className="group flex h-full w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Cover */}
              <div className="relative aspect-4/3 overflow-hidden bg-surface">
                {project.coverImage?.url ? (
                  <Image
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    fill
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    sizes="680px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-2xl font-bold text-accent/20">
                      {project.title}
                    </span>
                  </div>
                )}
                {project.projectStatus && (
                  <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-1 backdrop-blur-sm">
                    <StatusBadge status={project.projectStatus} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col border-t border-border p-5">
                <div className="flex items-center gap-2">
                  <h3 className="flex-1 truncate font-display text-lg font-bold">
                    {project.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                    {project.category}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {project.summary}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map(({ tag }) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-medium text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 6).map(({ tech }) => {
                      const icon = getTechIcon(tech)
                      return icon ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small tech glyphs
                        <img
                          key={tech}
                          src={icon}
                          alt={tech}
                          title={tech}
                          className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <span
                          key={tech}
                          title={tech}
                          className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-accent/50"
                        >
                          {tech.charAt(0).toUpperCase()}
                        </span>
                      )
                    })}
                    {project.techStack.length > 6 && (
                      <span className="flex h-4 items-center text-[10px] text-muted">
                        +{project.techStack.length - 6}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
