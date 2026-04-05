const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export function initKonami(onActivate: () => void) {
  let index = 0

  function handler(e: KeyboardEvent) {
    if (e.key === KONAMI_SEQUENCE[index]) {
      index++
      if (index === KONAMI_SEQUENCE.length) {
        onActivate()
        index = 0
      }
    } else {
      index = 0
    }
  }

  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}
