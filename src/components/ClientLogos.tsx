'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

type ClientLogo = {
  name: string
  logo: { url: string; alt: string }
  url?: string
  id?: string
}

export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  // Duplicate for seamless loop
  const items = [...logos, ...logos]

  useEffect(() => {
    const track = trackRef.current
    if (!track || logos.length === 0) return

    let animationId: number
    let position = 0
    const speed = 0.4

    function getHalfWidth() {
      if (!track) return 0
      return track.scrollWidth / 2
    }

    function animate() {
      position -= speed
      const half = getHalfWidth()
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
  }, [paused, logos])

  if (logos.length === 0) return null

  return (
    <section className="border-y border-border py-12">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted">
        Trusted by
      </p>
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div ref={trackRef} className="flex items-center gap-16 will-change-transform">
          {items.map((client, i) => {
            const logo =
              typeof client.logo === 'object' && client.logo ? client.logo : null
            if (!logo) return null
            const Wrapper = client.url ? 'a' : 'div'
            const linkProps = client.url
              ? {
                  href: client.url,
                  target: '_blank' as const,
                  rel: 'noopener noreferrer',
                }
              : {}
            return (
              <Wrapper
                key={`${client.id ?? client.name}-${i}`}
                {...linkProps}
                className="flex shrink-0 items-center gap-3 opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              >
                <Image
                  src={logo.url}
                  alt={logo.alt || client.name}
                  width={160}
                  height={52}
                  className="h-18 w-auto object-contain"
                />
                <span className="hidden text-sm font-medium text-muted sm:inline">
                  {client.name}
                </span>
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
