import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CategoryBadge } from './CategoryBadge'
import { ComplexityBadge } from './ComplexityBadge'
import { TagPill } from './TagPill'
import { RelativeDate } from '../RelativeDate'

/**
 * Category interface for type safety
 * Used in article cards to display category information
 */
interface Category {
  id: string
  title: string
  slug: string
  color?: string
  icon?: string
}

/**
 * Tag interface for type safety
 * Used in article cards to display article tags
 */
interface Tag {
  id: string
  title: string
  slug: string
}

/**
 * Cover image information interface
 * Represents the article's cover image with URL and alt text
 */
interface CoverImage {
  url: string
  alt?: string
}

/**
 * Article interface for type safety
 * Represents the complete article data needed to render ArticleCard
 */
interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: CoverImage | null
  category: Category
  tags: Tag[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
  publishedAt: string
}

/**
 * ArticleCard component props
 * @param article - The article data to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param className - Additional CSS classes to apply to the card
 */
interface ArticleCardProps {
  article: Article
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
    <article className={cn('group', className)}>
      <Link href={`/${locale}/articles/${article.slug}`} className="block h-full">
        <Card
          className={cn(
            'h-full overflow-hidden transition-all duration-200',
            'hover:shadow-lg hover:scale-[1.02]',
            'focus-within:ring-2 focus-within:ring-primary',
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
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          )}

          <CardHeader className="space-y-2 pb-2">
            {/* Category Badge */}
            {/* We prevent default link navigation here since we're inside a larger link */}
            <div onClick={(e) => e.preventDefault()}>
              <CategoryBadge category={article.category} locale={locale} clickable={true} />
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
              {article.title}
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

            {/* Tags (max 3) */}
            {article.tags.length > 0 && (
              <div
                className="flex flex-wrap gap-1.5"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {article.tags.slice(0, 3).map((tag) => (
                  <TagPill key={tag.id} tag={tag} locale={locale} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
