import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

type Payload = { name: string; email: string; message: string; phone?: string }

// --- Channel senders. Each returns void on success, throws on failure. ---
// Each channel only runs if its env vars are present, so you can enable them
// one at a time without touching code.

async function sendEmail({ name, email, phone, message }: Payload) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL
  if (!apiKey || !to) throw new Error('email: not configured')

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    // onboarding@resend.dev is Resend's shared sender. It can always deliver to
    // your own account email, so no domain verification is needed for self-notify.
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to,
    replyTo: email,
    subject: `Portfolio: New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\n\nMessage:\n${message}`,
  })
  if (error) throw new Error(`email: ${error.message}`)
}

async function sendTelegram({ name, email, phone, message }: Payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('telegram: not configured')

  const text = `New portfolio message\n\nFrom: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\n\n${message}`
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  if (!res.ok) throw new Error(`telegram: ${res.status} ${await res.text()}`)
}

async function sendWhatsApp({ name, email, phone, message }: Payload) {
  const toPhone = process.env.CALLMEBOT_PHONE // your number — e.g. 2348012345678 (country code, no +)
  const apiKey = process.env.CALLMEBOT_APIKEY
  if (!toPhone || !apiKey) throw new Error('whatsapp: not configured')

  const text = `New portfolio message\nFrom: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\n\n${message}`
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(toPhone)}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`whatsapp: ${res.status} ${await res.text()}`)
}

export async function POST(req: Request) {
  const { name, email, message, phone } = (await req.json()) as Partial<Payload>

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const payload: Payload = { name, email, message, phone }
  const channels = [sendEmail, sendTelegram, sendWhatsApp]

  const results = await Promise.allSettled(channels.map((send) => send(payload)))

  const delivered = results.filter((r) => r.status === 'fulfilled').length
  results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .forEach((r) => console.error('[contact]', r.reason?.message ?? r.reason))

  // Succeed as long as at least one channel delivered the message.
  if (delivered === 0) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
