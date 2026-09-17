import { expect, test } from '@playwright/test'

/**
 * Regression guard for a real shipped bug.
 *
 * The hero metric rail animates its numbers upward from 0. The original
 * implementation used 0 as the component's INITIAL state, so the true value
 * only ever appeared if the count-up animation actually ran. After a reload,
 * every metric sat at "0" indefinitely â€” meaning the page confidently told
 * visitors "0 years shipping production systems" about a real person on their
 * job-seeking portfolio.
 *
 * Nothing else in the build caught it: it compiled, typechecked, linted, and
 * passed the whole E2E suite, because no test asserted the rendered VALUES.
 * These tests do.
 */

/** The real figures, from src/lib/data/profile.ts (heroMetrics). */
const EXPECTED = [
  { value: '5', label: /Years shipping production systems/i },
  { value: '2', label: /Products live on App Store & Google Play/i },
  { value: '4', label: /Payment & fiscal integrations shipped/i },
  { value: '100', label: /Lighthouse Accessibility/i },
]

/**
 * Resolves the numeral belonging to one metric label.
 *
 * Deliberately precise: it walks from the label span to its parent cell and
 * reads that cell's own numeral, then asserts with `toHaveText` (exact) rather
 * than `toContainText`. A looser locator â€” e.g. filtering `div` by text â€” can
 * resolve to a large ancestor that happens to contain the digit somewhere else
 * on the page, and would pass no matter what the metric rendered. A test that
 * cannot fail is worse than no test.
 */
function metricNumeral(page: import('@playwright/test').Page, label: RegExp) {
  return page.getByText(label).locator('xpath=..').locator('.tabular-nums')
}

test.describe('Hero metrics', () => {
  test('every metric settles on its real value, not 0', async ({ page }) => {
    await page.goto('/')

    for (const { value, label } of EXPECTED) {
      await expect(metricNumeral(page, label)).toHaveText(value, { timeout: 5000 })
    }
  })

  test('metrics still show real values after a reload', async ({ page }) => {
    // The original bug only reproduced reliably on reload, when the elements
    // were already in view at mount and the observer callback never fired.
    await page.goto('/')
    await page.reload()

    for (const { value, label } of EXPECTED) {
      await expect(metricNumeral(page, label)).toHaveText(value, { timeout: 5000 })
    }
  })

  test('metrics show real values with animation suppressed', async ({ browser }) => {
    // Reduced motion skips the count-up entirely â€” the true value must still
    // render, which is the whole point of initialising to the truth.
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')

    for (const { value, label } of EXPECTED) {
      await expect(metricNumeral(page, label)).toHaveText(value, { timeout: 5000 })
    }

    await context.close()
  })

  test('no hero metric renders a bare 0', async ({ page }) => {
    await page.goto('/')
    // Settle any in-flight count-up before asserting.
    await expect(page.getByText(/Years shipping production systems/i)).toBeVisible()
    await expect(page.locator('body')).not.toContainText('0 Years shipping production systems')
  })
})



