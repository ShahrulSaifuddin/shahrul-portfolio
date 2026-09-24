'use client'

import * as React from 'react'

/**
 * `true` once the boot screen has lifted (or immediately, when it was skipped
 * this session / under reduced motion). Animations that should start "when
 * the power comes on" gate on this rather than on mount.
 */
export function useBootDone(): boolean {
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (document.documentElement.getAttribute('data-boot') !== 'pending') {
      setDone(true)
      return
    }
    const onDone = () => setDone(true)
    window.addEventListener('ss:boot-done', onDone)
    return () => window.removeEventListener('ss:boot-done', onDone)
  }, [])

  return done
}
