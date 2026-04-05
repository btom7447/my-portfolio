import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'

export function ContactCTA({
  headline,
  text,
}: {
  headline?: string | null
  text?: string | null
}) {
  return (
    <section className="bg-accent-subtle">
      <ScrollReveal className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          {headline || "Let's build something together"}
        </h2>
        <p className="mt-4 text-lg text-foreground">
          {text || "Have a project in mind? I'd love to hear about it."}
        </p>
        <Link
          href="/contact"
          data-hire-cta
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Get in Touch
        </Link>
      </ScrollReveal>
    </section>
  )
}
