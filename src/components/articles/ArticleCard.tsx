import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CategoryBadge } from './CategoryBadge'
import { ComplexityBadge } from './ComplexityBadge'
import { TagPill } from './TagPill'
import { RelativeDate } from '../RelativeDate'
import type { ArticleData } from './types'

/**
 * ArticleCard component props
 * @param article - The article data to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param className - Additional CSS classes to apply to the card
 */
interface ArticleCardProps {
  article: ArticleData
  locale: string
  className?: string
}

/**
 * ArticleCard Component
 *
 * Server-rendered component that displays a complete article preview card.
 * Combines multiple atomic components (CategoryBadge, ComplexityBadge, TagPill, RelativeDate)
 * to create a rich article preview with all relevant metadata.
 *
 * Features:
 * - Responsive cover image with hover zoom effect
 * - Category badge with dynamic styling
 * - Article title and excerpt with line-clamping
 * - Reading time and publication date
 * - Complexity level badge
 * - Up to 3 clickable tag pills
 * - Hover effects: card elevation and scale, image zoom
 * - Semantic HTML structure for accessibility
 * - Full keyboard navigation support
 * - Click-through to article detail page
 *
 * Layout:
 * ```
 * ┌─────────────────────────┐
 * │  🖼️ Cover Image         │ (aspect-video)
 * ├─────────────────────────┤
 * │  [Category Badge]       │ (clickable)
 * │                          │
 * │  Article Title          │ (line-clamp-2)
 * ├─────────────────────────┤
 * │  Article excerpt...     │ (line-clamp-2)
 * │                          │
 * │  5 min • 2 days ago     │
 * │  [Complexity Badge]     │
 * │  [tag1] [tag2] [tag3]   │ (max 3)
 * └─────────────────────────┘
 * ```
 *
 * Hover Effects (per UX_UI_Spec.md):
 * - Card: scale 1.02, shadow elevation, smooth transition (200ms)
 * - Image: scale 1.05 inside overflow-hidden container
 * - Title: text color changes to primary
 *
 * @param props - Component props
 * @returns JSX element with styled article card
 *
 * @example
 * ```tsx
 * <ArticleCard
 *   article={{
 *     id: '1',
 *     title: 'Getting Started with React',
 *     slug: 'getting-started-react',
 *     excerpt: 'Learn the basics of React...',
 *     coverImage: { url: '/images/react.jpg', alt: 'React logo' },
 *     category: { id: '1', title: 'Tutoriels', slug: 'tutorials', color: '#06b6d4', icon: '🎓' },
 *     tags: [{ id: '1', title: 'React', slug: 'react' }],
 *     complexity: 'beginner',
 *     readingTime: 5,
 *     publishedAt: '2025-12-01T10:00:00Z'
 *   }}
 *   locale="fr"
 * />
 * ```
 */
export async function ArticleCard({ article, locale, className }: ArticleCardProps) {
  const t = await getTranslations('homepage')

  return (
    <article className={cn('group relative', className)}>
      <Card
        className={cn(
          'h-full overflow-hidden',
          // GPU-accelerated, smooth transitions
          'transform-gpu transition-all duration-200 ease-out',
          // Motion-safe hover effects (respects prefers-reduced-motion)
          'motion-safe:hover:shadow-[var(--shadow-md)] motion-safe:hover:scale-[1.02]',
          // Focus ring for accessibility
          'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background',
          className,
        )}
      >
        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transform-gpu transition-transform duration-200 ease-out motion-safe:group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="space-y-2 pb-2">
          {/* Category Badge - clickable, outside of main link */}
          <div className="relative z-10">
            <CategoryBadge category={article.category} locale={locale} clickable={true} />
          </div>

          {/* Title with main card link */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
            <Link
              href={`/${locale}/articles/${article.slug}`}
              className="after:absolute after:inset-0"
            >
              {article.title}
            </Link>
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Excerpt */}
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>

          {/* Metadata Row: Reading Time & Publication Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t('minRead', { minutes: article.readingTime })}</span>
            <span aria-hidden="true">-</span>
            <RelativeDate date={article.publishedAt} />
          </div>

          {/* Complexity Badge */}
          <ComplexityBadge level={article.complexity} />

          {/* Tags (max 3) - clickable, outside of main link */}
          {article.tags.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag) => (
                <TagPill key={tag.id} tag={tag} locale={locale} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}
