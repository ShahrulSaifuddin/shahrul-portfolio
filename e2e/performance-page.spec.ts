import { test, expect } from '@playwright/test'

const CHECKLIST_TITLES = [
  'API Response Caching',
  'Load Balancing',
  'Database Indexing',
  'Image Compression',
  'Loading Skeletons',
  'Cache Expensive Queries',
  'Fix N+1 Database Queries',
  'Debounce Input Handlers',
  'Code Splitting',
  'CDN Integration',
  'Server-Side Caching',
  'Paginate Large Lists',
  'Lighthouse Audits',
  'API Payload Compression',
  'Reduce Unnecessary Re-Renders',
  'Minify JS & CSS',
  'Lazy-Load Images',
  'Defer Non-Critical Scripts',
  'Remove Unused Dependencies',
]

test.describe('Performance page', () => {
  test('all 19 checklist items render', async ({ page }) => {
    await page.goto('/performance')

    expect(CHECKLIST_TITLES).toHaveLength(19)
    for (const title of CHECKLIST_TITLES) {
      await expect(page.getByRole('button', { name: title })).toBeVisible()
    }
  })

  test('the pagination demo mounts and advances a page on click', async ({ page }) => {
    await page.goto('/performance')

    await page.getByRole('button', { name: 'Paginate Large Lists' }).click()

    const pageIndicator = page.getByText(/Page \d of \d/)
    await expect(pageIndicator).toHaveText('Page 1 of 4')

    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await expect(pageIndicator).toHaveText('Page 2 of 4')
  })
})
