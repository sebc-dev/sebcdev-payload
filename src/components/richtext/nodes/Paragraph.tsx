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
  return <p className="mb-4 leading-relaxed">{serializeChildren(node.children)}</p>
}
