'use client'

import * as React from 'react'

/**
 * Runs in <head> before first paint.
 *
 * 1. Every visit starts at the top: the browser's scroll restoration is off,
 *    and a reload or back/forward visit drops a leftover `#section` hash
 *    (from an in-page link clicked earlier) so it can't jump down the page.
 *    A fresh visit to a shared `/#contact` link still lands on the section.
 * 2. Decides whether the loader plays: once per browser session, never under
 *    reduced motion. Without JavaScript the attribute is never set, so the
 *    overlay stays `display: none` and the hero renders fully lit — the
 *    intro can only ever fail *open*.
 */
export const BOOT_INIT_SCRIPT = `(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(location.hash&&n&&n.type!=='navigate')history.replaceState(history.state,'',location.pathname+location.search)}catch(e){}try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=sessionStorage.getItem('ss-booted');d.setAttribute('data-boot',(r||s)?'done':'pending')}catch(e){document.documentElement.setAttribute('data-boot','done')}})();`

const STATUS = ['Spawning particles', 'Wiring the APIs', 'Calibrating the swarm', 'Ready'] as const

const TOTAL_MS = 1800

/**
 * The intro: an eased 000 → 100 counter with a hairline progress bar, then
 * the panel opens like an iris from the centre — the same portal the swarm
 * forms at the end of the page — and the hero letters flip up behind it.
 * Purely decorative (`aria-hidden`, nothing focusable); any click or key
 * press skips it.
 */
export function BootSequence(): React.ReactElement {
  const [percent, setPercent] = React.useState(0)
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
      setExiting(true)
      try {
        sessionStorage.setItem('ss-booted', '1')
      } catch {
        /* private mode: the intro just plays again next load */
      }
      // Flip to "done" as the iris starts opening, so the hero's entrance
      // overlaps the exit instead of waiting for it.
      root.setAttribute('data-boot', 'done')
      window.dispatchEvent(new Event('ss:boot-done'))
      window.setTimeout(() => setExiting(false), 1300)
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TOTAL_MS)
      // easeInOutCubic, so the count accelerates then settles onto 100.
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setPercent(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(finish, 220)
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

  const status =
    STATUS[
      percent >= 100 ? STATUS.length - 1 : Math.min(STATUS.length - 2, Math.floor(percent / 34))
    ]

  return (
    <div
      aria-hidden="true"
      className={`boot-screen dark bg-background text-foreground fixed inset-0 z-[90] flex-col justify-between overflow-hidden p-6 sm:p-10 ${
        exiting ? 'is-exiting' : ''
      }`}
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[90vmin] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] transition-[opacity,transform] duration-300"
        style={{
          opacity: 0.25 + (percent / 100) * 0.75,
          transform: `translate(-50%, -50%) scale(${0.6 + (percent / 100) * 0.5})`,
        }}
      />
      <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-60" />

      <div className="boot-fade text-muted-foreground relative flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase">
        <span className="text-foreground">Shahrul Saifuddin</span>
        <span>Portfolio · 2026</span>
      </div>

      <div className="boot-fade relative">
        <div className="flex items-end justify-between gap-6">
          <span className="font-display-wide block text-[26vw] leading-[0.78] font-extrabold tabular-nums sm:text-[13rem]">
            {String(percent).padStart(3, '0')}
          </span>
          <span className="text-muted-foreground mb-3 hidden text-right font-mono text-xs tracking-[0.2em] uppercase sm:block">
            <span className="text-brand">●</span> {status}
          </span>
        </div>
        <div className="bg-border mt-8 h-px w-full overflow-hidden">
          <div
            className="bg-brand h-full origin-left shadow-[0_0_18px_var(--brand)]"
            style={{ transform: `scaleX(${percent / 100})` }}
          />
        </div>
        <div className="text-muted-foreground mt-4 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase">
          <span className="sm:hidden">
            <span className="text-brand">●</span> {status}
          </span>
          <span className="hidden sm:inline">Freelance full-stack engineer</span>
          <span>Kuala Lumpur · MY</span>
        </div>
      </div>
    </div>
  )
}
