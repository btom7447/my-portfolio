'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type TerminalLine = {
  type: 'command' | 'output' | 'heading' | 'blank'
  text?: string
}

export function TerminalWindow({ lines }: { lines: TerminalLine[] }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const allRevealed = visibleCount >= lines.length

  // Listen for user typing "cd ~" or "cd" + Enter after all lines revealed
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!allRevealed) return

      if (e.key === 'Enter') {
        const cmd = userInput.trim()
        if (cmd === 'cd ~' || cmd === 'cd' || cmd === 'exit' || cmd === 'cd ~/' ) {
          router.push('/')
        }
        setUserInput('')
        return
      }

      if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1))
        return
      }

      // Only allow printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setUserInput((prev) => prev + e.key)
      }
    },
    [allRevealed, userInput, router],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (visibleCount >= lines.length) return

    const line = lines[visibleCount]

    if (line.type === 'command' && line.text) {
      // Typewriter effect for commands
      setIsTyping(true)
      setTypedText('')
      let charIndex = 0
      const text = line.text
      const typeInterval = setInterval(() => {
        charIndex++
        setTypedText(text.slice(0, charIndex))
        if (charIndex >= text.length) {
          clearInterval(typeInterval)
          setIsTyping(false)
          // Small pause after command finishes typing, then show next
          setTimeout(() => setVisibleCount((c) => c + 1), 300)
        }
      }, 25)
      return () => clearInterval(typeInterval)
    } else {
      // Non-command lines appear instantly with a small delay
      const timeout = setTimeout(
        () => setVisibleCount((c) => c + 1),
        line.type === 'blank' ? 100 : 60,
      )
      return () => clearTimeout(timeout)
    }
  }, [visibleCount, lines])

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [visibleCount, typedText])

  // Lines that are fully revealed (before the currently-typing one)
  const revealedLines = lines.slice(0, visibleCount)
  const currentLine = visibleCount < lines.length ? lines[visibleCount] : null

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-[#333] bg-[#1a1a1a] shadow-2xl shadow-black/50">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[#333] bg-[#252525] px-4 py-3">
        <div className="flex gap-2">
          <Link
            href="/"
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
            title="Back to portfolio"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 text-center text-xs text-[#888]">
          ~/secrets — bash
        </span>
        <span className="w-14" />
      </div>

      {/* Terminal body */}
      <div
        ref={bodyRef}
        className="max-h-[75vh] overflow-y-auto p-5 font-mono text-sm leading-relaxed"
      >
        {/* Revealed lines */}
        {revealedLines.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}

        {/* Currently typing line */}
        {currentLine?.type === 'command' && isTyping && (
          <div className="flex items-start gap-2">
            <Prompt />
            <span className="text-[#e5e5e5]">
              {typedText}
              <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#e5e5e5]" />
            </span>
          </div>
        )}

        {/* Exit prompt after all lines revealed */}
        {allRevealed && (
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <Prompt />
              <Link
                href="/"
                className="group relative inline-flex items-center gap-1"
              >
                <span className="absolute -inset-x-2 -inset-y-1 animate-[glow_2s_ease-in-out_infinite] rounded bg-[#7c3aed]/10" />
                <span className="relative text-[#c678dd] transition-colors group-hover:text-[#a78bfa]">
                  cd ~
                </span>
                <span className="relative text-[#555] transition-colors group-hover:text-[#888]">
                  # back to the polished version
                </span>
              </Link>
            </div>
            <div className="flex items-start gap-2">
              <Prompt />
              <span className="text-[#e5e5e5]">
                {userInput}
                <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#e5e5e5]" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-[#28c840]">visitor</span>
      <span className="text-[#888]">@</span>
      <span className="text-[#5c9eff]">portfolio</span>
      <span className="text-[#888]">:</span>
      <span className="text-[#c678dd]">~</span>
      <span className="text-[#888]">$</span>
    </span>
  )
}

function TerminalLine({ line }: { line: TerminalLine }) {
  if (line.type === 'blank') {
    return <div className="h-4" />
  }

  if (line.type === 'command') {
    return (
      <div className="flex items-start gap-2">
        <Prompt />
        <span className="text-[#e5e5e5]">{line.text}</span>
      </div>
    )
  }

  if (line.type === 'heading') {
    return (
      <p className="mt-1 text-[#5c9eff]">{line.text}</p>
    )
  }

  // output
  return (
    <p className="text-[#a0a0a0]">{line.text}</p>
  )
}
