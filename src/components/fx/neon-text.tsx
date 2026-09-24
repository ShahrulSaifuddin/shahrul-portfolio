import * as React from 'react'

/**
 * Deterministic pseudo-random per character, so server and client render the
 * same delays (Math.random here would be a hydration mismatch).
 */
function delayFor(line: number, index: number): number {
  const seed = Math.sin((line + 1) * 91.7 + index * 12.9898) * 43758.5453
  const jitter = seed - Math.floor(seed)
  return Math.round(line * 180 + index * 55 + jitter * 260)
}

/**
 * Oversized type that "ignites" like neon tubes: every glyph starts as an
 * unlit outline and flickers on at its own moment when the boot screen lifts.
 * Pure CSS (see `.neon-char` in globals.css) — server-rendered, lit by
 * default, so no-JS and reduced-motion visitors simply see the lit name.
 *
 * Decorative: it renders `aria-hidden`. The caller supplies the real,
 * accessible text alongside it (e.g. an sr-only span in the <h1>).
 */
export function NeonText({
  lines,
  className,
  lineClassName,
}: {
  lines: readonly { text: string; className?: string; style?: React.CSSProperties }[]
  className?: string
  lineClassName?: string
}): React.ReactElement {
  return (
    <span aria-hidden="true" className={className}>
      {lines.map((line, li) => (
        <span key={li} className={`block ${lineClassName ?? ''} ${line.className ?? ''}`} style={line.style}>
          {Array.from(line.text).map((char, ci) =>
            char === ' ' ? (
              <span key={ci}>&nbsp;</span>
            ) : (
              <span
                key={ci}
                className="neon-char"
                style={{ '--d': `${delayFor(li, ci)}ms` } as React.CSSProperties}
              >
                {char}
              </span>
            )
          )}
        </span>
      ))}
    </span>
  )
}
