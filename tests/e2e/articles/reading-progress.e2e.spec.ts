import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { gotoArticleOrSkip } from './helpers'

/**
 * Reading Progress Bar E2E Tests
 *
 * Tests reading progress functionality for article pages:
 * - Progress tracking as user scrolls
 * - ARIA attributes validation
 * - Accessibility compliance
 * - Reduced motion support
 *
 * Requires seeded data (run: pnpm seed --clean)
 */

test.describe('Reading Progress Bar', () => {
  test.beforeEach(async ({ page }) => {
    await gotoArticleOrSkip(page, 'fr')
    await page.waitForLoadState('networkidle')
  })

  test('displays progress bar at top of page', async ({ page }) => {
    const progressBar = page.getByRole('progressbar', { name: /progression/i })
    await expect(progressBar).toBeVisible()
  })

  test('starts near 0% at top of page', async ({ page }) => {
    // Ensure at top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(150)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')

    expect(Number(value)).toBeLessThanOrEqual(10)
  })

  test('updates progress on scroll', async ({ page }) => {
    // Scroll to middle of article
    await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        const rect = article.getBoundingClientRect()
        const middle = rect.top + window.scrollY + rect.height / 2
        window.scrollTo({ top: middle, behavior: 'instant' })
      }
    })
    await page.waitForTimeout(200)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')

    expect(Number(value)).toBeGreaterThan(20)
    expect(Number(value)).toBeLessThan(80)
  })

  test('reaches high percentage at end of article', async ({ page }) => {
    // Scroll to end of article
    await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        const rect = article.getBoundingClientRect()
        const bottom = rect.top + window.scrollY + rect.height - window.innerHeight
        window.scrollTo({ top: Math.max(0, bottom), behavior: 'instant' })
      }
    })
    await page.waitForTimeout(200)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')

    expect(Number(value)).toBeGreaterThanOrEqual(85)
  })

  test.describe('ARIA Attributes', () => {
    test('has required progressbar attributes', async ({ page }) => {
      const progressBar = page.getByRole('progressbar')

      await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      await expect(progressBar).toHaveAttribute('aria-valuenow')
      await expect(progressBar).toHaveAttribute('aria-label')
    })
  })

  test.describe('Accessibility', () => {
    test('has no accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page }).include('[role="progressbar"]').analyze()

      expect(results.violations).toEqual([])
    })
  })

  test.describe('Reduced Motion', () => {
    test('respects prefers-reduced-motion', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Progress bar should still work, just without transitions
      const progressBar = page.getByRole('progressbar')
      await expect(progressBar).toBeVisible()

      // Verify no transition style (motion-reduce:transition-none)
      const innerBar = progressBar.locator('div').first()
      const transitionDuration = await innerBar.evaluate((el) => {
        return window.getComputedStyle(el).transitionDuration
      })

      // Parse and verify all transitions are zero-duration
      // Handles multiple transitions (e.g., "0s, 0s") and normalizes values
      const durations = transitionDuration
        .split(',')
        .map((d) => d.trim())
        .map((d) => (d === 'none' || d === '' ? '0s' : d))

      const allZero = durations.every((d) => d === '0s' || d === '0ms')
      expect(allZero).toBe(true)
    })
  })
})
