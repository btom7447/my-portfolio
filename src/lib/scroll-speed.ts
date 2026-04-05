export function initScrollSpeedDetection(onFastScroll: () => void) {
  let lastY = 0
  let lastTime = Date.now()
  let triggered = false

  function handler() {
    if (triggered) return

    const now = Date.now()
    const deltaY = Math.abs(window.scrollY - lastY)
    const deltaT = now - lastTime

    const velocity = deltaY / deltaT // px per ms

    if (velocity > 3 && deltaT < 500) {
      triggered = true
      onFastScroll()
    }

    lastY = window.scrollY
    lastTime = now
  }

  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}
