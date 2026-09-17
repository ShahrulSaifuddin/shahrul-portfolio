import { test, expect } from '@playwright/test'

/**
 * Regression guard: `/projects` previously rendered a visually-hidden `<h1>`
 * from `SectionHeader` alongside a separate visible `<h2>`, breaking the
 * "one h1 per page" accessibility rule (design spec §5.3). This checks the
 * raw DOM count of `<h1>` elements, not just what is visible, so a hidden
 * duplicate would still fail it.
 */
const PAGES = ['/', '/projects', '/performance', '/contact']

for (const path of PAGES) {
  test(`${path} has exactly one h1`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
  })
}
