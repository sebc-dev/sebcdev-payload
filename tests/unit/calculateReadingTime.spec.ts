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

  it('should return null for draft articles', async () => {
    const text = 'word '.repeat(100).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'draft' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(null)
  })

  it('should return null for archived articles', async () => {
    const text = 'word '.repeat(100).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content, status: 'archived' } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(null)
  })

  it('should return null when status is undefined', async () => {
    const text = 'word '.repeat(100).trim()
    const content = createMockContent(text)

    const result = await calculateReadingTime({
      data: { content } as any,
      req: {} as any,
      operation: 'create',
      context: {},
    } as any)

    expect(result.readingTime).toBe(null)
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
})
