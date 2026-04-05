'use client'

import CountUp from 'react-countup'
import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'

type StatCounterProps = {
  value: string
  label: string
}

export function StatCounter({ value, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  // Extract the numeric part and suffix (e.g., "3+" → 3 and "+", "100%" → 100 and "%")
  const match = value.match(/^(\d+)(.*)$/)
  const numericValue = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''
  const isNumeric = match !== null

  return (
    <div ref={ref} className="text-center">
      <span className="font-display text-4xl font-bold text-accent sm:text-5xl lg:text-6xl">
        {isNumeric && inView ? (
          <CountUp
            start={0}
            end={numericValue}
            duration={2}
            suffix={suffix}
            onEnd={() => setHasAnimated(true)}
          />
        ) : hasAnimated ? (
          value
        ) : (
          isNumeric ? `0${suffix}` : value
        )}
      </span>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  )
}
