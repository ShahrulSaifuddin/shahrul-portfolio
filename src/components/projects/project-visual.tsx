'use client'

import * as React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Bot, KeyRound, Mail, ShieldCheck, Zap } from 'lucide-react'

import type { ProjectSlug } from '@/lib/types'

/**
 * One small, live "instrument" per featured project, drawn only from facts in
 * the data layer (protocol versions, Lighthouse scores, catalogue size, auth
 * methods). Decorative: `aria-hidden`, since the same facts are in the text.
 */
export function ProjectVisual({ slug }: { slug: ProjectSlug }): React.ReactElement | null {
  switch (slug) {
    case 'fastev':
      return <ChargeGauge />
    case 'karuna-growth-suite':
      return <LighthouseRings />
    case 'ctapps-digital':
      return <CatalogueGrid />
    default:
      return null
  }
}

function Frame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div
      aria-hidden="true"
      className="bg-grid relative flex size-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-background/60 px-4 pt-6 pb-12"
    >
      {children}
      <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {caption}
      </span>
    </div>
  )
}

/** FastEV: a charge-point session dial sweeping from empty to full. */
function ChargeGauge() {
  const R = 84
  const C = 2 * Math.PI * R
  return (
    <Frame caption="Charge session · simulated">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="size-52 -rotate-90 sm:size-60">
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            className="gauge-sweep"
            style={{ ['--c' as string]: C, filter: 'drop-shadow(0 0 8px var(--brand))' }}
          />
          {Array.from({ length: 40 }).map((_, i) => {
            const a = (i / 40) * Math.PI * 2
            // Rounded: server and browser Math.cos can differ in the last
            // float digit, which is a hydration mismatch on the attribute.
            const p = (r: number, f: (x: number) => number) => (100 + f(a) * r).toFixed(2)
            return (
              <line
                key={i}
                x1={p(64, Math.cos)}
                y1={p(64, Math.sin)}
                x2={p(i % 5 ? 68 : 72, Math.cos)}
                y2={p(i % 5 ? 68 : 72, Math.sin)}
                stroke="var(--muted-foreground)"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Zap className="animate-led size-6 text-brand" />
          <span className="font-display-wide mt-1 text-2xl font-bold">OCPP</span>
          <span className="font-mono text-xs text-muted-foreground">1.6 / 2.0</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        <span className="rounded-full border border-border px-2 py-1">per kWh</span>
        <span className="rounded-full border border-border px-2 py-1">per minute</span>
        <span className="rounded-full border border-brand/50 px-2 py-1 text-brand">prepaid</span>
      </div>
    </Frame>
  )
}

/** Karuna Growth Suite: the four Lighthouse category scores as dials. */
function LighthouseRings() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const scores = [
    { label: 'Perf', value: 90, text: '90+' },
    { label: 'A11y', value: 100, text: '100' },
    { label: 'Best pr.', value: 100, text: '100' },
    { label: 'SEO', value: 100, text: '100' },
  ]
  const R = 30
  const C = 2 * Math.PI * R
  return (
    <Frame caption="karunaventure.co · lighthouse">
      <div ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
        {scores.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center gap-2">
            <div className="relative size-20">
              <svg viewBox="0 0 80 80" className="size-full -rotate-90">
                <circle cx="40" cy="40" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: reduce ? C * (1 - s.value / 100) : C }}
                  animate={inView ? { strokeDashoffset: C * (1 - s.value / 100) } : undefined}
                  transition={{ duration: 1.4, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold">
                {s.text}
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        35 routes · prerendered static HTML
      </p>
    </Frame>
  )
}

/** CTApps Digital: the 8-product catalogue, three auth methods, an LLM assistant. */
function CatalogueGrid() {
  return (
    <Frame caption="8 products · 3 auth methods">
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="catalogue-tile size-12 rounded-lg border border-border bg-card sm:size-14"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase">
        <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          <Mail className="size-3" /> Email
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          <ShieldCheck className="size-3" /> Google OAuth
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          <KeyRound className="size-3" /> OTP
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full border border-brand/40 bg-brand-muted px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-brand uppercase">
        <Bot className="size-3.5" />
        Product-grounded assistant
        <span className="typing-dots" />
      </div>
    </Frame>
  )
}
