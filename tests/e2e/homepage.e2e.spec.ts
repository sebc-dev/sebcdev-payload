import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Homepage E2E Tests - Base Tests
 *
 * These tests verify the homepage works correctly regardless of data state.
 * They focus on:
 * - Page load and basic structure
 * - Responsive viewports
 * - Multilingual routing
 * - Accessibility compliance
 *
 * For tests with seeded article data, see homepage-seeded.e2e.spec.ts
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

      // Verify each image has non-empty alt text (except decorative images with aria-hidden)
      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        const ariaHidden = await img.evaluate((el) => {
          // Check if image or parent has aria-hidden
          return (
            el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]') !== null
          )
        })

        // Decorative images (aria-hidden) can have empty alt
        // Content images must have non-empty alt
        if (!ariaHidden) {
          expect(alt, `Image ${i} is missing alt text`).toBeTruthy()
          expect(alt?.trim().length, `Image ${i} has empty alt text`).toBeGreaterThan(0)
        }
      }
    })

    test('interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/fr')

      // Track unique focused elements to detect focus traps and ensure multiple elements are reachable
      const focusedElements: string[] = []
      const maxTabs = 15 // Reasonable number to traverse main interactive elements

      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab')

        const focused = page.locator(':focus')
        if ((await focused.count()) > 0) {
          // Get a unique identifier for the focused element
          const identifier = await focused.evaluate((el) => {
            const tagName = el.tagName.toLowerCase()
            const role = el.getAttribute('role') || ''
            const ariaLabel = el.getAttribute('aria-label') || ''
            const text = el.textContent?.trim().slice(0, 30) || ''
            return `${tagName}${role ? `[role=${role}]` : ''}${ariaLabel ? `[aria-label="${ariaLabel}"]` : ''}:${text}`
          })

          // Only add if not already in the list (avoid counting same element twice)
          if (!focusedElements.includes(identifier)) {
            focusedElements.push(identifier)
          }
        }
      }

      // Assert that at least 3 different elements received focus (avoids focus traps)
      expect(
        focusedElements.length,
        `Expected at least 3 focusable elements, but found ${focusedElements.length}: ${focusedElements.join(', ')}`,
      ).toBeGreaterThanOrEqual(3)

      // Verify focus didn't get stuck (if we have multiple unique elements, focus is moving)
      expect(focusedElements.length).toBeGreaterThan(1)
    })

    test('focus indicators are visible on interactive elements', async ({ page }) => {
      await page.goto('/fr')

      // Tab to first focusable element
      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')

      // Assert an element received focus (fail if Tab doesn't work)
      await expect(focused, 'Expected an element to receive focus after Tab').toHaveCount(1)

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
    })

    test('page has proper document structure', async ({ page }) => {
      await page.goto('/fr')

      // Check that there is exactly one main element (WCAG requirement)
      const mainElements = page.locator('main')
      const mainCount = await mainElements.count()
      expect(mainCount, 'Page should have exactly one <main> element').toBe(1)

      // Check that main element is visible
      await expect(mainElements.first()).toBeVisible()

      // Check for proper heading hierarchy (WCAG 2.1 - no skipped levels)
      const headingLevels = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll((elements) => elements.map((el) => parseInt(el.tagName.substring(1), 10)))

      expect(headingLevels.length).toBeGreaterThan(0)

      // Validate heading hierarchy: no level should increase by more than 1
      for (let i = 1; i < headingLevels.length; i++) {
        const previous = headingLevels[i - 1]
        const current = headingLevels[i]
        const levelJump = current - previous

        expect(
          levelJump,
          `Heading hierarchy skip detected: h${previous} → h${current}. Headings should not skip levels.`,
        ).toBeLessThanOrEqual(1)
      }
    })
  })
})
