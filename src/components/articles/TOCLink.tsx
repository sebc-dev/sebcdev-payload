'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface TOCLinkProps {
  /**
   * ID of the heading element to scroll to
   */
  id: string
  /**
   * Text content to display
   */
  text: string
  /**
   * Heading level (1, 2, or 3) for indentation
   */
  level: 1 | 2 | 3
  /**
   * Whether this link is currently active
   */
  isActive: boolean
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
 * Individual Table of Contents link with active state.
 *
 * Features:
 * - Smooth scroll navigation
 * - Visual indication of active section
 * - Indentation based on heading level
 * - Respects prefers-reduced-motion
 * - Keyboard accessible
 *
 * @example
 * <TOCLink
 *   id="introduction"
 *   text="Introduction"
 *   level={1}
 *   isActive={activeId === 'introduction'}
 * />
 */
export function TOCLink({ id, text, level, isActive, onNavigate, className }: TOCLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()

      const element = document.getElementById(id)
      if (!element) return

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
        block: 'start',
      })

      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`)

      // Call onNavigate callback (e.g., to close mobile sheet)
      onNavigate?.()
    },
    [id, onNavigate],
  )

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      aria-current={isActive ? 'location' : undefined}
      className={cn(
        // Base styles
        'block py-1.5 text-sm transition-colors duration-150',
        // Indentation based on level (with extra 2px for border on all levels)
        level === 1 ? 'pl-4' : level === 2 ? 'pl-8' : 'pl-12',
        // Active state (border replaces the 2px padding, maintaining alignment)
        isActive
          ? 'text-primary font-medium border-l-2 border-primary'
          : 'text-muted-foreground hover:text-foreground',
        // Focus styles
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        // Reduced motion
        'motion-reduce:transition-none',
        className,
      )}
    >
      {text}
    </a>
  )
}
