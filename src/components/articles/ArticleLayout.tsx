'use client'

import { useRef, type ReactNode } from 'react'
import type { TOCHeading } from '@/lib/toc/types'
import { ReadingProgressBar } from './ReadingProgressBar'
import { TableOfContents } from './TableOfContents'
import { MobileTOC } from './MobileTOC'
import { cn } from '@/lib/utils'

/**
 * ArticleLayout props interface
 */
export interface ArticleLayoutProps {
  /** The article content to render */
  children: ReactNode
  /** Array of TOC headings extracted from the article */
  headings: TOCHeading[]
  /** Translated title for the TOC section */
  tocTitle: string
  /** Translated label for the mobile TOC open button */
  tocOpenLabel: string
  /** Translated label for the reading progress bar (aria-label) */
  progressLabel: string
  /** Optional additional CSS classes */
  className?: string
}

/**
 * ArticleLayout Component
 *
 * Provides a responsive layout wrapper for article pages with:
 * - Reading progress bar at the top
 * - Table of Contents sidebar (desktop, lg+ breakpoint)
 * - Mobile TOC floating button (mobile, <lg breakpoint)
 * - Centered flex layout on desktop (article + TOC side-by-side)
 * - Single column layout on mobile
 *
 * @example
 * ```tsx
 * <ArticleLayout
 *   headings={extractTOCHeadings(content)}
 *   tocTitle={t('toc.title')}
 *   tocOpenLabel={t('toc.openButton')}
 *   progressLabel={t('toc.progressLabel')}
 * >
 *   <ArticleHero />
 *   <ArticleHeader />
 *   <ArticleContent />
 * </ArticleLayout>
 * ```
 */
export function ArticleLayout({
  children,
  headings,
  tocTitle,
  tocOpenLabel,
  progressLabel,
  className,
}: ArticleLayoutProps) {
  const articleRef = useRef<HTMLElement>(null)
  const hasTOC = headings.length > 0

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgressBar articleRef={articleRef} ariaLabel={progressLabel} />

      {/* Layout Container */}
      <div
        className={cn(
          'container mx-auto px-4 py-8',
          'lg:flex lg:justify-center lg:gap-8',
          className,
        )}
      >
        {/* Article Content */}
        <article ref={articleRef} className="min-w-0 max-w-prose lg:flex-1 lg:max-w-[65ch]">
          {children}
        </article>

        {/* Desktop TOC Sidebar */}
        {hasTOC && (
          <aside
            aria-label={tocTitle || 'Table of contents'}
            className="hidden lg:block lg:w-[280px] lg:flex-shrink-0"
          >
            <div className="sticky top-24">
              <TableOfContents headings={headings} title={tocTitle} />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile TOC */}
      {hasTOC && (
        <div className="lg:hidden">
          <MobileTOC headings={headings} title={tocTitle} triggerLabel={tocOpenLabel} />
        </div>
      )}
    </>
  )
}
