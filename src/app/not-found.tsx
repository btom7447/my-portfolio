'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Line = {
  type: 'command' | 'output' | 'blank' | 'link'
  text?: string
  href?: string
  delay?: number
}

const LINES: Line[] = [
  { type: 'command', text: 'find / -name "this-page" 2>/dev/null' },
  { type: 'output', text: 'Searching...', delay: 600 },
  { type: 'output', text: 'Searching /home...' },
  { type: 'output', text: 'Searching /work...' },
  { type: 'output', text: 'Searching /about...' },
  { type: 'blank' },
  { type: 'output', text: '\u001b[31m✗\u001b[0m find: no matches found' },
  { type: 'blank' },
  { type: 'command', text: 'cat /etc/suggestions.conf' },
  { type: 'blank' },
  { type: 'output', text: '# ─── Suggested routes ───' },
  { type: 'link', text: '  cd /           → Back to home', href: '/' },
  { type: 'link', text: '  cd /work       → View projects', href: '/work' },
  { type: 'link', text: '  cd /about      → About me', href: '/about' },
  { type: 'link', text: '  cd /contact    → Get in touch', href: '/contact' },
  { type: 'blank' },
  { type: 'output', text: '# Or type a command below and press Enter' },
]

const VALID_COMMANDS: Record<string, string> = {
  'cd /': '/',
  'cd ~': '/',
  cd: '/',
  exit: '/',
  'cd /work': '/work',
  'cd /about': '/about',
  'cd /contact': '/contact',
  'cd /secret': '/secret',
}

export default function NotFound() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const allRevealed = visibleCount >= LINES.length

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!allRevealed) return

      if (e.key === 'Enter') {
        const cmd = userInput.trim().toLowerCase()
        if (VALID_COMMANDS[cmd]) {
          router.push(VALID_COMMANDS[cmd])
        } else if (cmd) {
          setErrorMsg(`bash: ${userInput.trim()}: command not found`)
        }
        setUserInput('')
        return
      }

      if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1))
        setErrorMsg('')
        return
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setUserInput((prev) => prev + e.key)
        setErrorMsg('')
      }
    },
    [allRevealed, userInput, router],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Typewriter / reveal logic
  useEffect(() => {
    if (visibleCount >= LINES.length) return

    const line = LINES[visibleCount]
    const extraDelay = line.delay ?? 0

    if (line.type === 'command' && line.text) {
      setIsTyping(true)
      setTypedText('')
      let charIndex = 0
      const text = line.text

      const startTimeout = setTimeout(() => {
        const typeInterval = setInterval(() => {
          charIndex++
          setTypedText(text.slice(0, charIndex))
          if (charIndex >= text.length) {
            clearInterval(typeInterval)
            setIsTyping(false)
            setTimeout(() => setVisibleCount((c) => c + 1), 300)
          }
        }, 30)

        return () => clearInterval(typeInterval)
      }, extraDelay)

      return () => clearTimeout(startTimeout)
    } else {
      const timeout = setTimeout(
        () => setVisibleCount((c) => c + 1),
        line.type === 'blank' ? 80 : 120 + extraDelay,
      )
      return () => clearTimeout(timeout)
    }
  }, [visibleCount])

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [visibleCount, typedText, userInput, errorMsg])

  const revealedLines = LINES.slice(0, visibleCount)
  const currentLine = visibleCount < LINES.length ? LINES[visibleCount] : null

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0e0e0e',
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          padding: '1rem',
        }}
      >
        {/* 404 header */}
        <div
          style={{
            marginBottom: '2rem',
            fontSize: 'clamp(4rem, 10vw, 7rem)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            userSelect: 'none',
            color: 'rgba(124, 58, 237, 0.2)',
          }}
        >
          404
        </div>

        {/* Terminal */}
        <div
          style={{
            width: '100%',
            maxWidth: '42rem',
            overflow: 'hidden',
            borderRadius: '0.5rem',
            border: '1px solid #333',
            background: '#1a1a1a',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '1px solid #333',
              background: '#252525',
              padding: '0.75rem 1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                href="/"
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  background: '#ff5f57',
                  display: 'block',
                }}
              />
              <span
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  background: '#febc2e',
                  display: 'block',
                }}
              />
              <span
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  background: '#28c840',
                  display: 'block',
                }}
              />
            </div>
            <span
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#888',
              }}
            >
              ~/lost — bash
            </span>
            <span style={{ width: '3.5rem' }} />
          </div>

          {/* Terminal body */}
          <div
            ref={bodyRef}
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '1.25rem',
              fontSize: '0.875rem',
              lineHeight: '1.75',
            }}
          >
            {revealedLines.map((line, i) => (
              <RevealedLine key={i} line={line} />
            ))}

            {currentLine?.type === 'command' && isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Prompt />
                <span style={{ color: '#e5e5e5' }}>
                  {typedText}
                  <Cursor />
                </span>
              </div>
            )}

            {allRevealed && (
              <div style={{ marginTop: '0.5rem' }}>
                {errorMsg && (
                  <p style={{ color: '#ff5f57', margin: '0 0 0.25rem' }}>{errorMsg}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Prompt />
                  <span style={{ color: '#e5e5e5' }}>
                    {userInput}
                    <Cursor />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#555' }}>
          Type a command or click a route above
        </p>

        {/* Inline keyframes for cursor blink */}
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </body>
    </html>
  )
}

function Cursor() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.5rem',
        height: '1rem',
        background: '#e5e5e5',
        verticalAlign: 'text-bottom',
        animation: 'blink 1s step-end infinite',
      }}
    />
  )
}

function Prompt() {
  return (
    <span style={{ flexShrink: 0, userSelect: 'none' }}>
      <span style={{ color: '#28c840' }}>visitor</span>
      <span style={{ color: '#888' }}>@</span>
      <span style={{ color: '#5c9eff' }}>portfolio</span>
      <span style={{ color: '#888' }}>:</span>
      <span style={{ color: '#c678dd' }}>~</span>
      <span style={{ color: '#888' }}>$</span>
    </span>
  )
}

function RevealedLine({ line }: { line: Line }) {
  if (line.type === 'blank') {
    return <div style={{ height: '1rem' }} />
  }

  if (line.type === 'command') {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <Prompt />
        <span style={{ color: '#e5e5e5' }}>{line.text}</span>
      </div>
    )
  }

  if (line.type === 'link') {
    const parts = line.text?.split('→') ?? []
    return (
      <Link
        href={line.href ?? '/'}
        style={{ display: 'block', textDecoration: 'none' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.querySelector<HTMLSpanElement>('[data-cmd]')!.style.color = '#a78bfa'
          el.querySelector<HTMLSpanElement>('[data-desc]')!.style.color = '#e5e5e5'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.querySelector<HTMLSpanElement>('[data-cmd]')!.style.color = '#c678dd'
          el.querySelector<HTMLSpanElement>('[data-desc]')!.style.color = '#888'
        }}
      >
        <span data-cmd style={{ color: '#c678dd', transition: 'color 0.15s' }}>
          {parts[0]}
        </span>
        {parts[1] && (
          <>
            <span style={{ color: '#555' }}>→</span>
            <span data-desc style={{ color: '#888', transition: 'color 0.15s' }}>
              {parts[1]}
            </span>
          </>
        )}
      </Link>
    )
  }

  const text = line.text ?? ''
  if (text.includes('\u001b[31m')) {
    const clean = text.replace('\u001b[31m', '').replace('\u001b[0m', '')
    const crossIdx = clean.indexOf('✗')
    return (
      <p style={{ margin: 0 }}>
        <span style={{ color: '#ff5f57' }}>{clean.slice(0, crossIdx + 1)}</span>
        <span style={{ color: '#a0a0a0' }}>{clean.slice(crossIdx + 1)}</span>
      </p>
    )
  }

  if (text.startsWith('#')) {
    return <p style={{ margin: 0, color: '#5c9eff' }}>{text}</p>
  }

  return <p style={{ margin: 0, color: '#a0a0a0' }}>{text}</p>
}
