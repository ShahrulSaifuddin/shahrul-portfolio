# Content Brief — SINGLE SOURCE OF TRUTH

Extracted verbatim from `Shahrul_Saifuddin_Resume_2026.docx` by the foreman.

> **DO NOT INVENT, ROUND, EMBELLISH, OR "IMPROVE" ANY NUMBER OR CLAIM ON THIS PAGE.**
> Every metric here is a real, checkable claim about a real person's work. If a number you want is
> not on this page, it does not exist — leave it out. Do not write "50+ projects", "100k users",
> "99.9% uptime", or any other plausible-sounding filler. Fabricated credentials on a real person's
> job-seeking portfolio are the single worst failure mode of this build.

---

## Identity

| Field | Value |
|---|---|
| Full name | Shahrul Saifuddin Bin Ahmad Rosli |
| Display name | Shahrul Saifuddin |
| Title | Full-Stack Engineer |
| Tagline | Full-Stack Engineer · React Native · Laravel · Node.js |
| Location | Kuala Lumpur, Malaysia |
| Email | saifuddinshahrul@gmail.com |
| Phone | +60 17-275 0530 |
| GitHub | https://github.com/ShahrulSaifuddin |
| Resume file | `/Shahrul_Saifuddin_Resume_2026.pdf` (see "Assets" below) |

## Profile summary (verbatim — use as-is or tighten, never inflate)

> Full-stack engineer with 5 years shipping production mobile and web systems across EV charging,
> fintech and event ticketing, with two products live on the App Store and Google Play. Owns
> features end to end — React Native and React front ends, Laravel and Node.js APIs, payment
> gateway and hardware protocol integrations, and CI/CD onto Linux VPS infrastructure.

Headline stats for the hero metric rail (these four only):
- `5` years shipping production systems
- `2` products live on App Store & Google Play
- `4` payment / fiscal integrations shipped
- `100` Lighthouse Accessibility, Best Practices & SEO on karunaventure.co

---

## Projects

### 1. FastEV — slug `fastev`
- **Subtitle:** EV charging network
- **Status:** Live on the App Store & Google Play
- **Company:** Karuna Sarawak Enterprise Sdn Bhd
- **Period:** Aug 2024 – Present
- **Role:** Sole mobile developer; lead backend contributor
- **Link:** https://karunaventure.co/platforms/fastev
- **App Store / Google Play:** link to the karunaventure.co platform page above as the store
  redirect — direct store URLs were NOT supplied, so do not fabricate store URLs.
- **Metrics (exact):**
  - 450 of 494 commits on the React Native app
  - 42 screens, 5 Redux Toolkit slices
  - 402 of 830 commits on the Laravel 10 backend (three-developer team)
  - 90 API routes, 42 models
  - ~3× reduction in push-notification latency
- **Highlights (rewrite for the web, keep every fact):**
  - Integrated OCPP 1.6 / 2.0 charge-point hardware — remote start/stop commands plus live meter
    and status events — mapped onto prepaid billing priced per kWh or per minute.
  - Shipped four payment and fiscal integrations: SenangPay, S-Pay Global (including a bridged
    Android native module and an iOS deep-link return), Finexus card pre-authorisation, and
    LHDN MyInvois e-invoicing.
  - Delivered the Android 16 KB page-size migration ahead of the Google Play deadline:
    React Native 0.71 → 0.81, React 18 → 19, AGP 8.13, compileSdk 36, NDK 27.
  - Cut push-notification latency roughly 3× with FCM OAuth token caching and pooled multi-device
    delivery; made wallet billing safe against duplicate concurrent hardware events.
- **Tech:** React Native 0.81, Redux Toolkit, React Navigation, Laravel 10, PHP 8, MySQL,
  Firebase Cloud Messaging, OCPP 1.6/2.0, Kotlin, Swift

### 2. SD Engage — slug `sd-engage`
- **Subtitle:** Event ticketing platform
- **Status:** Live on the App Store & Google Play
- **Client:** Sarawak Digital Economy Corporation Berhad
- **Company:** Karuna Sarawak Enterprise Sdn Bhd
- **Period:** Aug 2024 – Present
- **Role:** Core engineer on a 15-developer platform
- **Links:** none supplied — do NOT fabricate store URLs. Omit link buttons for this project.
- **Metrics (exact):**
  - 413 commits
  - ~26 of 38 mobile API controllers owned
  - 15-developer platform
- **Highlights:**
  - Owned the Sanctum-authenticated REST API and the push and realtime layer serving the published
    iOS and Android clients.
  - Built mobile checkout and payments (Stripe PaymentIntents with webhooks, S-Pay Global),
    QR ticket check-in, business matching, 1:1 messaging and e-certificates.
  - Batched Expo push delivery and Pusher realtime events.
- **Tech:** React Native, Laravel, Sanctum, Stripe, S-Pay Global, Expo Push, Pusher, MySQL

### 3. Karuna Growth Suite — slug `karuna-growth-suite`
- **Subtitle:** Corporate web platform
- **Status:** Live in production
- **Period:** Aug 2024 – Present
- **Role:** Sole developer
- **Link:** https://karunaventure.co/
- **Metrics (exact):**
  - Lighthouse 100 Accessibility · 100 Best Practices · 100 SEO · 90+ Performance
  - 35 routes prerendered to static HTML
- **Highlights:**
  - Headless WordPress (WPGraphQL) + React 19 / Vite platform prerendered to static HTML across
    35 routes, letting non-technical staff manage every page without touching code.
  - Migrated the product off a low-code backend onto a self-built Express / SQLite API
    (JWT auth, bcrypt, rate limiting, SMTP) with zero call-site changes.
  - Shipped an admin CRM and GitHub Actions CI/CD to a CloudPanel / Nginx VPS with a
    PM2-managed API.
- **Tech:** React 19, Vite, WPGraphQL, Apollo Client, Tailwind CSS, Express, SQLite, JWT,
  GitHub Actions, CloudPanel, Nginx, PM2

### 4. CTApps Digital — slug `ctapps-digital`
- **Subtitle:** Commercial platform
- **Status:** Live in production
- **Period:** Aug 2024 – Present
- **Role:** Sole developer
- **Link:** https://ctappsdigital.com/
- **Metrics (exact):**
  - 8-product catalogue
  - 3 authentication methods (email, Google OAuth, OTP)
- **Highlights:**
  - Built the customer-facing platform and the admin inquiry dashboard.
  - Eight-product catalogue with gated lead capture and a product-grounded LLM assistant.
  - Full authentication: email, Google OAuth and OTP.
  - DPR-aware responsive image pipeline.
- **Tech:** React 18, Vite, Tailwind CSS, shadcn/ui, Radix UI, Express, LLM integration

**Featured on the home page:** FastEV, Karuna Growth Suite, CTApps Digital (3 of 4).
All four appear on `/projects`.

---

## Experience timeline

### Karuna Sarawak Enterprise Sdn Bhd — Aug 2024 – Present
- **Role:** Full-Stack Developer · Sarawak, Malaysia
- Delivers FastEV, SD Engage, Karuna Growth Suite and CTApps Digital (see Projects).

### Thunder Software (M) Sdn Bhd — Jul 2022 – Jul 2024
- **Role:** Software Engineer · Georgetown, Penang
- Led full-stack development of a MERN scheduling application (React, Node.js / Express, MongoDB),
  raising measured application performance from 55% to 95–100%.
- Ran Agile delivery in Jira, building custom workflow configurations and automations that
  streamlined releases across the team.

### Skymind CNS Sdn Bhd — Sep 2021 – May 2022
- **Role:** Junior AI Engineer · Georgetown, Penang
- Performed data annotation and validation testing for computer-vision training pipelines.
- Contributed as a hybrid mobile front-end engineer adapting web applications for mobile.

---

## Education & certifications

- **B.Eng (Hons) Electrical and Electronic Engineering** — Universiti Teknologi MARA (UiTM),
  Pulau Pinang · CGPA 3.70 / 4.00 · Mar 2016 – Jul 2019
  > NOTE: the build request said "UTM". The resume says **Universiti Teknologi MARA**, which is
  > UiTM, a different institution from Universiti Teknologi Malaysia. The resume wins. Use UiTM.
- **Certified Engineer in Computer Vision** — Skymind
- **Full Stack Web Development Bootcamp**

---

## Skills (verbatim groupings from the resume — keep these five categories)

- **Mobile** — React Native 0.81, React Navigation, Redux Toolkit, Reanimated, Firebase Cloud
  Messaging, Pusher, Vision Camera (QR), Google & Apple Sign-In, native module bridging
  (Kotlin / Swift), App Store & Google Play releases
- **Web** — React 19, TypeScript, Vite, Tailwind CSS, shadcn/Radix UI, Apollo Client & GraphQL,
  Framer Motion, React Query, static prerendering (SSG), Vue.js
- **Backend & Data** — Laravel 10, PHP 8, Node.js, Express, REST API design, Sanctum & JWT,
  Eloquent ORM, queued jobs & schedulers, MySQL, MongoDB, SQLite, Firebase
- **Integrations** — OCPP 1.6 / 2.0 (EV charging), Stripe, SenangPay, S-Pay Global, Finexus,
  LHDN MyInvois e-Invoicing, FCM & Expo Push, Twilio / Vonage, headless WordPress (WPGraphQL)
- **DevOps & Tools** — Git & GitHub, GitHub Actions CI/CD, CloudPanel, Nginx, PM2, Linux VPS,
  Gradle / AGP / NDK, CocoaPods, Jira, Agile & Scrum

**No proficiency percentages.** Do NOT render "React Native 95%" bars — self-assigned skill
percentages are meaningless and read as padding. Group and list them; that is the whole design.

---

## Assets

- **Profile photo:** `public/images/profile.jpg` — **EXISTS (foreman corrected 2026-09-17).**
  A square 111 KB JPEG headshot, ~1242×1242, plain light-grey background, subject in a dark suit.
  The owner had already dropped it into `public/images/` under the filename
  `profile picture.jpeg`; the space in that name is why nothing resolved it. The foreman copied it
  to `profile.jpg`. The original space-named duplicate is still present — the owner can delete it.
  The initials ("SS") monogram fallback **stays in the code regardless** — it is the correct
  behaviour if the file is ever missing, and it costs nothing when the image loads.
  Because the background is near-white, the avatar needs a visible ring/border in LIGHT theme or it
  will bleed into the page background.
- **Resume PDF:** `public/Shahrul_Saifuddin_Resume_2026.pdf` — **EXISTS**, copied in by the foreman.
  The "Download Resume" button points at this path.
- **OG image:** the profile photo is a usable source for the social card.
- **No project screenshots exist.** Project cards must NOT reference image files. Use a typographic
  / metric-led card design instead of an image-led one. Do not generate placeholder screenshots.
