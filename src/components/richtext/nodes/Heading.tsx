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
