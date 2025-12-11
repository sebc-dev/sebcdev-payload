import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Table of Contents Navigation E2E Tests
 *
 * Tests TOC functionality for article pages:
 * - Desktop: Sticky sidebar navigation
 * - Mobile: Floating button with Sheet modal
 * - Accessibility: WCAG compliance and keyboard navigation
 *
 * Requires seeded data (run: pnpm seed --clean)
 */

// Seed data constants (must match scripts/seed.ts)
const ARTICLE_SLUG = 'nextjs-cloudflare-workers'

/**
 * Helper: navigate to article and skip test if not seeded.
 */
async function gotoArticleOrSkip(page: Page, locale: 'fr' | 'en' = 'fr'): Promise<void> {
  await page.goto(`/${locale}/articles/${ARTICLE_SLUG}`)

  // Skip if article not found - check for <article> element
  const articleElement = page.locator('article')
  const articleExists = (await articleElement.count()) > 0

  if (!articleExists) {
    test.skip(true, 'Database not seeded - run: pnpm seed --clean')
  }
}

test.describe('Table of Contents Navigation', () => {
  test.describe('Desktop TOC (@desktop)', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test.beforeEach(async ({ page }) => {
      await gotoArticleOrSkip(page)
      await page.waitForLoadState('networkidle')
    })

    test('displays TOC sidebar', async ({ page }) => {
      const toc = page.getByRole('navigation', { name: /table des matières/i })
      await expect(toc).toBeVisible()
    })

    test('TOC contains headings from article', async ({ page }) => {
      const tocNav = page.getByRole('navigation', { name: /table des matières/i })
      const links = tocNav.getByRole('link')
      await expect(links).not.toHaveCount(0)
    })

    test('clicking TOC link scrolls to section', async ({ page }) => {
      const tocLink = page
        .getByRole('navigation', { name: /table des matières/i })
        .getByRole('link')
        .first()

      const linkText = await tocLink.textContent()
      await tocLink.click()

      // Wait for scroll
      await page.waitForTimeout(500)

      // Verify target heading is in viewport
      // The ID is generated from the heading text via slugify
      const targetHeading = page.locator(`h2, h3`).filter({ hasText: linkText || '' })
      await expect(targetHeading.first()).toBeInViewport()
    })

    test('highlights active section on scroll', async ({ page }) => {
      // Get second TOC link
      const secondLink = page
        .getByRole('navigation', { name: /table des matières/i })
        .getByRole('link')
        .nth(1)

      const linkText = await secondLink.textContent()

      // Scroll the corresponding heading into view
      const heading = page.locator('h2, h3').filter({ hasText: linkText || '' })
      await heading.first().scrollIntoViewIfNeeded()
      await page.waitForTimeout(400) // Wait for intersection observer

      // Check aria-current
      await expect(secondLink).toHaveAttribute('aria-current', 'true')
    })
  })

  test.describe('Mobile TOC (@mobile)', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test.beforeEach(async ({ page }) => {
      await gotoArticleOrSkip(page)
      await page.waitForLoadState('networkidle')
    })

    test('hides desktop TOC sidebar', async ({ page }) => {
      // Desktop TOC should be hidden
      const desktopToc = page
        .locator('aside')
        .getByRole('navigation', { name: /table des matières/i })
      await expect(desktopToc).not.toBeVisible()
    })

    test('displays floating TOC button', async ({ page }) => {
      const button = page.getByRole('button', { name: /ouvrir la table des matières/i })
      await expect(button).toBeVisible()
    })

    test('opens sheet on button click', async ({ page }) => {
      await page.getByRole('button', { name: /ouvrir la table des matières/i }).click()

      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()
    })

    test('closes sheet after link click', async ({ page }) => {
      // Open sheet
      await page.getByRole('button', { name: /ouvrir la table des matières/i }).click()
      await expect(page.getByRole('dialog')).toBeVisible()

      // Click first link
      await page.getByRole('dialog').getByRole('link').first().click()

      // Wait for animation and verify closed
      await page.waitForTimeout(500)
      await expect(page.getByRole('dialog')).not.toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test.beforeEach(async ({ page }) => {
      await gotoArticleOrSkip(page)
      await page.waitForLoadState('networkidle')
    })

    test('TOC has no accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('nav[aria-label*="matières"], nav[aria-label*="Contents"]')
        .analyze()

      expect(results.violations).toEqual([])
    })

    test('keyboard navigation works', async ({ page }) => {
      const toc = page.getByRole('navigation', { name: /table des matières/i })
      const firstLink = toc.getByRole('link').first()

      // Tab to TOC
      await firstLink.focus()
      await expect(firstLink).toBeFocused()

      // Press Enter to navigate
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Verify scroll occurred
      const linkText = await firstLink.textContent()
      const heading = page.locator('h2, h3').filter({ hasText: linkText || '' })
      await expect(heading.first()).toBeInViewport()
    })
  })
})
