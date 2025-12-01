import { describe, expect, it } from 'vitest'

import { isValidHexColor, validateTaxonomySlug } from '@/lib/validators'

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

  it('should allow empty string', () => {
    expect(validateTaxonomySlug('')).toBe(true)
  })

  it('should use custom entity name in error message', () => {
    const result = validateTaxonomySlug('INVALID', 'tag')
    expect(result).toContain('my-tag-name')
    // Verify the custom entity name is actually used (not 'taxonomy')
    expect(result).not.toContain('my-taxonomy-name')
    expect(typeof result).toBe('string')
  })

  it('should use default entity name when not provided', () => {
    const result = validateTaxonomySlug('INVALID')
    expect(result).toContain('my-taxonomy-name')
  })
})

describe('isValidHexColor', () => {
  it('should accept valid 6-digit hex colors', () => {
    expect(isValidHexColor('#FF5733')).toBe(true)
    expect(isValidHexColor('#000000')).toBe(true)
    expect(isValidHexColor('#FFFFFF')).toBe(true)
    expect(isValidHexColor('#abc123')).toBe(true)
    expect(isValidHexColor('#AbC123')).toBe(true)
  })

  it('should accept valid 3-digit hex colors', () => {
    expect(isValidHexColor('#fff')).toBe(true)
    expect(isValidHexColor('#000')).toBe(true)
    expect(isValidHexColor('#F5A')).toBe(true)
    expect(isValidHexColor('#abc')).toBe(true)
  })

  it('should reject invalid hex colors', () => {
    expect(isValidHexColor('FF5733')).toContain('Please enter a valid hex color')
    expect(isValidHexColor('#gg0000')).toContain('Please enter a valid hex color')
    expect(isValidHexColor('#FF57')).toContain('Please enter a valid hex color')
    expect(isValidHexColor('#FF57333')).toContain('Please enter a valid hex color')
    expect(isValidHexColor('red')).toContain('Please enter a valid hex color')
    expect(isValidHexColor('#')).toContain('Please enter a valid hex color')
    expect(isValidHexColor('##FF5733')).toContain('Please enter a valid hex color')
  })

  it('should allow null/undefined values', () => {
    expect(isValidHexColor(null)).toBe(true)
    expect(isValidHexColor(undefined)).toBe(true)
  })

  it('should accept empty string', () => {
    const result = isValidHexColor('')
    expect(result).toBe(true) // Empty string is falsy, returns true
    // Verify it returns true (not just truthy) for empty string
    expect(result === true).toBe(true)
  })

  it('should return error string for invalid colors (not false)', () => {
    const result = isValidHexColor('invalid')
    expect(typeof result).toBe('string')
    expect(result).not.toBe(true)
    expect(result).not.toBe(false)
  })
})
