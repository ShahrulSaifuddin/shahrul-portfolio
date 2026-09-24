'use client'

import * as React from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>=+*'

/**
 * Decrypts its text left-to-right when it first scrolls into view, and again
 * on hover (after React Bits' <DecryptedText />, trimmed to what this site
 * uses). The real string is always in the accessibility tree; only the
 * visible layer scrambles.
 */
export function ScrambleText({
  text,
  className,
  trigger = 'both',
  duration = 700,
}: {
  text: string
  className?: string
  trigger?: 'view' | 'hover' | 'both'
  duration?: number
}): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = React.useState(text)
  const frame = React.useRef(0)

  const run = React.useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    cancelAnimationFrame(frame.current)
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const revealed = Math.floor(t * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        out += i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setDisplay(out)
      if (t < 1) frame.current = requestAnimationFrame(step)
      else setDisplay(text)
    }
    frame.current = requestAnimationFrame(step)
  }, [text, duration])

  React.useEffect(() => {
    if (trigger === 'hover') return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame.current)
    }
  }, [run, trigger])

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={trigger === 'view' ? undefined : run}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
