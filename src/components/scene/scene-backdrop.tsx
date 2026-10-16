'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

import { useBootDone } from '@/components/fx/use-boot-done'
import { swarmStore } from '@/components/scene/swarm-store'

// three.js only downloads once the loader has lifted, and never for
// reduced motion or without WebGL.
const SwarmScene = dynamic(() => import('@/components/scene/swarm-scene'), { ssr: false })

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

interface Budget {
  count: number
  maxDpr: number
}

function budget(): Budget {
  const phone = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const weak = cores <= 4 || memory <= 4
  const count = phone ? (weak ? 5500 : 8000) : weak ? 11000 : 18000
  return { count, maxDpr: phone ? 1.5 : 1.75 }
}

/**
 * The fixed WebGL layer behind every page. Mounted once in the root layout
 * and kept alive across navigations, so the swarm flies from one page's shape
 * into the next instead of reloading. Sits at `-z-10` in the root stacking
 * context: every section paints over it, and sections stay transparent
 * wherever the swarm should show through. A soft CSS glow holds the space
 * until (or instead of) the canvas.
 */
export function SceneBackdrop(): React.ReactElement {
  const pathname = usePathname()
  const bootDone = useBootDone()
  const { resolvedTheme } = useTheme()
  const [config, setConfig] = React.useState<Budget | null>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!bootDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !webglAvailable()) return
    setConfig(budget())
  }, [bootDone])

  // The hero's shape switcher only exists on the home page.
  React.useEffect(() => {
    swarmStore.setActive(ready && pathname === '/')
  }, [ready, pathname])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute top-[18%] right-[-10%] size-[70vmin] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] transition-opacity duration-[1500ms] max-md:top-[2%] max-md:right-[-25%] max-md:size-[110vmin]"
        style={{ opacity: ready ? 0.35 : 1 }}
      />
      {config ? (
        <div className="absolute inset-0 transition-opacity duration-[1200ms]" style={{ opacity: ready ? 1 : 0 }}>
          <SwarmScene
            count={config.count}
            maxDpr={config.maxDpr}
            light={resolvedTheme === 'light'}
            pathname={pathname}
            onReady={() => setReady(true)}
          />
        </div>
      ) : null}
      {/* Keeps copy legible where it overlaps the swarm. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_130%_100%_at_50%_45%,transparent_62%,var(--background)_100%)] opacity-60" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
