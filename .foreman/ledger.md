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
| T2a | 1 | sonnet | r1 | DISPATCHED | — | baseline e72eda0 | 2026-09-17 |
| T2b | 1 | sonnet | r1 | DISPATCHED | — | baseline e72eda0 | 2026-09-17 |
| T2c | 1 | sonnet | r1 | DISPATCHED | — | baseline e72eda0 | 2026-09-17 |
| T2d | 1 | sonnet | r1 | DISPATCHED | — | baseline e72eda0 | 2026-09-17 |

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
