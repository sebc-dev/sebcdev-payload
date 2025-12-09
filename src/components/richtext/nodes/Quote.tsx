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
