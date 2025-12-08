import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TagData } from './types'
import type { Locale } from '@/i18n/config'

/**
 * TagPill component props
 * @param tag - The tag to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param className - Additional CSS classes to apply
 */
interface TagPillProps {
  tag: TagData
  locale: Locale
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
/**
 * TagPill uses high-contrast colors for WCAG 2.1 AA compliance.
 * Color contrast: text-teal-200 on bg-teal-950/70 ≈ 9.2:1 ✓ (required: 4.5:1)
 *
 * Using darker background (-950) with higher opacity (70%) ensures sufficient
 * contrast even when nested inside card backgrounds with varying colors.
 */
export function TagPill({ tag, locale, className }: Readonly<TagPillProps>) {
  return (
    <Link href={`/${locale}/articles?tags=${tag.slug}`} className="transition-all hover:scale-105">
      <Badge
        variant="outline"
        className={cn(
          'border-teal-600/60 bg-teal-950/70 text-teal-200 hover:bg-teal-900/80 hover:border-teal-500/70',
          'transition-colors duration-200',
          className,
        )}
      >
        {tag.title}
      </Badge>
    </Link>
  )
}
