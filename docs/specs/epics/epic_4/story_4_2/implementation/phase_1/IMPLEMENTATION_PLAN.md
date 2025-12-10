# Phase 1: TOC Data Extraction - Implementation Plan

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 1 - TOC Data Extraction
**Commits**: 3-4 atomic commits
**Estimated Duration**: 1-2 days

---

## Atomic Commit Strategy

This phase is broken into **3-4 small, focused commits** following atomic commit principles:

| # | Commit | Focus | Est. Lines | Est. Time |
|---|--------|-------|-----------|-----------|
| 1 | Types & Slugify Utility | Foundation types + shared utility | ~55 | 30-45 min |
| 2 | Extract Headings Function | Core extraction logic | ~75 | 45-60 min |
| 3 | Unit Tests | Comprehensive test coverage | ~150 | 60-90 min |
| 4 | Heading.tsx Integration | Refactor to use shared slugify | ~10 | 15-20 min |

**Total**: ~290 lines, 2.5-3.5 hours implementation time

---

## Commit 1: Types & Slugify Utility

### Objective

Define TypeScript types for TOC data structures and create the shared `slugify()` utility that will be used by both the extraction function and the existing Heading component.

### Files to Create

#### `src/lib/toc/types.ts`

```typescript
/**
 * TOC Data Types
 *
 * Type definitions for Table of Contents extraction and rendering.
 * Used by extractTOCHeadings() and TableOfContents component.
 */

import type { LexicalContent } from '@/components/richtext/types'

/**
 * Represents a single heading entry in the Table of Contents
 */
export interface TOCHeading {
  /** URL-friendly ID generated from heading text (matches Heading.tsx output) */
  id: string
  /** Plain text content of the heading */
  text: string
  /** Heading level - only h2 and h3 are supported for TOC */
  level: 2 | 3
}

/**
 * Array of TOC headings representing the full table of contents
 */
export type TOCData = TOCHeading[]

/**
 * Input type for extraction function
 */
export type TOCExtractionInput = LexicalContent | null | undefined
```

#### `src/lib/toc/slugify.ts`

```typescript
/**
 * Slugify Utility
 *
 * Generates URL-friendly slugs from text strings.
 * Used for heading IDs in both Heading.tsx and TOC extraction.
 *
 * IMPORTANT: This must produce identical output to the original
 * slugify in Heading.tsx to ensure ID matching.
 */

/**
 * Generate URL-friendly slug from text
 *
 * @param text - The text to slugify
 * @returns URL-friendly slug
 *
 * @example
 * slugify("Hello World") // "hello-world"
 * slugify("Café Résumé") // "cafe-resume"
 * slugify("  Multiple   Spaces  ") // "multiple-spaces"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
}
```

### Validation Checklist

- [ ] Types compile without errors
- [ ] JSDoc comments present on all exports
- [ ] `slugify()` handles edge cases (empty string, accents, special chars)
- [ ] No circular dependencies

### Commit Message Template

```
✨ feat(toc): add types and slugify utility for TOC extraction

- Add TOCHeading and TOCData type definitions
- Create shared slugify utility (moved from Heading.tsx logic)
- Prepare foundation for heading extraction

Story 4.2 Phase 1 - Commit 1/4
```

---

## Commit 2: Extract Headings Function

### Objective

Implement the core `extractTOCHeadings()` function that parses Lexical JSON content and returns an array of TOC headings.

### Files to Create

#### `src/lib/toc/extract-headings.ts`

```typescript
/**
 * TOC Heading Extraction
 *
 * Extracts h2 and h3 headings from Lexical JSON content
 * for Table of Contents generation.
 */

import type { LexicalNode, HeadingNode } from '@/components/richtext/types'
import { hasChildren, isHeadingNode, isTextNode } from '@/components/richtext/types'
import { slugify } from './slugify'
import type { TOCHeading, TOCData, TOCExtractionInput } from './types'

/**
 * Extract plain text from Lexical node children
 *
 * Recursively traverses node tree to extract text content.
 * Handles nested structures like links within headings.
 */
function extractText(children: LexicalNode[]): string {
  return children
    .map((child) => {
      if (isTextNode(child)) {
        return child.text
      }
      if (hasChildren(child)) {
        return extractText(child.children)
      }
      return ''
    })
    .join('')
}

/**
 * Check if heading level is supported for TOC (h2 or h3)
 */
function isTOCHeadingLevel(tag: HeadingNode['tag']): tag is 'h2' | 'h3' {
  return tag === 'h2' || tag === 'h3'
}

/**
 * Convert HeadingNode to TOCHeading
 */
function headingNodeToTOCHeading(node: HeadingNode): TOCHeading | null {
  if (!isTOCHeadingLevel(node.tag)) {
    return null
  }

  const text = extractText(node.children)
  if (!text.trim()) {
    return null // Skip empty headings
  }

  const id = slugify(text)
  if (!id) {
    return null // Skip headings that produce empty IDs
  }

  return {
    id,
    text: text.trim(),
    level: node.tag === 'h2' ? 2 : 3,
  }
}

/**
 * Recursively extract headings from Lexical node tree
 */
function extractFromNodes(nodes: LexicalNode[]): TOCHeading[] {
  const headings: TOCHeading[] = []

  for (const node of nodes) {
    if (isHeadingNode(node)) {
      const tocHeading = headingNodeToTOCHeading(node)
      if (tocHeading) {
        headings.push(tocHeading)
      }
    }

    // Continue traversing children for nested structures
    if (hasChildren(node)) {
      headings.push(...extractFromNodes(node.children))
    }
  }

  return headings
}

/**
 * Extract TOC headings from Lexical content
 *
 * Parses Lexical JSON structure and extracts h2/h3 headings
 * with their IDs and text content for Table of Contents display.
 *
 * @param content - Lexical JSON content from Payload CMS
 * @returns Array of TOC headings, empty array if no headings found
 *
 * @example
 * const headings = extractTOCHeadings(article.content)
 * // Returns: [{ id: 'introduction', text: 'Introduction', level: 2 }, ...]
 */
export function extractTOCHeadings(content: TOCExtractionInput): TOCData {
  if (!content?.root?.children) {
    return []
  }

  return extractFromNodes(content.root.children)
}
```

#### `src/lib/toc/index.ts`

```typescript
/**
 * TOC Module
 *
 * Utilities for Table of Contents extraction and generation.
 *
 * @example
 * import { extractTOCHeadings, slugify } from '@/lib/toc'
 *
 * const headings = extractTOCHeadings(article.content)
 */

// Types
export type { TOCHeading, TOCData, TOCExtractionInput } from './types'

// Utilities
export { slugify } from './slugify'
export { extractTOCHeadings } from './extract-headings'
```

### Validation Checklist

- [ ] Function handles null/undefined content gracefully
- [ ] Only h2 and h3 headings are extracted
- [ ] Empty headings are skipped
- [ ] Nested text (e.g., links in headings) is extracted correctly
- [ ] Generated IDs match Heading.tsx output
- [ ] TypeScript compiles without errors

### Commit Message Template

```
✨ feat(toc): implement extractTOCHeadings function

- Add extractTOCHeadings() to parse Lexical JSON
- Support h2/h3 heading extraction with text and ID
- Handle edge cases: null content, empty headings, nested text
- Export via @/lib/toc barrel file

Story 4.2 Phase 1 - Commit 2/4
```

---

## Commit 3: Unit Tests

### Objective

Create comprehensive unit tests covering all extraction scenarios including edge cases.

### Files to Create

#### `tests/unit/lib/toc/extract-headings.spec.ts`

```typescript
/**
 * TOC Extraction Unit Tests
 *
 * Tests for extractTOCHeadings() function and slugify utility.
 */

import { describe, it, expect } from 'vitest'
import { extractTOCHeadings, slugify } from '@/lib/toc'
import type { LexicalContent, HeadingNode, ParagraphNode } from '@/components/richtext/types'

// Helper to create minimal Lexical content structure
function createLexicalContent(children: (HeadingNode | ParagraphNode)[]): LexicalContent {
  return {
    root: {
      type: 'root',
      version: 1,
      children,
    },
  }
}

// Helper to create heading node
function createHeading(
  tag: HeadingNode['tag'],
  text: string
): HeadingNode {
  return {
    type: 'heading',
    tag,
    version: 1,
    children: [{ type: 'text', text, format: 0, version: 1 }],
  }
}

// Helper to create paragraph node
function createParagraph(text: string): ParagraphNode {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', text, format: 0, version: 1 }],
  }
}

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('multiple words here')).toBe('multiple-words-here')
  })

  it('should remove accents', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world')
  })

  it('should collapse multiple hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })

  it('should trim whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle string with only special chars', () => {
    expect(slugify('!@#$%')).toBe('')
  })
})

describe('extractTOCHeadings', () => {
  describe('basic extraction', () => {
    it('should extract h2 headings', () => {
      const content = createLexicalContent([
        createHeading('h2', 'Introduction'),
        createParagraph('Some text'),
        createHeading('h2', 'Conclusion'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: 'introduction', text: 'Introduction', level: 2 })
      expect(result[1]).toEqual({ id: 'conclusion', text: 'Conclusion', level: 2 })
    })

    it('should extract h3 headings', () => {
      const content = createLexicalContent([
        createHeading('h3', 'Subsection'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ id: 'subsection', text: 'Subsection', level: 3 })
    })

    it('should extract mixed h2 and h3 headings', () => {
      const content = createLexicalContent([
        createHeading('h2', 'Main Section'),
        createHeading('h3', 'Sub Section'),
        createHeading('h2', 'Another Main'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(3)
      expect(result[0].level).toBe(2)
      expect(result[1].level).toBe(3)
      expect(result[2].level).toBe(2)
    })
  })

  describe('filtering', () => {
    it('should ignore h1 headings', () => {
      const content = createLexicalContent([
        createHeading('h1', 'Title'),
        createHeading('h2', 'Introduction'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Introduction')
    })

    it('should ignore h4, h5, h6 headings', () => {
      const content = createLexicalContent([
        createHeading('h2', 'Main'),
        createHeading('h4', 'Deep'),
        createHeading('h5', 'Deeper'),
        createHeading('h6', 'Deepest'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Main')
    })
  })

  describe('edge cases', () => {
    it('should return empty array for null content', () => {
      expect(extractTOCHeadings(null)).toEqual([])
    })

    it('should return empty array for undefined content', () => {
      expect(extractTOCHeadings(undefined)).toEqual([])
    })

    it('should return empty array for content without children', () => {
      const content = { root: { type: 'root', version: 1, children: [] } } as LexicalContent
      expect(extractTOCHeadings(content)).toEqual([])
    })

    it('should skip empty headings', () => {
      const content = createLexicalContent([
        createHeading('h2', ''),
        createHeading('h2', 'Valid'),
        createHeading('h2', '   '),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Valid')
    })

    it('should handle headings with special characters', () => {
      const content = createLexicalContent([
        createHeading('h2', 'What is React?'),
        createHeading('h2', 'FAQ & Tips'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('what-is-react')
      expect(result[1].id).toBe('faq-tips')
    })

    it('should handle headings with accents', () => {
      const content = createLexicalContent([
        createHeading('h2', 'Méthodologie'),
        createHeading('h2', 'Résumé'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('methodologie')
      expect(result[1].id).toBe('resume')
    })
  })

  describe('nested content', () => {
    it('should extract text from headings with nested links', () => {
      const content: LexicalContent = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'heading',
              tag: 'h2',
              version: 1,
              children: [
                { type: 'text', text: 'Check out ', format: 0, version: 1 },
                {
                  type: 'link',
                  version: 1,
                  fields: { url: 'https://example.com' },
                  children: [{ type: 'text', text: 'this link', format: 0, version: 1 }],
                },
              ],
            },
          ],
        },
      }

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Check out this link')
      expect(result[0].id).toBe('check-out-this-link')
    })

    it('should handle headings with formatted text', () => {
      const content: LexicalContent = {
        root: {
          type: 'root',
          version: 1,
          children: [
            {
              type: 'heading',
              tag: 'h2',
              version: 1,
              children: [
                { type: 'text', text: 'Bold', format: 1, version: 1 },
                { type: 'text', text: ' and ', format: 0, version: 1 },
                { type: 'text', text: 'Italic', format: 2, version: 1 },
              ],
            },
          ],
        },
      }

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Bold and Italic')
    })
  })

  describe('real-world scenarios', () => {
    it('should handle typical article structure', () => {
      const content = createLexicalContent([
        createHeading('h2', 'Introduction'),
        createParagraph('Welcome to this article...'),
        createHeading('h2', 'Getting Started'),
        createHeading('h3', 'Prerequisites'),
        createParagraph('You will need...'),
        createHeading('h3', 'Installation'),
        createParagraph('Run the following command...'),
        createHeading('h2', 'Advanced Usage'),
        createHeading('h3', 'Configuration'),
        createHeading('h3', 'Customization'),
        createHeading('h2', 'Conclusion'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(8)
      expect(result.map(h => h.text)).toEqual([
        'Introduction',
        'Getting Started',
        'Prerequisites',
        'Installation',
        'Advanced Usage',
        'Configuration',
        'Customization',
        'Conclusion',
      ])
    })

    it('should preserve heading order', () => {
      const content = createLexicalContent([
        createHeading('h2', 'First'),
        createHeading('h3', 'Second'),
        createHeading('h2', 'Third'),
      ])

      const result = extractTOCHeadings(content)

      expect(result.map(h => h.text)).toEqual(['First', 'Second', 'Third'])
    })
  })
})
```

### Validation Checklist

- [ ] All tests pass (`pnpm test:unit`)
- [ ] Coverage > 80% for extraction module
- [ ] Edge cases covered (null, empty, special chars)
- [ ] Real-world scenarios tested

### Commit Message Template

```
✅ test(toc): add comprehensive unit tests for TOC extraction

- Add slugify utility tests (8 test cases)
- Add extractTOCHeadings tests (15+ test cases)
- Cover edge cases: null/empty content, special chars, accents
- Test nested content: links, formatted text
- Verify real-world article structure handling

Story 4.2 Phase 1 - Commit 3/4
```

---

## Commit 4: Heading.tsx Integration (Optional)

### Objective

Refactor Heading.tsx to import `slugify` from the shared location, ensuring a single source of truth.

### Files to Modify

#### `src/components/richtext/nodes/Heading.tsx`

**Before** (current):
```typescript
/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    // ... implementation
}
```

**After** (refactored):
```typescript
import { slugify } from '@/lib/toc'

// Re-export for backwards compatibility if needed
export { slugify }
```

### Validation Checklist

- [ ] Heading.tsx still compiles
- [ ] Article page renders headings correctly
- [ ] Generated heading IDs unchanged
- [ ] No import cycles created

### Commit Message Template

```
♻️ refactor(richtext): use shared slugify from @/lib/toc

- Import slugify from centralized location
- Remove duplicate implementation
- Maintain backwards compatibility with re-export

Story 4.2 Phase 1 - Commit 4/4
```

---

## Pre-Implementation Checklist

Before starting implementation:

- [ ] Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [ ] Verify dev environment working (`pnpm dev`)
- [ ] Verify tests run (`pnpm test:unit`)
- [ ] Create feature branch: `git checkout -b feature/story-4.2-phase-1`

## Post-Implementation Checklist

After completing all commits:

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Code reviewed (see [guides/REVIEW.md](./guides/REVIEW.md))
- [ ] Validation checklist completed ([validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md))

---

## Quick Reference

### File Locations Summary

| File | Path |
|------|------|
| Types | `src/lib/toc/types.ts` |
| Slugify | `src/lib/toc/slugify.ts` |
| Extraction | `src/lib/toc/extract-headings.ts` |
| Barrel | `src/lib/toc/index.ts` |
| Tests | `tests/unit/lib/toc/extract-headings.spec.ts` |

### Commands

```bash
# Create files
mkdir -p src/lib/toc tests/unit/lib/toc

# Run tests
pnpm test:unit

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# All quality checks
pnpm test:unit && pnpm exec tsc --noEmit && pnpm lint
```

---

**Plan Generated**: 2025-12-10
**Last Updated**: 2025-12-10
