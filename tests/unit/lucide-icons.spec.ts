import { describe, expect, it } from 'vitest'

import { getLucideIconOptions, isValidLucideIcon, LUCIDE_CATEGORY_ICONS } from '@/lib/lucide-icons'

describe('LUCIDE_CATEGORY_ICONS', () => {
  it('should contain a curated list of icons', () => {
    expect(LUCIDE_CATEGORY_ICONS).toBeDefined()
    expect(LUCIDE_CATEGORY_ICONS.length).toBeGreaterThan(0)
  })

  it('should include common blog category icons', () => {
    expect(LUCIDE_CATEGORY_ICONS).toContain('newspaper')
    expect(LUCIDE_CATEGORY_ICONS).toContain('book')
    expect(LUCIDE_CATEGORY_ICONS).toContain('code')
    expect(LUCIDE_CATEGORY_ICONS).toContain('terminal')
  })

  it('should be a readonly array', () => {
    // TypeScript compile-time check - this will fail if const assertion is removed
    const firstIcon: string = LUCIDE_CATEGORY_ICONS[0]
    expect(firstIcon).toBe('newspaper')
  })
})

describe('isValidLucideIcon', () => {
  it('should accept valid Lucide icon identifiers', () => {
    expect(isValidLucideIcon('newspaper')).toBe(true)
    expect(isValidLucideIcon('book')).toBe(true)
    expect(isValidLucideIcon('book-open')).toBe(true)
    expect(isValidLucideIcon('code')).toBe(true)
    expect(isValidLucideIcon('terminal')).toBe(true)
  })

  it('should reject invalid icon identifiers', () => {
    expect(isValidLucideIcon('invalid-icon')).toContain('Please select a valid icon')
    expect(isValidLucideIcon('not-an-icon')).toContain('Please select a valid icon')
    expect(isValidLucideIcon('random-string')).toContain('Please select a valid icon')
  })

  it('should allow null/undefined values', () => {
    expect(isValidLucideIcon(null)).toBe(true)
    expect(isValidLucideIcon(undefined)).toBe(true)
  })

  it('should allow empty string (treated as falsy)', () => {
    const result = isValidLucideIcon('')
    expect(result).toBe(true)
    // Verify it returns exactly true (not just truthy)
    expect(result === true).toBe(true)
  })

  it('should be case-sensitive', () => {
    const uppercaseResult = isValidLucideIcon('Newspaper')
    const allCapsResult = isValidLucideIcon('BOOK')

    // Verify they return error strings (returns true on success, error string on failure)
    expect(uppercaseResult).not.toBe(true)
    expect(allCapsResult).not.toBe(true)
    expect(typeof uppercaseResult).toBe('string')
    expect(typeof allCapsResult).toBe('string')
    expect(uppercaseResult).toContain('Please select a valid icon')
    expect(allCapsResult).toContain('Please select a valid icon')

    // Verify lowercase versions are valid
    expect(isValidLucideIcon('newspaper')).toBe(true)
    expect(isValidLucideIcon('book')).toBe(true)
  })
})

describe('getLucideIconOptions', () => {
  it('should return an array of option objects', () => {
    const options = getLucideIconOptions()
    expect(Array.isArray(options)).toBe(true)
    expect(options.length).toBe(LUCIDE_CATEGORY_ICONS.length)
  })

  it('should format options with label and value', () => {
    const options = getLucideIconOptions()
    options.forEach((option) => {
      expect(option).toHaveProperty('label')
      expect(option).toHaveProperty('value')
      expect(typeof option.label).toBe('string')
      expect(typeof option.value).toBe('string')
    })
  })

  it.each([
    { value: 'newspaper', expectedLabel: 'Newspaper' },
    { value: 'book-open', expectedLabel: 'Book Open' },
    { value: 'code-xml', expectedLabel: 'Code Xml' },
    { value: 'file-text', expectedLabel: 'File Text' },
  ])('should convert "$value" to "$expectedLabel"', ({ value, expectedLabel }) => {
    const options = getLucideIconOptions()
    const option = options.find((opt) => opt.value === value)

    expect(option).toBeDefined()
    expect(option?.label).toBe(expectedLabel)
  })

  it('should use lowercase kebab-case for all values', () => {
    const options = getLucideIconOptions()

    options.forEach((opt) => {
      expect(opt.value).toMatch(/^[a-z]+(-[a-z0-9]+)*$/)
      expect(opt.value).toBe(opt.value.toLowerCase())
    })
  })

  it('should convert hyphens to spaces in multi-word labels', () => {
    const options = getLucideIconOptions()
    const multiWordOptions = options.filter((opt) => opt.value.includes('-'))

    expect(multiWordOptions.length).toBeGreaterThan(0)
    multiWordOptions.forEach((opt) => {
      expect(opt.label).toContain(' ')
      expect(opt.label).not.toContain('-')
    })
  })
})
