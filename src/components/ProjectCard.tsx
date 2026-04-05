'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/StatusBadge'
import { getTechIcon } from '@/lib/tech-icons'

type ProjectCardProps = {
  title: string
  slug: string
  summary: string
  category: string
  coverImage?: {
    url: string
    alt: string
  }
  techStack?: { tech: string }[]
  tags?: { tag: string }[]
  deviceFrameType?: 'browser' | 'phone' | 'tablet'
  projectStatus?: 'live' | 'development' | 'degraded' | 'down'
  className?: string
  index?: number
}

export function ProjectCard({
  title,
  slug,
  category,
  coverImage,
  techStack,
  tags,
  projectStatus,
  className = '',
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={className}
    >
      <Link
        href={`/work/${slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
      >
        {/* Status badge */}
        {projectStatus && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-background/80 px-2 py-1 backdrop-blur-sm">
            <StatusBadge status={projectStatus} />
          </div>
        )}

        {/* Cover image */}
        <div className="relative flex-1 overflow-hidden bg-surface">
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt || title}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-2xl font-bold text-accent/30">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="border-t border-border p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <h3 className="flex-1 truncate font-display text-sm font-bold">
              {title}
            </h3>
            <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
              {category}
            </span>
          </div>
          {/* Tech stack icons */}
          {techStack && techStack.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {techStack.slice(0, 5).map(({ tech }) => {
                const icon = getTechIcon(tech)
                return icon ? (
                  <img
                    key={tech}
                    src={icon}
                    alt={tech}
                    title={tech}
                    className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100"
                    loading="lazy"
                  />
                ) : (
                  <span
                    key={tech}
                    title={tech}
                    className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-accent/60"
                  >
                    {tech.charAt(0).toUpperCase()}
                  </span>
                )
              })}
              {techStack.length > 5 && (
                <span className="flex h-4 items-center text-[10px] text-muted">
                  +{techStack.length - 5}
                </span>
              )}
            </div>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map(({ tag }) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
