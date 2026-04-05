export function initIdleDetection(
  onIdle: () => void,
  onReturn: () => void,
  timeout = 30_000,
) {
  let timer: ReturnType<typeof setTimeout>
  let isIdle = false

  function reset() {
    if (isIdle) {
      isIdle = false
      onReturn()
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      isIdle = true
      onIdle()
    }, timeout)
  }

  const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
  events.forEach((event) => {
    window.addEventListener(event, reset, { passive: true })
  })

  reset() // start the timer

  return () => {
    clearTimeout(timer)
    events.forEach((event) => {
      window.removeEventListener(event, reset)
    })
  }
}
