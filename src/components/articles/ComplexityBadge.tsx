'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Complexity = 'beginner' | 'intermediate' | 'advanced'

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
 */
const COMPLEXITY_CONFIG: Record<Complexity, { emoji: string; classes: string }> = {
  beginner: {
    emoji: '📗', // Green book
    classes: 'bg-green-600/20 text-green-400 border-green-600/30',
  },
  intermediate: {
    emoji: '📙', // Orange book
    classes: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  },
  advanced: {
    emoji: '📕', // Red book
    classes: 'bg-red-600/20 text-red-400 border-red-600/30',
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
  const t = useTranslations('article.complexity')
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
