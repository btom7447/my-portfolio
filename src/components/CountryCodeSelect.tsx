'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { countryCodes } from '@/lib/country-codes'

function Flag({ code }: { code: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny flag SVGs from a CDN; next/image is overkill here
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt=""
      width={20}
      height={14}
      loading="lazy"
      className="h-3.5 w-5 shrink-0 rounded-xs object-cover ring-1 ring-border/60"
    />
  )
}

export function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (code: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected =
    countryCodes.find((c) => c.code === value) ?? countryCodes[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countryCodes
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    )
  }, [query])

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  // Focus the search box when the menu opens (DOM side effect only — the state
  // reset that accompanies opening lives in openMenu() so it stays out of effects).
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[highlight] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlight, open])

  function openMenu() {
    setQuery('')
    const idx = countryCodes.findIndex((c) => c.code === value)
    setHighlight(idx >= 0 ? idx : 0)
    setOpen(true)
  }

  function select(code: string) {
    onChange(code)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const c = filtered[highlight]
      if (c) select(c.code)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} (${selected.dial})`}
        className="flex h-full items-center gap-2 rounded-lg border border-border bg-surface py-3 pl-3 pr-2.5 text-sm text-foreground transition-colors hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <Flag code={selected.code} />
        <span className="tabular-nums">{selected.dial}</span>
        <svg
          className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-background shadow-xl sm:w-72">
          <div className="border-b border-border p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlight(0)
              }}
              onKeyDown={onKeyDown}
              placeholder="Search country or code…"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted">No matches</li>
            ) : (
              filtered.map((c, i) => {
                const isSelected = c.code === value
                const isHighlighted = i === highlight
                return (
                  <li
                    key={c.code}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => select(c.code)}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors ${
                      isHighlighted ? 'bg-accent/10' : ''
                    }`}
                  >
                    <Flag code={c.code} />
                    <span className="flex-1 truncate text-foreground">{c.name}</span>
                    <span className="tabular-nums text-muted">{c.dial}</span>
                    {isSelected && (
                      <svg
                        className="text-accent"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
