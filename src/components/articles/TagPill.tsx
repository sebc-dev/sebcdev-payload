import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Tag interface for type safety
 * Represents a tag that can be displayed in pills
 */
interface Tag {
  id: string
  title: string
  slug: string
}

/**
 * TagPill component props
 * @param tag - The tag to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param className - Additional CSS classes to apply
 */
interface TagPillProps {
  tag: Tag
  locale: string
  className?: string
}

/**
 * TagPill Component
 *
 * Displays a tag as a clickable pill that navigates to the articles Hub
 * with a tag filter.
 *
 * Features:
 * - Clickable navigation to `/[locale]/articles?tags=[slug]`
 * - Subtle hover effect for affordance
 * - Outline variant with muted styling
 *
 * @param props - Component props
 * @returns JSX element with tag link wrapped in badge
 *
 * @example
 * ```tsx
 * <TagPill
 *   tag={{ id: '1', title: 'React', slug: 'react' }}
 *   locale="fr"
 * />
 * ```
 */
export function TagPill({ tag, locale, className }: Readonly<TagPillProps>) {
  return (
    <Link href={`/${locale}/articles?tags=${tag.slug}`} className="transition-all hover:scale-105">
      <Badge
        variant="outline"
        className={cn(
          'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50',
          'transition-colors duration-200',
          className,
        )}
      >
        {tag.title}
      </Badge>
    </Link>
  )
}
