'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { MagneticButton } from '@/components/MagneticButton'
import { CursorTrail } from '@/components/CursorTrail'

type HeroProps = {
  headshot?: { url: string; alt: string } | null
  headline?: string | null
  subtext?: string | null
  availableForWork?: boolean
}

const accentWords = ['web', '&', 'mobile']

export function Hero({ headshot, headline, subtext, availableForWork = true }: HeroProps) {
  const container = useRef<HTMLElement>(null)

  const displayHeadline = headline || 'I build web & mobile experiences'
  const displaySubtext = subtext || 'Full-stack engineer crafting polished, production-ready products from concept to deployment.'

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 0.0s — Ambient shapes fade in
      tl.from('[data-hero="shape"]', {
        opacity: 0,
        scale: 0.5,
        duration: 1.2,
        stagger: 0.2,
      })

      // 0.2s — Nav stagger (handled by Navbar, but avatar starts here)
      tl.from(
        '[data-hero="avatar"]',
        { scale: 0.8, opacity: 0, duration: 0.6 },
        0.3,
      )

      // 0.5s — Clip-path word reveal
      tl.from(
        '[data-hero="heading"] .word-inner',
        {
          yPercent: 100,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power4.out',
        },
        0.5,
      )

      // 0.9s — Badge
      tl.from(
        '[data-hero="badge"]',
        { y: 20, opacity: 0, duration: 0.5 },
        0.9,
      )

      // 1.0s — Subtext
      tl.from(
        '[data-hero="subtext"]',
        { y: 20, opacity: 0, duration: 0.6 },
        1.0,
      )

      // 1.2s — CTA buttons scale in
      tl.from(
        '[data-hero="cta"]',
        {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        1.2,
      )

      // 1.5s — Scroll indicator
      tl.from(
        '[data-hero="scroll"]',
        { opacity: 0, duration: 0.8 },
        1.5,
      )

      // Ambient shape loops (independent, yoyo)
      gsap.to('[data-shape="1"]', {
        y: -20,
        x: 10,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('[data-shape="2"]', {
        y: 15,
        x: -12,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      })
      gsap.to('[data-shape="3"]', {
        y: -25,
        x: -8,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 5,
      })

      // Scroll indicator pulse loop
      gsap.to('[data-hero="scroll-line"]', {
        scaleY: 0.4,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'top',
      })
    },
    { scope: container },
  )

  const words = displayHeadline.split(' ')

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Cursor trail — hero only */}
      <CursorTrail />

      {/* Background: dot grid with radial fade */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-accent) 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Radial fade — hides dots at edges, focuses center */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--color-background) 100%)',
          }}
        />
      </div>

      {/* Ambient floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          data-hero="shape"
          data-shape="1"
          className="absolute left-[15%] top-[20%] h-60 w-60 rounded-full bg-accent/5 blur-3xl"
        />
        <div
          data-hero="shape"
          data-shape="2"
          className="absolute right-[20%] top-[40%] h-40 w-40 rounded-full bg-accent/8 blur-3xl"
        />
        <div
          data-hero="shape"
          data-shape="3"
          className="absolute bottom-[25%] left-[30%] h-80 w-80 rounded-full bg-accent/4 blur-3xl"
        />
      </div>

      {/* Avatar */}
      <div
        data-hero="avatar"
        className="relative z-10 mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-accent/30"
      >
        <Image
          src={headshot?.url || '/avatar-placeholder.png'}
          alt={headshot?.alt || 'Profile photo'}
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {/* Availability badge */}
      {availableForWork && (
        <div
          data-hero="badge"
          className="relative z-10 mb-8 flex items-center gap-2 rounded-full border border-accent-muted bg-accent-subtle px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-sm font-medium text-accent">
            Available for work
          </span>
        </div>
      )}

      {/* Headline — clip-path word reveal */}
      <h1
        data-hero="heading"
        className="relative z-10 max-w-4xl text-center text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              className={`word-inner inline-block ${
                accentWords.includes(word.toLowerCase()) ? 'text-accent' : ''
              }`}
            >
              {word}&nbsp;
            </span>
          </span>
        ))}
      </h1>

      <p
        data-hero="subtext"
        className="relative z-10 mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted sm:text-xl"
      >
        {displaySubtext}
      </p>

      <div className="relative z-10 mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <MagneticButton data-hero="cta">
          <Link
            href="/#work"
            className="inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            View Work
          </Link>
        </MagneticButton>
        <MagneticButton data-hero="cta">
          <Link
            href="/contact"
            data-hire-cta
            className="inline-block rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Get in Touch
          </Link>
        </MagneticButton>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero="scroll"
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-muted">
          Scroll
        </span>
        <div
          data-hero="scroll-line"
          className="h-10 w-[1px] bg-accent"
        />
      </div>
    </section>
  )
}
