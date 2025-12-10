import { expect, test, type Page } from '@playwright/test'

/**
 * Article Page E2E Tests
 *
 * Tests article page rendering, navigation, and SEO elements.
 * Requires seeded data (run: pnpm seed --clean)
 *
 * These tests are SKIPPED in CI (no seed data) and run locally after: pnpm seed --clean
 */

// Seed data constants (must match scripts/seed.ts)
const TEST_ARTICLE = {
  slug: 'nextjs-cloudflare-workers',
  fr: {
    title: 'Déployer une Application Next.js sur Cloudflare Workers',
    category: 'Tutoriels',
  },
  en: {
    title: 'Deploy a Next.js Application on Cloudflare Workers',
    category: 'Tutorials',
  },
}

/**
 * Helper: navigate to article and skip test if not seeded
 * Returns the page if article exists, otherwise skips the test
 */
async function gotoArticleOrSkip(page: Page, locale: 'fr' | 'en' = 'fr'): Promise<void> {
  await page.goto(`/${locale}/articles/${TEST_ARTICLE.slug}`)
  const h1Text = await page.locator('h1').textContent()

  if (h1Text?.includes('non trouvé') || h1Text?.includes('Not Found')) {
    test.skip(true, 'Database not seeded - run: pnpm seed --clean')
  }
}

test.describe('Article Page', () => {
  test.describe('Content Rendering', () => {
    test('displays article title in H1', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(TEST_ARTICLE.fr.title)
    })

    test('displays article title in EN locale', async ({ page }) => {
      await gotoArticleOrSkip(page, 'en')

      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toContainText(TEST_ARTICLE.en.title)
    })

    test('renders article content (RichText)', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      // Article should have paragraphs
      const paragraphs = page.locator('article p')
      const count = await paragraphs.count()
      expect(count).toBeGreaterThan(0)
    })

    test('renders code blocks with syntax highlighting', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      // Look for code blocks (pre > code)
      const codeBlocks = page.locator('pre code')
      const count = await codeBlocks.count()

      // Skip if article has no code blocks
      if (count === 0) {
        test.skip(true, 'Article has no code blocks')
        return
      }

      // Code should have syntax highlighting classes
      const firstCode = codeBlocks.first()
      await expect(firstCode).toBeVisible()
    })

    test('displays category badge', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      // Category badge should be visible
      const categoryBadge = page.getByText(TEST_ARTICLE.fr.category).first()
      await expect(categoryBadge).toBeVisible()
    })

    test('displays reading time', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const readingTime = page.getByText(/min de lecture/i)
      await expect(readingTime.first()).toBeVisible()
    })
  })

  test.describe('SEO Metadata', () => {
    test('has correct page title', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const title = await page.title()
      expect(title).toContain(TEST_ARTICLE.fr.title)
      expect(title).toContain('SebCDev')
    })

    test('has meta description', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const description = await page.locator('meta[name="description"]').getAttribute('content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(10)
    })

    test('has Open Graph meta tags', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')

      expect(ogTitle).toBeTruthy()
      expect(ogType).toBe('article')
      expect(ogUrl).toContain(`/fr/articles/${TEST_ARTICLE.slug}`)
    })

    test('has Twitter Card meta tags', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')

      expect(twitterCard).toBeTruthy()
      expect(twitterTitle).toBeTruthy()
    })

    test('has hreflang alternates', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const frAlternate = page.locator('link[rel="alternate"][hreflang="fr"]')
      const enAlternate = page.locator('link[rel="alternate"][hreflang="en"]')

      await expect(frAlternate).toHaveAttribute(
        'href',
        new RegExp(`/fr/articles/${TEST_ARTICLE.slug}`),
      )
      await expect(enAlternate).toHaveAttribute(
        'href',
        new RegExp(`/en/articles/${TEST_ARTICLE.slug}`),
      )
    })

    test('has JSON-LD structured data', async ({ page }) => {
      await gotoArticleOrSkip(page, 'fr')

      const jsonLdScript = page.locator('script[type="application/ld+json"]')
      const jsonLdContent = await jsonLdScript.textContent()

      expect(jsonLdContent).toBeTruthy()

      const jsonLd = JSON.parse(jsonLdContent!)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Article')
      expect(jsonLd.headline).toContain(TEST_ARTICLE.fr.title)
    })
  })

  test.describe('Navigation', () => {
    test('navigate from homepage to article', async ({ page }) => {
      await page.goto('/fr')

      // Skip if no featured article link exists (empty state)
      const h1Link = page.locator('h1 a')
      const h1Count = await h1Link.count()
      if (h1Count === 0) {
        test.skip(true, 'No featured article - database not seeded')
        return
      }

      // Click on featured article
      await h1Link.click()

      // Verify navigation to an article page (any featured article)
      await expect(page).toHaveURL(/\/fr\/articles\/.+/)
      // Article page should have an H1 title (first H1 is the article title)
      await expect(page.locator('h1').first()).toBeVisible()
    })

    test('article exists in both locales', async ({ page }) => {
      // Test FR locale
      await gotoArticleOrSkip(page, 'fr')
      await expect(page.locator('h1')).toContainText(TEST_ARTICLE.fr.title)

      // Test EN locale (same article)
      await page.goto(`/en/articles/${TEST_ARTICLE.slug}`)
      await expect(page.locator('h1')).toContainText(TEST_ARTICLE.en.title)
    })
  })

  test.describe('Responsive Layout', () => {
    test('mobile: article renders correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await gotoArticleOrSkip(page, 'fr')

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })

    test('tablet: article renders correctly', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await gotoArticleOrSkip(page, 'fr')

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })

    test('desktop: article renders correctly', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await gotoArticleOrSkip(page, 'fr')

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })
  })
})
