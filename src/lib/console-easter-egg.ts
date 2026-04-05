const ASCII_ART = `
 _______ _______ _______ ___ ___ __ ___ _______
|       |   _   |   |   |   |   |  |   |   _   |
|_     _|       |       |   |   |     _|  |_|  |
  |   | |   _   |  _    |   |   |     _|       |
  |   | |  |_|  | | |   |   |   |    |_|       |
  |   | |       | |_|   |   |___|       |   _   |
  |___| |_______|_______|_______|_______|__| |__|
`

const styles = {
  ascii: 'color: #7c3aed; font-family: monospace; font-size: 10px; line-height: 1.2',
  label: 'color: #888; font-size: 11px',
  command: 'color: #e5e5e5; font-weight: bold; font-size: 11px',
  success: 'color: #22c55e; font-weight: bold; font-size: 11px',
}

export function initConsoleEasterEgg() {
  console.log('%c' + ASCII_ART, styles.ascii)
  console.log('%cFull-Stack Engineer · Web & Mobile', styles.label)
  console.log('%c────────────────────────────────────────', styles.label)
  console.log('%cAvailable commands:', styles.label)
  console.log('')
  console.log('%c  hire()      %c→ Open contact page', styles.command, styles.label)
  console.log('%c  projects()  %c→ List all projects', styles.command, styles.label)
  console.log('%c  stack()     %c→ View tech stack', styles.command, styles.label)
  console.log('%c  secret()    %c→ ????', styles.command, styles.label)
  console.log('')
  console.log('%cType any command and press Enter.', styles.label)

  Object.assign(window, {
    hire: () => {
      console.log('%c✓ Opening contact...', styles.success)
      window.location.href = '/contact'
      return '📬'
    },

    projects: () => {
      fetch('/api/projects')
        .then((r) => r.json())
        .then((data) => {
          const docs = data.docs || data
          if (Array.isArray(docs)) {
            console.table(
              docs.map((p: { title: string; category: string; slug: string }) => ({
                Title: p.title,
                Category: p.category,
                URL: `/work/${p.slug}`,
              })),
            )
          }
        })
        .catch(() => console.log('%c✗ Failed to fetch projects', styles.label))
      return '📋'
    },

    stack: () => {
      console.log('%c⚡ Tech Stack:', styles.command)
      console.log(
        '%cNext.js · Payload CMS · Neon Postgres · GSAP · Framer Motion · Tailwind CSS · TypeScript · Vercel',
        styles.label,
      )
      return '⚡'
    },

    secret: () => {
      console.log('%c👀 You found it.', styles.command)
      console.log('%cNavigating to /secret...', styles.label)
      window.dispatchEvent(new CustomEvent('easter-egg-found'))
      setTimeout(() => {
        window.location.href = '/secret'
      }, 1500)
      return '🔓'
    },
  })
}
