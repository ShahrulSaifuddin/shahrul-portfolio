import { FadeIn } from '@/components/home/fade-in'

/**
 * Inner-page opener in the home hero's style: a full-bleed gradient heading
 * with a small uppercase line and an optional aside beneath it.
 */
export function PageHero({
  id,
  title,
  intro,
  aside,
  fontSize = 'clamp(3.5rem, 18vw, 22rem)',
}: {
  id: string
  title: string
  intro: string
  aside?: React.ReactNode
  fontSize?: string
}): React.ReactElement {
  return (
    <section className="px-6 pt-6 pb-24 sm:pt-4 sm:pb-28 md:px-10 md:pb-32">
      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading w-full text-center leading-none font-black tracking-tight whitespace-nowrap uppercase"
          style={{ fontSize }}
        >
          <span id={`${id}-heading`}>{title}</span>
        </FadeIn>
      </div>
      <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[340px] leading-snug font-light tracking-wide text-[#D7E2EA] uppercase"
          style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.35rem)' }}
        >
          {intro}
        </FadeIn>
        {aside ? (
          <FadeIn delay={0.5} y={20}>
            {aside}
          </FadeIn>
        ) : null}
      </div>
    </section>
  )
}

/** White, round-topped panel — the prompt's Services surface. */
export function LightPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}): React.ReactElement {
  return (
    <section
      className={`rounded-t-[40px] bg-white px-5 pt-16 pb-32 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:pt-20 md:rounded-t-[60px] md:px-10 md:pt-24 md:pb-40 ${className ?? ''}`}
    >
      {children}
    </section>
  )
}
