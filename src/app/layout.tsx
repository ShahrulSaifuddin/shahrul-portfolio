import type { Metadata, Viewport } from 'next'
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { Analytics } from '@/components/analytics'
import { BOOT_INIT_SCRIPT, BootSequence } from '@/components/fx/boot-sequence'
import { ChargeHud } from '@/components/fx/charge-hud'
import { ClickSparks } from '@/components/fx/click-sparks'
import { CursorGlow } from '@/components/fx/cursor-glow'
import { SmoothScroll } from '@/components/fx/smooth-scroll'
import { siteConfig } from '@/lib/site'
import { profile } from '@/lib/data/profile'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

// Display face. The variable width axis is the point: headings run at its
// widest (125%), HUD labels can run condensed, from a single font file.
const archivo = Archivo({
  variable: '--font-display',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
})

// Italic accent words only.
const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0f1418',
}

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before first paint: decides whether the boot screen
            plays, so there is never a flash of the page before it. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${instrumentSerif.variable} antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              Skip to content
            </a>
            <BootSequence />
            <SmoothScroll />
            <Navigation />
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
            <ChargeHud />
            <BackToTop />
            <ClickSparks />
            <CursorGlow />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
