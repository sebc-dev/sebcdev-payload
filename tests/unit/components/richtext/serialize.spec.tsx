import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { serializeLexical, serializeChildren, serializeText } from '@/components/richtext/serialize'
import type { LexicalContent, TextNode } from '@/components/richtext/types'
import { TEXT_FORMAT } from '@/components/richtext/types'

describe('serializeLexical', () => {
  it('returns null for null content', () => {
    expect(serializeLexical(null)).toBeNull()
  })

  it('returns null for undefined content', () => {
    expect(serializeLexical(undefined)).toBeNull()
  })

  it('returns null for content without root', () => {
    expect(serializeLexical({} as LexicalContent)).toBeNull()
  })

  it('returns null for content without children', () => {
    const content = {
      root: {
        type: 'root' as const,
        version: 1,
      },
    } as LexicalContent
    expect(serializeLexical(content)).toBeNull()
  })

  it('serializes simple paragraph', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', text: 'Hello world', format: 0, version: 1 }],
          },
        ],
      },
    }

    const result = serializeLexical(content)
    const { container } = render(<>{result}</>)

    expect(container.querySelector('p')).toBeTruthy()
    expect(container.textContent).toBe('Hello world')
  })

  it('serializes heading', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h2',
            version: 1,
            children: [{ type: 'text', text: 'My Heading', format: 0, version: 1 }],
          },
        ],
      },
    }

    const result = serializeLexical(content)
    const { container } = render(<>{result}</>)

    expect(container.querySelector('h2')).toBeTruthy()
    expect(container.textContent).toContain('My Heading')
  })

  it('serializes linebreak', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              { type: 'text', text: 'Line 1', format: 0, version: 1 },
              { type: 'linebreak', version: 1 },
              { type: 'text', text: 'Line 2', format: 0, version: 1 },
            ],
          },
        ],
      },
    }

    const result = serializeLexical(content)
    const { container } = render(<>{result}</>)

    expect(container.querySelector('br')).toBeTruthy()
    expect(container.textContent).toBe('Line 1Line 2')
  })

  it('handles unknown node types gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'unknown-node' as 'paragraph',
            version: 1,
            children: [],
          },
        ],
      },
    }

    const result = serializeLexical(content)
    const { container } = render(<>{result}</>)

    expect(consoleSpy).toHaveBeenCalledWith('[serializeLexical] Unknown node type: unknown-node')
    expect(container.textContent).toBe('')

    consoleSpy.mockRestore()
  })
})

describe('serializeText', () => {
  it('renders plain text', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Plain text',
      format: 0,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.textContent).toBe('Plain text')
  })

  it('renders bold text', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Bold',
      format: TEXT_FORMAT.BOLD,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.textContent).toBe('Bold')
  })

  it('renders italic text', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Italic',
      format: TEXT_FORMAT.ITALIC,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('em')).toBeTruthy()
    expect(container.textContent).toBe('Italic')
  })

  it('renders underline text', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Underline',
      format: TEXT_FORMAT.UNDERLINE,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('u')).toBeTruthy()
  })

  it('renders strikethrough text', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Strike',
      format: TEXT_FORMAT.STRIKETHROUGH,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('s')).toBeTruthy()
  })

  it('renders inline code', () => {
    const node: TextNode = {
      type: 'text',
      text: 'code',
      format: TEXT_FORMAT.CODE,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('code')).toBeTruthy()
  })

  it('renders subscript text', () => {
    const node: TextNode = {
      type: 'text',
      text: '2',
      format: TEXT_FORMAT.SUBSCRIPT,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('sub')).toBeTruthy()
  })

  it('renders superscript text', () => {
    const node: TextNode = {
      type: 'text',
      text: '2',
      format: TEXT_FORMAT.SUPERSCRIPT,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('sup')).toBeTruthy()
  })

  it('renders combined bold + italic formatting', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Bold Italic',
      format: TEXT_FORMAT.BOLD | TEXT_FORMAT.ITALIC,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.querySelector('em')).toBeTruthy()
    expect(container.textContent).toBe('Bold Italic')
  })

  it('renders combined bold + italic + underline formatting', () => {
    const node: TextNode = {
      type: 'text',
      text: 'All styles',
      format: TEXT_FORMAT.BOLD | TEXT_FORMAT.ITALIC | TEXT_FORMAT.UNDERLINE,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.querySelector('em')).toBeTruthy()
    expect(container.querySelector('u')).toBeTruthy()
  })
})

describe('serializeChildren', () => {
  it('returns empty array for empty children', () => {
    expect(serializeChildren([])).toEqual([])
  })

  it('serializes multiple text children', () => {
    const children = [
      { type: 'text' as const, text: 'Hello ', format: 0, version: 1 },
      {
        type: 'text' as const,
        text: 'world',
        format: TEXT_FORMAT.BOLD,
        version: 1,
      },
    ]

    const result = serializeChildren(children)
    expect(result).toHaveLength(2)

    const { container } = render(<>{result}</>)
    expect(container.textContent).toBe('Hello world')
    expect(container.querySelector('strong')).toBeTruthy()
  })

  it('serializes mixed node types', () => {
    const children = [
      { type: 'text' as const, text: 'Before ', format: 0, version: 1 },
      { type: 'linebreak' as const, version: 1 },
      { type: 'text' as const, text: 'After', format: 0, version: 1 },
    ]

    const result = serializeChildren(children)
    expect(result).toHaveLength(3)

    const { container } = render(<>{result}</>)
    expect(container.querySelector('br')).toBeTruthy()
  })
})
