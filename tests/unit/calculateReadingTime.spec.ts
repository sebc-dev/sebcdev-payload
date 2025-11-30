import { describe, it, expect } from 'vitest'
import { calculateReadingTime } from '@/hooks/calculateReadingTime'

describe('calculateReadingTime hook', () => {
  // Helper to create mock Lexical content
  const createMockContent = (text: string) => ({
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
            },
          ],
        },
      ],
    },
  })

  it('should handle null content for published articles', async () => {
    const result = await calculateReadingTime({
      data: { content: null, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(0)
  })

  it('should handle undefined content for published articles', async () => {
    const result = await calculateReadingTime({
      data: { status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(0)
  })

  it('should return 0 for draft articles', async () => {
    const text = 'word '.repeat(100).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'draft' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(0)
  })

  it('should return 0 for archived articles', async () => {
    const text = 'word '.repeat(100).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'archived' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(0)
  })

  it('should return 0 when status is undefined', async () => {
    const text = 'word '.repeat(100).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(0)
  })

  it('should handle null data gracefully', async () => {
    const result = await calculateReadingTime({
      data: null as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // When data is null, hook returns null per Payload conventions
    expect(result).toBeNull()
  })

  it('should handle undefined data gracefully', async () => {
    const result = await calculateReadingTime({
      data: undefined as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // When data is undefined, hook returns null per Payload conventions
    expect(result).toBeNull()
  })

  it('should handle empty params object gracefully', async () => {
    const result = await calculateReadingTime({} as any)

    // When data is missing from params, hook returns null per Payload conventions
    expect(result).toBeNull()
  })

  it('should calculate reading time for 100-word content', async () => {
    const text = 'word '.repeat(100).trim() // Exactly 100 words
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // 100 words / 200 wpm = 0.5, rounds up to 1
    expect(result.readingTime).toBe(1)
  })

  it('should calculate reading time for 200-word content', async () => {
    const text = 'word '.repeat(200).trim() // Exactly 200 words
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // 200 words / 200 wpm = 1 minute
    expect(result.readingTime).toBe(1)
  })

  it('should calculate reading time for 400-word content', async () => {
    const text = 'word '.repeat(400).trim() // Exactly 400 words
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // 400 words / 200 wpm = 2 minutes
    expect(result.readingTime).toBe(2)
  })

  it('should round up reading time correctly', async () => {
    const text = 'word '.repeat(250).trim() // 250 words
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // 250 words / 200 wpm = 1.25, rounds up to 2
    expect(result.readingTime).toBe(2)
  })

  it('should extract text from rich formatted content', async () => {
    const content = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'This is ', format: 0 },
              { type: 'text', text: 'bold text', format: 1 }, // Bold
              { type: 'text', text: ' and ' },
              { type: 'text', text: 'italic text', format: 2 }, // Italic
            ],
          },
        ],
      },
    }

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // "This is bold text and italic text" = 6 words
    // 6 / 200 = 0.03, rounds up to 1
    expect(result.readingTime).toBe(1)
  })

  it('should handle mixed content types (headings, paragraphs, lists)', async () => {
    const content = {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'This is a heading' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'This is a paragraph with text.' }],
          },
          {
            type: 'list',
            tag: 'ul',
            children: [
              {
                type: 'listitem',
                children: [{ type: 'text', text: 'First item' }],
              },
              {
                type: 'listitem',
                children: [{ type: 'text', text: 'Second item' }],
              },
            ],
          },
        ],
      },
    }

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // Total: "This is a heading This is a paragraph with text. First item Second item"
    // 14 words / 200 = 0.07, rounds up to 1
    expect(result.readingTime).toBe(1)
  })

  it('should skip calculation if context.skipReadingTimeHook is true', async () => {
    const text = 'word '.repeat(400).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, readingTime: 999 } as any,
      req: {} as any,
      operation: 'update',
      context: { skipReadingTimeHook: true },
    } as any)

    // Should return data unchanged
    expect(result.readingTime).toBe(999)
  })

  it('should handle empty content object for published articles', async () => {
    const result = await calculateReadingTime({
      data: { content: {}, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(0)
  })

  it('should handle code blocks and special content', async () => {
    const content = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Check this code:' }],
          },
          {
            type: 'code',
            children: [{ type: 'text', text: 'const x = 10' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'word '.repeat(180).trim() }],
          },
        ],
      },
    }

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // "Check this code" (3) + "const x = 10" (4) + 180 words = 187 words
    // 187 / 200 = 0.935, rounds up to 1
    expect(result.readingTime).toBe(1)
  })

  it('should handle content with root as array of nodes', async () => {
    // Some Lexical structures may have root as an array
    const content = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'First paragraph content.' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Second paragraph content.' }],
      },
    ]

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // "First paragraph content." (3) + "Second paragraph content." (3) = 6 words
    // 6 / 200 = 0.03, rounds up to 1
    expect(result.readingTime).toBe(1)
  })

  it('should handle very large content with budget protection', async () => {
    // Create a deeply nested structure that would normally cause issues
    const createNestedContent = (depth: number): Record<string, unknown> => {
      if (depth <= 0) {
        return { type: 'text', text: 'word '.repeat(50) }
      }
      return {
        type: 'paragraph',
        children: [createNestedContent(depth - 1), createNestedContent(depth - 1)],
      }
    }

    // Create moderately deep content (8 levels = 256 text nodes)
    const content = {
      root: {
        type: 'root',
        children: [createNestedContent(8)],
      },
    }

    const result = await calculateReadingTime({
      data: { content, status: 'published' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    // Should return a valid reading time (budget protection should handle large content)
    expect(typeof result.readingTime).toBe('number')
    expect(result.readingTime).toBeGreaterThanOrEqual(0)
  })

  /**
   * Unicode-aware word counting tests
   *
   * These tests validate the countWords() function handles CJK (Chinese, Japanese, Korean)
   * and other non-Latin scripts correctly. CJK languages don't use spaces between words,
   * so each CJK character is counted as approximately one word.
   *
   * Implementation uses:
   * 1. Intl.Segmenter (when available) for accurate word segmentation
   * 2. Fallback: hybrid approach (whitespace split + CJK character count)
   */
  describe('Unicode-aware word counting', () => {
    it('should count pure Chinese characters as individual words', async () => {
      // "你好世界" = 4 Chinese characters = 4 words
      const content = createMockContent('你好世界')

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 4 words / 200 wpm = 0.02, rounds up to 1
      expect(result.readingTime).toBe(1)
    })

    it('should count mixed Latin and CJK text correctly', async () => {
      // "Hello世界World" = "Hello" (1) + "世界" (2) + "World" (1) = 4 words
      const content = createMockContent('Hello世界World')

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 4 words / 200 wpm = 0.02, rounds up to 1
      expect(result.readingTime).toBe(1)
    })

    it('should count Japanese Hiragana and Katakana characters', async () => {
      // "こんにちは" (Hiragana) + "カタカナ" (Katakana) = 9 characters = 9 words
      const content = createMockContent('こんにちはカタカナ')

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 9 words / 200 wpm = 0.045, rounds up to 1
      expect(result.readingTime).toBe(1)
    })

    it('should count Korean Hangul characters', async () => {
      // "안녕하세요" = 5 Korean characters = 5 words
      const content = createMockContent('안녕하세요')

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 5 words / 200 wpm = 0.025, rounds up to 1
      expect(result.readingTime).toBe(1)
    })

    it('should handle mixed CJK scripts with Latin text and punctuation', async () => {
      // Complex mixed content: Latin + Chinese + Japanese + punctuation
      // "Hello 世界! How are you? こんにちは"
      // Latin: "Hello" (1) + "How" (1) + "are" (1) + "you" (1) = 4 words
      // Chinese: "世界" = 2 characters
      // Japanese: "こんにちは" = 5 characters
      // Total: 4 + 2 + 5 = 11 words
      const content = createMockContent('Hello 世界! How are you? こんにちは')

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 11 words / 200 wpm = 0.055, rounds up to 1
      expect(result.readingTime).toBe(1)
    })

    it('should still count standard Latin text correctly', async () => {
      // Verify existing Latin word counting behavior is preserved
      const content = createMockContent('The quick brown fox jumps over the lazy dog')

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 9 words / 200 wpm = 0.045, rounds up to 1
      expect(result.readingTime).toBe(1)
    })

    it('should handle longer CJK content for accurate reading time', async () => {
      // Create content with 200 Chinese characters (should equal 1 minute reading time)
      const chineseText = '中'.repeat(200)
      const content = createMockContent(chineseText)

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 200 characters / 200 wpm = 1 minute
      expect(result.readingTime).toBe(1)
    })

    it('should handle CJK content exceeding 200 characters', async () => {
      // Create content with 400 Chinese characters (should equal 2 minutes reading time)
      const chineseText = '文'.repeat(400)
      const content = createMockContent(chineseText)

      const result = await calculateReadingTime({
        data: { content, status: 'published' } as any,
        req: {} as any,
        operation: 'create',
        context: {},
      } as any)

      // 400 characters / 200 wpm = 2 minutes
      expect(result.readingTime).toBe(2)
    })
  })
})
