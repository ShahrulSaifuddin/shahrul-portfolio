# Foreman Ledger — Shahrul Saifuddin Portfolio (Next.js)

BASELINE: 6a037d80556ff56705d1b89280ac0ba35c2b79a0 | clean (only README.md tracked) | 2026-09-17
MODE: Full (Agent tool + real shell; Codex NOT installed — no Codex consent required)
LEAD SEAT: Opus 5 (frontier-class, confirmed from session identity)
WORK BRANCH: feat/portfolio (branched off main; nothing pushed without user approval)

ENV CONSTRAINT: The Bash tool on this machine is pathologically slow (120s+ timeouts on
trivial commands; broken ~/.bashrc line 2). PowerShell is instant. EVERY ticket mandates
PowerShell for shell work and Read/Write/Edit tools for file work.

## Plan

| # | Task | Class | Wave |
|---|---|---|---|
| T0 | Scaffold Next.js 15 + TS + Tailwind v4 + shadcn/ui + deps; verify build | WORKHORSE | 0 (serial) |
| T1 | Content data layer — typed profile/projects/skills/experience/perf data | WORKHORSE | 1 (serial) |
| T2a | Layout shell — root layout, nav, mobile menu, footer, theme, scroll chrome | WORKHORSE | 2 (parallel) |
| T2b | Home page sections — hero, about, skills, timeline, education | WORKHORSE | 2 (parallel) |
| T2c | Projects index + case-study routes, filtering, search | WORKHORSE | 2 (parallel) |
| T2d | Performance checklist page (interactive demos) + contact form & API route | WORKHORSE | 2 (parallel) |
| T3a | SEO (sitemap/robots/JSON-LD/OG), README, .env.example, bundle analyzer | WORKHORSE | 3 (parallel) |
| T3b | Playwright E2E + GitHub Actions CI + Lighthouse CI | WORKHORSE | 3 (parallel) |
| T4 | Deterministic gates + blind verification + fix waves | FRONTIER (foreman) | 4 |

## Routing

- T0 → WORKHORSE (`sonnet`) — well-specified tooling setup, no architectural judgment; high file count.
- T1 → WORKHORSE (`sonnet`) — factual accuracy matters (real resume metrics); not mechanical enough for FAST.
- T2a–T2d → WORKHORSE (`sonnet`) — well-specified implementation against a foreman-authored design spec.
- T3a → WORKHORSE (`sonnet`) — spec-driven config + docs.
- T3b → WORKHORSE (`sonnet`) — test authoring needs judgment about real selectors; FAST would write brittle tests.
- Verifier → `Explore` agent @ `sonnet` — Explore genuinely lacks Edit/Write (enforced read-only, not
  promised), and `model: sonnet` avoids Explore's expensive default of inheriting the Opus session seat.
- Final acceptance verifier → `Explore` @ `opus` — one frontier read against the user's original spec.
- No Codex → cross-family pairing unavailable; recorded as a known assurance limitation.

## Tasks

| id | state | owned paths | job id |
|---|---|---|---|
| T0 | VERIFIED | (repo root scaffold) | sync |
| T1 | VERIFIED | src/lib/data/**, src/lib/types.ts, src/lib/site.ts | sync |
| T2a | DISPATCHED | src/app/layout.tsx, src/app/globals.css, src/lib/motion.ts, src/components/layout/**, src/components/motion/**, src/components/providers/** | wave2-a |
| T2b | DISPATCHED | src/app/page.tsx, src/components/sections/**, src/components/profile-avatar.tsx | wave2-b |
| T2c | DISPATCHED | src/app/projects/**, src/components/projects/** | wave2-c |
| T2d | DISPATCHED | src/app/performance/**, src/app/contact/**, src/app/api/contact/**, src/components/performance/**, src/components/contact/**, src/lib/{validation,email,rate-limit}.ts | wave2-d |
| T3a | PENDING | src/app/sitemap.ts, src/app/robots.ts, src/app/opengraph-image.tsx, README.md, .env.example, next.config.ts | — |
| T3b | PENDING | e2e/**, playwright.config.ts, .github/**, lighthouserc.json | — |

Note: `src/lib/seo.ts` moved OFF T3a — T2a emits Person JSON-LD inline in the root layout, so
T3a never needs to touch `layout.tsx`. Keeps wave 3 write sets disjoint.

## Attempts

| task | # | seat | ticket rev | outcome | checks run | evidence | when |
|---|---|---|---|---|---|---|---|
| T0 | 1 | sonnet | r1 | DONE | foreman re-ran `npm run build` (exit 0) + `tsc --noEmit` (exit 0) | commit 2f75391; build log bz7t58qif | 2026-09-17 |
| T1 | 1 | sonnet | r1 | DONE | foreman verified 19 perf items / 5 demos / 4 projects by regex; read `appliedHere` for the 5 highest-risk entries — all honest | commit e72eda0 | 2026-09-17 |
| T2a | 1 | sonnet | r1 | DONE | foreman: full `next build` 0, `tsc` 0; read globals.css + layout.tsx + section-header.tsx | commit f2be8a5 | 2026-09-17 |
| T2b | 1 | sonnet | r1 | DONE | same build; read profile-avatar.tsx | commit f2be8a5 | 2026-09-17 |
| T2c | 1 | sonnet | r1 | DONE | same build; read [slug]/page.tsx link markup | commit f2be8a5 | 2026-09-17 |
| T2d | 1 | sonnet | r1 | DONE_WITH_CONCERNS → concerns resolved into FIX1 | same build; read api/contact/route.ts + rate-limit.ts | commit f2be8a5 | 2026-09-17 |
| FIX1 | 1 | sonnet | r1 | DISPATCHED | — | baseline f2be8a5 | 2026-09-17 |
| T3a | 1 | sonnet | r1 | DISPATCHED | — | baseline f2be8a5 | 2026-09-17 |

### Wave 2 review findings (batched into FIX1 — one ticket, not one worker per finding)

Sources are marked because it matters who caught what:

| # | Finding | Source |
|---|---|---|
| F1 | Nested `<main>` landmarks on /performance and /contact | T2d self-reported; foreman confirmed by grep |
| F2 | light `--primary` 3.92:1 — CTA label fails 4.5:1 | **foreman measurement (defect in the foreman's own spec)** |
| F3 | light `--brand` exactly 4.50:1, no margin | **foreman measurement (own spec)** |
| F4 | light `--ring` must track corrected primary | **foreman measurement (own spec)** |
| F5 | `--input` 1.26:1 / 1.39:1 — fails WCAG 1.4.11 (3:1) | **foreman measurement (own spec)** |
| F6 | /projects uses sr-only h1 + visible h2 | T2c self-reported |
| F7 | rate-limit Map never evicts — leaks under PM2 | foreman code review |
| F8 | contact/page.tsx `rel` missing `noopener` | foreman code review |

Four of eight findings were defects in the **foreman-authored design spec**, not worker error. The
workers implemented bad numbers faithfully, and the spec even carried a comment asserting the values
passed. Only converting OKLCH → sRGB and computing real ratios caught it. Recorded because the
lesson is the point: reviewing a spec by reading it would have shipped an inaccessible primary CTA.

### Non-findings — measured, then deliberately NOT acted on

- **Home page First Load JS = 252 kB raw.** Measured the built chunks: gzip ratio ~3.2:1, so home is
  **≈79 kB gzipped** against the brief's "<200 KB gzipped" target. A framer-motion → CSS refactor was
  scoped and then dropped as unjustified. Measuring first prevented a large speculative refactor.

### Process incident

A Wave 2 worker started `npm run dev` and never stopped it. The dev server held `.next` for ~20
minutes and starved the foreman's production build (which was killed at exit 255; T2d had already hit
the same thing as `EPERM ... .next\trace`). Foreman identified the processes by command line via
`Get-CimInstance Win32_Process`, confirmed they were the project's dev server rather than the agent
runtime, terminated them, and re-ran a clean build. **Every wave-3 ticket now carries an explicit
"do not start a dev server" instruction.** Logged because a stray process silently invalidating a
verification run is exactly the failure mode the reconciliation step exists to catch.

### Trivial change made by the foreman directly (verifier-exempt)

Removed an unused `// eslint-disable-next-line react/no-danger` directive at `src/app/layout.tsx:77`
that the build flagged as a warning. Single line, no logic content — the one category
verification.md exempts from the blind-verifier requirement.

### T0 verification note (deviation from the default protocol, recorded deliberately)

T0's acceptance criteria are entirely deterministic (build / tsc / lint exit codes + file existence).
The foreman re-ran all of them personally rather than dispatching a blind verifier, because a
reproduced deterministic result outranks a model verdict for exactly this class of task
(verification.md: "A reproduced deterministic failure is authoritative"). A blind verifier runs
against the cumulative tree at the end of wave 2 and again at final acceptance, which covers the
scaffold's output as consumed in anger. Recorded here so the reduced assurance is visible, not
silently assumed.

### Known assurance limitations for this run

- **No cross-family verification.** Codex is not installed, so every verifier shares the builders'
  model family and therefore some of their blind spots. Stated rather than papered over.
- **Wave 2 baseline is e72eda0** for all four parallel workers. Any reconciliation is a diff
  against that commit.

## Decisions

- 2026-09-17 — Codex not installed; crew is Claude-only. No consent prompt needed.
- 2026-09-17 — Wave 2 capped at 4 parallel workers (skill guidance: 2–4). Contact + performance
  folded into one ticket (T2d) rather than running a 5th worker.
- 2026-09-17 — Design decisions (palette, type, motion, spacing) authored by the foreman in
  .foreman/design.md so four parallel workers converge on one visual language instead of four.
- 2026-09-17 — shadcn primitives are installed once in T0 and are READ-ONLY for all later workers.
  Wave 2 workers may not run `shadcn add` (would collide on components.json + package.json).
- 2026-09-17 — Work happens on branch feat/portfolio. Per-wave commits are required by the
  verification protocol (verifier must read a clean tree at a known HEAD). No push without user OK.
- 2026-09-17 — Skills named by the user (emilkowalski/skills, impeccable, taste,
  web-design-guidelines, awesome-design-skills, image-to-code-skill, playwright-cli) are NOT
  installed in this session. Their *intent* is encoded as explicit constraints in .foreman/design.md
  and the tickets. Surfaced to the user rather than silently claimed.
- 2026-09-17 — Optional spec items (blog/MDX, newsletter, database/analytics backend, Sentry)
  deferred as out-of-MVP per the spec's own "MVP → polish → extras" instruction. Stated to user.
- 2026-09-17 — Profile photo: user pasted it into chat, but no image file exists on disk and the
  foreman cannot materialize binary image data. Avatar component ships with a graceful
  initials/gradient fallback and reads /images/profile.jpg when the user drops it in.

## Scratch

- .foreman/design.md — shared design spec (read by every Wave 2 worker)
- .foreman/scratch/ — worker artifacts, build logs
