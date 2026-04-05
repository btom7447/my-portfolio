'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springX = useSpring(cursorX, { damping: 25, stiffness: 250 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 250 })

  useEffect(() => {
    // Only show custom cursor on devices with a pointer
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    if (!hasPointer) return

    setVisible(true)

    function onMove(e: MouseEvent) {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, label')
      setHovered(!!interactive)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [cursorX, cursorY])

  if (!visible) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-99999 hidden rounded-full border border-accent/50 md:block"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          borderColor: hovered ? 'var(--accent)' : 'var(--accent-light)',
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-99999 hidden rounded-full bg-accent md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovered ? 8 : 4,
          height: hovered ? 8 : 4,
          opacity: hovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}
