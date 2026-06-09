'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { countryCodes } from '@/lib/country-codes'
import { CountryCodeSelect } from '@/components/CountryCodeSelect'

export function ContactForm() {
  const [sending, setSending] = useState(false)
  const [country, setCountry] = useState('US')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)

    const form = e.currentTarget
    const data = new FormData(form)

    // Phone is optional — only attach it (with the dial code) if a number was typed.
    const number = (data.get('phone') as string)?.trim()
    const dial = countryCodes.find((c) => c.code === country)?.dial
    const phone = number ? `${dial} ${number}` : undefined

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone,
          message: data.get('message'),
        }),
      })

      if (res.ok) {
        toast.success("Message sent! I'll get back to you soon.")
        form.reset()
        setCountry('US')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <div className="flex gap-2">
          <CountryCodeSelect value={country} onChange={setCountry} />
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            className="w-full flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="801 234 5678"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Tell me about your project..."
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
