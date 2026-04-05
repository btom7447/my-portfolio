import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeader } from '@/components/SectionHeader'
import Link from 'next/link'

type Project = {
  id: string | number
  title: string
  slug: string
  summary: string
  category: string
  featured?: boolean
  coverImage?: { url: string; alt: string }
  techStack?: { tech: string }[]
  tags?: { tag: string }[]
  deviceFrameType?: 'browser' | 'phone' | 'tablet'
  projectStatus?: 'live' | 'development' | 'degraded' | 'down'
}

/*
  Bento layout (4-col desktop):
  ┌───────────┬─────────┬─────┐
  │           │         │  3  │
  │     1     │    2    ├─────┤
  │  featured │ mobile  │  4  │
  ├─────┬─────┴─────────┼─────┤
  │     │               │     │
  │  5  │       6       │  7  │
  │ mob │    website    │ mob │
  └─────┴───────────────┴─────┘

  Slot 0: featured project (always)
  Slots 1, 4, 6: mobile only (deviceFrameType === 'phone')
  Slots 2, 3, 5: web only (non-phone)
  Empty portrait slots stay blank if not enough mobile projects
*/
const bentoClasses = [
  'col-span-2 row-span-2',   // 0: hero (featured)
  'col-span-1 row-span-2',   // 1: mobile portrait
  'col-span-1 row-span-1',   // 2: web small
  'col-span-1 row-span-1',   // 3: web small
  'col-span-1 row-span-2',   // 4: mobile portrait
  'col-span-2 row-span-2',   // 5: web landscape
  'col-span-1 row-span-2',   // 6: mobile portrait
]

function arrangeBento(projects: Project[]): (Project | null)[] {
  const slots: (Project | null)[] = Array(7).fill(null)
  if (projects.length === 0) return slots

  // Slot 0: featured project, fallback to first project
  const featuredIdx = projects.findIndex((p) => p.featured)
  slots[0] = featuredIdx >= 0 ? projects[featuredIdx] : projects[0]

  // Remaining projects (exclude the one used for slot 0)
  const usedId = slots[0].id
  const remaining = projects.filter((p) => p.id !== usedId)

  const mobile = remaining.filter((p) => p.deviceFrameType === 'phone')
  const web = remaining.filter((p) => p.deviceFrameType !== 'phone')

  // Portrait slots — mobile only, leave null if not enough
  let mi = 0
  for (const slot of [1, 4, 6]) {
    if (mi < mobile.length) {
      slots[slot] = mobile[mi++]
    }
  }

  // Web slots
  let wi = 0
  for (const slot of [2, 3, 5]) {
    if (wi < web.length) {
      slots[slot] = web[wi++]
    }
  }

  return slots
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const slots = arrangeBento(projects)

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

      {slots.some(Boolean) ? (
        <div className="grid auto-rows-[160px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 grid-flow-dense">
          {slots.map((project, i) =>
            project ? (
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
                className={bentoClasses[i]}
              />
            ) : (
              <div key={`empty-${i}`} className={bentoClasses[i]} />
            ),
          )}
        </div>
      ) : (
        <p className="text-center text-muted">
          Projects coming soon. Check back later.
        </p>
      )}
    </section>
  )
}
