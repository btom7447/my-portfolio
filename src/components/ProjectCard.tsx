'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/StatusBadge'

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
  /** When true, the card manages its own bento grid spans */
  selfSpan?: boolean
}

const bentoSpans = {
  browser: 'col-span-2 row-span-3',
  phone: 'col-span-1 row-span-5',
  tablet: 'col-span-1 row-span-4',
} as const

export function ProjectCard({
  title,
  slug,
  category,
  coverImage,
  tags,
  deviceFrameType = 'browser',
  projectStatus,
  selfSpan = false,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={selfSpan ? bentoSpans[deviceFrameType] : 'h-full'}
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
              sizes={deviceFrameType === 'phone' ? '25vw' : '50vw'}
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
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <h3 className="flex-1 truncate font-display text-sm font-bold">
              {title}
            </h3>
            <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
              {category}
            </span>
          </div>
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
