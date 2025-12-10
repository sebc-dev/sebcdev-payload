/**
 * Heading Node Component
 *
 * Renders heading elements (h1-h6) with anchor links for TOC.
 * Generates URL-friendly IDs from heading text.
 */

import { slugify } from '@/lib/toc'
import { serializeChildren } from '../serialize'
import type { HeadingNode, LexicalNode } from '../types'
import { hasChildren, isTextNode } from '../types'

// Re-export slugify for backwards compatibility
export { slugify }

interface HeadingProps {
  node: HeadingNode
}

/**
 * Extract plain text from node children
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

const headingStyles: Record<HeadingNode['tag'], string> = {
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
    <Tag id={id || undefined} className={`${headingStyles[node.tag]} group scroll-mt-20`}>
      {serializeChildren(node.children)}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
          aria-label={`Link to ${text}`}
        >
          #
        </a>
      )}
    </Tag>
  )
}
