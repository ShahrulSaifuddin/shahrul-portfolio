'use client'

import * as React from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

/** The live Lenis instance, or `null` under reduced motion / before mount. */
export function getLenis(): Lenis | null {
  return instance
}

/**
 * Scrolls the window to `top`, going through Lenis when it is running so the
 * two never fight over the scroll position.
 */
export function scrollToTop(immediate = false): void {
  if (instance) {
    instance.scrollTo(0, { immediate, force: true })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

/**
 * Inertial wheel scrolling (Lenis). Touch devices keep native scrolling —
 * Lenis only smooths wheel input by default — and `prefers-reduced-motion`
 * skips it entirely. It drives the real window scroll, so `position: sticky`,
 * IntersectionObserver and Framer Motion's `useScroll` all keep working.
 */
export function SmoothScroll(): null {
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: { offset: -96 },
    })
    instance = lenis

    return () => {
      lenis.destroy()
      instance = null
    }
  }, [])

  return null
}
