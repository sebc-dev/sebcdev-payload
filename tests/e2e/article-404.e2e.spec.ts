import { expect, test } from '@playwright/test'

/**
 * Article 404 E2E Tests
 *
 * Tests 404 handling for non-existent articles.
 */

const NON_EXISTENT_SLUGS = [
  'this-article-does-not-exist',
  'non-existent-article-12345',
  'random-slug-xyz',
]

test.describe('Article 404 Handling', () => {
  test('displays 404 page for non-existent article (FR)', async ({ page }) => {
    const response = await page.goto(`/fr/articles/${NON_EXISTENT_SLUGS[0]}`)

    // Should return 404 status
    expect(response?.status()).toBe(404)

    // Should display 404 content
    const body = await page.textContent('body')
    expect(body).toMatch(/404|non trouvé|not found/i)
  })

  test('displays 404 page for non-existent article (EN)', async ({ page }) => {
    const response = await page.goto(`/en/articles/${NON_EXISTENT_SLUGS[1]}`)

    expect(response?.status()).toBe(404)

    const body = await page.textContent('body')
    expect(body).toMatch(/404|not found/i)
  })

  test('404 page has navigation back to homepage', async ({ page }) => {
    await page.goto(`/fr/articles/${NON_EXISTENT_SLUGS[2]}`)

    // 404 page must have a link back to homepage for good UX
    // Use exact match to avoid matching "Retour d'Expérience" category link
    const homeLink = page.getByRole('link', { name: /retour à l'accueil/i })

    await expect(homeLink).toBeVisible()

    // Click and wait for URL change
    await homeLink.click()
    await page.waitForURL(/\/(fr|en)(\/)?$/, { timeout: 10000 })

    await expect(page).toHaveURL(/\/(fr|en)(\/)?$/)
  })

  test('404 page has noindex meta tag', async ({ page }) => {
    await page.goto(`/fr/articles/${NON_EXISTENT_SLUGS[0]}`)

    // 404 pages must have noindex for SEO
    // Use .first() since there may be multiple robots meta tags
    const robotsMeta = page.locator('meta[name="robots"]').first()
    await expect(robotsMeta).toHaveAttribute('content', /noindex/)
  })

  test('handles unicode and accented characters in slug gracefully', async ({ page }) => {
    const specialSlug = 'article-éèç-über-日本語'
    const response = await page.goto(`/fr/articles/${encodeURIComponent(specialSlug)}`)

    // Should not crash, either 404 or valid response
    expect([200, 404]).toContain(response?.status())
  })
})
