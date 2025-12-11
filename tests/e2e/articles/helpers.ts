import type { Page } from '@playwright/test'
import { test } from '@playwright/test'

/**
 * Shared E2E test helpers for article pages
 */

// Seed data constants (must match scripts/seed.ts)
export const ARTICLE_SLUG = 'nextjs-cloudflare-workers'

/**
 * Helper: navigate to article and skip test if not seeded.
 */
export async function gotoArticleOrSkip(page: Page, locale: 'fr' | 'en' = 'fr'): Promise<void> {
  await page.goto(`/${locale}/articles/${ARTICLE_SLUG}`)

  // Skip if article not found - check for <article> element
  const articleElement = page.locator('article')
  const articleExists = (await articleElement.count()) > 0

  if (!articleExists) {
    test.skip(true, 'Database not seeded - run: pnpm seed --clean')
  }
}
