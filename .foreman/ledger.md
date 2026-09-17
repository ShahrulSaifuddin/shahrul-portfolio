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
| T0 | PENDING | (repo root scaffold) | — |
| T1 | PENDING | src/lib/data/**, src/lib/types.ts, src/lib/site.ts | — |
| T2a | PENDING | src/app/layout.tsx, src/app/globals.css, src/components/layout/**, src/components/providers/** | — |
| T2b | PENDING | src/app/page.tsx, src/components/sections/** | — |
| T2c | PENDING | src/app/projects/**, src/components/projects/** | — |
| T2d | PENDING | src/app/performance/**, src/app/contact/**, src/app/api/contact/**, src/components/performance/**, src/components/contact/**, src/lib/email.ts | — |
| T3a | PENDING | src/app/sitemap.ts, src/app/robots.ts, src/app/opengraph-image.tsx, src/lib/seo.ts, README.md, .env.example, next.config.ts | — |
| T3b | PENDING | e2e/**, playwright.config.ts, .github/**, lighthouserc.json | — |

## Attempts

(append-only; task | attempt | seat | ticket rev | outcome | checks | evidence | time)

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
