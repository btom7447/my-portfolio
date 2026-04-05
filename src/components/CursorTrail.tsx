'use client'

import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; alpha: number; size: number }

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Only enable on devices with a fine pointer (no touch)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const ctx = canvas.getContext('2d')!
    const particles: Particle[] = []
    let animId: number

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      particles.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        alpha: 0.6,
        size: 3,
      })
      // Limit particle count
      if (particles.length > 80) particles.shift()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas!.offsetWidth, canvas!.offsetHeight)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`
        ctx.fill()

        p.alpha -= 0.015
        p.size *= 0.97

        if (p.alpha <= 0) particles.splice(i, 1)
      }

      animId = requestAnimationFrame(draw)
    }

    canvas.addEventListener('mousemove', onMouseMove)
    draw()

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      aria-hidden
    />
  )
}
