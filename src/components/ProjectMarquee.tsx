'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type MarqueeProject = {
  title: string
  slug: string
  coverImage?: { url: string; alt: string }
  category: string
}

type TrackProps = {
  projects: MarqueeProject[]
  direction: 'left' | 'right'
  speed?: number
}

function MarqueeTrack({ projects, direction, speed = 0.5 }: TrackProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  const items = [...projects, ...projects]

  useEffect(() => {
    const track = trackRef.current
    if (!track || projects.length === 0) return

    let animationId: number
    let position = 0

    function getHalfWidth() {
      if (!track) return 0
      return track.scrollWidth / 2
    }

    function animate() {
      position += direction === 'left' ? -speed : speed
      const half = getHalfWidth()
      if (half > 0) {
        if (direction === 'left' && Math.abs(position) >= half) {
          position += half
        }
        if (direction === 'right' && position >= half) {
          position -= half
        }
      }
      if (track) {
        track.style.transform = `translateX(${position}px)`
      }
      animationId = requestAnimationFrame(animate)
    }

    if (!paused) {
      animationId = requestAnimationFrame(animate)
    }

    return () => cancelAnimationFrame(animationId)
  }, [paused, projects, direction, speed])

  if (projects.length === 0) return null

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

      <div
        ref={trackRef}
        className="flex items-stretch gap-6 will-change-transform"
        style={direction === 'right' ? { transform: 'translateX(-50%)' } : undefined}
      >
        {items.map((project, i) => (
          <Link
            key={`${project.slug}-${i}`}
            href={`/work/${project.slug}`}
            className="group relative flex shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            style={{ width: 300 }}
          >
            {/* Cover image */}
            {project.coverImage && (
              <div className="relative h-44 w-full overflow-hidden bg-surface">
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt || project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="300px"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
              <span className="truncate text-sm font-medium text-foreground">
                {project.title}
              </span>
              <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                {project.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ProjectMarquee({ projects }: { projects: MarqueeProject[] }) {
  const webProjects = projects.filter(
    (p) => p.category === 'web' || p.category === 'both',
  )
  const mobileProjects = projects.filter(
    (p) => p.category === 'mobile' || p.category === 'both',
  )

  if (webProjects.length === 0 && mobileProjects.length === 0) return null

  return (
    <div className="space-y-8">
      {/* Web projects — left to right */}
      {webProjects.length > 0 && (
        <div>
          <p className="mb-4 px-6 text-xs font-medium uppercase tracking-widest text-muted">
            Web Projects
          </p>
          <MarqueeTrack projects={webProjects} direction="right" speed={0.4} />
        </div>
      )}

      {/* Mobile projects — right to left */}
      {mobileProjects.length > 0 && (
        <div>
          <p className="mb-4 px-6 text-xs font-medium uppercase tracking-widest text-muted">
            Mobile Projects
          </p>
          <MarqueeTrack projects={mobileProjects} direction="left" speed={0.4} />
        </div>
      )}
    </div>
  )
}
