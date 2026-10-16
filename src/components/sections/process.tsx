'use client'

import * as React from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import { Container } from '@/components/layout/container'
import { SectionHeader } from '@/components/layout/section-header'
import { processSteps } from '@/lib/data/services'
import { cn } from '@/lib/utils'

function Step({
  step,
  index,
  progress,
  total,
}: {
  step: (typeof processSteps)[number]
  index: number
  progress: MotionValue<number>
  total: number
}) {
  const at = index / (total - 1 || 1)
  const [lit, setLit] = React.useState(false)
  React.useEffect(() => progress.on('change', (v) => setLit(v >= at - 0.02)), [progress, at])
  const reduce = useReducedMotion()
  // Each step swings in on its own hinge as the wire's charge reaches it.
  const on = reduce || lit
  const lift = useTransform(progress, [at - 0.25, at], [40, 0])
  const rotateY = useTransform(progress, [at - 0.25, at], [-28, 0])
  const fade = useTransform(progress, [at - 0.3, at - 0.02], [0.25, 1])

  return (
    <motion.li
      style={reduce ? undefined : { y: lift, rotateY, opacity: fade }}
      className="relative pl-16 lg:pt-16 lg:pl-0"
    >
      <span
        aria-hidden="true"
        className={cn(
          'bg-background absolute top-0 left-0 flex size-11 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold transition-all duration-500',
          on
            ? 'border-brand text-brand shadow-[0_0_24px_-2px_var(--brand)]'
            : 'border-border text-muted-foreground'
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="font-display-wide text-2xl font-bold">{step.title}</h3>
      <p className="text-muted-foreground mt-3 max-w-[34ch] leading-relaxed">{step.body}</p>
    </motion.li>
  )
}

/** How an engagement runs: four steps on a wire that charges as you scroll. */
export function Process(): React.ReactElement {
  const ref = React.useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  return (
    <section
      id="process"
      data-hud="Process"
      aria-labelledby="process-heading"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      <Container>
        <SectionHeader
          id="process"
          index="04"
          eyebrow="How it works"
          title="From first call to launch day."
          accent={['launch']}
          description="Clear steps, a working preview the whole way through, and no surprises on the invoice."
        />
        <ol ref={ref} className="relative grid gap-12 [perspective:1200px] lg:grid-cols-4 lg:gap-8">
          {/* The wire: vertical on phones, horizontal on desktop. */}
          <span
            aria-hidden="true"
            className="bg-border absolute top-0 bottom-0 left-[21px] w-px lg:top-[21px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
          />
          <motion.span
            aria-hidden="true"
            className="bg-brand absolute top-0 bottom-0 left-[21px] w-px origin-top shadow-[0_0_12px_var(--brand)] lg:hidden"
            style={{ scaleY: reduce ? 1 : progress }}
          />
          <motion.span
            aria-hidden="true"
            className="bg-brand absolute top-[21px] right-0 left-0 hidden h-px origin-left shadow-[0_0_12px_var(--brand)] lg:block"
            style={{ scaleX: reduce ? 1 : progress }}
          />
          {processSteps.map((step, i) => (
            <Step
              key={step.title}
              step={step}
              index={i}
              progress={progress}
              total={processSteps.length}
            />
          ))}
        </ol>
      </Container>
    </section>
  )
}
