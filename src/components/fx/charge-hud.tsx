'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'

import { getLenis } from '@/components/fx/smooth-scroll'
import { cn } from '@/lib/utils'

interface HudSection {
  id: string
  label: string
}

/**
 * Scroll progress re-imagined as a state of charge. Bottom-left: a battery
 * readout (percent + the section you're in). Left edge on wide screens: a
 * "circuit rail" — one node per `[data-hud]` section, lit as the current
 * reaches it, each node a jump button. Both read the real window scroll, so
 * they stay correct with or without Lenis.
 */
export function ChargeHud(): React.ReactElement {
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  const fillHeight = useTransform(smooth, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`)
  const [percent, setPercent] = React.useState(0)
  const [sections, setSections] = React.useState<HudSection[]>([])
  const [active, setActive] = React.useState<string | null>(null)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPercent(Math.round(Math.max(0, Math.min(1, v)) * 100))
  })

  // Re-scan sections on every route change.
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-hud]'))
    setSections(els.map((el) => ({ id: el.id, label: el.dataset.hud ?? el.id })))
    setActive(els[0]?.id ?? null)
    setPercent(Math.round(scrollYProgress.get() * 100))

    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).id)
        }
      },
      // A thin band across the middle of the viewport: whichever section
      // crosses it is "the one you're reading".
      { rootMargin: '-45% 0px -54% 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname, scrollYProgress])

  const activeLabel = sections.find((s) => s.id === active)?.label
  const full = percent >= 99

  function jump(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: -24 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Battery readout */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-3 rounded-full border border-border/80 bg-background/70 py-2 pr-4 pl-2.5 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase shadow-lg backdrop-blur-md sm:flex"
      >
        <span className="relative flex h-3.5 w-7 items-center rounded-[4px] border border-foreground/40 p-[2px]">
          <span className="absolute top-1/2 -right-[4px] h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-foreground/40" />
          <span
            className={cn(
              'h-full rounded-[2px] transition-[width] duration-150',
              full ? 'bg-brand shadow-[0_0_10px_var(--brand)]' : 'bg-brand/80'
            )}
            style={{ width: `${Math.max(6, percent)}%` }}
          />
        </span>
        <span className={cn('tabular-nums', full ? 'text-brand' : 'text-foreground')}>
          {String(percent).padStart(3, ' ')}%
        </span>
        {activeLabel ? (
          <>
            <span className="h-3 w-px bg-border" />
            <span className="max-w-[18ch] truncate">{full ? 'Fully charged' : activeLabel}</span>
          </>
        ) : null}
      </div>

      {/* Circuit rail */}
      {sections.length > 1 ? (
        <nav
          aria-label="Section rail"
          className={cn(
            'fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 transition-opacity duration-500 xl:block',
            // The pinned project gallery runs edge to edge; step aside.
            active === 'projects' && 'pointer-events-none opacity-0'
          )}
        >
          <div className="relative flex flex-col gap-7 py-2">
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[5px] w-px bg-border"
            />
            <motion.span
              aria-hidden="true"
              className="absolute top-0 left-[5px] w-px origin-top bg-brand shadow-[0_0_8px_var(--brand)]"
              style={{ height: fillHeight }}
            />
            {sections.map((section, index) => {
              const isActive = section.id === active
              const activeIndex = sections.findIndex((s) => s.id === active)
              const lit = index <= activeIndex
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jump(section.id)}
                  aria-label={`Jump to ${section.label}`}
                  aria-current={isActive ? 'location' : undefined}
                  className="group relative flex items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'relative z-10 size-[11px] rounded-full border transition-all duration-300',
                      lit
                        ? 'border-brand bg-brand shadow-[0_0_10px_var(--brand)]'
                        : 'border-border bg-background group-hover:border-foreground/50',
                      isActive && 'scale-125'
                    )}
                  />
                  <span
                    className={cn(
                      'rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap uppercase backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                      // Wide screens have room beside the content column
                      // for the active label; narrower ones reveal on hover.
                      isActive
                        ? 'text-foreground opacity-0 min-[1600px]:translate-x-0 min-[1600px]:opacity-100'
                        : '-translate-x-1 text-muted-foreground opacity-0'
                    )}
                  >
                    {section.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      ) : null}
    </>
  )
}
