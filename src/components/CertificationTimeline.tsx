'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type Certification = {
  id: string | number
  name: string
  institute: string
  link?: string | null
  date: string
  credentialId?: string | null
  badge?: { url: string; alt: string } | null
}

export function CertificationTimeline({ items }: { items: Certification[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const measure = () => setHeight(sectionRef.current?.offsetHeight ?? 0)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(sectionRef.current)
    return () => ro.disconnect()
  }, [items])

  useGSAP(
    () => {
      if (!sectionRef.current || !pathRef.current || !height) return

      const path = pathRef.current
      const pathLength = path.getTotalLength()

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      })

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 70%',
          scrub: 0.8,
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-cert-dot]').forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(3)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-cert-card]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: -40, y: 10 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.03,
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-cert-connector]').forEach((conn) => {
        gsap.fromTo(
          conn,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: conn,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          },
        )
      })
    },
    { scope: sectionRef, dependencies: [height] },
  )

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div ref={sectionRef} className="relative mt-12 pl-8 sm:pl-12">
      {/* SVG vertical path */}
      <svg
        className="pointer-events-none absolute left-1.75 top-0 sm:left-2.75"
        width="24"
        height={height || '100%'}
        aria-hidden
      >
        {height > 0 && (
          <path
            ref={pathRef}
            d={`M 12 0 L 12 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent"
          />
        )}
        <path
          d={`M 12 0 L 12 ${height || 500}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-border"
        />
      </svg>

      <div className="space-y-10">
        {items.map((cert, i) => (
          <div key={cert.id ?? i} className="relative flex items-start gap-4 sm:gap-6">
            {/* Dot */}
            <div className="absolute -left-8 top-6 flex items-center sm:-left-12">
              <div
                data-cert-dot
                className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-accent bg-background shadow-sm shadow-accent/20"
              >
                <div className="h-2 w-2 rounded-full bg-accent" />
              </div>
              <div
                data-cert-connector
                className="h-0.5 w-4 bg-accent/30 sm:w-6"
              />
            </div>

            {/* Card */}
            <div
              data-cert-card
              className="flex-1 rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md hover:shadow-accent/5"
            >
              <div className="flex items-start gap-4">
                {cert.badge && (
                  <Image
                    src={cert.badge.url}
                    alt={cert.badge.alt || cert.institute}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-lg object-contain"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <h3 className="font-display text-lg font-bold">{cert.name}</h3>
                    <span className="w-fit shrink-0 rounded-full bg-accent-subtle px-3 py-0.5 text-xs font-medium text-accent">
                      {formatDate(cert.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">{cert.institute}</p>
                  {cert.credentialId && (
                    <p className="mt-1 text-xs text-muted">
                      ID: {cert.credentialId}
                    </p>
                  )}
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-dark"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Verify Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
