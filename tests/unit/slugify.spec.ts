import { describe, expect, it } from 'vitest'

import { validateTaxonomySlug } from '@/lib/slugify'

/**
 * Note: The slugifyTaxonomy function is a FieldHook and requires
 * full Payload context to test properly. These tests cover the
 * validation logic which is pure and easily testable.
 */

describe('validateTaxonomySlug', () => {
  it('should accept valid slugs', () => {
    expect(validateTaxonomySlug('hello-world')).toBe(true)
    expect(validateTaxonomySlug('javascript')).toBe(true)
    expect(validateTaxonomySlug('react-hooks-2024')).toBe(true)
    expect(validateTaxonomySlug('a-b-c-d-e')).toBe(true)
    expect(validateTaxonomySlug('test123')).toBe(true)
    expect(validateTaxonomySlug('123test')).toBe(true)
  })

  it('should reject invalid slugs', () => {
    expect(validateTaxonomySlug('UPPERCASE')).toContain('Slug must contain only')
    expect(validateTaxonomySlug('with spaces')).toContain('Slug must contain only')
    expect(validateTaxonomySlug('with--double-hyphens')).toContain('Slug must contain only')
    expect(validateTaxonomySlug('-leading-hyphen')).toContain('Slug must contain only')
    expect(validateTaxonomySlug('trailing-hyphen-')).toContain('Slug must contain only')
    expect(validateTaxonomySlug('special!chars')).toContain('Slug must contain only')
    expect(validateTaxonomySlug('under_score')).toContain('Slug must contain only')
  })

  it('should allow null/undefined values', () => {
    expect(validateTaxonomySlug(null)).toBe(true)
    expect(validateTaxonomySlug(undefined)).toBe(true)
  })

  it('should use custom entity name in error message', () => {
    const result = validateTaxonomySlug('INVALID', 'tag')
    expect(result).toContain('my-tag-name')
  })

  it('should use default entity name when not provided', () => {
    const result = validateTaxonomySlug('INVALID')
    expect(result).toContain('my-taxonomy-name')
  })
})
