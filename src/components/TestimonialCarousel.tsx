'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

type Testimonial = {
  id: string | number
  quote: string
  authorName: string
  authorRole: string
  authorCompany: string
  authorAvatar?: { url: string; alt: string } | null
  linkedinProfileUrl?: string | null
  linkedinRecommendationUrl?: string | null
}

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  // Duplicate items for seamless loop
  const items = [...testimonials, ...testimonials]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationId: number
    let position = 0
    const speed = 0.5 // px per frame

    // Width of one set of testimonials (half the track since we duplicated)
    function getHalfWidth() {
      if (!track) return 0
      return track.scrollWidth / 2
    }

    function animate() {
      position -= speed
      const half = getHalfWidth()
      // Reset seamlessly when first set scrolls out
      if (half > 0 && Math.abs(position) >= half) {
        position += half
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
  }, [paused, testimonials])

  if (testimonials.length === 0) return null

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="flex gap-6 will-change-transform">
        {items.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  const initials = t.authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
  const verifyUrl = t.linkedinRecommendationUrl || t.linkedinProfileUrl

  return (
    <blockquote className="relative flex w-80 shrink-0 flex-col rounded-2xl border border-border bg-background p-6 sm:w-96">
      <span className="absolute right-5 top-4 font-serif text-6xl leading-none opacity-10">
        &ldquo;
      </span>
      <p className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          {t.authorAvatar ? (
            <Image
              src={t.authorAvatar.url ?? ''}
              alt={t.authorAvatar.alt || t.authorName}
              width={36}
              height={36}
              className="shrink-0 rounded-full"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-bold">{t.authorName}</p>
              {verifyUrl && (
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1 text-[11px] text-muted transition-colors hover:text-accent"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Verified
                </a>
              )}
            </div>
            <p className="truncate text-xs text-muted">
              {t.authorRole} · {t.authorCompany}
            </p>
          </div>
        </div>
      </div>
    </blockquote>
  )
}
