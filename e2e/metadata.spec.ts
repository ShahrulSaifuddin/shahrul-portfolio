import { expect, test } from '@playwright/test'

/**
 * Regression guard for a real shipped bug.
 *
 * The root layout sets `title.template = '%s — Shahrul Saifuddin'`. Four pages
 * ALSO appended the site name to their own title, so every one of them rendered
 * a doubled name:
 *
 *   "Projects — Shahrul Saifuddin — Shahrul Saifuddin"
 *
 * That is what shows in the browser tab and in Google's result listing. It
 * compiled, typechecked, linted and passed every existing test, because nothing
 * asserted the rendered <title>. Spotted only by looking at a browser tab.
 */

const SITE = 'Shahrul Saifuddin'

const ROUTES = [
  { path: '/', expected: 'Shahrul Saifuddin — Full-Stack Engineer' },
  { path: '/projects', expected: `Projects — ${SITE}` },
  { path: '/performance', expected: `Performance checklist — ${SITE}` },
  { path: '/contact', expected: `Contact — ${SITE}` },
  { path: '/projects/fastev', expected: `FastEV — ${SITE}` },
]

test.describe('Page metadata', () => {
  for (const { path, expected } of ROUTES) {
    test(`${path} has the correct, non-duplicated title`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveTitle(expected)
    })
  }

  test('no route repeats the site name in its title', async ({ page }) => {
    for (const { path } of ROUTES) {
      await page.goto(path)
      const title = await page.title()
      const occurrences = title.split(SITE).length - 1
      expect(occurrences, `"${title}" repeats "${SITE}" ${occurrences} times`).toBeLessThanOrEqual(1)
    }
  })

  test('every route has a non-empty meta description', async ({ page }) => {
    for (const { path } of ROUTES) {
      await page.goto(path)
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description, `${path} is missing a meta description`).toBeTruthy()
      expect((description ?? '').length).toBeGreaterThan(40)
    }
  })
})
