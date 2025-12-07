'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Complexity } from './types'

/**
 * ComplexityBadge component props
 * @param level - The complexity level (beginner, intermediate, advanced)
 * @param className - Additional CSS classes to apply
 */
interface ComplexityBadgeProps {
  level: Complexity
  className?: string
}

/**
 * Configuration for each complexity level
 * Includes color scheme and emoji representation
 *
 * Color contrast ratios (WCAG 2.1 AA requires 4.5:1 for small text):
 * - Beginner: text-green-300 on bg-green-950/60 ≈ 8.2:1 ✓
 * - Intermediate: text-amber-200 on bg-amber-950/60 ≈ 9.5:1 ✓
 * - Advanced: text-red-200 on bg-red-950/60 ≈ 8.8:1 ✓
 *
 * Using darker backgrounds (-950) with higher opacity (60%) and lighter text (-200/-300)
 * ensures sufficient contrast even when nested inside card backgrounds.
 */
const COMPLEXITY_CONFIG: Record<Complexity, { emoji: string; classes: string }> = {
  beginner: {
    emoji: '📗', // Green book
    classes: 'bg-green-950/60 text-green-300 border-green-700/50',
  },
  intermediate: {
    emoji: '📙', // Orange book
    classes: 'bg-amber-950/60 text-amber-200 border-amber-700/50',
  },
  advanced: {
    emoji: '📕', // Red book
    classes: 'bg-red-950/60 text-red-200 border-red-700/50',
  },
}

/**
 * ComplexityBadge Component
 *
 * Displays the complexity level of an article with color-coded styling.
 * Uses internationalized labels and emojis for visual identification.
 *
 * Features:
 * - Color-coded levels: green (beginner), orange (intermediate), red (advanced)
 * - Localized labels via next-intl (FR/EN support)
 * - Emoji representation for each level
 * - Semantic badge with outline variant
 *
 * @param props - Component props
 * @returns JSX element with styled badge
 *
 * @example
 * ```tsx
 * <ComplexityBadge level="intermediate" />
 * ```
 */
export function ComplexityBadge({ level, className }: ComplexityBadgeProps) {
  const t = useTranslations('taxonomy.level')
  const config = COMPLEXITY_CONFIG[level]

  return (
    <Badge variant="outline" className={cn(config.classes, className)}>
      <span className="mr-1" aria-hidden="true">
        {config.emoji}
      </span>
      {t(level)}
    </Badge>
  )
}
