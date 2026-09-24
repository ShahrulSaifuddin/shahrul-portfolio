import type { Metadata } from 'next'
import { Geist_Mono, Kanit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { SiteNav } from '@/components/layout/site-nav'
import { Footer } from '@/components/layout/footer'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { BackToTop } from '@/components/layout/back-to-top'
import { HideOnHome } from '@/components/layout/hide-on-home'
import { Analytics } from '@/components/analytics'
import { siteConfig } from '@/lib/site'
import { profile } from '@/lib/data/profile'

const kanit = Kanit({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // No explicit `images` here on purpose: `src/app/opengraph-image.tsx` uses
  // Next's file-convention metadata API, which auto-generates and injects
  // the correct `og:image` / `twitter:image` tags (with size and type) for
  // every page. Setting `images` here would either point at the removed
  // static `/og-image.png` (which never existed and 404'd every share) or
  // duplicate what the file convention already emits.
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.displayName,
  jobTitle: profile.title,
  url: siteConfig.url,
  email: profile.email,
  sameAs: [profile.github],
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.location,
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Universiti Teknologi MARA (UiTM)',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${kanit.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <a
              href="#main"
              className="focus:bg-foreground focus:text-background focus:ring-ring focus:ring-offset-background sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Skip to content
            </a>
            <HideOnHome>
              <ScrollProgress />
              <SiteNav />
            </HideOnHome>
            {/*
              `tabIndex={-1}` is what makes the skip link actually work. A plain
              `<main id="main">` is not a focusable element, so activating
              `href="#main"` only moves the scroll position — `document.activeElement`
              stays on the link and the next Tab drops the user right back into the
              header, which is precisely what the skip link exists to avoid.
              `-1` makes it programmatically focusable without adding a tab stop.
              Caught by an E2E keyboard test; it is invisible to code review.
            */}
            <main id="main" tabIndex={-1} className="focus:outline-none">
              {children}
            </main>
            <Footer />
            <BackToTop />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
