'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Atom, Disc3, MousePointerClick, Orbit, Smartphone } from 'lucide-react'

import { FORMATION, type FormationIndex } from '@/components/scene/formations'
import { swarmStore, useHeroShape, useSwarmActive } from '@/components/scene/swarm-store'
import { cn } from '@/lib/utils'

const SHAPES: readonly { f: FormationIndex; label: string; Icon: typeof Atom }[] = [
  { f: FORMATION.core, label: 'Core', Icon: Atom },
  { f: FORMATION.phone, label: 'Phone', Icon: Smartphone },
  { f: FORMATION.galaxy, label: 'Galaxy', Icon: Orbit },
  { f: FORMATION.portal, label: 'Portal', Icon: Disc3 },
]

/**
 * Lets the visitor play with the hero swarm: pick a shape and the particles
 * re-form. Only appears once the WebGL swarm is actually running.
 */
export function ShapeSwitcher({ className }: { className?: string }): React.ReactElement {
  const active = useSwarmActive()
  const current = useHeroShape()

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className={cn('flex flex-wrap items-center gap-3', className)}
        >
          <div
            role="group"
            aria-label="Reshape the particle swarm"
            className="border-border bg-background/50 flex items-center gap-1 rounded-full border p-1 backdrop-blur-md"
          >
            {SHAPES.map(({ f, label, Icon }) => {
              const on = current === f
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => swarmStore.setHeroShape(f)}
                  className={cn(
                    'focus-visible:ring-ring relative flex h-10 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    on ? 'text-brand-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {on ? (
                    <motion.span
                      layoutId="shape-pill"
                      className="bg-brand absolute inset-0 -z-10 rounded-full shadow-[0_0_24px_-4px_var(--brand)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <Icon aria-hidden="true" className="size-3.5" />
                  <span className="max-sm:sr-only">{label}</span>
                </button>
              )
            })}
          </div>
          <p className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            <MousePointerClick aria-hidden="true" className="text-brand size-3.5" />
            <span className="pointer-coarse:hidden">Click · hold · drag the swarm</span>
            <span className="hidden pointer-coarse:inline">Tap the swarm</span>
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
