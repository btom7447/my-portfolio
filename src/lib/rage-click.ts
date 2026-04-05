export function initRageClickDetection(onRageClick: (target: HTMLElement) => void) {
  const clicks: { target: EventTarget | null; time: number }[] = []
  const THRESHOLD = 3
  const WINDOW_MS = 1000

  function handler(e: MouseEvent) {
    const now = Date.now()
    clicks.push({ target: e.target, time: now })

    // Keep only recent clicks on the same target
    const recent = clicks.filter(
      (c) => c.time > now - WINDOW_MS && c.target === e.target,
    )

    if (recent.length >= THRESHOLD) {
      clicks.length = 0
      onRageClick(e.target as HTMLElement)
    }
  }

  window.addEventListener('click', handler)
  return () => window.removeEventListener('click', handler)
}
