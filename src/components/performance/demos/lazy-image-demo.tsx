'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Tiny inline SVG placeholder as a `data:` URI — no files under `public/`
 * exist for this demo, so nothing references `/images/*`.
 */
function placeholderDataUri(label: string, hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="hsl(${hue} 45% 88%)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace,ui-monospace" font-size="16" fill="hsl(${hue} 35% 28%)">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const EAGER_SRC = placeholderDataUri('eager', 168)
const LAZY_SRC = placeholderDataUri('lazy', 262)

/**
 * Two explicitly-sized (320x200) placeholder images: one `loading="eager"`,
 * one `loading="lazy"` inside a scrollable panel. Both boxes reserve their
 * final dimensions up front, so painting either image causes zero layout
 * shift. An IntersectionObserver on the lazy image makes "entered viewport"
 * visible without needing devtools.
 */
export function LazyImageDemo() {
  const [lazyVisible, setLazyVisible] = useState(false)
  const lazyRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const node = lazyRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setLazyVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Both boxes reserve their final width/height up front, so neither image causes layout shift
        when it paints. Scroll the right panel to reveal the lazy image.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            loading=&quot;eager&quot;
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- deliberate <img> demo of the loading attribute, not app content */}
          <img
            src={EAGER_SRC}
            alt="Placeholder graphic labelled eager"
            width={320}
            height={200}
            loading="eager"
            className="h-auto w-full rounded-lg border border-border"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            loading=&quot;lazy&quot; — scroll to reveal
          </p>
          <div className="h-40 overflow-y-auto rounded-lg border border-dashed border-border p-2">
            <div className="pt-32">
              {/* eslint-disable-next-line @next/next/no-img-element -- deliberate <img> demo of the loading attribute, not app content */}
              <img
                ref={lazyRef}
                src={LAZY_SRC}
                alt="Placeholder graphic labelled lazy"
                width={320}
                height={200}
                loading="lazy"
                className="h-auto w-full rounded-lg border border-border"
              />
            </div>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
        lazy image entered viewport:{' '}
        <span className="text-foreground">{lazyVisible ? 'yes' : 'not yet'}</span>
      </p>
    </div>
  )
}
