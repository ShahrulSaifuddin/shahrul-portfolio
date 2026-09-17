import { ImageResponse } from 'next/og'

import { profile } from '@/lib/data/profile'
import { siteConfig } from '@/lib/site'

// Deliberately NOT `runtime = 'edge'`. On the Node.js runtime Next prerenders
// this card once at build time (route shows as `○` static) instead of
// rendering it on every request (`ƒ`), which also clears the build's
// "edge runtime ... disables static generation" warning. `next/og` supports
// the Node runtime, and the self-hosted CloudPanel/Nginx/PM2 target runs
// `next start` under Node — so static is both faster and more portable here.

export const alt = `${siteConfig.name} — ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Social share card, prerendered at build time via `next/og`.
 *
 * Colors below are sRGB conversions of the dark-theme brand tokens defined
 * in `src/app/globals.css` (`ImageResponse` cannot parse `oklch()`):
 *   --background (dark) oklch(0.165 0.004 285) -> #0e0e10
 *   --card       (dark) oklch(0.205 0.005 285) -> #171719
 *   --primary    (dark) oklch(0.76  0.13  168) -> #48cba1  (brand teal)
 *   --foreground (dark) oklch(0.955 0.002 285) -> #f0f0f1
 *   --muted-foreground (dark) oklch(0.735 0.008 285) -> #a8a9ae
 */
export default async function OpengraphImage() {
  const BG = '#0e0e10'
  const CARD = '#171719'
  const TEAL = '#48cba1'
  const INK = '#f0f0f1'
  const MUTED = '#a8a9ae'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: TEAL,
              marginRight: 16,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: MUTED,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Portfolio
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 76,
              fontWeight: 600,
              color: INK,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {profile.displayName}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 34,
              color: TEAL,
              fontWeight: 500,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${CARD}`,
            paddingTop: 32,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: MUTED }}>{profile.location}</div>
          <div style={{ display: 'flex', fontSize: 26, color: MUTED }}>
            {siteConfig.url.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
