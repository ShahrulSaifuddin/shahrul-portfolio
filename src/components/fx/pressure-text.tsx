'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Variable-font letters that swell toward the cursor (after React Bits'
 * <TextPressure />): each letter's width and weight axes follow its distance
 * from the pointer, and a slow wave keeps them breathing when nothing is
 * near. Archivo carries both `wdth` and `wght` axes, so this costs no extra
 * font. Decorative — the section's real heading is separate.
 */
export function PressureText({
  text,
  className,
}: {
  text: string
  className?: string
}): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-ch]'))
    const state = chars.map(() => ({ w: 100, g: 700 }))
    let mx = -1e4
    let my = -1e4
    let raf = 0
    let visible = false
    const t0 = performance.now()

    const tick = () => {
      if (!visible) return
      const t = (performance.now() - t0) / 1000
      const rects = chars.map((c) => c.getBoundingClientRect())
      chars.forEach((c, i) => {
        const r = rects[i]
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2))
        const near = Math.max(0, 1 - d / (r.height * 1.9))
        const idle = ((Math.sin(t * 1.5 - i * 0.6) + 1) / 2) * 0.32
        const k = Math.max(near * near * (3 - 2 * near), idle)
        const s = state[i]
        s.w += (76 + k * 49 - s.w) * 0.16
        s.g += (760 + k * 140 - s.g) * 0.16
        c.style.fontVariationSettings = `'wdth' ${s.w.toFixed(1)}, 'wght' ${s.g.toFixed(0)}`
      })
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onLeave = () => {
      mx = my = -1e4
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [text])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('flex w-full justify-between select-none', className)}
    >
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          data-ch=""
          className="inline-block"
          style={{
            fontFamily: 'var(--font-display)',
            fontVariationSettings: "'wdth' 90, 'wght' 800",
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
