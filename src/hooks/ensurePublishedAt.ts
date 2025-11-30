import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Ensures publishedAt is set when status is 'published'
 *
 * This hook auto-populates the publishedAt field with the current date/time
 * when an article is being published and doesn't have a publishedAt value set.
 *
 * @param data - Article data being created/updated
 * @returns Modified article data with publishedAt set if needed
 */
export const ensurePublishedAt: CollectionBeforeValidateHook = async ({ data }) => {
  if (!data) {
    return data
  }

  // If status is 'published' and publishedAt is not set, auto-populate it
  if (data.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  return data
}
