'use client'

import { useFormatter } from 'next-intl'
import { cn } from '@/lib/utils'

/**
 * RelativeDate component props
 * @param date - Date to display as relative time (string ISO 8601 or Date object)
 * @param className - Additional CSS classes to apply
 */
interface RelativeDateProps {
  date: string | Date
  className?: string
}

/**
 * RelativeDate Component
 *
 * Displays a date in localized relative time format (e.g., "il y a 2 jours" in FR, "2 days ago" in EN).
 * Uses next-intl's useFormatter hook for proper internationalization support.
 *
 * Features:
 * - Localized relative time display (FR/EN support via next-intl)
 * - Semantic <time> element with ISO 8601 datetime attribute
 * - Full date tooltip on hover via title attribute
 * - Supports both string (ISO 8601) and Date object inputs
 * - CSS class for tabular-nums for consistent date width
 *
 * Why Client Component:
 * - useFormatter from next-intl requires client context for hydration
 * - Allows future updates for real-time relative time updates
 * - Prevents SSR/CSR hydration mismatches
 *
 * @param props - Component props
 * @returns JSX element with localized relative time
 *
 * @example
 * ```tsx
 * // Display article publication date
 * <RelativeDate date="2025-12-03T10:30:00Z" />
 *
 * // Display with custom styling
 * <RelativeDate
 *   date={new Date('2025-12-01')}
 *   className="text-xs text-muted-foreground"
 * />
 * ```
 */
export function RelativeDate({ date, className }: RelativeDateProps) {
  const format = useFormatter()
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // Validate date - return empty span if invalid
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return <span className={className} />
  }

  // Format as relative time using next-intl (e.g., "il y a 2 jours")
  const relativeTime = format.relativeTime(dateObj)

  // Format as full date for tooltip (e.g., "3 décembre 2025 à 10:30")
  const fullDate = format.dateTime(dateObj, {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  return (
    <time
      dateTime={dateObj.toISOString()}
      className={cn('tabular-nums', className)}
      title={fullDate}
    >
      {relativeTime}
    </time>
  )
}
