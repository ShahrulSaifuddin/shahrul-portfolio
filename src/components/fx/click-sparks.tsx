'use client'

import * as React from 'react'

interface Spark {
  x: number
  y: number
  angle: number
  start: number
  length: number
}

const DURATION = 420
const COUNT = 9
const RADIUS = 26

/**
 * Site-wide electrical sparks on every click (after React Bits' ClickSpark).
 * One fixed, viewport-sized canvas — never document-sized — and the rAF loop
 * only runs while sparks are alive, so an idle page costs nothing.
 */
export function ClickSparks(): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let sparks: Spark[] = []
    let frame = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()

    const color = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#6ef2c0'

    let stroke = color()

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks = sparks.filter((s) => now - s.start < DURATION)
      for (const s of sparks) {
        const t = (now - s.start) / DURATION
        const eased = t * (2 - t)
        const dist = eased * RADIUS
        const len = s.length * (1 - eased)
        // A slight zig-zag so each spark reads as an arc, not a ray.
        const jitter = Math.sin(t * 20 + s.angle * 5) * 2
        const x1 = s.x + dist * Math.cos(s.angle)
        const y1 = s.y + dist * Math.sin(s.angle)
        const x2 = s.x + (dist + len) * Math.cos(s.angle) + jitter
        const y2 = s.y + (dist + len) * Math.sin(s.angle) - jitter
        ctx.strokeStyle = stroke
        ctx.globalAlpha = 1 - t
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      frame = sparks.length ? requestAnimationFrame(draw) : 0
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stroke = color()
      const now = performance.now()
      const offset = Math.random() * Math.PI
      for (let i = 0; i < COUNT; i++) {
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          angle: offset + (2 * Math.PI * i) / COUNT,
          start: now,
          length: 8 + Math.random() * 8,
        })
      }
      if (!frame) frame = requestAnimationFrame(draw)
    }

    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] size-full"
    />
  )
}
