'use client'

import { type RefObject } from 'react'
import { useReadingProgress } from '@/hooks/use-reading-progress'
import { cn } from '@/lib/utils'

/**
 * Props for the ReadingProgressBar component.
 */
export interface ReadingProgressBarProps {
  /**
   * Optional ref to the article element to track.
   * If not provided, tracks the entire document.
   */
  articleRef?: RefObject<HTMLElement | null>
  /**
   * Optional className for custom styling.
   */
  className?: string
  /**
   * Optional aria-label override for accessibility.
   * @default "Reading progress"
   */
  ariaLabel?: string
}

/**
 * A sticky progress bar that shows reading progress through an article.
 *
 * Features:
 * - Sticky positioning at top of viewport
 * - Accessible with ARIA progressbar role and attributes
 * - Respects prefers-reduced-motion
 * - Uses primary color from design system
 *
 * @example
 * ```tsx
 * // Track entire document
 * <ReadingProgressBar />
 *
 * // Track specific article element
 * const articleRef = useRef<HTMLElement>(null)
 * <ReadingProgressBar articleRef={articleRef} />
 * <article ref={articleRef}>...</article>
 * ```
 */
export function ReadingProgressBar({
  articleRef,
  className,
  ariaLabel = 'Reading progress',
}: ReadingProgressBarProps) {
  const progress = useReadingProgress(articleRef)
  const roundedProgress = Math.round(progress)

  return (
    <div
      role="progressbar"
      aria-valuenow={roundedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        // Fixed positioning at top
        'fixed top-0 left-0 right-0 z-50',
        // Height
        'h-[3px]',
        // Background track
        'bg-muted/30',
        className,
      )}
    >
      <div
        className={cn(
          // Bar styling
          'h-full bg-primary',
          // Smooth transition (respects prefers-reduced-motion via CSS)
          'transition-[width] duration-150 ease-linear',
          // Reduced motion: instant updates
          'motion-reduce:transition-none',
        )}
        style={{ width: `${roundedProgress}%` }}
      />
    </div>
  )
}
