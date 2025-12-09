/**
 * Article Fetch Utilities
 *
 * Provides type-safe functions for fetching articles from Payload CMS.
 * Uses Local API (no HTTP) for optimal performance on Edge.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Article } from '@/payload-types'
import type { Locale } from '@/i18n/config'
import { isValidSlug } from '@/lib/validators'

/**
 * Result type for article fetch operations
 */
export interface ArticleFetchResult {
  article: Article | null
  error?: string
}

/**
 * Fetch a single article by slug
 *
 * @param slug - Article slug (URL-friendly identifier)
 * @param locale - Locale for localized content (fr/en)
 * @returns Article data or null if not found
 *
 * @example
 * const { article, error } = await getArticleBySlug('mon-article', 'fr')
 * if (!article) notFound()
 */
export async function getArticleBySlug(slug: string, locale: Locale): Promise<ArticleFetchResult> {
  // Validate slug format before DB query to avoid unnecessary calls
  if (!isValidSlug(slug)) {
    return { article: null }
  }

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'articles',
      locale,
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 2, // Include relations (category, tags)
      limit: 1,
    })

    return {
      article: docs[0] ?? null,
    }
  } catch (error) {
    console.error('[getArticleBySlug] Error:', error)
    return {
      article: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
