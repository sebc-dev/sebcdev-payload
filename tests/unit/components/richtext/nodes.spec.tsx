import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

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
import { Paragraph } from '@/components/richtext/nodes/Paragraph'
import { Heading, slugify } from '@/components/richtext/nodes/Heading'
import { List, ListItem } from '@/components/richtext/nodes/List'
import { Quote } from '@/components/richtext/nodes/Quote'
import { Link, isExternalUrl, isSpecialProtocol } from '@/components/richtext/nodes/Link'
import type {
  ParagraphNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  LinkNode,
} from '@/components/richtext/types'

describe('slugify', () => {
  it('converts text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('Hello World Test')).toBe('hello-world-test')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('removes accents', () => {
    expect(slugify('Héllo Wörld')).toBe('hello-world')
  })

  it('handles French accents', () => {
    expect(slugify('élève été')).toBe('eleve-ete')
  })

  it('handles multiple consecutive spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world')
  })

  it('trims whitespace', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles string with only special characters', () => {
    expect(slugify('!@#$%')).toBe('')
  })

  it('removes duplicate hyphens', () => {
    expect(slugify('Hello - - World')).toBe('hello-world')
  })
})

describe('Paragraph', () => {
  it('renders paragraph element', () => {
    const node: ParagraphNode = {
      type: 'paragraph',
      version: 1,
      children: [{ type: 'text', text: 'Test paragraph', format: 0, version: 1 }],
    }

    const { container } = render(<Paragraph node={node} />)
    const p = container.querySelector('p')

    expect(p).toBeTruthy()
    expect(p?.textContent).toBe('Test paragraph')
  })

  it('applies correct classes', () => {
    const node: ParagraphNode = {
      type: 'paragraph',
      version: 1,
      children: [{ type: 'text', text: 'Test', format: 0, version: 1 }],
    }

    const { container } = render(<Paragraph node={node} />)
    const p = container.querySelector('p')

    expect(p?.className).toContain('mb-4')
    expect(p?.className).toContain('leading-relaxed')
  })

  it('renders nested formatted text', () => {
    const node: ParagraphNode = {
      type: 'paragraph',
      version: 1,
      children: [
        { type: 'text', text: 'Normal ', format: 0, version: 1 },
        { type: 'text', text: 'bold', format: 1, version: 1 },
      ],
    }

    const { container } = render(<Paragraph node={node} />)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.textContent).toBe('Normal bold')
  })
})

describe('Heading', () => {
  it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)('renders %s element', (tag) => {
    const node: HeadingNode = {
      type: 'heading',
      tag,
      version: 1,
      children: [{ type: 'text', text: 'Test Heading', format: 0, version: 1 }],
    }

    const { container } = render(<Heading node={node} />)
    const heading = container.querySelector(tag)

    expect(heading).toBeTruthy()
    expect(heading?.textContent).toContain('Test Heading')
  })

  it('generates id from text', () => {
    const node: HeadingNode = {
      type: 'heading',
      tag: 'h2',
      version: 1,
      children: [{ type: 'text', text: 'My Heading', format: 0, version: 1 }],
    }

    const { container } = render(<Heading node={node} />)
    const heading = container.querySelector('h2')

    expect(heading?.id).toBe('my-heading')
  })

  it('generates id from text with accents', () => {
    const node: HeadingNode = {
      type: 'heading',
      tag: 'h2',
      version: 1,
      children: [{ type: 'text', text: 'Élève été', format: 0, version: 1 }],
    }

    const { container } = render(<Heading node={node} />)
    const heading = container.querySelector('h2')

    expect(heading?.id).toBe('eleve-ete')
  })

  it('includes anchor link', () => {
    const node: HeadingNode = {
      type: 'heading',
      tag: 'h2',
      version: 1,
      children: [{ type: 'text', text: 'Test Heading', format: 0, version: 1 }],
    }

    const { container } = render(<Heading node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor).toBeTruthy()
    expect(anchor?.getAttribute('href')).toBe('#test-heading')
    expect(anchor?.getAttribute('aria-label')).toBe('Link to Test Heading')
  })

  it('applies correct styling classes', () => {
    const node: HeadingNode = {
      type: 'heading',
      tag: 'h2',
      version: 1,
      children: [{ type: 'text', text: 'Test', format: 0, version: 1 }],
    }

    const { container } = render(<Heading node={node} />)
    const heading = container.querySelector('h2')

    expect(heading?.className).toContain('text-3xl')
    expect(heading?.className).toContain('font-bold')
    expect(heading?.className).toContain('scroll-mt-20')
    expect(heading?.className).toContain('group')
  })

  it('extracts text from nested nodes', () => {
    const node: HeadingNode = {
      type: 'heading',
      tag: 'h2',
      version: 1,
      children: [
        { type: 'text', text: 'Hello ', format: 0, version: 1 },
        { type: 'text', text: 'World', format: 1, version: 1 },
      ],
    }

    const { container } = render(<Heading node={node} />)
    const heading = container.querySelector('h2')

    expect(heading?.id).toBe('hello-world')
  })
})

describe('List', () => {
  it('renders unordered list with ul tag', () => {
    const node: ListNode = {
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
    }

    const { container } = render(<List node={node} />)
    const ul = container.querySelector('ul')

    expect(ul).toBeTruthy()
    expect(ul?.className).toContain('list-disc')
  })

  it('renders ordered list with ol tag', () => {
    const node: ListNode = {
      type: 'list',
      listType: 'number',
      tag: 'ol',
      version: 1,
      children: [
        {
          type: 'listitem',
          version: 1,
          children: [{ type: 'text', text: 'Item 1', format: 0, version: 1 }],
        },
      ],
    }

    const { container } = render(<List node={node} />)
    const ol = container.querySelector('ol')

    expect(ol).toBeTruthy()
    expect(ol?.className).toContain('list-decimal')
  })

  it('renders multiple list items', () => {
    const node: ListNode = {
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
        {
          type: 'listitem',
          version: 1,
          children: [{ type: 'text', text: 'Item 2', format: 0, version: 1 }],
        },
      ],
    }

    const { container } = render(<List node={node} />)
    const items = container.querySelectorAll('li')

    expect(items.length).toBe(2)
    expect(items[0].textContent).toBe('Item 1')
    expect(items[1].textContent).toBe('Item 2')
  })

  it('respects start attribute for ordered lists', () => {
    const node: ListNode = {
      type: 'list',
      listType: 'number',
      tag: 'ol',
      version: 1,
      start: 5,
      children: [
        {
          type: 'listitem',
          version: 1,
          children: [{ type: 'text', text: 'Item', format: 0, version: 1 }],
        },
      ],
    }

    const { container } = render(<List node={node} />)
    const ol = container.querySelector('ol')

    expect(ol?.getAttribute('start')).toBe('5')
  })

  it('applies proper classes', () => {
    const node: ListNode = {
      type: 'list',
      listType: 'bullet',
      tag: 'ul',
      version: 1,
      children: [
        {
          type: 'listitem',
          version: 1,
          children: [{ type: 'text', text: 'Item', format: 0, version: 1 }],
        },
      ],
    }

    const { container } = render(<List node={node} />)
    const ul = container.querySelector('ul')

    expect(ul?.className).toContain('pl-6')
    expect(ul?.className).toContain('mb-4')
    expect(ul?.className).toContain('space-y-1')
  })
})

describe('ListItem', () => {
  it('renders li element', () => {
    const node: ListItemNode = {
      type: 'listitem',
      version: 1,
      children: [{ type: 'text', text: 'List item text', format: 0, version: 1 }],
    }

    const { container } = render(<ListItem node={node} />)
    const li = container.querySelector('li')

    expect(li).toBeTruthy()
    expect(li?.textContent).toBe('List item text')
  })

  it('renders formatted text in list items', () => {
    const node: ListItemNode = {
      type: 'listitem',
      version: 1,
      children: [
        { type: 'text', text: 'Normal ', format: 0, version: 1 },
        { type: 'text', text: 'bold', format: 1, version: 1 },
      ],
    }

    const { container } = render(<ListItem node={node} />)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.textContent).toBe('Normal bold')
  })
})

describe('Quote', () => {
  it('renders blockquote element', () => {
    const node: QuoteNode = {
      type: 'quote',
      version: 1,
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', text: 'Quote text', format: 0, version: 1 }],
        },
      ],
    }

    const { container } = render(<Quote node={node} />)
    const blockquote = container.querySelector('blockquote')

    expect(blockquote).toBeTruthy()
    expect(blockquote?.textContent).toBe('Quote text')
  })

  it('applies correct styling classes', () => {
    const node: QuoteNode = {
      type: 'quote',
      version: 1,
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', text: 'Quote', format: 0, version: 1 }],
        },
      ],
    }

    const { container } = render(<Quote node={node} />)
    const blockquote = container.querySelector('blockquote')

    expect(blockquote?.className).toContain('border-l-4')
    expect(blockquote?.className).toContain('border-primary')
    expect(blockquote?.className).toContain('pl-4')
    expect(blockquote?.className).toContain('italic')
    expect(blockquote?.className).toContain('text-muted-foreground')
  })

  it('renders nested formatted content', () => {
    const node: QuoteNode = {
      type: 'quote',
      version: 1,
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            { type: 'text', text: 'Important: ', format: 1, version: 1 },
            { type: 'text', text: 'This is quoted', format: 0, version: 1 },
          ],
        },
      ],
    }

    const { container } = render(<Quote node={node} />)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.textContent).toBe('Important: This is quoted')
  })
})

describe('isExternalUrl', () => {
  it('returns false for relative paths', () => {
    expect(isExternalUrl('/about')).toBe(false)
    expect(isExternalUrl('/articles/test')).toBe(false)
  })

  it('returns false for anchor links', () => {
    expect(isExternalUrl('#section')).toBe(false)
  })

  it('returns false for mailto links', () => {
    expect(isExternalUrl('mailto:test@example.com')).toBe(false)
  })

  it('returns false for tel links', () => {
    expect(isExternalUrl('tel:+1234567890')).toBe(false)
  })

  it('returns true for http URLs', () => {
    expect(isExternalUrl('http://example.com')).toBe(true)
  })

  it('returns true for https URLs', () => {
    expect(isExternalUrl('https://example.com')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isExternalUrl('')).toBe(false)
  })

  it('returns false for invalid URLs', () => {
    expect(isExternalUrl('not-a-url')).toBe(false)
  })

  it('returns false for same-origin absolute URLs', () => {
    // jsdom sets window.location.origin to 'http://localhost'
    const currentOrigin = window.location.origin

    // Test with the default jsdom origin
    expect(isExternalUrl(`${currentOrigin}/about`)).toBe(false)
    expect(isExternalUrl(`${currentOrigin}/articles/test`)).toBe(false)
  })
})

describe('isSpecialProtocol', () => {
  it('returns true for mailto links', () => {
    expect(isSpecialProtocol('mailto:test@example.com')).toBe(true)
  })

  it('returns true for tel links', () => {
    expect(isSpecialProtocol('tel:+1234567890')).toBe(true)
  })

  it('returns false for http links', () => {
    expect(isSpecialProtocol('http://example.com')).toBe(false)
  })

  it('returns false for relative paths', () => {
    expect(isSpecialProtocol('/about')).toBe(false)
  })
})

describe('Link', () => {
  it('renders internal link with Next.js Link', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: '/about',
      },
      children: [{ type: 'text', text: 'About', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor).toBeTruthy()
    expect(anchor?.getAttribute('href')).toBe('/about')
    expect(anchor?.getAttribute('target')).toBeNull()
    expect(anchor?.textContent).toBe('About')
  })

  it('renders external link with target blank', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: 'https://example.com',
      },
      children: [{ type: 'text', text: 'External', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor).toBeTruthy()
    expect(anchor?.getAttribute('href')).toBe('https://example.com')
    expect(anchor?.getAttribute('target')).toBe('_blank')
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders mailto link without new tab', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: 'mailto:test@example.com',
      },
      children: [{ type: 'text', text: 'Email Us', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor).toBeTruthy()
    expect(anchor?.getAttribute('href')).toBe('mailto:test@example.com')
    expect(anchor?.getAttribute('target')).toBeNull()
  })

  it('renders tel link without new tab', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: 'tel:+1234567890',
      },
      children: [{ type: 'text', text: 'Call Us', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor).toBeTruthy()
    expect(anchor?.getAttribute('href')).toBe('tel:+1234567890')
    expect(anchor?.getAttribute('target')).toBeNull()
  })

  it('respects newTab field override', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: '/about',
        newTab: true,
      },
      children: [{ type: 'text', text: 'About', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor?.getAttribute('target')).toBe('_blank')
  })

  it('applies correct styling classes', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: '/about',
      },
      children: [{ type: 'text', text: 'About', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor?.className).toContain('text-primary')
    expect(anchor?.className).toContain('underline')
    expect(anchor?.className).toContain('underline-offset-4')
  })

  it('renders link with formatted children', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {
        url: '/about',
      },
      children: [
        { type: 'text', text: 'Bold ', format: 1, version: 1 },
        { type: 'text', text: 'link', format: 0, version: 1 },
      ],
    }

    const { container } = render(<Link node={node} />)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.textContent).toBe('Bold link')
  })

  it('uses # for undefined URL', () => {
    const node: LinkNode = {
      type: 'link',
      version: 1,
      fields: {},
      children: [{ type: 'text', text: 'Link', format: 0, version: 1 }],
    }

    const { container } = render(<Link node={node} />)
    const anchor = container.querySelector('a')

    expect(anchor?.getAttribute('href')).toBe('#')
  })
})
