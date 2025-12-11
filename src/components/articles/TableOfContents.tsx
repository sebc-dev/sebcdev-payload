'use client'

import { useMemo } from 'react'
import type { TOCHeading } from '@/lib/toc/types'
import { useActiveSection } from '@/hooks/use-active-section'
import { TOCLink } from './TOCLink'
import { cn } from '@/lib/utils'

export interface TableOfContentsProps {
  /**
   * Array of headings extracted from article content
   */
  headings: TOCHeading[]
  /**
   * Title displayed above the TOC
   * @default "Table of Contents"
   */
  title?: string
  /**
   * Offset from top for sticky positioning and intersection observer
   * @default 80
   */
  topOffset?: number
  /**
   * Optional callback after navigation
   */
  onNavigate?: () => void
  /**
   * Optional className for custom styling
   */
  className?: string
}

/**
 * Desktop Table of Contents with sticky positioning.
 *
 * Features:
 * - Sticky sidebar positioning
 * - Active section highlighting via Intersection Observer
 * - Smooth scroll navigation
 * - Accessible with ARIA landmarks
 *
 * @example
 * const headings = extractTOCHeadings(article.content)
 *
 * <TableOfContents
 *   headings={headings}
 *   title="Contents"
 *   topOffset={100}
 * />
 */
export function TableOfContents({
  headings,
  title = 'Table of Contents',
  topOffset = 80,
  onNavigate,
  className,
}: TableOfContentsProps) {
  // Extract IDs for active section tracking
  const sectionIds = useMemo(() => headings.map((heading) => heading.id), [headings])

  // Track active section
  const activeId = useActiveSection({
    sectionIds,
    topOffset,
  })

  // Don't render if no headings
  if (headings.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={title}
      className={cn(
        // Sticky positioning
        'sticky',
        // Width constraints
        'w-full max-w-[200px]',
        // Spacing
        'py-4',
        className,
      )}
      style={{ top: `${topOffset}px` }}
    >
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>

      {/* role="list" restores list semantics for screen readers (Safari VoiceOver)
          when list-style is removed by Tailwind's space-y-* utilities */}
      <ul className="space-y-0.5 border-l border-border" role="list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <TOCLink
              id={heading.id}
              text={heading.text}
              level={heading.level}
              isActive={activeId === heading.id}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
