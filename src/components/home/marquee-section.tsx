'use client'

import * as React from 'react'
import { skillCategories } from '@/lib/data/skills'

const [mobile, web, backend, integrations, devops] = skillCategories
const ROW_1_SKILLS = [...mobile.skills, ...web.skills]
const ROW_2_SKILLS = [...backend.skills, ...integrations.skills, ...devops.skills]

const ROW_1 = [...ROW_1_SKILLS, ...ROW_1_SKILLS, ...ROW_1_SKILLS]
const ROW_2 = [...ROW_2_SKILLS, ...ROW_2_SKILLS, ...ROW_2_SKILLS]

function Row({ skills, transform }: { skills: string[]; transform: string }): React.ReactElement {
  return (
    <div className="flex w-max gap-3" style={{ transform, willChange: 'transform' }}>
      {skills.map((skill, i) => (
        <div
          key={i}
          aria-hidden={i >= skills.length / 3}
          className="flex h-[110px] shrink-0 items-center rounded-2xl border border-[#D7E2EA]/15 bg-[#141414] px-10 sm:h-[140px] sm:px-14"
        >
          <span
            className="hero-heading font-semibold tracking-tight whitespace-nowrap uppercase"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.75rem)' }}
          >
            {skill}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Two rows of tech-stack tiles that slide in opposite directions as the page scrolls. */
export function MarqueeSection(): React.ReactElement {
  const ref = React.useRef<HTMLElement>(null)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const sectionTop = el.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={ref}
      aria-label="Tech stack"
      className="flex flex-col gap-3 bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40"
    >
      <Row skills={ROW_1} transform={`translateX(${offset - 200}px)`} />
      <Row skills={ROW_2} transform={`translateX(${-(offset - 200)}px)`} />
    </section>
  )
}
