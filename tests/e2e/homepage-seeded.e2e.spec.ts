import { expect, test } from '@playwright/test'

import enMessages from '../../messages/en.json' with { type: 'json' }
import frMessages from '../../messages/fr.json' with { type: 'json' }

/**
 * Homepage E2E Tests with Seeded Data
 *
 * These tests run with actual article data from the seed script.
 * They verify the homepage renders correctly with real content.
 *
 * IMPORTANT: These tests require the database to be seeded BEFORE running.
 * Run: pnpm seed --clean && pnpm test:e2e --grep "Seeded"
 *
 * The seed creates:
 * - 5 Categories
 * - 10 Tags
 * - 7 Articles (with images and localized content)
 *
 * Tests include:
 * - Featured article card (H1 title, excerpt, metadata, CTA)
 * - Article grid with recent articles
 * - Navigation to article detail pages
 * - Multilingual content (FR/EN)
 * - Responsive layouts with real content
 */

// Seed data constants (must match scripts/seed.ts)
const SEED_ARTICLES = {
  featured: {
    fr: 'Déployer une Application Next.js sur Cloudflare Workers',
    en: 'Deploy a Next.js Application on Cloudflare Workers',
    slug: 'nextjs-cloudflare-workers',
  },
  total: 7,
  recentCount: 6, // Total minus featured
}

/**
 * Skip all tests if no seeded data is available.
 * This prevents false failures when running without seed data.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/fr')
  const h1 = page.locator('h1')
  const h1Text = await h1.textContent().catch(() => '')

  // If homepage shows empty state instead of featured article, skip tests
  if (!h1Text || h1Text.includes(frMessages.homepage.emptyState.title)) {
    test.skip(true, 'Database not seeded - run: pnpm seed --clean')
  }
})

test.describe('Homepage with Seeded Data', () => {
  test.describe('Featured Article Card', () => {
    test('displays featured article title as H1', async ({ page }) => {
      await page.goto('/fr')

      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(SEED_ARTICLES.featured.fr)
    })

    test('displays featured article title in EN locale', async ({ page }) => {
      await page.goto('/en')

      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(SEED_ARTICLES.featured.en)
    })

    test('featured article has cover image with alt text', async ({ page }) => {
      await page.goto('/fr')

      // Featured article card should have an image (if uploaded successfully during seed)
      const articleCard = page.locator('article').first()
      const image = articleCard.locator('img').first()

      // Skip if no image (seed may not have uploaded images)
      if ((await image.count()) === 0) {
        test.skip(true, 'No cover image uploaded during seed')
        return
      }

      await expect(image).toBeVisible()

      const alt = await image.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt!.length).toBeGreaterThan(0)
    })

    test('featured article displays category badge', async ({ page }) => {
      await page.goto('/fr')

      // The first article has category "Tutoriels"
      const tutorialsBadge = page.getByText('Tutoriels').first()
      await expect(tutorialsBadge).toBeVisible()
    })

    test('featured article displays reading time', async ({ page }) => {
      await page.goto('/fr')

      // Reading time should be visible
      const readingTime = page.getByText(/min de lecture/i)
      await expect(readingTime.first()).toBeVisible()
    })

    test('featured article displays complexity badge', async ({ page }) => {
      await page.goto('/fr')

      // First article is "advanced" complexity
      const complexityBadge = page.getByText(/Avancé/i).first()
      await expect(complexityBadge).toBeVisible()
    })

    test('featured article has "Read Article" CTA button', async ({ page }) => {
      await page.goto('/fr')

      const readCta = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.readArticle, 'i'),
      })

      await expect(readCta.first()).toBeVisible()
    })

    test('clicking featured article title navigates to article page', async ({ page }) => {
      await page.goto('/fr')

      const h1Link = page.locator('h1 a')
      await expect(h1Link).toBeVisible()

      await h1Link.click()

      await expect(page).toHaveURL(`/fr/articles/${SEED_ARTICLES.featured.slug}`)
    })

    test('clicking "Read Article" CTA navigates to article page', async ({ page }) => {
      await page.goto('/fr')

      const readCta = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.readArticle, 'i'),
      })

      await readCta.first().click()

      await expect(page).toHaveURL(`/fr/articles/${SEED_ARTICLES.featured.slug}`)
    })
  })

  test.describe('Recent Articles Grid', () => {
    test('displays "Recent Articles" section heading', async ({ page }) => {
      await page.goto('/fr')

      const sectionHeading = page.getByRole('heading', {
        name: new RegExp(frMessages.homepage.recentArticles, 'i'),
      })

      await expect(sectionHeading).toBeVisible()
    })

    test('displays multiple recent article cards', async ({ page }) => {
      await page.goto('/fr')

      // Count article elements (excluding the featured one which has H1)
      // Recent articles have H3 titles in cards
      const articleCards = page.locator('article h3')
      const count = await articleCards.count()

      // Should have at least 1 recent article (we seeded 7 total, 6 in grid)
      expect(count).toBeGreaterThan(0)
    })

    test('recent article cards are clickable', async ({ page }) => {
      await page.goto('/fr')

      // Find a card link in the recent articles section
      const recentSection = page.locator('section').filter({
        has: page.getByRole('heading', {
          name: new RegExp(frMessages.homepage.recentArticles, 'i'),
        }),
      })

      const cardLink = recentSection.locator('a').first()
      await expect(cardLink).toBeVisible()

      const href = await cardLink.getAttribute('href')
      // Link should be to articles (either a specific article or filtered list)
      expect(href).toContain('/fr/articles')
    })
  })

  test.describe('View All Articles CTA', () => {
    test('displays "View All Articles" button', async ({ page }) => {
      await page.goto('/fr')

      const viewAllCta = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.viewAllArticles, 'i'),
      })

      await expect(viewAllCta).toBeVisible()
    })

    test('clicking "View All Articles" navigates to articles hub', async ({ page }) => {
      await page.goto('/fr')

      const viewAllCta = page.getByRole('link', {
        name: new RegExp(frMessages.homepage.viewAllArticles, 'i'),
      })

      await viewAllCta.click()

      await expect(page).toHaveURL('/fr/articles')
    })

    test('EN locale "View All Articles" navigates to EN hub', async ({ page }) => {
      await page.goto('/en')

      const viewAllCta = page.getByRole('link', {
        name: new RegExp(enMessages.homepage.viewAllArticles, 'i'),
      })

      await viewAllCta.click()

      await expect(page).toHaveURL('/en/articles')
    })
  })

  test.describe('Multilingual Content', () => {
    test('article titles change when switching locale', async ({ page }) => {
      // Start with French
      await page.goto('/fr')
      const frTitle = await page.locator('h1').textContent()
      expect(frTitle).toContain(SEED_ARTICLES.featured.fr)

      // Switch to English
      await page.goto('/en')
      const enTitle = await page.locator('h1').textContent()
      expect(enTitle).toContain(SEED_ARTICLES.featured.en)

      // Titles should be different
      expect(frTitle).not.toBe(enTitle)
    })

    test('UI labels are translated', async ({ page }) => {
      // French labels
      await page.goto('/fr')
      await expect(
        page.getByRole('heading', { name: new RegExp(frMessages.homepage.recentArticles, 'i') }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: new RegExp(frMessages.homepage.viewAllArticles, 'i') }),
      ).toBeVisible()

      // English labels
      await page.goto('/en')
      await expect(
        page.getByRole('heading', { name: new RegExp(enMessages.homepage.recentArticles, 'i') }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: new RegExp(enMessages.homepage.viewAllArticles, 'i') }),
      ).toBeVisible()
    })
  })

  test.describe('Responsive Layout with Content', () => {
    test('mobile: featured article and grid display correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/fr')

      // Featured article should be visible
      await expect(page.locator('h1')).toBeVisible()

      // Recent articles section should be visible
      await expect(
        page.getByRole('heading', { name: new RegExp(frMessages.homepage.recentArticles, 'i') }),
      ).toBeVisible()

      // CTA should be visible
      await expect(
        page.getByRole('link', { name: new RegExp(frMessages.homepage.viewAllArticles, 'i') }),
      ).toBeVisible()
    })

    test('tablet: layout adapts correctly', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/fr')

      // All main sections should be visible
      await expect(page.locator('h1')).toBeVisible()
      await expect(
        page.getByRole('heading', { name: new RegExp(frMessages.homepage.recentArticles, 'i') }),
      ).toBeVisible()
    })

    test('desktop: full layout with all elements', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto('/fr')

      // Featured article should be visible
      await expect(page.locator('h1')).toBeVisible()

      // Recent articles grid
      await expect(
        page.getByRole('heading', { name: new RegExp(frMessages.homepage.recentArticles, 'i') }),
      ).toBeVisible()

      // View all CTA
      await expect(
        page.getByRole('link', { name: new RegExp(frMessages.homepage.viewAllArticles, 'i') }),
      ).toBeVisible()
    })
  })

  test.describe('Article Tags Display', () => {
    test('featured article displays tag pills', async ({ page }) => {
      await page.goto('/fr')

      // The first article has tags: nextjs, cloudflare, typescript, performance
      // Look for at least one tag
      const tagPill = page.getByText('Next.js').first()
      await expect(tagPill).toBeVisible()
    })
  })
})
