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
function createHeading(tag: HeadingNode['tag'], text: string): HeadingNode {
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
      const content = createLexicalContent([createHeading('h3', 'Subsection')])

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
      expect(result[0]?.level).toBe(2)
      expect(result[1]?.level).toBe(3)
      expect(result[2]?.level).toBe(2)
    })
  })

  describe('filtering', () => {
    it('should include h1 headings', () => {
      const content = createLexicalContent([
        createHeading('h1', 'Title'),
        createHeading('h2', 'Introduction'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(2)
      expect(result[0]?.text).toBe('Title')
      expect(result[0]?.level).toBe(1)
      expect(result[1]?.text).toBe('Introduction')
      expect(result[1]?.level).toBe(2)
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
      expect(result[0]?.text).toBe('Main')
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
      expect(result[0]?.text).toBe('Valid')
    })

    it('should handle headings with special characters', () => {
      const content = createLexicalContent([
        createHeading('h2', 'What is React?'),
        createHeading('h2', 'FAQ & Tips'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe('what-is-react')
      expect(result[1]?.id).toBe('faq-tips')
    })

    it('should handle headings with accents', () => {
      const content = createLexicalContent([
        createHeading('h2', 'Méthodologie'),
        createHeading('h2', 'Résumé'),
      ])

      const result = extractTOCHeadings(content)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe('methodologie')
      expect(result[1]?.id).toBe('resume')
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
      expect(result[0]?.text).toBe('Check out this link')
      expect(result[0]?.id).toBe('check-out-this-link')
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
      expect(result[0]?.text).toBe('Bold and Italic')
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
      expect(result.map((h) => h.text)).toEqual([
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

      expect(result.map((h) => h.text)).toEqual(['First', 'Second', 'Third'])
    })
  })
})
