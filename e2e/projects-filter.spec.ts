import { test, expect } from '@playwright/test'

test.describe('Projects filter & search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('starts with all 4 projects shown', async ({ page }) => {
    await expect(page.getByText('Showing 4 of 4 projects')).toBeVisible()
    await expect(page.getByRole('link', { name: 'FastEV', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'SD Engage', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Karuna Growth Suite', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'CTApps Digital', exact: true })).toBeVisible()
  })

  test('typing in the search box narrows results and updates the live count', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: 'Search projects' })
    await search.fill('FastEV')

    await expect(page.getByText('Showing 1 of 4 projects')).toBeVisible()
    await expect(page.getByRole('link', { name: 'FastEV', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'SD Engage', exact: true })).not.toBeVisible()
  })

  test('a query matching nothing shows the empty state', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: 'Search projects' })
    await search.fill('zzz-nonexistent-project-zzz')

    await expect(page.getByText('No projects match your filters.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'FastEV', exact: true })).not.toBeVisible()
  })

  test('clear filters restores all 4 projects', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: 'Search projects' })
    await search.fill('zzz-nonexistent-project-zzz')
    await expect(page.getByText('No projects match your filters.')).toBeVisible()

    // In the empty state, "Clear filters" is a <Button>, not the inline link.
    await page.getByRole('button', { name: 'Clear filters' }).click()

    await expect(page.getByText('Showing 4 of 4 projects')).toBeVisible()
    await expect(search).toHaveValue('')
  })

  test('selecting a tech chip filters to the matching project', async ({ page }) => {
    // OCPP 1.6/2.0 appears only on FastEV's tech stack.
    await page.getByRole('button', { name: 'OCPP 1.6/2.0', exact: true }).click()

    await expect(page.getByText('Showing 1 of 4 projects')).toBeVisible()
    await expect(page.getByRole('link', { name: 'FastEV', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'SD Engage', exact: true })).not.toBeVisible()

    const chip = page.getByRole('button', { name: 'OCPP 1.6/2.0', exact: true })
    await expect(chip).toHaveAttribute('aria-pressed', 'true')

    // Clicking it again toggles the filter back off.
    await chip.click()
    await expect(page.getByText('Showing 4 of 4 projects')).toBeVisible()
  })
})
