'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

type DepthImageProps = {
  src: string
  alt: string
  className?: string
}

export function DepthImage({ src, alt, className }: DepthImageProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl border border-border bg-surface shadow-lg ${className ?? ''}`}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </motion.div>
    </motion.div>
  )
}
