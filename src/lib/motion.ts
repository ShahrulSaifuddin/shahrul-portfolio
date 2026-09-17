import type { Variants } from 'framer-motion'

/**
 * Shared motion constants — the house feel. Every animated component in the
 * app should build on these instead of inventing its own easing/duration.
 */

/** Expo-out. The house curve. */
export const EASE = [0.16, 1, 0.3, 1] as const

export const DUR = {
  fast: 0.18,
  base: 0.34,
  slow: 0.55,
} as const

/** Section entrance: opacity 0→1, y 14→0. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE },
  },
}

/** Orchestrates staggered children entrances. */
export function staggerParent(staggerChildren = 0.06): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren },
    },
  }
}

/** Spring used for card hover lift. No scale on cards. */
export const cardHoverSpring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
} as const
