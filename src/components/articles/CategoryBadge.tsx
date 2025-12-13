import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getLucideIcon } from '@/lib/lucide-icons'
import type { CategoryData } from './types'
import type { Locale } from '@/i18n/config'

/**
 * CategoryBadge component props
 * @param category - The category to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param clickable - Whether the badge should be wrapped in a link (default: true)
 * @param className - Additional CSS classes to apply
 */
interface CategoryBadgeProps {
  category: CategoryData
  locale: Locale
  clickable?: boolean
  className?: string
}

/**
 * CategoryBadge Component
 *
 * Displays a category badge with optional dynamic styling and navigation.
 * When clickable, wraps the badge in a link to the articles Hub with category filter.
 *
 * Features:
 * - Dynamic background color based on category.color (20% opacity with category color text)
 * - Optional icon display with aria-hidden for semantic correctness
 * - Clickable variant that links to `/[locale]/articles?category=[slug]`
 * - Smooth transition effects on hover
 *
 * @param props - Component props
 * @returns JSX element with badge, optionally wrapped in a Link
 *
 * @example
 * ```tsx
 * <CategoryBadge
 *   category={{
 *     id: '1',
 *     title: 'Tutoriels',
 *     slug: 'tutorials',
 *     color: '#06b6d4',
 *     icon: 'graduation-cap'
 *   }}
 *   locale="fr"
 *   clickable={true}
 * />
 * ```
 */
export function CategoryBadge({
  category,
  locale,
  clickable = true,
  className,
}: CategoryBadgeProps) {
  // Use white text on category color background (20% opacity) to ensure WCAG 2.1 AA contrast
  // White text provides better contrast than using the category color for both bg and text
  const style = category.color ? { backgroundColor: `${category.color}33`, color: '#fff' } : {}

  const IconComponent = category.icon ? getLucideIcon(category.icon) : null

  const badge = (
    <Badge variant="secondary" className={cn('gap-1.5 transition-colors', className)} style={style}>
      {IconComponent && <IconComponent className="size-3.5" aria-hidden="true" />}
      {category.title}
    </Badge>
  )

  if (!clickable) return badge

  return (
    <Link
      href={`/${locale}/articles?category=${encodeURIComponent(category.slug)}`}
      className="transition-opacity hover:opacity-80"
    >
      {badge}
    </Link>
  )
}
