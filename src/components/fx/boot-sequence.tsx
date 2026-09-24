'use client'

import * as React from 'react'

/**
 * Runs in <head> before first paint. Decides whether the boot screen plays:
 * once per browser session, never under reduced motion. Without JavaScript
 * the attribute is never set, so the overlay stays `display: none` and the
 * hero renders fully lit — the intro can only ever fail *open*.
 */
export const BOOT_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=sessionStorage.getItem('ss-booted');d.setAttribute('data-boot',(r||s)?'done':'pending')}catch(e){document.documentElement.setAttribute('data-boot','done')}})();`

const LINES = [
  ['BootNotification', 'Accepted'],
  ['Handshake · React Native ⇄ Laravel ⇄ Node.js', 'OK'],
  ['Payment rails · SenangPay · S-Pay · Finexus', 'OK'],
  ['Connector 01 · Shahrul Saifuddin', 'Available'],
] as const

const TOTAL_MS = 1900

/**
 * The intro: a charge-point handshake log and a 0→100% charge bar, then the
 * panel lifts away. Purely decorative — `aria-hidden`, no focusable content —
 * so keyboard and screen-reader users land on the real page immediately.
 * Any click or key press skips it.
 */
export function BootSequence(): React.ReactElement {
  const [percent, setPercent] = React.useState(0)
  const [lines, setLines] = React.useState(0)
  const [exiting, setExiting] = React.useState(false)

  React.useEffect(() => {
    const root = document.documentElement
    if (root.getAttribute('data-boot') !== 'pending') return

    let raf = 0
    let finished = false
    const start = performance.now()

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      setPercent(100)
      setLines(LINES.length)
      setExiting(true)
      try {
        sessionStorage.setItem('ss-booted', '1')
      } catch {
        /* private mode: the intro just plays again next load */
      }
      // Flip to "done" as the panel starts lifting, so the hero's neon
      // ignition overlaps the exit instead of waiting for it.
      root.setAttribute('data-boot', 'done')
      window.dispatchEvent(new Event('ss:boot-done'))
      window.setTimeout(() => setExiting(false), 900)
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TOTAL_MS)
      // Ease-in-out with a small stall around 70%, like a real handshake.
      const eased = t < 0.7 ? (t / 0.7) ** 1.6 * 0.72 : 0.72 + ((t - 0.7) / 0.3) * 0.28
      setPercent(Math.round(eased * 100))
      setLines(Math.min(LINES.length, Math.floor(t * (LINES.length + 0.6))))
      if (t < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(finish, 160)
    }
    raf = requestAnimationFrame(tick)

    const skip = () => finish()
    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`boot-screen dark fixed inset-0 z-[90] flex-col justify-between bg-background p-6 text-foreground sm:p-10 ${
        exiting ? 'is-exiting' : ''
      }`}
    >
      <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" />
      <div className="relative flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        <span>SS/Charge-Point · v2026</span>
        <span className="flex items-center gap-2">
          <span className="animate-led size-1.5 rounded-full bg-brand" />
          Connecting
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <ul className="space-y-2 font-mono text-xs text-muted-foreground sm:text-sm">
          {LINES.map(([label, status], i) => (
            <li
              key={label}
              className="flex items-center justify-between gap-4 transition-opacity duration-200"
              style={{ opacity: i < lines ? 1 : 0 }}
            >
              <span>
                <span className="text-brand">→</span> {label}
              </span>
              <span className="text-brand">[{status}]</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-end justify-between gap-6">
          <span className="font-display-wide text-[22vw] leading-[0.8] font-bold tabular-nums sm:text-[14rem]">
            {String(percent).padStart(2, '0')}
            <span className="text-brand">%</span>
          </span>
          <span className="mb-4 hidden font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase sm:block">
            State of charge
          </span>
        </div>
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand shadow-[0_0_24px_var(--brand)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="relative flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        <span>Kuala Lumpur · MY</span>
        <span>Click to skip</span>
      </div>
    </div>
  )
}
