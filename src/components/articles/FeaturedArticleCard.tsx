import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CategoryBadge } from './CategoryBadge'
import { ComplexityBadge } from './ComplexityBadge'
import { TagPill } from './TagPill'
import { RelativeDate } from '../RelativeDate'

/**
 * Category interface for type safety
 * Used in featured article cards to display category information
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
 * Used in featured article cards to display article tags
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
 * Represents the complete article data needed to render FeaturedArticleCard
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
 * FeaturedArticleCard component props
 * @param article - The article data to display
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param className - Additional CSS classes to apply to the card
 */
interface FeaturedArticleCardProps {
  article: Article
  locale: string
  className?: string
}

/**
 * FeaturedArticleCard Component
 *
 * Server-rendered component that displays a featured/hero article preview.
 * Designed to be the prominent article showcased at the top of the homepage.
 * Combines multiple atomic components (CategoryBadge, ComplexityBadge, TagPill, RelativeDate)
 * to create a rich article preview with all relevant metadata.
 *
 * Features:
 * - Full-width layout ideal for hero/featured article display
 * - Large responsive cover image (16:9, max-h 400px)
 * - H1 title for SEO prominence
 * - Horizontal metadata row (category, reading time, date, complexity)
 * - Extended excerpt preview
 * - Up to 5 clickable tag pills
 * - Prominent CTA button to read full article
 * - Hover effects: card elevation and scale, image zoom
 * - Semantic HTML structure for accessibility
 * - Full keyboard navigation support
 *
 * Layout:
 * ```
 * ┌───────────────────────────────────────────────────────┐
 * │  🖼️ Cover Image (100%, aspect-video, max-h 400px)  │
 * ├───────────────────────────────────────────────────────┤
 * │  [Category]  -  5 min  -  2 days ago  -  [Complexity] │
 * │                                                         │
 * │  Featured Article Title Goes Here (H1)                │
 * │  ================================================        │
 * │                                                         │
 * │  Full excerpt that gives a compelling overview of     │
 * │  what the article is about and why readers should...  │
 * │                                                         │
 * │  [tag1] [tag2] [tag3] [tag4] [tag5]  (max 5)         │
 * │                                     [Read Article ->]  │
 * └───────────────────────────────────────────────────────┘
 * ```
 *
 * Hover Effects (per UX_UI_Spec.md):
 * - Card: scale 1.01, shadow elevation, smooth transition (300ms)
 * - Image: scale 1.05 inside overflow-hidden container
 * - CTA button: standard button hover effects
 *
 * @param props - Component props
 * @returns JSX element with styled featured article card
 *
 * @example
 * ```tsx
 * <FeaturedArticleCard
 *   article={{
 *     id: '1',
 *     title: 'Building Scalable React Applications',
 *     slug: 'scalable-react-apps',
 *     excerpt: 'Learn advanced patterns for building large-scale React applications...',
 *     coverImage: { url: '/images/react-scale.jpg', alt: 'React at scale' },
 *     category: { id: '1', title: 'Tutoriels', slug: 'tutorials', color: '#06b6d4', icon: '🎓' },
 *     tags: [
 *       { id: '1', title: 'React', slug: 'react' },
 *       { id: '2', title: 'Performance', slug: 'performance' },
 *       { id: '3', title: 'TypeScript', slug: 'typescript' }
 *     ],
 *     complexity: 'advanced',
 *     readingTime: 12,
 *     publishedAt: '2025-12-01T10:00:00Z'
 *   }}
 *   locale="fr"
 * />
 * ```
 */
export async function FeaturedArticleCard({
  article,
  locale,
  className,
}: FeaturedArticleCardProps) {
  const t = await getTranslations('homepage')

  return (
    <article className={cn('group', className)}>
      <Card
        className={cn(
          'overflow-hidden',
          // GPU-accelerated, smooth transitions
          'transform-gpu transition-all duration-300 ease-out',
          // Motion-safe hover effects
          'motion-safe:hover:shadow-xl motion-safe:hover:scale-[1.01]',
          // Focus ring for accessibility
          'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background',
          className,
        )}
      >
        {/* Cover Image - Full width with 16:9 aspect ratio, max height 400px */}
        {article.coverImage && (
          <div className="relative aspect-video max-h-[400px] overflow-hidden">
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover transform-gpu transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="space-y-4 pb-4">
          {/* Metadata Row: Category - Reading Time - Date - Complexity */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <CategoryBadge category={article.category} locale={locale} clickable={false} />
            <span className="text-muted-foreground" aria-hidden="true">
              -
            </span>
            <span className="text-muted-foreground">
              {t('minRead', { minutes: article.readingTime })}
            </span>
            <span className="text-muted-foreground" aria-hidden="true">
              -
            </span>
            <RelativeDate date={article.publishedAt} className="text-muted-foreground" />
            <span className="text-muted-foreground" aria-hidden="true">
              -
            </span>
            <ComplexityBadge level={article.complexity} />
          </div>

          {/* Title - H1 for SEO prominence */}
          <h1 className="text-2xl font-bold leading-tight transition-colors sm:text-3xl lg:text-4xl group-hover:text-primary">
            <Link href={`/${locale}/articles/${article.slug}`}>{article.title}</Link>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Excerpt - Extended preview for featured article */}
          <p className="text-base text-muted-foreground line-clamp-3 sm:text-lg">
            {article.excerpt}
          </p>

          {/* Tags (max 5 for featured article) */}
          {article.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              {article.tags.slice(0, 5).map((tag) => (
                <TagPill key={tag.id} tag={tag} locale={locale} />
              ))}
            </div>
          )}

          {/* CTA Button - Read Article */}
          <div className="flex justify-end pt-2">
            <Button asChild>
              <Link href={`/${locale}/articles/${article.slug}`}>
                {t('readArticle')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
