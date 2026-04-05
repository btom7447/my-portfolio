'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'

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

const filters = ['All', 'Web', 'Mobile'] as const

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>('All')

  const filtered =
    active === 'All'
      ? projects
      : projects.filter(
          (p) => p.category === active.toLowerCase() || p.category === 'both',
        )

  return (
    <>
      {/* Filter buttons */}
      <div className="mb-12 flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === filter
                ? 'text-white'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {active === filter && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </button>
        ))}
      </div>

      {/* Grid with layout animation */}
      <div className="grid auto-rows-[80px] grid-cols-2 gap-4 sm:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={getSpanClasses(project.deviceFrameType)}
              >
                <ProjectCard
                  title={project.title}
                  slug={project.slug}
                  summary={project.summary}
                  category={project.category}
                  coverImage={project.coverImage}
                  techStack={project.techStack}
                  tags={project.tags}
                  deviceFrameType={project.deviceFrameType}
                  projectStatus={project.projectStatus}
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-4 text-center text-muted"
            >
              No projects in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function getSpanClasses(deviceFrameType?: string) {
  switch (deviceFrameType) {
    case 'phone':
      return 'col-span-1 row-span-5'
    case 'tablet':
      return 'col-span-1 row-span-4'
    default:
      return 'col-span-2 row-span-3'
  }
}
