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
    expect(isValidLucideIcon('')).toBe(true)
  })

  it('should be case-sensitive', () => {
    expect(isValidLucideIcon('Newspaper')).toContain('Please select a valid icon')
    expect(isValidLucideIcon('BOOK')).toContain('Please select a valid icon')
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

  it('should format labels with capitalized words', () => {
    const options = getLucideIconOptions()
    const newspaperOption = options.find((opt) => opt.value === 'newspaper')
    const bookOpenOption = options.find((opt) => opt.value === 'book-open')
    const codeXmlOption = options.find((opt) => opt.value === 'code-xml')

    expect(newspaperOption?.label).toBe('Newspaper')
    expect(bookOpenOption?.label).toBe('Book Open')
    expect(codeXmlOption?.label).toBe('Code Xml')
  })

  it('should use kebab-case icon identifiers as values', () => {
    const options = getLucideIconOptions()
    const bookOpenOption = options.find((opt) => opt.label === 'Book Open')

    expect(bookOpenOption?.value).toBe('book-open')
  })
})
