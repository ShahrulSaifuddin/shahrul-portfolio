'use client'

import * as React from 'react'

/** Kuala Lumpur wall clock — client-only, so SSR never renders a stale time. */
export function LocalTime(): React.ReactElement {
  const [now, setNow] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return <span className="tabular-nums">{now ?? '--:--:--'}</span>
}
