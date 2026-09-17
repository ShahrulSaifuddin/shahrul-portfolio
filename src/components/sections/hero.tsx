import Link from 'next/link'
import { ArrowDown, Download, FolderGit2, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { MetricRail } from '@/components/layout/metric-rail'
import { Reveal } from '@/components/motion/reveal'
import { ProfileAvatar } from '@/components/profile-avatar'
import { heroMetrics, profile } from '@/lib/data/profile'

// Derived, not invented: the first sentence of the verbatim profile summary,
// used as a short hero positioning line.
const [heroPositioningLine] = profile.summary.split(/(?<=\.)\s+/)

/**
 * Server component. The only interactive leaves are `Reveal` (entrance
 * animation) and `ProfileAvatar` (image-error fallback) — both client
 * components already, so no `'use client'` is needed here.
 */
export function Hero() {
  return (
    <section aria-label="Introduction" className="relative overflow-hidden">
      {/* Decorative ambient gradient — the one permitted flourish. Pure CSS,
          opacity-only animation, disabled under reduced motion, and behind
          the text so it never delays LCP paint. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="hero-ambient-gradient absolute inset-0" />
        <style>{`
          .hero-ambient-gradient {
            background: radial-gradient(
              680px circle at 22% 18%,
              color-mix(in oklch, var(--brand) 14%, transparent),
              transparent 62%
            );
            animation: hero-ambient-drift 14s ease-in-out infinite;
          }
          @keyframes hero-ambient-drift {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-ambient-gradient { animation: none; opacity: 0.7; }
          }
        `}</style>
      </div>

      <Container className="py-20 sm:py-28 lg:py-32">
        <Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                {profile.displayName}
              </h1>
              <p className="mt-4 text-lg font-medium text-muted-foreground sm:text-xl">
                {profile.tagline}
              </p>
              <p className="mt-6 max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                {heroPositioningLine}
              </p>

              <div className="mt-10">
                {/*
                  Deliberately NOT `countUp`. These are factual claims about a
                  person's career, and counting up from 0 means that for the
                  first ~quarter of the animation the hero reads "0 Products
                  live on App Store & Google Play" — briefly false, and the
                  four numerals visibly desync because each cell animates on
                  its own timer. For single-digit values (5, 2, 4) the motion
                  is imperceptible anyway, so it bought nothing and cost
                  accuracy. The numbers fade in with the section instead.
                  `MetricRail` keeps the `countUp` capability for any future
                  use where a large number genuinely benefits from it.
                */}
                <MetricRail metrics={heroMetrics} />
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/projects">
                    <FolderGit2 aria-hidden="true" />
                    View Projects
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a
                    href={profile.resumeUrl}
                    download
                    aria-label="Download resume (PDF)"
                  >
                    <Download aria-hidden="true" />
                    Download Resume
                  </a>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/contact">
                    <Mail aria-hidden="true" />
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </div>

            <ProfileAvatar
              size={176}
              initials={profile.avatarInitials}
              name={profile.displayName}
              className="mx-auto lg:mx-0"
            />
          </div>
        </Reveal>
      </Container>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 flex justify-center motion-reduce:hidden"
      >
        <ArrowDown className="size-5 animate-bounce text-muted-foreground" />
      </div>
    </section>
  )
}
