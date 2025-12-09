import type { FieldHook } from 'payload'

/**
 * Shared validation utilities for Payload CMS fields.
 * Includes slug normalization, taxonomy validation, and color validation.
 * Used by Categories, Tags, and any future collections requiring field validation.
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
 * Slug validation regex pattern.
 * Matches: lowercase letters, numbers, hyphens between segments.
 * Does not match: uppercase, consecutive hyphens, leading/trailing hyphens.
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Checks if a slug is valid (boolean version for runtime checks).
 * Use this for pre-validation before DB queries to avoid unnecessary calls.
 *
 * @param slug The slug to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * isValidSlug('my-article-123') // true
 * isValidSlug('') // false
 * isValidSlug('UPPERCASE') // false
 * isValidSlug('my--slug') // false
 */
export function isValidSlug(slug: string | null | undefined): boolean {
  if (!slug || typeof slug !== 'string') return false
  const trimmed = slug.trim()
  return trimmed.length > 0 && SLUG_REGEX.test(trimmed)
}

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
  return (
    isValidSlug(value) ||
    `Slug must contain only lowercase letters, numbers, and hyphens (e.g., "my-${entityName}-name")`
  )
}

/**
 * Validates that a string is a valid hexadecimal color code.
 * Accepts both 3-digit and 6-digit hex formats with a leading '#'.
 * Allows null/undefined values (returns true) for optional color fields.
 *
 * @param value The color value to validate
 * @returns true if valid or null/undefined, error message string if invalid
 *
 * @example
 * isValidHexColor('#FF5733') // true
 * isValidHexColor('#fff') // true
 * isValidHexColor('#ABC123') // true
 * isValidHexColor(null) // true
 * isValidHexColor('FF5733') // 'Please enter a valid hex color...'
 * isValidHexColor('#gg0000') // 'Please enter a valid hex color...'
 */
export function isValidHexColor(value: string | null | undefined): true | string {
  if (!value) return true
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(value) || 'Please enter a valid hex color (e.g., "#FF5733")'
}
