'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import confetti from 'canvas-confetti'
import gsap from 'gsap'
import { initConsoleEasterEgg } from '@/lib/console-easter-egg'
import { initKonami } from '@/lib/konami'
import { initRageClickDetection } from '@/lib/rage-click'
import { initScrollSpeedDetection } from '@/lib/scroll-speed'
import { initIdleDetection } from '@/lib/idle-detection'

export function DelightLayer() {
  const router = useRouter()

  useEffect(() => {
    const cleanups: (() => void)[] = []

    // 1. Console easter egg
    initConsoleEasterEgg()

    // 2. Confetti bridge (from secret() command)
    function onEasterEgg() {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
    }
    window.addEventListener('easter-egg-found', onEasterEgg)
    cleanups.push(() => window.removeEventListener('easter-egg-found', onEasterEgg))

    // 3. Konami code
    const cleanupKonami = initKonami(() => {
      document.documentElement.classList.add('konami-mode')
      toast('// CHEAT CODE ACTIVATED', { duration: 3000 })
      confetti({ particleCount: 100, spread: 70 })
      setTimeout(() => {
        document.documentElement.classList.remove('konami-mode')
      }, 5000)
    })
    cleanups.push(cleanupKonami)

    // 4. Rage click detection
    const cleanupRage = initRageClickDetection((target) => {
      if (target.closest('[data-hire-cta]')) {
        toast("I like your enthusiasm. Let's talk.", { duration: 3000 })
        router.push('/contact')
        return
      }
      toast("Everything okay? Try Ctrl+/ — it's faster.", { duration: 3000 })
    })
    cleanups.push(cleanupRage)

    // 5. Scroll speed nudge
    const cleanupScroll = initScrollSpeedDetection(() => {
      toast('Slow down — the good stuff is in the case studies.', {
        duration: 4000,
      })
    })
    cleanups.push(cleanupScroll)

    // 6. Idle detection — speeds up ambient GSAP shapes
    const cleanupIdle = initIdleDetection(
      () => gsap.globalTimeline.timeScale(2.5),
      () => gsap.globalTimeline.timeScale(1),
    )
    cleanups.push(cleanupIdle)

    return () => cleanups.forEach((fn) => fn())
  }, [router])

  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        className:
          'bg-background border border-border text-foreground text-sm font-mono',
      }}
    />
  )
}
