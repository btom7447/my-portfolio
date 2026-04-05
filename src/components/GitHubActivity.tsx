'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Language = { name: string; count: number; color: string }

type GitHubData = {
  lastShipped: { repo: string; daysAgo: number }
  sparkline: number[]
  totalContributions: number
  streak: number
  publicRepos: number
  topLanguages: Language[]
}

function formatDaysAgo(days: number): string {
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
}

export function GitHubActivity() {
  const [data, setData] = useState<GitHubData | null>(null)

  useEffect(() => {
    fetch('/api/github')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) return null

  const max = Math.max(...data.sparkline, 1)
  const totalLangCount = data.topLanguages.reduce((sum, l) => sum + l.count, 0)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Sparkline + last shipped */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:col-span-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            90-day activity
          </p>
          <p className="text-xs text-muted">
            Last shipped{' '}
            <span className="font-medium text-foreground">
              {formatDaysAgo(data.lastShipped.daysAgo)}
            </span>
          </p>
        </div>
        <svg
          width="100%"
          height={40}
          viewBox={`0 0 ${data.sparkline.length * 2} 40`}
          preserveAspectRatio="none"
          className="shrink-0"
          aria-label="90-day contribution sparkline"
        >
          {data.sparkline.map((count, i) => {
            const barHeight = Math.max((count / max) * 32, 1)
            const opacity = count === 0 ? 0.15 : 0.3 + (count / max) * 0.7

            return (
              <motion.rect
                key={i}
                x={i * 2}
                y={40 - barHeight}
                width={1.5}
                height={barHeight}
                rx={0.5}
                fill="currentColor"
                className="text-accent"
                style={{ opacity }}
                initial={{ height: 0, y: 40 }}
                animate={{ height: barHeight, y: 40 - barHeight }}
                transition={{ duration: 0.4, delay: i * 0.008, ease: 'easeOut' }}
              />
            )
          })}
        </svg>
      </div>

      {/* Total contributions */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          This year
        </p>
        <div className="mt-2">
          <motion.p
            className="font-display text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {data.totalContributions.toLocaleString()}
          </motion.p>
          <p className="text-xs text-muted">contributions</p>
        </div>
      </div>

      {/* Streak */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Current streak
        </p>
        <div className="mt-2">
          <motion.p
            className="font-display text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {data.streak}
          </motion.p>
          <p className="text-xs text-muted">
            {data.streak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Top languages */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:col-span-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Top languages
        </p>
        {/* Bar */}
        <div className="flex h-2 overflow-hidden rounded-full">
          {data.topLanguages.map((lang, i) => (
            <motion.div
              key={lang.name}
              className="h-full"
              style={{ backgroundColor: lang.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(lang.count / totalLangCount) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
            />
          ))}
        </div>
        {/* Labels */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {data.topLanguages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-xs text-foreground">{lang.name}</span>
              <span className="text-xs text-muted">
                {Math.round((lang.count / totalLangCount) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Public repos */}
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Public repos
        </p>
        <div className="mt-2">
          <motion.p
            className="font-display text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {data.publicRepos}
          </motion.p>
          <p className="text-xs text-muted">repositories</p>
        </div>
      </div>

      {/* GitHub link */}
      <div className="flex items-center justify-center rounded-2xl border border-border bg-background p-5">
        <a
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'btom7447'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View GitHub Profile
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </a>
      </div>
    </div>
  )
}
