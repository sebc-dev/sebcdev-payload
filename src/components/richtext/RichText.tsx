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
import { cn } from '@/lib/utils'

interface RichTextProps {
  /** Lexical JSON content from Payload CMS */
  content: LexicalContent | null | undefined
  /** Additional CSS classes for the container */
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  const serialized = serializeLexical(content)

  if (!serialized) {
    return null
  }

  return (
    <div
      className={cn(
        'article-prose',
        'prose prose-invert max-w-none',
        'prose-headings:text-foreground',
        'prose-p:text-foreground/90',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground',
        'prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
        'prose-blockquote:border-primary prose-blockquote:text-muted-foreground',
        'prose-li:text-foreground/90',
        className,
      )}
    >
      {serialized}
    </div>
  )
}
