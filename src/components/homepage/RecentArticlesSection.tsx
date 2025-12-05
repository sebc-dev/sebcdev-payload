import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import config from '@payload-config'
import { Button } from '@/components/ui/button'
import { ArticleCard } from '@/components/articles'
import { cn } from '@/lib/utils'

interface RecentArticlesSectionProps {
  locale: string
  className?: string
  limit?: number
}

/**
 * Raw article data from Payload API
 * Uses flexible types to handle Payload's polymorphic relationships
 */
interface RawArticle {
  id: string | number
  title: string
  slug: string
  excerpt: string
  featuredImage?:
    | {
        url?: string
        alt?: string
        id?: string | number
      }
    | string
  category?: {
    id: string | number
    title: string
    slug: string
    color?: string
    icon?: string
  }
  tags?: Array<{
    id: string | number
    title: string
    slug: string
  }>
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  readingTime?: number
  publishedAt?: string
}

/**
 * RecentArticlesSection Component
 *
 * Server Component that fetches and displays the most recent published articles
 * in a responsive grid layout with empty state handling.
 *
 * Features:
 * - Fetches articles directly from Payload CMS using Local API
 * - Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
 * - Displays up to `limit` recent articles (default 6)
 * - Shows empty state with message and CTA when no articles
 * - "View all articles" link to Hub page
 * - Semantic HTML with proper heading structure
 * - Full i18n support (FR/EN)
 *
 * Layout:
 * ```
 * ┌──────────────────────────┐
 * │ Articles récents         │ (h2)
 * ├──────────────────────────┤
 * │ [Card] [Card] [Card]     │ (desktop: 3 cols)
 * │ [Card] [Card] [Card]     │
 * ├──────────────────────────┤
 * │ [Voir tous les articles] │ (CTA Button)
 * └──────────────────────────┘
 * ```
 *
 * Grid Breakpoints (per UX_UI_Spec.md 8.6.3):
 * - Desktop (≥ 1024px): 3 columns, 24px gap
 * - Tablet (768-1023px): 2 columns, 20px gap
 * - Mobile (< 768px): 1 column, 16px gap
 *
 * @param props - Component props
 * @returns JSX element with recent articles section
 *
 * @example
 * ```tsx
 * <RecentArticlesSection locale="fr" limit={6} />
 * ```
 */
export async function RecentArticlesSection({
  locale,
  className,
  limit = 6,
}: RecentArticlesSectionProps) {
  const t = await getTranslations('homepage')
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Fetch published articles sorted by publishedAt descending
    const { docs } = await payload.find({
      collection: 'articles',
      where: {
        and: [{ status: { equals: 'published' } }, { publishedAt: { exists: true } }],
      },
      sort: '-publishedAt',
      limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        tags: true,
        complexity: true,
        readingTime: true,
        publishedAt: true,
      },
    })

    const articles = docs as unknown as RawArticle[]

    // Transform articles to match ArticleCard interface
    const transformedArticles = articles
      .filter((article) => article.category)
      .map((article) => ({
        id: String(article.id),
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        coverImage: article.featuredImage
          ? {
              url:
                typeof article.featuredImage === 'object' && article.featuredImage.url
                  ? article.featuredImage.url
                  : typeof article.featuredImage === 'string'
                    ? article.featuredImage
                    : undefined,
              alt:
                typeof article.featuredImage === 'object' && article.featuredImage.alt
                  ? article.featuredImage.alt
                  : article.title,
            }
          : undefined,
        category: {
          id: String(article.category!.id),
          title: article.category!.title,
          slug: article.category!.slug,
          color: article.category!.color,
          icon: article.category!.icon,
        },
        tags: (article.tags || []).map((tag) => ({
          id: String(tag.id),
          title: tag.title,
          slug: tag.slug,
        })),
        complexity: article.complexity || 'beginner',
        readingTime: article.readingTime || 0,
        publishedAt: article.publishedAt || new Date().toISOString(),
      }))

    // If no articles, show empty state
    if (transformedArticles.length === 0) {
      return (
        <section className={cn('py-12', className)}>
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 px-6 py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">{t('emptyState.title')}</h2>
            <p className="mb-6 text-muted-foreground">{t('emptyState.description')}</p>
            <Button asChild>
              <a href={`/${locale}/admin/collections/articles/create`}>{t('emptyState.cta')}</a>
            </Button>
          </div>
        </section>
      )
    }

    // Render articles grid
    return (
      <section className={cn('py-12', className)}>
        {/* Section Title */}
        <h2 className="mb-8 text-3xl font-bold">{t('recentArticles')}</h2>

        {/* Responsive Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {transformedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>

        {/* CTA: View All Articles */}
        <div className="flex justify-center">
          <Button asChild size="lg" variant="outline">
            <a href={`/${locale}/articles`}>{t('viewAllArticles')}</a>
          </Button>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error fetching articles:', error)

    // Fallback: Show error message
    return (
      <section className={cn('py-12', className)}>
        <div className="rounded-lg border border-dashed border-destructive/30 bg-destructive/10 px-6 py-8 text-center">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Failed to load articles</h2>
          <p className="text-sm text-muted-foreground">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </section>
    )
  }
}
