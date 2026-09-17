import { test, expect } from '@playwright/test'

test.describe('Navigation & routing', () => {
  test('home page loads with the hero heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Shahrul Saifuddin' })).toBeVisible()
  })

  test('primary nav reaches Projects, Performance and Contact', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Primary' })

    // Page identity is asserted via URL + page <title> here rather than an
    // `<h1>` role/level, so this navigation check stays independent of
    // e2e/headings.spec.ts's dedicated "exactly one h1" regression guard
    // (which currently fails for /performance and /contact — see that spec
    // and the final report for details; not something this spec should mask
    // or duplicate).
    await nav.getByRole('link', { name: 'Projects', exact: true }).click()
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page).toHaveTitle(/^Projects/)
    await expect(page.getByRole('heading', { name: 'Projects' }).first()).toBeVisible()

    await nav.getByRole('link', { name: 'Performance', exact: true }).click()
    await expect(page).toHaveURL(/\/performance$/)
    await expect(page).toHaveTitle(/^Performance checklist/)
    await expect(page.getByRole('heading', { name: 'Performance' }).first()).toBeVisible()

    await nav.getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page).toHaveTitle(/^Contact/)
    await expect(page.getByRole('heading', { name: 'Contact' }).first()).toBeVisible()
  })

  test('a project card on the home page navigates to its case study', async ({ page }) => {
    await page.goto('/')
    // FastEV is a featured project rendered on the home page.
    await page.getByRole('link', { name: 'FastEV', exact: true }).click()
    await expect(page).toHaveURL(/\/projects\/fastev$/)
    await expect(page.getByRole('heading', { level: 1, name: 'FastEV' })).toBeVisible()
  })

  test('/projects/fastev renders the FastEV case study', async ({ page }) => {
    const response = await page.goto('/projects/fastev')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'FastEV' })).toBeVisible()
    await expect(page.getByText('EV charging network')).toBeVisible()
  })

  test('an unknown project slug returns a 404', async ({ page }) => {
    const response = await page.goto('/projects/does-not-exist')
    expect(response?.status()).toBe(404)
  })
})
