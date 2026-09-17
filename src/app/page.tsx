import type { Metadata } from 'next'

import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { Skills } from '@/components/sections/skills'
import { Experience } from '@/components/sections/experience'
import { Education } from '@/components/sections/education'
import { ContactCta } from '@/components/sections/contact-cta'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
      <Experience />
      <Education />
      <ContactCta />
    </>
  )
}
