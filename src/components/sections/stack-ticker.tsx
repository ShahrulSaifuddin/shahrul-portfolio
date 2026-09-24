import * as React from 'react'

import { VelocityMarquee } from '@/components/fx/velocity-marquee'

const PRIMARY = ['React Native', 'Laravel', 'Node.js', 'React 19', 'TypeScript', 'OCPP 1.6 / 2.0']
const SECONDARY = [
  'Stripe',
  'SenangPay',
  'S-Pay Global',
  'Finexus',
  'LHDN MyInvois',
  'Firebase Cloud Messaging',
  'Pusher',
  'MySQL',
  'GitHub Actions',
  'Nginx',
  'PM2',
]

function Sep() {
  return <span className="mx-6 inline-block text-brand sm:mx-10">⚡</span>
}

/**
 * The band between the hero and About: two counter-running rows of the stack
 * whose speed and lean follow how fast you scroll. Decorative (the real,
 * grouped list is in the Skills section).
 */
export function StackTicker() {
  return (
    <div className="relative border-y border-border bg-background py-8 sm:py-10">
      <VelocityMarquee
        velocity={40}
        className="space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        rowClassName="items-center"
        rows={[
          <React.Fragment key="primary">
            {PRIMARY.map((w) => (
              <span key={w} className="flex items-center">
                <span className="font-display-wide text-4xl font-extrabold uppercase sm:text-6xl">{w}</span>
                <Sep />
              </span>
            ))}
          </React.Fragment>,
          <React.Fragment key="secondary">
            {SECONDARY.map((w) => (
              <span key={w} className="flex items-center">
                <span className="font-display-wide text-outline text-3xl font-extrabold uppercase sm:text-5xl">
                  {w}
                </span>
                <span className="mx-5 inline-block size-2 rounded-full bg-border sm:mx-8" />
              </span>
            ))}
          </React.Fragment>,
        ]}
      />
    </div>
  )
}
