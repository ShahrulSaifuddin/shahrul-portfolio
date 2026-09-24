'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand } from 'lucide-react'

import { ElectricBorder } from '@/components/fx/electric-border'
import { useBootDone } from '@/components/fx/use-boot-done'
import { paintBadgeArt, type BadgeArt, type BadgeData } from '@/components/fx/lanyard/badge-art'
import { cn } from '@/lib/utils'

// three.js + rapier (physics, WASM) only ever download on a desktop that
// qualifies, after the boot screen — never on phones, never for reduced motion.
const Lanyard = dynamic(() => import('@/components/fx/lanyard/lanyard'), { ssr: false })

interface BadgeState {
  art: BadgeArt | null
  ready: boolean
  setReady: () => void
}

const BadgeContext = React.createContext<BadgeState>({ art: null, ready: false, setReady: () => {} })

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Decides whether the 3D badge runs, paints its textures, and shares that
 * state between the 3D layer and the static portrait placeholder.
 */
export function HeroBadgeProvider({
  data,
  children,
}: {
  data: BadgeData
  children: React.ReactNode
}): React.ReactElement {
  const bootDone = useBootDone()
  const [art, setArt] = React.useState<BadgeArt | null>(null)
  const [ready, setReadyState] = React.useState(false)
  const setReady = React.useCallback(() => setReadyState(true), [])

  React.useEffect(() => {
    if (!bootDone) return
    const qualifies =
      window.matchMedia('(min-width: 1024px)').matches &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      webglAvailable()
    if (!qualifies) return

    let cancelled = false
    const run = () => {
      paintBadgeArt(data).then((result) => {
        if (!cancelled) setArt(result)
      })
    }
    const idle = window.requestIdleCallback?.(run, { timeout: 1200 })
    const timeout = idle === undefined ? window.setTimeout(run, 300) : undefined
    return () => {
      cancelled = true
      if (idle !== undefined) window.cancelIdleCallback?.(idle)
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [bootDone, data])

  const value = React.useMemo(() => ({ art, ready, setReady }), [art, ready, setReady])
  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>
}

/** The physics canvas: fills its (absolutely positioned) parent. */
export function HeroBadgeCanvas({ className }: { className?: string }): React.ReactElement | null {
  const { art, ready, setReady } = React.useContext(BadgeContext)
  if (!art) return null
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <Lanyard art={art} onReady={setReady} />
    </motion.div>
  )
}

/**
 * The portrait card. It is the LCP image (next/image, `priority`), the whole
 * visual on phones, and the placeholder on desktop until the 3D badge takes
 * over — at which point it fades out but stays in the DOM, so the portrait's
 * alt text remains available to assistive tech.
 */
export function HeroPortrait({
  name,
  initials,
  className,
}: {
  name: string
  initials: string
  className?: string
}): React.ReactElement {
  const { ready } = React.useContext(BadgeContext)
  const [errored, setErrored] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <motion.div
        animate={{ opacity: ready ? 0 : 1, scale: ready ? 0.96 : 1 }}
        transition={{ duration: 0.5 }}
        className={ready ? 'pointer-events-none' : undefined}
      >
        <ElectricBorder radius={28} chaos={0.08} speed={0.8}>
          <div className="relative aspect-[4/5] w-[15rem] overflow-hidden rounded-[28px] bg-card sm:w-[17rem] lg:w-[19rem]">
            {!errored ? (
              <Image
                src="/images/profile.jpg"
                alt={`Portrait of ${name}`}
                fill
                sizes="(min-width: 1024px) 304px, (min-width: 640px) 272px, 240px"
                priority
                className="object-cover object-top grayscale-[0.25]"
                onError={() => setErrored(true)}
              />
            ) : (
              <div
                role="img"
                aria-label={`Portrait of ${name}`}
                className="flex size-full items-center justify-center bg-brand-muted"
              >
                <span className="font-mono text-4xl font-semibold text-brand">{initials}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(0.145_0.012_255/0.85),transparent_45%)]" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-foreground/90 uppercase">
              <span className="flex items-center gap-1.5">
                <span className="animate-led size-1.5 rounded-full bg-brand" />
                Online
              </span>
              <span>KUL · MY</span>
            </div>
          </div>
        </ElectricBorder>
      </motion.div>

      <AnimatePresence>
        {ready ? (
          <motion.p
            aria-hidden="true"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="pointer-events-none absolute -bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[11px] tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase"
          >
            <Hand className="size-3.5 text-brand" />
            Grab the badge — throw it
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
