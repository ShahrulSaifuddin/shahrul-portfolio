import { test, expect } from '@playwright/test'

test.describe('SEO endpoints', () => {
  test('/sitemap.xml returns 200 XML containing every project URL', async ({ request }) => {
    const response = await request.get('/sitemap.xml')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')

    const body = await response.text()
    expect(body).toContain('<urlset')
    for (const slug of ['fastev', 'sd-engage', 'karuna-growth-suite', 'ctapps-digital']) {
      expect(body).toContain(`/projects/${slug}`)
    }
  })

  test('/robots.txt returns 200 and references the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')

    expect(response.status()).toBe(200)

    const body = await response.text()
    const normalized = body.toLowerCase()
    expect(normalized).toContain('user-agent: *')
    expect(normalized).toContain('sitemap:')
    expect(body).toContain('/sitemap.xml')
  })
})
