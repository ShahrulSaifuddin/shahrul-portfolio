import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for the portfolio's E2E suite.
 *
 * `webServer` owns the whole server lifecycle: it runs a real production
 * build (`next build && next start`) and waits for it to answer on
 * localhost:3000 before any test starts. Locally it reuses an already
 * running server (fast iteration); on CI it always starts a fresh one.
 *
 * IMPORTANT: no `RESEND_API_KEY` is set anywhere in this repo or in CI, by
 * design. The contact-form and `/api/contact` specs assert the graceful
 * 503 "email delivery not configured" path rather than a real send, which
 * is the only path reachable without a live Resend key.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // The mobile-menu spec exercises the `md:hidden` hamburger trigger,
      // which does not render/is not interactable at desktop width — it
      // belongs to the `mobile-chromium` project below only.
      testIgnore: /mobile-menu\.spec\.ts/,
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      // Kept narrow on purpose: the desktop `chromium` project already
      // covers every other flow once. Re-running the full suite here would
      // duplicate POSTs to /api/contact, which shares a small in-memory
      // rate limit (5 requests / 10 min) across the single webServer
      // process — see e2e/contact-api.spec.ts and e2e/contact-form.spec.ts.
      testMatch: /mobile-menu\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
