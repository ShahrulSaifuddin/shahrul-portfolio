import type { Metadata } from 'next'

import { Hero } from '@/components/sections/hero'
import { StackTicker } from '@/components/sections/stack-ticker'
import { Services } from '@/components/sections/services'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { About } from '@/components/sections/about'
import { Process } from '@/components/sections/process'
import { Skills } from '@/components/sections/skills'
import { Experience } from '@/components/sections/experience'
import { Education } from '@/components/sections/education'
import { ContactCta } from '@/components/sections/contact-cta'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

/**
 * Ordered for a client deciding whether to hire: what I build → proof →
 * who I am → how we'd work → depth (stack, career, training) → the ask.
 * Each section's id is a waypoint for the particle swarm (scene-anchors.ts).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <StackTicker />
      <Services />
      <FeaturedProjects />
      <About />
      <Process />
      <Skills />
      <Experience />
      <Education />
      <ContactCta />
    </>
  )
}
