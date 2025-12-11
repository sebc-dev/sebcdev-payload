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
 * Check if heading level is supported for TOC (h1, h2, or h3)
 */
function isTOCHeadingLevel(tag: HeadingNode['tag']): tag is 'h1' | 'h2' | 'h3' {
  return tag === 'h1' || tag === 'h2' || tag === 'h3'
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
    level: node.tag === 'h1' ? 1 : node.tag === 'h2' ? 2 : 3,
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
 * Parses Lexical JSON structure and extracts h1/h2/h3 headings
 * with their IDs and text content for Table of Contents display.
 *
 * @param content - Lexical JSON content from Payload CMS
 * @returns Array of TOC headings, empty array if no headings found
 *
 * @example
 * const headings = extractTOCHeadings(article.content)
 * // Returns: [{ id: 'introduction', text: 'Introduction', level: 1 }, ...]
 */
export function extractTOCHeadings(content: TOCExtractionInput): TOCData {
  if (!content?.root?.children) {
    return []
  }

  return extractFromNodes(content.root.children)
}
