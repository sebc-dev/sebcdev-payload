import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Category interface for type safety
 * Represents a category that can be displayed in badges
 */
interface Category {
  id: string
  title: string
  slug: string
  color?: string
  icon?: string
}

/**
 * Converts a kebab-case icon name to PascalCase for Lucide component lookup
 * @example "book-open" -> "BookOpen"
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Gets the Lucide icon component for a given icon name
 * @param iconName - The kebab-case icon name (e.g., "book-open")
 * @returns The Lucide icon component or null if not found
 */
function getLucideIcon(iconName: string): LucideIcons.LucideIcon | null {
  const pascalName = toPascalCase(iconName)
  const icon = (LucideIcons as Record<string, unknown>)[pascalName]
  // Lucide icons are React forwardRef components (objects with render function)
  if (icon && typeof icon === 'object' && 'render' in icon) {
    return icon as unknown as LucideIcons.LucideIcon
  }
  // Also check if it's a function (for different export formats)
  if (typeof icon === 'function') {
    return icon as LucideIcons.LucideIcon
  }
  return null
}

/**
 * CategoryBadge component props
 * @param category - The category to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param clickable - Whether the badge should be wrapped in a link (default: true)
 * @param className - Additional CSS classes to apply
 */
interface CategoryBadgeProps {
  category: Category
  locale: string
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
 *     icon: '🎓'
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
  const style = category.color
    ? { backgroundColor: `${category.color}20`, color: category.color }
    : {}

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
      href={`/${locale}/articles?category=${category.slug}`}
      className="transition-opacity hover:opacity-80"
    >
      {badge}
    </Link>
  )
}
