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
  ParagraphNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  LinkNode,
} from './types'
import { TEXT_FORMAT, hasChildren, isTextNode } from './types'
import { Paragraph } from './nodes/Paragraph'
import { Heading } from './nodes/Heading'
import { List, ListItem } from './nodes/List'
import { Quote } from './nodes/Quote'
import { Link } from './nodes/Link'

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
  // These will be enhanced in subsequent commits
  switch (node.type) {
    case 'paragraph':
      return <Paragraph key={index} node={node as ParagraphNode} />

    case 'heading':
      return <Heading key={index} node={node as HeadingNode} />

    case 'list':
      return <List key={index} node={node as ListNode} />

    case 'listitem':
      return <ListItem key={index} node={node as ListItemNode} />

    case 'quote':
      return <Quote key={index} node={node as QuoteNode} />

    case 'link':
    case 'autolink':
      return <Link key={index} node={node as LinkNode} />

    case 'code':
      // Phase 3 - render as plain code for now
      return (
        <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
          <code>{hasChildren(node) ? serializeChildren(node.children) : null}</code>
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
        return <span key={index}>{serializeChildren(node.children)}</span>
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
    text = <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{text}</code>
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
