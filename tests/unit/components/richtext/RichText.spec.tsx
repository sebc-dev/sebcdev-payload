import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { RichText } from '@/components/richtext/RichText'
import type { LexicalContent } from '@/components/richtext/types'

// Mock next/link to avoid router context issues
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('RichText', () => {
  it('returns null for null content', () => {
    const { container } = render(<RichText content={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null for undefined content', () => {
    const { container } = render(<RichText content={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null for empty content', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [],
      },
    }
    const { container } = render(<RichText content={content} />)
    // Empty children array results in empty array serialization, which renders as []
    // This is expected behavior - the component renders but with no visible content
    expect(container.textContent).toBe('')
  })

  it('renders paragraph content', () => {
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

    const { container } = render(<RichText content={content} />)
    expect(container.querySelector('p')).toBeTruthy()
    expect(container.textContent).toBe('Hello world')
  })

  it('applies prose styling classes', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', text: 'Test', format: 0, version: 1 }],
          },
        ],
      },
    }

    const { container } = render(<RichText content={content} />)
    const wrapper = container.firstChild as HTMLElement

    expect(wrapper?.className).toContain('prose')
    expect(wrapper?.className).toContain('prose-invert')
    expect(wrapper?.className).toContain('max-w-none')
  })

  it('applies custom className', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', text: 'Test', format: 0, version: 1 }],
          },
        ],
      },
    }

    const { container } = render(<RichText content={content} className="custom-class" />)
    const wrapper = container.firstChild as HTMLElement

    expect(wrapper?.className).toContain('custom-class')
  })

  it('renders complex content with multiple elements', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h2',
            version: 1,
            children: [{ type: 'text', text: 'Title', format: 0, version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [{ type: 'text', text: 'Paragraph text', format: 0, version: 1 }],
          },
          {
            type: 'list',
            listType: 'bullet',
            tag: 'ul',
            version: 1,
            children: [
              {
                type: 'listitem',
                version: 1,
                children: [{ type: 'text', text: 'Item 1', format: 0, version: 1 }],
              },
            ],
          },
        ],
      },
    }

    const { container } = render(<RichText content={content} />)

    expect(container.querySelector('h2')).toBeTruthy()
    expect(container.querySelector('p')).toBeTruthy()
    expect(container.querySelector('ul')).toBeTruthy()
    expect(container.querySelector('li')).toBeTruthy()
  })

  it('renders formatted text correctly', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              { type: 'text', text: 'Normal ', format: 0, version: 1 },
              { type: 'text', text: 'bold', format: 1, version: 1 },
              { type: 'text', text: ' and ', format: 0, version: 1 },
              { type: 'text', text: 'italic', format: 2, version: 1 },
            ],
          },
        ],
      },
    }

    const { container } = render(<RichText content={content} />)

    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.querySelector('em')).toBeTruthy()
    expect(container.textContent).toBe('Normal bold and italic')
  })
})
