'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { getTechIcon } from '@/lib/tech-icons'

gsap.registerPlugin(ScrollTrigger)

type TechCategory = {
  category: string
  techs: string
  id?: string
}

function parseTechs(raw: string): string[] {
  return raw
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)
}

// Seeded random so positions are deterministic per tech name
function seededRandom(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b
    h = (h ^ (h >>> 16)) * 0x45d9f3b
    h = h ^ (h >>> 16)
    return (h >>> 0) / 4294967295
  }
}

export function TechStackSection({ categories }: { categories: TechCategory[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  // Hover float for individual cards
  const onCardEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -8,
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const onCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      boxShadow: '0 0px 0px rgba(124, 58, 237, 0)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || hasAnimated.current) return
    const section = sectionRef.current

    // Animate category labels
    gsap.fromTo(
      section.querySelectorAll('[data-cat-label]'),
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      },
    )

    // For each category group, animate cards bursting from stacked pile
    section.querySelectorAll('[data-cat-group]').forEach((group, groupIdx) => {
      const cards = group.querySelectorAll<HTMLElement>('[data-tech-card]')

      // Set initial stacked state: all cards piled in center with random rotation
      cards.forEach((card, i) => {
        const rng = seededRandom(card.dataset.techName ?? `${groupIdx}-${i}`)
        const rotation = (rng() - 0.5) * 30 // -15 to 15 degrees
        const offsetX = (rng() - 0.5) * 20 // slight random x offset
        const offsetY = i * -3 // slight vertical stacking

        gsap.set(card, {
          opacity: 0,
          scale: 0.6,
          rotation,
          x: offsetX,
          y: offsetY,
          transformOrigin: 'center center',
        })
      })

      // Animate to final position
      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: group,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        delay: groupIdx * 0.12,
      })
    })

    hasAnimated.current = true
  }, { scope: sectionRef })

  // Subtle continuous float for the icon images
  useEffect(() => {
    if (!sectionRef.current) return

    const icons = sectionRef.current.querySelectorAll<HTMLElement>('[data-tech-icon]')
    const tweens: gsap.core.Tween[] = []

    icons.forEach((icon, i) => {
      tweens.push(
        gsap.to(icon, {
          y: -3,
          duration: 1.8 + (i % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: (i % 5) * 0.3,
        }),
      )
    })

    return () => tweens.forEach((t) => t.kill())
  }, [categories])

  return (
    <div ref={sectionRef} className="grid gap-12 sm:grid-cols-2">
      {categories.map((cat) => {
        const techs = parseTechs(cat.techs)
        return (
          <div key={cat.id ?? cat.category}>
            {/* Category label */}
            <div data-cat-label className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
                {cat.category.charAt(0)}
              </span>
              <h3 className="font-display text-lg font-bold">{cat.category}</h3>
              <span className="text-sm text-muted">({techs.length})</span>
            </div>

            {/* Tech cards grid */}
            <div
              data-cat-group
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {techs.map((tech) => {
                const icon = getTechIcon(tech)
                return (
                  <div
                    key={tech}
                    data-tech-card
                    data-tech-name={tech}
                    onMouseEnter={onCardEnter}
                    onMouseLeave={onCardLeave}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 will-change-transform"
                  >
                    <div
                      data-tech-icon
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-subtle"
                    >
                      {icon ? (
                        <img
                          src={icon}
                          alt={tech}
                          className="h-5 w-5"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-sm font-bold text-accent">
                          {tech.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="truncate text-sm font-medium text-foreground">
                      {tech}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
