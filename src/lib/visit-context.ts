export type VisitType = 'first' | 'returning-same-day' | 'returning' | 'referred'

export function getVisitContext(): VisitType {
  if (typeof window === 'undefined') return 'first'

  // Check referrer
  const referrer = document.referrer
  if (referrer.includes('linkedin.com') || referrer.includes('github.com')) {
    return 'referred'
  }

  const lastVisit = localStorage.getItem('last-visit')

  if (!lastVisit) {
    localStorage.setItem('last-visit', Date.now().toString())
    return 'first'
  }

  const daysSince =
    (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)
  localStorage.setItem('last-visit', Date.now().toString())

  return daysSince < 1 ? 'returning-same-day' : 'returning'
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 0 && hour < 5) return "You're up late. So am I."
  if (hour >= 5 && hour < 12) return 'Good morning.'
  if (hour >= 12 && hour < 17) return 'Hey.'
  if (hour >= 17 && hour < 21) return 'Evening.'
  return 'Still at it?'
}

type HeroCopy = { headline: string; sub: string }

const heroCopy: Record<VisitType, HeroCopy> = {
  first: {
    headline: '',  // uses CMS headline
    sub: '',       // uses CMS subtext
  },
  'returning-same-day': {
    headline: 'Still here? Good taste.',
    sub: "Let me know if you want to build something together.",
  },
  returning: {
    headline: "You're back.",
    sub: 'I may have shipped something new since your last visit.',
  },
  referred: {
    headline: 'Thanks for following the link.',
    sub: "Here's what I've been building.",
  },
}

export function getHeroCopy(
  visitType: VisitType,
): HeroCopy | null {
  const hour = new Date().getHours()

  // Special combo: returning late at night
  if (visitType === 'returning' && hour >= 22) {
    return {
      headline: 'Back again at this hour?',
      sub: "Let's build something.",
    }
  }

  const copy = heroCopy[visitType]

  // First visit: return null so Hero falls through to CMS content
  if (visitType === 'first') {
    return null
  }

  return copy
}
