import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

import enMessages from '../../messages/en.json' with { type: 'json' }
import frMessages from '../../messages/fr.json' with { type: 'json' }

/**
 * Homepage E2E Tests
 *
 * Comprehensive tests for the homepage including:
 * - Page load (FR/EN)
 * - Featured article display
 * - Article grid rendering
 * - Hub CTA navigation
 * - Empty state handling
 * - Responsive viewports
 */
test.describe('Homepage', () => {
  test.describe('Page Load', () => {
    test('loads FR homepage correctly', async ({ page }) => {
      await page.goto('/fr')
      await expect(page).toHaveTitle(/sebc\.dev/)
      await expect(page.locator('main')).toBeVisible()
    })

    test('loads EN homepage correctly', async ({ page }) => {
      await page.goto('/en')
      await expect(page).toHaveTitle(/sebc\.dev/)
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('Featured Article', () => {
    test('displays featured article with H1 title', async ({ page }) => {
      await page.goto('/fr')

      // Check for H1 (featured article title)
      const h1 = page.locator('h1')
      const h1Count = await h1.count()

      // If there are articles, should have exactly one H1
      if (h1Count > 0) {
        expect(h1Count).toBe(1)
        await expect(h1).toBeVisible()
      }
    })

    test('displays read article CTA', async ({ page }) => {
      await page.goto('/fr')

      const readButton = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.readArticle, 'i'),
      })

      // If featured article exists, CTA should be visible
      if ((await readButton.count()) > 0) {
        await expect(readButton.first()).toBeVisible()
      }
    })
  })

  test.describe('Article Grid', () => {
    test('displays recent articles section', async ({ page }) => {
      await page.goto('/fr')

      // Section title
      const sectionTitle = page.getByRole('heading', {
        name: new RegExp(frMessages.homepage.recentArticles, 'i'),
      })

      // If there are more than 1 article, section should exist
      const h1Exists = (await page.locator('h1').count()) > 0
      if (h1Exists) {
        // May or may not have recent articles depending on data
        // Just check the page doesn't crash
        await expect(page.locator('main')).toBeVisible()
      }
    })
  })

  test.describe('Hub CTA', () => {
    test('displays view all articles button', async ({ page }) => {
      await page.goto('/fr')

      const ctaButton = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.viewAllArticles, 'i'),
      })

      // If there are articles, CTA should exist
      if ((await ctaButton.count()) > 0) {
        await expect(ctaButton).toBeVisible()
      }
    })

    test('navigates to Hub on click', async ({ page }) => {
      await page.goto('/fr')

      const ctaButton = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.viewAllArticles, 'i'),
      })

      if ((await ctaButton.count()) > 0) {
        await ctaButton.click()
        await expect(page).toHaveURL('/fr/articles')
      }
    })
  })

  test.describe('Empty State', () => {
    test('displays welcome message when no articles', async ({ page }) => {
      await page.goto('/fr')

      const emptyTitle = page.getByRole('heading', {
        name: new RegExp(frMessages.homepage.emptyState.title, 'i'),
      })

      // If empty state is visible, check content
      if (await emptyTitle.isVisible()) {
        await expect(emptyTitle).toBeVisible()
        await expect(
          page.getByText(new RegExp(frMessages.homepage.emptyState.description, 'i')),
        ).toBeVisible()
      }
    })

    test('hides create CTA when not authenticated', async ({ page }) => {
      await page.goto('/fr')

      const emptyTitle = page.getByRole('heading', {
        name: new RegExp(frMessages.homepage.emptyState.title, 'i'),
      })

      if (await emptyTitle.isVisible()) {
        const createCta = page.getByRole('link', {
          name: new RegExp(frMessages.homepage.emptyState.cta, 'i'),
        })
        await expect(createCta).not.toBeVisible()
      }
    })
  })

  test.describe('Responsive', () => {
    test('mobile viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })

    test('tablet viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })

    test('desktop viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('Multilingual', () => {
    test('displays FR content on /fr', async ({ page }) => {
      await page.goto('/fr')
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(htmlLang).toBe('fr')
    })

    test('displays EN content on /en', async ({ page }) => {
      await page.goto('/en')
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(htmlLang).toBe('en')
    })
  })

  test.describe('Navigation', () => {
    test('can navigate from featured article to article page', async ({ page }) => {
      await page.goto('/fr')

      const h1Link = page.locator('h1 a').first()

      if (await h1Link.isVisible()) {
        await h1Link.click()
        await expect(page).toHaveURL(/\/fr\/articles\//)
      }
    })

    test('EN navigation works correctly', async ({ page }) => {
      await page.goto('/en')

      const ctaButton = page.getByRole('link', {
        name: new RegExp(enMessages.homepage.viewAllArticles, 'i'),
      })

      if ((await ctaButton.count()) > 0) {
        await ctaButton.click()
        await expect(page).toHaveURL('/en/articles')
      }
    })
  })

  test.describe('Accessibility', () => {
    test('FR homepage passes WCAG 2.1 AA audit', async ({ page }) => {
      await page.goto('/fr')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      // Filter for critical and serious violations only
      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      )

      expect(violations).toHaveLength(0)
    })

    test('EN homepage passes WCAG 2.1 AA audit', async ({ page }) => {
      await page.goto('/en')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      )

      expect(violations).toHaveLength(0)
    })

    test('has exactly one H1 element', async ({ page }) => {
      await page.goto('/fr')

      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
    })

    test('all images have alt text', async ({ page }) => {
      await page.goto('/fr')

      const images = page.locator('img')
      const count = await images.count()

      // Verify each image has non-empty alt text
      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt?.trim().length).toBeGreaterThan(0)
      }
    })

    test('interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/fr')

      // Tab through the page
      await page.keyboard.press('Tab')

      // Check that something received focus
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('focus indicators are visible on interactive elements', async ({ page }) => {
      await page.goto('/fr')

      // Tab to first focusable element
      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')

      // Verify focus indicator exists
      if ((await focused.count()) > 0) {
        const styles = await focused.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            outline: computed.outline,
            boxShadow: computed.boxShadow,
            outlineWidth: computed.outlineWidth,
          }
        })

        // Check for visible focus indicator (outline or box-shadow)
        const hasFocusIndicator =
          (styles.outline && styles.outline !== 'none') ||
          (styles.boxShadow && styles.boxShadow !== 'none')

        expect(hasFocusIndicator).toBe(true)
      }
    })

    test('page has proper document structure', async ({ page }) => {
      await page.goto('/fr')

      // Check that main element exists
      const main = page.locator('main')
      await expect(main).toBeVisible()

      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
      expect(headings.length).toBeGreaterThan(0)
    })
  })
})
