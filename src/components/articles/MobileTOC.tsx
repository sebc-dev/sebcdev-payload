'use client'

import { useState, useCallback, useMemo } from 'react'
import { List } from 'lucide-react'
import type { TOCHeading } from '@/lib/toc/types'
import { useActiveSection } from '@/hooks/use-active-section'
import { TOCLink } from './TOCLink'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface MobileTOCProps {
  /**
   * Array of headings extracted from article content
   */
  headings: TOCHeading[]
  /**
   * Title displayed in the Sheet header
   * @default "Table of Contents"
   */
  title?: string
  /**
   * Aria label for the trigger button
   * @default "Open table of contents"
   */
  triggerLabel?: string
  /**
   * Offset from top for intersection observer
   * @default 80
   */
  topOffset?: number
  /**
   * Optional className for the trigger button
   */
  triggerClassName?: string
}

/**
 * Mobile Table of Contents with Sheet modal.
 *
 * Features:
 * - Fixed position trigger button
 * - Full-screen Sheet modal from right
 * - Active section highlighting
 * - Auto-close on navigation
 * - Accessible with focus trap
 *
 * @example
 * const headings = extractTOCHeadings(article.content)
 *
 * <MobileTOC
 *   headings={headings}
 *   title="Contents"
 *   triggerLabel="Menu"
 * />
 */
export function MobileTOC({
  headings,
  title = 'Table of Contents',
  triggerLabel = 'Open table of contents',
  topOffset = 80,
  triggerClassName,
}: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract IDs for active section tracking
  const sectionIds = useMemo(() => headings.map((heading) => heading.id), [headings])

  // Track active section
  const activeId = useActiveSection({
    sectionIds,
    topOffset,
  })

  // Close sheet after navigation
  const handleNavigate = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Don't render if no headings
  if (headings.length === 0) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          aria-label={triggerLabel}
          className={cn(
            // Fixed positioning
            'fixed bottom-4 right-4 z-40',
            // Size
            'h-12 w-12',
            // Shadow for visibility
            'shadow-lg',
            // Rounded
            'rounded-full',
            triggerClassName,
          )}
        >
          <List className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <nav aria-label={title} className="mt-6 px-4">
          <ul className="space-y-0.5 border-l border-border" role="list">
            {headings.map((heading) => (
              <li key={heading.id}>
                <TOCLink
                  id={heading.id}
                  text={heading.text}
                  level={heading.level}
                  isActive={activeId === heading.id}
                  onNavigate={handleNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
