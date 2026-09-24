'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function random(x: number): number {
  return (Math.sin(x * 12.9898) * 43758.5453) % 1
}

function noise2D(x: number, y: number): number {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const a = random(i + j * 57)
  const b = random(i + 1 + j * 57)
  const c = random(i + (j + 1) * 57)
  const d = random(i + 1 + (j + 1) * 57)
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
}

function octaved(x: number, amplitude: number, time: number, seed: number): number {
  let y = 0
  let amp = amplitude
  let freq = 10
  for (let i = 0; i < 8; i++) {
    y += (i === 0 ? 0 : amp) * noise2D(freq * x + seed * 100, time * freq * 0.3)
    freq *= 1.6
    amp *= 0.7
  }
  return y
}

function roundedRectPoint(t: number, l: number, top: number, w: number, h: number, r: number) {
  const sw = w - 2 * r
  const sh = h - 2 * r
  const arc = (Math.PI * r) / 2
  const total = 2 * sw + 2 * sh + 4 * arc
  let d = t * total
  const corner = (cx: number, cy: number, start: number, p: number) => ({
    x: cx + r * Math.cos(start + p * (Math.PI / 2)),
    y: cy + r * Math.sin(start + p * (Math.PI / 2)),
  })
  if (d <= sw) return { x: l + r + d, y: top }
  d -= sw
  if (d <= arc) return corner(l + w - r, top + r, -Math.PI / 2, d / arc)
  d -= arc
  if (d <= sh) return { x: l + w, y: top + r + d }
  d -= sh
  if (d <= arc) return corner(l + w - r, top + h - r, 0, d / arc)
  d -= arc
  if (d <= sw) return { x: l + w - r - d, y: top + h }
  d -= sw
  if (d <= arc) return corner(l + r, top + h - r, Math.PI / 2, d / arc)
  d -= arc
  if (d <= sh) return { x: l, y: top + h - r - d }
  d -= sh
  return corner(l + r, top + r, Math.PI, Math.min(1, d / arc))
}

/**
 * Adapted from React Bits' <ElectricBorder /> (reactbits.dev): a noise-
 * displaced stroke crawling around the element like a live arc. Changes:
 * colour comes from a CSS variable (so it follows the theme), the loop
 * pauses offscreen, and reduced motion gets the static glow only.
 */
export function ElectricBorder({
  children,
  speed = 1,
  chaos = 0.1,
  radius = 24,
  className,
}: {
  children: React.ReactNode
  speed?: number
  chaos?: number
  radius?: number
  className?: string
}): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const OFFSET = 50
    const DISPLACEMENT = 50
    let width = 0
    let height = 0
    let dpr = 1
    let color = '#6ef2c0'

    const measure = () => {
      const rect = container.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width + OFFSET * 2
      height = rect.height + OFFSET * 2
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      color = getComputedStyle(container).getPropertyValue('--brand').trim() || color
    }
    measure()

    let raf = 0
    let running = false
    let time = 0
    let last = performance.now()

    const draw = (now: number) => {
      time += ((now - last) / 1000) * speed
      last = now
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.25
      ctx.lineJoin = 'round'
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      const bw = width - OFFSET * 2
      const bh = height - OFFSET * 2
      const r = Math.min(radius, Math.min(bw, bh) / 2)
      const samples = Math.floor((2 * (bw + bh)) / 3)
      ctx.beginPath()
      for (let i = 0; i <= samples; i++) {
        const p = i / samples
        const pt = roundedRectPoint(p, OFFSET, OFFSET, bw, bh, r)
        const x = pt.x + octaved(p * 8, chaos, time, 0) * DISPLACEMENT
        const y = pt.y + octaved(p * 8, chaos, time, 1) * DISPLACEMENT
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
      if (running) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const ro = new ResizeObserver(measure)
    ro.observe(container)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(container)
    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
  }, [speed, chaos, radius])

  return (
    <div
      ref={containerRef}
      className={cn('relative isolate', className)}
      style={{ borderRadius: radius }}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
        <canvas ref={canvasRef} className="block" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]">
        <div className="absolute inset-0 rounded-[inherit] border-2 border-brand/60 blur-[1px]" />
        <div className="absolute inset-0 rounded-[inherit] border-2 border-brand blur-[4px]" />
        <div className="absolute inset-0 -z-[1] scale-110 rounded-[inherit] bg-[linear-gradient(-30deg,var(--brand),transparent,var(--arc))] opacity-30 blur-[32px]" />
      </div>
      <div className="relative z-[1] rounded-[inherit]">{children}</div>
    </div>
  )
}
