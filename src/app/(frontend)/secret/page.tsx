import { getPayloadClient } from '@/lib/payload'
import { TerminalWindow } from '@/components/TerminalWindow'

export const metadata = {
  title: '// you weren\'t supposed to find this',
  robots: 'noindex, nofollow',
}

export default async function SecretPageRoute() {
  const payload = await getPayloadClient()
  const secret = await payload.findGlobal({ slug: 'secret-page' })

  const sections = (secret.sections as {
    command: string
    heading: string
    body: string
    id?: string
  }[]) || []

  const exitMessage = (secret.exitMessage as string) || "don't tell anyone you were here"

  type Line = { type: 'command' | 'output' | 'heading' | 'blank'; text?: string }

  const lines: Line[] = [
    { type: 'command', text: 'cat ~/secrets/README.md' },
    { type: 'output', text: '// you weren\'t supposed to find this' },
    { type: 'blank' },
    { type: 'command', text: 'ls -la ~/secrets/' },
    ...sections.map((s) => ({
      type: 'output' as const,
      text: `drwxr-xr-x  ${s.command.replace('cat ', '').split('/')[0]}/`,
    })),
    { type: 'blank' },
  ]

  for (const section of sections) {
    lines.push({ type: 'command', text: section.command })
    lines.push({ type: 'heading', text: section.heading })
    lines.push({ type: 'output', text: section.body })
    lines.push({ type: 'blank' })
  }

  lines.push({ type: 'command', text: `echo "${exitMessage}"` })
  lines.push({ type: 'output', text: exitMessage })

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 sm:p-8">
      <TerminalWindow lines={lines} />
    </main>
  )
}
