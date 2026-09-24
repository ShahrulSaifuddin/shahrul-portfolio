import Link from 'next/link'
import { FadeIn } from '@/components/home/fade-in'

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
] as const

/** The four-link top bar shared by the home hero and every inner page. */
export function SiteNav(): React.ReactElement {
  return (
    <FadeIn as="nav" delay={0} y={-20} className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="rounded-sm text-sm font-medium tracking-wider text-[#D7E2EA] uppercase transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7E2EA] md:text-lg lg:text-[1.4rem]"
        >
          {link.label}
        </Link>
      ))}
    </FadeIn>
  )
}
