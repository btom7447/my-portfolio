import { SectionHeader } from '@/components/SectionHeader'
import { GitHubActivity } from '@/components/GitHubActivity'

export function GitHubSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader label="Open Source" heading="GitHub Activity" />
        <div className="mt-12">
          <GitHubActivity />
        </div>
      </div>
    </section>
  )
}
