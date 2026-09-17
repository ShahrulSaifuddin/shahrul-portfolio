# Shahrul Saifuddin — Portfolio

Personal portfolio site for Shahrul Saifuddin, a full-stack engineer. Built with the Next.js App
Router, TypeScript, Tailwind CSS v4, shadcn/ui and Framer Motion. Content (profile, projects,
skills, experience, education, the performance checklist) lives in a typed data layer under
`src/lib/data/`, not scattered across components.

## Stack

- **Next.js 15.5.25** (App Router, React Server Components)
- **React 19.1.0**
- **TypeScript 5.9.3**
- **Tailwind CSS v4.3.3** — CSS-first configuration. There is no `tailwind.config.ts`; every design
  token (colors, spacing, radii) is defined as CSS custom properties directly in
  `src/app/globals.css` (`:root`, `.dark`, and an `@theme inline` block) and consumed via ordinary
  Tailwind utility classes.
- **shadcn/ui** primitives (`radix-nova` style) on top of the consolidated `radix-ui` package —
  installed under `src/components/ui/`: button, card, badge, input, textarea, label, sheet,
  dialog, tabs, skeleton, separator, tooltip, accordion, progress, sonner.
- **Framer Motion 13.4.0** for section entrances, hover states and the animated nav indicator —
  every animation respects `prefers-reduced-motion` via `useReducedMotion()`.
- **Resend** for contact-form email delivery, **Zod** + **react-hook-form** for validation.
- **next/og** (`ImageResponse`) for the generated Open Graph image.

## Project structure

```
src/
  app/
    page.tsx                  Home: hero, about, featured projects, skills, experience, education
    projects/page.tsx         All projects, with tech filter + search
    projects/[slug]/page.tsx  Full case study per project
    performance/page.tsx      19-item optimization checklist with live demos
    contact/page.tsx          Contact form
    api/contact/route.ts      POST handler: validates, rate-limits, sends via Resend
    layout.tsx                Root layout: fonts, theme provider, nav/footer, metadata, JSON-LD
    globals.css                Design tokens (Tailwind v4 CSS-first)
    sitemap.ts                 Generated sitemap (static routes + one entry per project slug)
    robots.ts                  robots.txt rules
    opengraph-image.tsx        Generated 1200x630 social share card
  components/
    layout/                   Navigation, footer, mobile nav, scroll progress, back-to-top, icons
    sections/                 Home page sections (hero, about, skills, experience, education, ...)
    projects/                 Project card, tech filter, debounce hook
    contact/                  Contact form
    performance/              Checklist + live demo components (debounce, skeleton, pagination, ...)
    motion/                   Shared `Reveal` scroll-entrance wrapper
    providers/                Theme provider
    ui/                       shadcn/ui primitives (read-only, do not hand-edit)
  lib/
    data/                     Typed content: profile, projects, skills, experience, education, performance
    site.ts                   Site-wide config: name, description, canonical URL, nav, social links
    types.ts                  Shared TypeScript types for the content layer
    email.ts                  Resend integration for the contact form
    rate-limit.ts             In-memory rate limiter for /api/contact
    validation.ts             Zod schema for the contact form
    motion.ts                 Shared Framer Motion easing/duration constants
public/
  images/profile.jpg                        Profile photo
  Shahrul_Saifuddin_Resume_2026.pdf          Downloadable resume
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Start the production server from a prior build |
| `npm run lint` | Run ESLint (`next lint`) |
| `npm run typecheck` | Run the TypeScript compiler with `--noEmit` |
| `npm run format` | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Run Playwright tests in UI mode |
| `npm run analyze` | Production build with the bundle analyzer enabled (`ANALYZE=true`) |

## Environment variables

See [`.env.example`](./.env.example) for the full, commented list. In short:

| Variable | Required | Effect if unset |
|---|---|---|
| `RESEND_API_KEY` | No, but needed for the contact form to actually send email | The site still builds and runs. `/api/contact` returns HTTP 503 ("Email delivery is not configured on this deployment yet.") instead of sending, and logs the submission to the server console outside production. |
| `CONTACT_FROM_EMAIL` | No | Falls back to Resend's shared sandbox sender, `Portfolio Contact <onboarding@resend.dev>`. |
| `NEXT_PUBLIC_ANALYTICS_SRC` | No | Analytics mount (`src/components/analytics.tsx`) renders nothing and no third-party script loads. |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | No | Same as above — both must be set together or analytics stays disabled. |

`NEXT_PUBLIC_ANALYTICS_SRC` and `NEXT_PUBLIC_ANALYTICS_DOMAIN` are `NEXT_PUBLIC_*` and are therefore
inlined into the client bundle and visible to anyone viewing the site — that's fine here since
neither is a secret. They enable a privacy-first, cookieless analytics script (no Google Analytics;
see `.env.example` for details) and are both optional: leaving either unset disables analytics
entirely, with zero third-party scripts loaded. Never put an actual secret behind a `NEXT_PUBLIC_`
name.

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Set `RESEND_API_KEY` and (optionally) `CONTACT_FROM_EMAIL` under Project Settings → Environment
   Variables.
3. Deploy. The default build command (`next build`) and output are used as-is; no extra
   configuration is required.

### Self-hosted (CloudPanel / Nginx / PM2 on a VPS)

This mirrors the deployment pattern already used for the author's other production sites
(`karunaventure.co`):

1. On the server: `git pull`, then `npm install` and `npm run build`.
2. Run the production server with PM2: `pm2 start npm --name shahrul-portfolio -- start` (or a PM2
   ecosystem file that sets `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` in `env`). `npm start` runs
   `next start`, which listens on port 3000 by default.
3. In CloudPanel, create a reverse-proxy vhost for the domain pointing at `127.0.0.1:3000`, and
   issue a Let's Encrypt certificate through CloudPanel's built-in tooling.
4. Reload PM2 (`pm2 reload shahrul-portfolio`) on every deploy so the new build is served without
   downtime.

### Before you deploy — checklist

- [ ] Change `siteConfig.url` in `src/lib/site.ts` from the placeholder
      (`https://shahrulsaifuddin.com`) to the real production domain. It drives canonical URLs,
      Open Graph/Twitter metadata, JSON-LD, `sitemap.ts` and `robots.ts`.
- [ ] Set `RESEND_API_KEY` (and optionally `CONTACT_FROM_EMAIL`) on the host, or the contact form
      will keep returning a 503 in production.
- [ ] Verify the sending domain in Resend if using a custom `CONTACT_FROM_EMAIL`.
- [ ] If you plan to add a Content-Security-Policy header, test it against the real deployment
      first — `next.config.ts` intentionally ships without one (see the comment there).

## Notes

- No performance audit (Lighthouse or otherwise) has been run against this site; the `100`
  Lighthouse figure that appears in the hero metrics and the FastEV/Karuna Growth Suite content
  is a verified, historical score for a separate production site (`karunaventure.co`), not a claim
  about this portfolio.
- There are no project screenshots; project cards are typographic/metric-led by design, not
  image-led — no screenshots were available to use.
