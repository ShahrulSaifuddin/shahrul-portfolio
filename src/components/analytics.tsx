import Script from 'next/script'

/**
 * Privacy-first analytics mount (brief: "Additional Features" #10 — no
 * Google Analytics). Deliberately vendor-neutral: `src` + `data-domain` is
 * the script shape used by cookieless, self-hostable analytics services
 * such as Plausible or Umami, not any one vendor hardcoded here. Do NOT add
 * Google Analytics, gtag.js, or any cookie-based tracker.
 *
 * Off by default: both env vars are optional and unset in this repo, so by
 * default this renders `null` and the site loads zero third-party scripts.
 * A deployer who wants analytics sets both `NEXT_PUBLIC_ANALYTICS_SRC` and
 * `NEXT_PUBLIC_ANALYTICS_DOMAIN` (see `.env.example`).
 *
 * Server Component: it only reads env vars and renders a `<Script>`, so no
 * `'use client'` is needed.
 */
export function Analytics(): React.ReactElement | null {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN

  if (!src || !domain) {
    return null
  }

  return <Script src={src} data-domain={domain} strategy="afterInteractive" defer />
}
