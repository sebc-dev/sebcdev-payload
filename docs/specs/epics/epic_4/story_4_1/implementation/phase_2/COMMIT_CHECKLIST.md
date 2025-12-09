# Phase 2 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 2.

---

## 📋 Commit 1: Lexical Types & Interfaces

**Files**: `src/components/richtext/types.ts`, `src/components/richtext/index.ts`
**Estimated Duration**: 30-45 minutes

### Implementation Tasks

- [ ] Create `src/components/richtext/` directory
- [ ] Create `types.ts` with all Lexical node type definitions
- [ ] Define `LexicalNode` union type
- [ ] Define `TextFormatFlags` enum or constants
- [ ] Define specific node interfaces (ParagraphNode, HeadingNode, etc.)
- [ ] Create `index.ts` barrel file with type exports

### File: `src/components/richtext/types.ts`

```typescript
/**
 * Lexical JSON Type Definitions
 *
 * Types for Payload CMS Lexical richText editor output.
 * Used by the serializer to convert JSON to React components.
 *
 * @see https://payloadcms.com/docs/rich-text/lexical
 */

/**
 * Text format flags (bitmask)
 * Combined using bitwise OR: bold + italic = 1 | 2 = 3
 */
export const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
} as const

export type TextFormat = (typeof TEXT_FORMAT)[keyof typeof TEXT_FORMAT]

/**
 * Base node properties shared by all Lexical nodes
 */
export interface BaseLexicalNode {
  type: string
  version: number
  direction?: 'ltr' | 'rtl' | null
  format?: string | number
  indent?: number
}

/**
 * Text node - leaf node containing actual text content
 */
export interface TextNode extends BaseLexicalNode {
  type: 'text'
  text: string
  format: number // Bitmask of TextFormat flags
  mode?: 'normal' | 'token' | 'segmented'
  style?: string
  detail?: number
}

/**
 * Linebreak node - represents a line break
 */
export interface LinebreakNode extends BaseLexicalNode {
  type: 'linebreak'
}

/**
 * Paragraph node - block element containing text/inline nodes
 */
export interface ParagraphNode extends BaseLexicalNode {
  type: 'paragraph'
  children: LexicalNode[]
  textFormat?: number
}

/**
 * Heading node - h1-h6 elements
 */
export interface HeadingNode extends BaseLexicalNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: LexicalNode[]
}

/**
 * List node - ordered or unordered list
 */
export interface ListNode extends BaseLexicalNode {
  type: 'list'
  listType: 'bullet' | 'number' | 'check'
  tag: 'ul' | 'ol'
  children: ListItemNode[]
  start?: number
}

/**
 * List item node - individual list item
 */
export interface ListItemNode extends BaseLexicalNode {
  type: 'listitem'
  children: LexicalNode[]
  checked?: boolean
  value?: number
}

/**
 * Quote node - blockquote element
 */
export interface QuoteNode extends BaseLexicalNode {
  type: 'quote'
  children: LexicalNode[]
}

/**
 * Link fields from Payload
 */
export interface LinkFields {
  url?: string
  newTab?: boolean
  linkType?: 'custom' | 'internal'
  doc?: {
    value: unknown
    relationTo: string
  }
}

/**
 * Link node - anchor element
 */
export interface LinkNode extends BaseLexicalNode {
  type: 'link'
  fields: LinkFields
  children: LexicalNode[]
}

/**
 * Autolink node - automatically detected links
 */
export interface AutoLinkNode extends BaseLexicalNode {
  type: 'autolink'
  fields: LinkFields
  children: LexicalNode[]
}

/**
 * Code block node - for Phase 3 (rendered as plain pre/code for now)
 */
export interface CodeNode extends BaseLexicalNode {
  type: 'code'
  language?: string
  children: LexicalNode[]
}

/**
 * Upload/Image node - for Phase 4 (placeholder for now)
 */
export interface UploadNode extends BaseLexicalNode {
  type: 'upload'
  value: {
    id: number | string
    url?: string
    alt?: string
    width?: number
    height?: number
  }
  fields?: Record<string, unknown>
  relationTo?: string
}

/**
 * Root node - top-level container
 */
export interface RootNode extends BaseLexicalNode {
  type: 'root'
  children: LexicalNode[]
}

/**
 * Union type of all supported Lexical nodes
 */
export type LexicalNode =
  | TextNode
  | LinebreakNode
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | QuoteNode
  | LinkNode
  | AutoLinkNode
  | CodeNode
  | UploadNode
  | RootNode

/**
 * Lexical content structure from Payload
 */
export interface LexicalContent {
  root: RootNode
}

/**
 * Props for node renderer components
 */
export interface NodeRendererProps {
  node: LexicalNode
}

/**
 * Type guard to check if node has children
 */
export function hasChildren(
  node: LexicalNode
): node is LexicalNode & { children: LexicalNode[] } {
  return 'children' in node && Array.isArray(node.children)
}

/**
 * Type guard for text nodes
 */
export function isTextNode(node: LexicalNode): node is TextNode {
  return node.type === 'text'
}

/**
 * Type guard for heading nodes
 */
export function isHeadingNode(node: LexicalNode): node is HeadingNode {
  return node.type === 'heading'
}
```

### Validation

```bash
# Type check only (no runtime code yet)
pnpm exec tsc --noEmit
```

**Expected Result**: TypeScript compiles without errors

### Review Checklist

#### Type Definitions

- [ ] All Lexical node types defined
- [ ] TextFormatFlags bitmask documented
- [ ] Base interface for shared properties
- [ ] Union type covers all nodes

#### Type Safety

- [ ] No `any` types used
- [ ] Optional fields marked correctly
- [ ] Correct use of type guards

#### Code Quality

- [ ] JSDoc comments on all interfaces
- [ ] Consistent naming convention
- [ ] No duplicate definitions

### Commit Message

```bash
git add src/components/richtext/
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add Lexical JSON type definitions

- Define TypeScript interfaces for all Lexical node types
- Add TEXT_FORMAT constants for text formatting bitmask
- Create type guards for node type checking
- Include types for: text, paragraph, heading, list, quote, link
- Prepare code/upload types for Phase 3/4 (placeholder)
- Export from richtext barrel file

Part of Phase 2 - Commit 1/6
EOF
)"
```

---

## 📋 Commit 2: Base Serializer Function

**Files**: `src/components/richtext/serialize.tsx`, `tests/unit/components/richtext/serialize.spec.ts`
**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Create `serialize.tsx` with main serializer function
- [ ] Implement `serializeLexical` entry point
- [ ] Implement `serializeNode` recursive function
- [ ] Implement `serializeChildren` helper
- [ ] Implement `serializeText` for text nodes with formatting
- [ ] Add unit tests for serializer

### File: `src/components/richtext/serialize.tsx`

```typescript
/**
 * Lexical JSON Serializer
 *
 * Converts Payload Lexical JSON to React components.
 * Handles recursive node traversal and text formatting.
 */

import type { ReactNode } from 'react'
import type {
  LexicalContent,
  LexicalNode,
  TextNode,
} from './types'
import { TEXT_FORMAT, hasChildren, isTextNode } from './types'

/**
 * Main entry point: serialize Lexical content to React
 *
 * @param content - Lexical JSON content from Payload
 * @returns React elements or null if empty
 */
export function serializeLexical(content: LexicalContent | null | undefined): ReactNode {
  if (!content?.root?.children) {
    return null
  }

  return serializeChildren(content.root.children)
}

/**
 * Serialize an array of child nodes
 *
 * @param children - Array of Lexical nodes
 * @returns Array of React elements
 */
export function serializeChildren(children: LexicalNode[]): ReactNode[] {
  return children.map((node, index) => serializeNode(node, index))
}

/**
 * Serialize a single Lexical node to React
 *
 * @param node - Lexical node to serialize
 * @param index - Index for React key
 * @returns React element or null
 */
export function serializeNode(node: LexicalNode, index: number): ReactNode {
  // Handle text nodes specially
  if (isTextNode(node)) {
    return serializeText(node, index)
  }

  // Handle linebreak
  if (node.type === 'linebreak') {
    return <br key={index} />
  }

  // Route to specific node handlers
  // These will be implemented in subsequent commits
  switch (node.type) {
    case 'paragraph':
      // Commit 3
      return (
        <p key={index} className="mb-4">
          {hasChildren(node) ? serializeChildren(node.children) : null}
        </p>
      )

    case 'heading':
      // Commit 3 - placeholder
      const HeadingTag = (node as { tag: string }).tag || 'h2'
      return (
        <HeadingTag key={index} className="font-bold mt-6 mb-4">
          {hasChildren(node) ? serializeChildren(node.children) : null}
        </HeadingTag>
      )

    case 'list':
      // Commit 4 - placeholder
      const ListTag = (node as { tag: string }).tag || 'ul'
      return (
        <ListTag key={index} className="list-disc pl-6 mb-4">
          {hasChildren(node) ? serializeChildren(node.children) : null}
        </ListTag>
      )

    case 'listitem':
      // Commit 4 - placeholder
      return (
        <li key={index}>
          {hasChildren(node) ? serializeChildren(node.children) : null}
        </li>
      )

    case 'quote':
      // Commit 4 - placeholder
      return (
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4">
          {hasChildren(node) ? serializeChildren(node.children) : null}
        </blockquote>
      )

    case 'link':
    case 'autolink':
      // Commit 5 - placeholder
      const linkFields = (node as { fields?: { url?: string } }).fields
      return (
        <a key={index} href={linkFields?.url || '#'} className="text-primary underline">
          {hasChildren(node) ? serializeChildren(node.children) : null}
        </a>
      )

    case 'code':
      // Phase 3 - render as plain code for now
      return (
        <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
          <code>
            {hasChildren(node) ? serializeChildren(node.children) : null}
          </code>
        </pre>
      )

    case 'upload':
      // Phase 4 - placeholder
      return (
        <div key={index} className="my-4 p-4 bg-muted rounded-lg text-center text-muted-foreground">
          [Image placeholder - Phase 4]
        </div>
      )

    default:
      // Unknown node type - render children if available
      console.warn(`[serializeLexical] Unknown node type: ${node.type}`)
      if (hasChildren(node)) {
        return <>{serializeChildren(node.children)}</>
      }
      return null
  }
}

/**
 * Serialize a text node with formatting
 *
 * @param node - Text node to serialize
 * @param index - Index for React key
 * @returns Formatted text element
 */
export function serializeText(node: TextNode, index: number): ReactNode {
  let text: ReactNode = node.text

  // Apply formatting based on bitmask
  const format = node.format || 0

  if (format & TEXT_FORMAT.BOLD) {
    text = <strong>{text}</strong>
  }

  if (format & TEXT_FORMAT.ITALIC) {
    text = <em>{text}</em>
  }

  if (format & TEXT_FORMAT.UNDERLINE) {
    text = <u>{text}</u>
  }

  if (format & TEXT_FORMAT.STRIKETHROUGH) {
    text = <s>{text}</s>
  }

  if (format & TEXT_FORMAT.CODE) {
    text = (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {text}
      </code>
    )
  }

  if (format & TEXT_FORMAT.SUBSCRIPT) {
    text = <sub>{text}</sub>
  }

  if (format & TEXT_FORMAT.SUPERSCRIPT) {
    text = <sup>{text}</sup>
  }

  // Return with key for array rendering
  return <span key={index}>{text}</span>
}
```

### File: `tests/unit/components/richtext/serialize.spec.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import {
  serializeLexical,
  serializeChildren,
  serializeText,
} from '@/components/richtext/serialize'
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

  it('serializes simple paragraph', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              { type: 'text', text: 'Hello world', format: 0, version: 1 },
            ],
          },
        ],
      },
    }

    const result = serializeLexical(content)
    const { container } = render(<>{result}</>)

    expect(container.querySelector('p')).toBeTruthy()
    expect(container.textContent).toBe('Hello world')
  })
})

describe('serializeText', () => {
  it('renders plain text', () => {
    const node: TextNode = { type: 'text', text: 'Plain text', format: 0, version: 1 }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.textContent).toBe('Plain text')
  })

  it('renders bold text', () => {
    const node: TextNode = { type: 'text', text: 'Bold', format: TEXT_FORMAT.BOLD, version: 1 }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('strong')).toBeTruthy()
  })

  it('renders italic text', () => {
    const node: TextNode = { type: 'text', text: 'Italic', format: TEXT_FORMAT.ITALIC, version: 1 }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('em')).toBeTruthy()
  })

  it('renders combined formatting', () => {
    const node: TextNode = {
      type: 'text',
      text: 'Bold Italic',
      format: TEXT_FORMAT.BOLD | TEXT_FORMAT.ITALIC,
      version: 1,
    }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.querySelector('em')).toBeTruthy()
  })

  it('renders inline code', () => {
    const node: TextNode = { type: 'text', text: 'code', format: TEXT_FORMAT.CODE, version: 1 }
    const { container } = render(<>{serializeText(node, 0)}</>)
    expect(container.querySelector('code')).toBeTruthy()
  })
})

describe('serializeChildren', () => {
  it('returns empty array for empty children', () => {
    expect(serializeChildren([])).toEqual([])
  })

  it('serializes multiple children', () => {
    const children = [
      { type: 'text' as const, text: 'Hello ', format: 0, version: 1 },
      { type: 'text' as const, text: 'world', format: TEXT_FORMAT.BOLD, version: 1 },
    ]

    const result = serializeChildren(children)
    expect(result).toHaveLength(2)
  })
})
```

### Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "serialize"
```

**Expected Result**: All tests pass, TypeScript compiles

### Review Checklist

#### Serializer Logic

- [ ] Entry point handles null/undefined
- [ ] Recursive traversal works correctly
- [ ] Unknown nodes handled gracefully
- [ ] Text formatting applied correctly

#### Text Formatting

- [ ] Bold (`<strong>`)
- [ ] Italic (`<em>`)
- [ ] Underline (`<u>`)
- [ ] Strikethrough (`<s>`)
- [ ] Inline code (`<code>`)
- [ ] Combined formats work

#### Code Quality

- [ ] No `any` types
- [ ] Keys provided for array elements
- [ ] Warning logged for unknown nodes
- [ ] Tests cover all scenarios

### Commit Message

```bash
git add src/components/richtext/serialize.tsx tests/unit/components/richtext/
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add base Lexical serializer with text formatting

- Create serializeLexical main entry point
- Implement recursive node traversal via serializeNode
- Add serializeChildren helper for child arrays
- Implement serializeText with format bitmask support
- Support bold, italic, underline, strikethrough, code formatting
- Add placeholder handlers for all node types
- Include unit tests for serializer functions

Part of Phase 2 - Commit 2/6
EOF
)"
```

---

## 📋 Commit 3: Text Nodes (Paragraph & Heading)

**Files**: `src/components/richtext/nodes/Paragraph.tsx`, `src/components/richtext/nodes/Heading.tsx`, `src/components/richtext/nodes/index.ts`
**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Create `src/components/richtext/nodes/` directory
- [ ] Create `Paragraph.tsx` component
- [ ] Create `Heading.tsx` component with anchor links
- [ ] Create `index.ts` barrel file
- [ ] Create `slugify` utility for heading IDs
- [ ] Update `serialize.tsx` to use new components
- [ ] Add unit tests

### File: `src/components/richtext/nodes/Paragraph.tsx`

```typescript
/**
 * Paragraph Node Component
 *
 * Renders paragraph elements with proper prose styling.
 */

import { serializeChildren } from '../serialize'
import type { ParagraphNode } from '../types'

interface ParagraphProps {
  node: ParagraphNode
}

export function Paragraph({ node }: ParagraphProps) {
  return (
    <p className="mb-4 leading-relaxed">
      {serializeChildren(node.children)}
    </p>
  )
}
```

### File: `src/components/richtext/nodes/Heading.tsx`

```typescript
/**
 * Heading Node Component
 *
 * Renders heading elements (h1-h6) with anchor links for TOC.
 * Generates URL-friendly IDs from heading text.
 */

import { serializeChildren } from '../serialize'
import type { HeadingNode, LexicalNode, TextNode } from '../types'

interface HeadingProps {
  node: HeadingNode
}

/**
 * Extract plain text from node children
 */
function extractText(children: LexicalNode[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') {
        return (child as TextNode).text
      }
      if ('children' in child && Array.isArray(child.children)) {
        return extractText(child.children as LexicalNode[])
      }
      return ''
    })
    .join('')
}

/**
 * Generate URL-friendly slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .trim()
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Remove duplicate hyphens
}

const headingStyles: Record<string, string> = {
  h1: 'text-4xl font-bold mt-8 mb-4',
  h2: 'text-3xl font-bold mt-8 mb-4',
  h3: 'text-2xl font-semibold mt-6 mb-3',
  h4: 'text-xl font-semibold mt-6 mb-3',
  h5: 'text-lg font-medium mt-4 mb-2',
  h6: 'text-base font-medium mt-4 mb-2',
}

export function Heading({ node }: HeadingProps) {
  const Tag = node.tag
  const text = extractText(node.children)
  const id = slugify(text)

  return (
    <Tag id={id} className={`${headingStyles[node.tag]} group scroll-mt-20`}>
      {serializeChildren(node.children)}
      <a
        href={`#${id}`}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
        aria-label={`Link to ${text}`}
      >
        #
      </a>
    </Tag>
  )
}
```

### File: `src/components/richtext/nodes/index.ts`

```typescript
export { Paragraph } from './Paragraph'
export { Heading } from './Heading'
```

### Update `serialize.tsx`

```typescript
// Add imports at top
import { Paragraph } from './nodes/Paragraph'
import { Heading } from './nodes/Heading'

// Update switch cases:
case 'paragraph':
  return <Paragraph key={index} node={node as ParagraphNode} />

case 'heading':
  return <Heading key={index} node={node as HeadingNode} />
```

### Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "Paragraph|Heading"
```

### Review Checklist

- [ ] Paragraph renders with prose styling
- [ ] Heading renders correct tag (h1-h6)
- [ ] Heading ID generated from text
- [ ] Anchor link visible on hover
- [ ] slugify handles accents and special chars
- [ ] scroll-mt-20 for fixed header offset

### Commit Message

```bash
git add src/components/richtext/nodes/ src/components/richtext/serialize.tsx tests/unit/components/richtext/
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add Paragraph and Heading node components

- Create Paragraph component with prose styling
- Create Heading component (h1-h6) with anchor links
- Add slugify utility for URL-friendly IDs
- Generate heading IDs for TOC integration (Story 4.2)
- Add hover effect for anchor link visibility
- Include scroll-mt-20 for fixed header offset
- Export from nodes barrel file

Part of Phase 2 - Commit 3/6
EOF
)"
```

---

## 📋 Commit 4: List & Quote Nodes

**Files**: `src/components/richtext/nodes/List.tsx`, `src/components/richtext/nodes/Quote.tsx`, update `serialize.tsx`
**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Create `List.tsx` component (handles ul, ol, li)
- [ ] Create `ListItem.tsx` component
- [ ] Create `Quote.tsx` component (blockquote)
- [ ] Handle nested lists
- [ ] Update `serialize.tsx` to use new components
- [ ] Update `nodes/index.ts` exports
- [ ] Add unit tests

### File: `src/components/richtext/nodes/List.tsx`

```typescript
/**
 * List Node Components
 *
 * Renders ordered and unordered lists with proper nesting support.
 */

import { serializeChildren } from '../serialize'
import type { ListNode, ListItemNode } from '../types'

interface ListProps {
  node: ListNode
}

interface ListItemProps {
  node: ListItemNode
}

export function List({ node }: ListProps) {
  const Tag = node.listType === 'number' ? 'ol' : 'ul'
  const listStyle = node.listType === 'number' ? 'list-decimal' : 'list-disc'

  return (
    <Tag className={`${listStyle} pl-6 mb-4 space-y-1`} start={node.start}>
      {node.children.map((child, index) => (
        <ListItem key={index} node={child} />
      ))}
    </Tag>
  )
}

export function ListItem({ node }: ListItemProps) {
  // Check if this list item contains a nested list
  const hasNestedList = node.children.some(
    (child) => child.type === 'list'
  )

  return (
    <li className={hasNestedList ? 'list-none' : ''}>
      {serializeChildren(node.children)}
    </li>
  )
}
```

### File: `src/components/richtext/nodes/Quote.tsx`

```typescript
/**
 * Quote Node Component
 *
 * Renders blockquote elements with proper styling.
 */

import { serializeChildren } from '../serialize'
import type { QuoteNode } from '../types'

interface QuoteProps {
  node: QuoteNode
}

export function Quote({ node }: QuoteProps) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic text-muted-foreground">
      {serializeChildren(node.children)}
    </blockquote>
  )
}
```

### Update `nodes/index.ts`

```typescript
export { Paragraph } from './Paragraph'
export { Heading } from './Heading'
export { List, ListItem } from './List'
export { Quote } from './Quote'
```

### Update `serialize.tsx`

```typescript
// Add imports
import { List, ListItem } from './nodes/List'
import { Quote } from './nodes/Quote'

// Update switch cases:
case 'list':
  return <List key={index} node={node as ListNode} />

case 'listitem':
  return <ListItem key={index} node={node as ListItemNode} />

case 'quote':
  return <Quote key={index} node={node as QuoteNode} />
```

### Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "List|Quote"
```

### Review Checklist

- [ ] Unordered list uses `<ul>` with bullets
- [ ] Ordered list uses `<ol>` with numbers
- [ ] List items render correctly
- [ ] Nested lists work (2+ levels)
- [ ] Blockquote styled with border-left
- [ ] Proper spacing between items

### Commit Message

```bash
git add src/components/richtext/nodes/ src/components/richtext/serialize.tsx tests/unit/components/richtext/
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add List and Quote node components

- Create List component for ul/ol elements
- Create ListItem component with nested list support
- Create Quote component for blockquotes
- Handle bullet, number, and check list types
- Apply proper spacing and indentation
- Style blockquote with left border accent

Part of Phase 2 - Commit 4/6
EOF
)"
```

---

## 📋 Commit 5: Link Node

**Files**: `src/components/richtext/nodes/Link.tsx`, update `serialize.tsx`
**Estimated Duration**: 30-45 minutes

### Implementation Tasks

- [ ] Create `Link.tsx` component
- [ ] Handle internal links (Next.js Link)
- [ ] Handle external links (new tab, rel security)
- [ ] Support mailto: and tel: links
- [ ] Update `serialize.tsx` to use Link component
- [ ] Update `nodes/index.ts` exports
- [ ] Add unit tests

### File: `src/components/richtext/nodes/Link.tsx`

```typescript
/**
 * Link Node Component
 *
 * Renders anchor elements with proper handling for:
 * - Internal links (same domain) - uses Next.js Link
 * - External links - opens in new tab with security attrs
 * - mailto: and tel: links
 */

import NextLink from 'next/link'
import { serializeChildren } from '../serialize'
import type { LinkNode, AutoLinkNode } from '../types'

interface LinkProps {
  node: LinkNode | AutoLinkNode
}

/**
 * Check if URL is external (different domain)
 */
function isExternalUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/')) return false
  if (url.startsWith('#')) return false
  if (url.startsWith('mailto:')) return false
  if (url.startsWith('tel:')) return false

  try {
    const urlObj = new URL(url)
    // Check if it's a different origin
    if (typeof window !== 'undefined') {
      return urlObj.origin !== window.location.origin
    }
    // On server, treat http/https URLs as potentially external
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Check if URL is a special protocol (mailto, tel)
 */
function isSpecialProtocol(url: string): boolean {
  return url.startsWith('mailto:') || url.startsWith('tel:')
}

export function Link({ node }: LinkProps) {
  const url = node.fields?.url || '#'
  const newTab = node.fields?.newTab ?? isExternalUrl(url)
  const isExternal = isExternalUrl(url)
  const isSpecial = isSpecialProtocol(url)

  const className = 'text-primary hover:text-primary/80 underline underline-offset-4 transition-colors'

  // Special protocol links (mailto, tel)
  if (isSpecial) {
    return (
      <a href={url} className={className}>
        {serializeChildren(node.children)}
      </a>
    )
  }

  // External links - open in new tab with security
  if (isExternal || newTab) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {serializeChildren(node.children)}
      </a>
    )
  }

  // Internal links - use Next.js Link for client-side navigation
  return (
    <NextLink href={url} className={className}>
      {serializeChildren(node.children)}
    </NextLink>
  )
}
```

### Update `nodes/index.ts`

```typescript
export { Paragraph } from './Paragraph'
export { Heading } from './Heading'
export { List, ListItem } from './List'
export { Quote } from './Quote'
export { Link } from './Link'
```

### Update `serialize.tsx`

```typescript
// Add import
import { Link } from './nodes/Link'

// Update switch cases:
case 'link':
case 'autolink':
  return <Link key={index} node={node as LinkNode} />
```

### Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "Link"
```

### Review Checklist

- [ ] Internal links use Next.js Link
- [ ] External links open in new tab
- [ ] External links have `rel="noopener noreferrer"`
- [ ] mailto: links work without new tab
- [ ] tel: links work without new tab
- [ ] Link styling matches design system

### Commit Message

```bash
git add src/components/richtext/nodes/ src/components/richtext/serialize.tsx tests/unit/components/richtext/
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add Link node component

- Create Link component for anchor elements
- Use Next.js Link for internal navigation
- Add rel="noopener noreferrer" for external links
- Open external links in new tab by default
- Support mailto: and tel: protocol links
- Add isExternalUrl and isSpecialProtocol helpers

Part of Phase 2 - Commit 5/6
EOF
)"
```

---

## 📋 Commit 6: RichText Component & Integration

**Files**: `src/components/richtext/RichText.tsx`, update `src/components/richtext/index.ts`, update article page
**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Create `RichText.tsx` main component
- [ ] Update `index.ts` with all exports
- [ ] Update article page to use RichText
- [ ] Remove Phase 1 placeholder
- [ ] Add prose container styling
- [ ] Handle empty content gracefully
- [ ] Run final validation

### File: `src/components/richtext/RichText.tsx`

```typescript
/**
 * RichText Component
 *
 * Main component for rendering Payload Lexical richText content.
 * Wraps the serializer output with appropriate prose styling.
 *
 * @example
 * <RichText content={article.content} />
 */

import { serializeLexical } from './serialize'
import type { LexicalContent } from './types'

interface RichTextProps {
  /** Lexical JSON content from Payload CMS */
  content: LexicalContent | null | undefined
  /** Additional CSS classes for the container */
  className?: string
}

export function RichText({ content, className = '' }: RichTextProps) {
  const serialized = serializeLexical(content)

  if (!serialized) {
    return null
  }

  return (
    <div
      className={`prose prose-invert max-w-none
        prose-headings:text-foreground
        prose-p:text-foreground/90
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted prose-pre:border prose-pre:border-border
        prose-blockquote:border-primary prose-blockquote:text-muted-foreground
        prose-li:text-foreground/90
        ${className}`}
    >
      {serialized}
    </div>
  )
}
```

### Update `src/components/richtext/index.ts`

```typescript
// Main component
export { RichText } from './RichText'

// Serializer
export { serializeLexical, serializeChildren, serializeNode, serializeText } from './serialize'

// Types
export type {
  LexicalContent,
  LexicalNode,
  TextNode,
  ParagraphNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  LinkNode,
  CodeNode,
  UploadNode,
  RootNode,
} from './types'
export { TEXT_FORMAT, hasChildren, isTextNode, isHeadingNode } from './types'

// Node components (for advanced usage)
export { Paragraph } from './nodes/Paragraph'
export { Heading } from './nodes/Heading'
export { List, ListItem } from './nodes/List'
export { Quote } from './nodes/Quote'
export { Link } from './nodes/Link'
```

### Update Article Page

```typescript
// src/app/[locale]/(frontend)/articles/[slug]/page.tsx

// Add import
import { RichText } from '@/components/richtext'

// Replace the placeholder div in the return statement:
{/* Content - Rendered via RichText serializer */}
<div className="py-8">
  <RichText content={payloadArticle.content} />
</div>
```

### Validation

```bash
# Full validation
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit

# Build to ensure everything works
pnpm build

# Manual test: start dev server and view an article
pnpm dev
# Visit http://localhost:3000/fr/articles/[slug]
```

### Review Checklist

- [ ] RichText component exported
- [ ] All types exported from index
- [ ] Article page uses RichText
- [ ] Placeholder removed
- [ ] Empty content handled (returns null)
- [ ] Prose styling applied correctly
- [ ] Visual inspection: content renders properly

### Commit Message

```bash
git add src/components/richtext/ src/app/
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add RichText component and integrate with article page

- Create RichText main component with prose styling
- Export all types, serializers, and node components
- Integrate RichText into article page
- Remove Phase 1 JSON placeholder
- Handle empty/null content gracefully
- Apply dark theme prose customizations

Part of Phase 2 - Commit 6/6
EOF
)"
```

---

## ✅ Final Phase Validation

After all commits:

### Complete Phase Checklist

- [ ] All 6 commits completed
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Linter passes
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] VALIDATION_CHECKLIST.md completed

### Final Validation Commands

```bash
# Run all tests
pnpm test:unit

# Run linter
pnpm lint

# Run type-check
pnpm exec tsc --noEmit

# Run build
pnpm build
```

**Phase 2 is complete when all checkboxes are checked! 🎉**
