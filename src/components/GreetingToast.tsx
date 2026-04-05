'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getVisitContext, getTimeGreeting, getHeroCopy } from '@/lib/visit-context'

export function GreetingToast() {
  const [greeting, setGreeting] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [inHero, setInHero] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const visitType = getVisitContext()
    const timeGreeting = getTimeGreeting()
    const copy = getHeroCopy(visitType)

    setGreeting(copy?.headline || timeGreeting)
    setSubtitle(copy?.sub || '')
  }, [])

  // Track whether user is in the hero section
  useEffect(() => {
    function onScroll() {
      setInHero(window.scrollY < window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!greeting || dismissed) return null

  return (
    <AnimatePresence>
      {inHero ? (
        // Expanded — floating pill in hero
        <motion.div
          key="expanded"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed left-1/2 top-20 z-40 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background/90 px-3 py-2 shadow-lg backdrop-blur-md sm:gap-3 sm:px-5 sm:py-2.5">
            <span className="text-xs font-medium text-foreground sm:text-sm">{greeting}</span>
            {subtitle && (
              <>
                <span className="hidden h-3 w-px bg-border sm:block" />
                <span className="hidden max-w-48 truncate text-xs text-muted sm:block">{subtitle}</span>
              </>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
              aria-label="Dismiss"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      ) : (
        // Minimized — tiny pill pinned top-center
        <motion.div
          key="minimized"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed left-1/2 top-3 z-40 -translate-x-1/2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1 shadow-md backdrop-blur-md transition-colors hover:border-accent/30">
            <span className="text-xs font-medium text-muted">{greeting}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
