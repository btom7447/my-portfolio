'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

type ProjectItem = {
  title: string
  slug: string
  category: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const router = useRouter()

  // Toggle on Ctrl+/ — capture phase to intercept before browser handles it
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.metaKey || e.ctrlKey
      if (isCtrl && e.key === '/') {
        e.preventDefault()
        e.stopPropagation()
        setOpen((prev) => !prev)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [])

  // Fetch projects once on first open
  useEffect(() => {
    if (!open || projects.length > 0) return
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        const docs = data.docs || data
        if (Array.isArray(docs)) {
          setProjects(
            docs.map((p: { title: string; slug: string; category: string }) => ({
              title: p.title,
              slug: p.slug,
              category: p.category,
            })),
          )
        }
      })
      .catch(() => {})
  }, [open, projects.length])

  function run(action: () => void) {
    setOpen(false)
    action()
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-9990 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed left-1/2 top-[20%] z-9991 w-full max-w-lg -translate-x-1/2 px-4"
          >
            <Command className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
              <div className="flex items-center border-b border-border px-4">
                <svg
                  className="mr-2 h-4 w-4 shrink-0 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <Command.Input
                  placeholder="Search projects, pages, actions..."
                  className="flex-1 bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted"
                />
                <kbd className="ml-2 hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="px-4 py-8 text-center text-sm text-muted">
                  No results found.
                </Command.Empty>

                {/* Navigation */}
                <Command.Group heading="Navigation" className="mb-2">
                  <PaletteItem
                    onSelect={() => run(() => router.push('/'))}
                    icon={<HomeIcon />}
                  >
                    Home
                  </PaletteItem>
                  <PaletteItem
                    onSelect={() => run(() => router.push('/work'))}
                    icon={<GridIcon />}
                  >
                    All Projects
                  </PaletteItem>
                  <PaletteItem
                    onSelect={() => run(() => router.push('/about'))}
                    icon={<UserIcon />}
                  >
                    About
                  </PaletteItem>
                  <PaletteItem
                    onSelect={() => run(() => router.push('/contact'))}
                    icon={<MailIcon />}
                  >
                    Contact
                  </PaletteItem>
                </Command.Group>

                {/* Projects */}
                {projects.length > 0 && (
                  <Command.Group heading="Projects" className="mb-2">
                    {projects.map((p) => (
                      <PaletteItem
                        key={p.slug}
                        onSelect={() =>
                          run(() => router.push(`/work/${p.slug}`))
                        }
                        icon={
                          p.category === 'mobile' ? (
                            <PhoneIcon />
                          ) : (
                            <MonitorIcon />
                          )
                        }
                      >
                        {p.title}
                      </PaletteItem>
                    ))}
                  </Command.Group>
                )}

                {/* Actions */}
                <Command.Group heading="Actions">
                  <PaletteItem
                    onSelect={() => run(toggleTheme)}
                    icon={<SunIcon />}
                  >
                    Toggle Theme
                  </PaletteItem>
                  <PaletteItem
                    onSelect={() =>
                      run(() => {
                        confetti({ particleCount: 100, spread: 70 })
                        document.documentElement.classList.add('konami-mode')
                        setTimeout(() => document.documentElement.classList.remove('konami-mode'), 5000)
                      })
                    }
                    icon={<GamepadIcon />}
                  >
                    Konami Code
                  </PaletteItem>
                  <PaletteItem
                    onSelect={() => run(() => router.push('/secret'))}
                    icon={<TerminalIcon />}
                  >
                    /secret
                  </PaletteItem>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function PaletteItem({
  children,
  onSelect,
  icon,
}: {
  children: React.ReactNode
  onSelect: () => void
  icon: React.ReactNode
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
    >
      <span className="flex h-5 w-5 items-center justify-center text-muted">
        {icon}
      </span>
      {children}
    </Command.Item>
  )
}

// ── Inline SVG icons ──

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function GamepadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
