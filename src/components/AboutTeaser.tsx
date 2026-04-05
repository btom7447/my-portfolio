import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'

export function AboutTeaser({
  headline,
  text,
}: {
  headline?: string | null
  text?: string | null
}) {
  return (
    <section className="border-t border-border">
      <ScrollReveal className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {headline || 'A developer who ships'}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-foreground">
          {text ||
            "I'm a full-stack engineer who builds for both web and mobile. From idea to deployment, I focus on clean architecture, polished interfaces, and products that actually work."}
        </p>
        <Link
          href="/about"
          className="mt-8 inline-block text-sm font-medium text-accent transition-colors hover:text-accent-dark"
        >
          More about me &rarr;
        </Link>
      </ScrollReveal>
    </section>
  )
}
