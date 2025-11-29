import type { FieldHook } from 'payload'

/**
 * Shared utilities for slug normalization and validation across taxonomy collections.
 * Used by Categories, Tags, and any future taxonomy-like collections.
 */

/**
 * Normalizes a string into a URL-friendly slug.
 * - Converts to lowercase
 * - Removes diacritics (é → e, ñ → n, etc.)
 * - Replaces non-alphanumeric characters with hyphens
 * - Removes leading/trailing hyphens
 * - Collapses multiple consecutive hyphens
 *
 * @example
 * slugifyTaxonomy('Hello World!') // 'hello-world'
 * slugifyTaxonomy('Café & Bar') // 'cafe-bar'
 * slugifyTaxonomy('  --multiple---hyphens--  ') // 'multiple-hyphens'
 */
function normalizeSlug(value: string | null | undefined): string | null | undefined {
  if (!value) return value
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
}

/**
 * Field hook that normalizes a text field value into a URL-friendly slug.
 * Use this in the `beforeChange` hook array for slug fields.
 *
 * @example
 * {
 *   name: 'slug',
 *   type: 'text',
 *   hooks: {
 *     beforeChange: [slugifyTaxonomy]
 *   }
 * }
 */
export const slugifyTaxonomy: FieldHook = ({ value }) => normalizeSlug(value as string)

/**
 * Validates that a slug matches the expected format:
 * - Lowercase letters and numbers only
 * - Hyphens allowed between segments (not at start/end)
 * - No consecutive hyphens
 *
 * @param value The slug to validate
 * @param entityName Optional entity name for error message (e.g., "category", "tag")
 * @returns true if valid, error message string if invalid
 *
 * @example
 * validateTaxonomySlug('my-tag-123') // true
 * validateTaxonomySlug('my--tag') // 'Slug must contain only...'
 * validateTaxonomySlug('-invalid-') // 'Slug must contain only...'
 * validateTaxonomySlug('UPPERCASE') // 'Slug must contain only...'
 */
export function validateTaxonomySlug(
  value: string | null | undefined,
  entityName = 'taxonomy',
): true | string {
  if (!value) return true
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return (
    slugRegex.test(value) ||
    `Slug must contain only lowercase letters, numbers, and hyphens (e.g., "my-${entityName}-name")`
  )
}
