import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeader } from '@/components/SectionHeader'
import Link from 'next/link'

type Project = {
  id: string | number
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

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 flex items-end justify-between">
        <SectionHeader label="Projects" heading="Selected Work" />
        <Link
          href="/work"
          className="hidden text-sm font-medium text-accent transition-colors hover:text-accent-dark sm:block"
        >
          View all &rarr;
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid auto-rows-[80px] grid-cols-2 gap-4 sm:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              slug={project.slug}
              summary={project.summary}
              category={project.category}
              coverImage={project.coverImage}
              techStack={project.techStack}
              tags={project.tags}
              deviceFrameType={project.deviceFrameType || 'browser'}
              projectStatus={project.projectStatus}
              selfSpan
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">
          Projects coming soon. Check back later.
        </p>
      )}
    </section>
  )
}
