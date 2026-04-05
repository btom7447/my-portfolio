'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

type GalleryImage = {
  url: string
  alt: string
  caption?: string
}

type GalleryLightboxProps = {
  images: GalleryImage[]
  deviceType: 'browser' | 'phone' | 'tablet'
}

const aspectMap = {
  browser: 'aspect-[16/10]',
  phone: 'aspect-[9/19.5]',
  tablet: 'aspect-[3/4]',
} as const

const gridMap = {
  browser: 'sm:grid-cols-2',
  phone: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  tablet: 'sm:grid-cols-2 lg:grid-cols-3',
} as const

const modalAspectMap = {
  browser: 'max-w-5xl w-full',
  phone: 'max-w-sm w-full',
  tablet: 'max-w-2xl w-full',
} as const

export function GalleryLightbox({ images, deviceType }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i + 1) % images.length : null))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, close, prev, next])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeIndex])

  // Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) {
      if (diff > 0) prev()
      else next()
    }
    setTouchStart(null)
  }

  const aspect = aspectMap[deviceType] || aspectMap.browser
  const grid = gridMap[deviceType] || gridMap.browser
  const modalSize = modalAspectMap[deviceType] || modalAspectMap.browser

  return (
    <>
      {/* Thumbnail grid */}
      <div className={`grid gap-6 ${grid}`}>
        {images.map((img, i) => (
          <figure
            key={i}
            className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-surface"
            onClick={() => setActiveIndex(i)}
          >
            <div className={`relative ${aspect}`}>
              <Image
                src={img.url}
                alt={img.alt || img.caption || `Screenshot ${i + 1}`}
                fill
                className="object-contain bg-black/5 transition-transform duration-300 group-hover:scale-105"
                sizes={deviceType === 'phone' ? '200px' : '(max-width: 768px) 100vw, 50vw'}
              />
            </div>
            {img.caption && (
              <figcaption className="px-4 py-3 text-sm text-muted">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Fullscreen modal — portaled to body so no parent clips it */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
              onClick={close}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Close button */}
              <button
                onClick={close}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Prev button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}

              {/* Next button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}

              {/* Image — fills the viewport with padding */}
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative mx-16 my-12 flex h-[calc(100vh-6rem)] w-[calc(100vw-8rem)] flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={images[activeIndex].url}
                    alt={images[activeIndex].alt || `Screenshot ${activeIndex + 1}`}
                    fill
                    className="rounded-lg object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
                {images[activeIndex].caption && (
                  <p className="mt-3 text-center text-sm text-white/70">
                    {images[activeIndex].caption}
                  </p>
                )}
                {/* Counter */}
                {images.length > 1 && (
                  <p className="mt-2 text-center text-xs text-white/50">
                    {activeIndex + 1} / {images.length}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
