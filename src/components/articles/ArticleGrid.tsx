import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { ArticleCard } from './ArticleCard'

/**
 * Category interface for type safety
 * Used in article grids to display category information
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
 * Used in article grids to display article tags
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
 * Represents the complete article data needed to render ArticleGrid
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
 * ArticleGrid component props
 * @param articles - Array of articles to display in the grid
 * @param locale - Current locale (e.g., 'fr', 'en')
 * @param title - Optional custom section title (uses i18n fallback if not provided)
 * @param className - Additional CSS classes to apply to the section
 */
interface ArticleGridProps {
  articles: Article[]
  locale: string
  title?: string
  className?: string
}

/**
 * ArticleGrid Component
 *
 * Server-rendered component that displays a responsive grid of article cards.
 * Designed to showcase multiple articles in a responsive layout that adapts
 * to different screen sizes.
 *
 * Features:
 * - Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop
 * - Responsive gaps: 16px mobile, 20px tablet, 24px desktop
 * - Section title with i18n support and aria-labelledby
 * - Returns null if no articles (prevents empty section rendering)
 * - Uses ArticleCard component for consistent article display
 * - Semantic HTML structure for accessibility
 * - Full keyboard navigation support
 *
 * Responsive Specs:
 * - Mobile (<768px): 1 column, 16px gap
 * - Tablet (768-1023px): 2 columns, 20px gap
 * - Desktop (>=1024px): 3 columns, 24px gap
 *
 * Layout:
 * ```
 * ┌─────────────────────────────────────────────────────────┐
 * │  Recent Articles                                         │
 * ├─────────────────────────────────────────────────────────┤
 * │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
 * │  │ Card 1   │  │ Card 2   │  │ Card 3   │              │
 * │  └──────────┘  └──────────┘  └──────────┘              │
 * │                                                          │
 * │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
 * │  │ Card 4   │  │ Card 5   │  │ Card 6   │              │
 * │  └──────────┘  └──────────┘  └──────────┘              │
 * └─────────────────────────────────────────────────────────┘
 * ```
 *
 * @param props - Component props
 * @returns JSX element with responsive article grid, or null if no articles
 *
 * @example
 * ```tsx
 * <ArticleGrid
 *   articles={[
 *     {
 *       id: '1',
 *       title: 'Getting Started with React',
 *       slug: 'getting-started-react',
 *       excerpt: 'Learn the basics of React...',
 *       coverImage: { url: '/images/react.jpg', alt: 'React logo' },
 *       category: { id: '1', title: 'Tutoriels', slug: 'tutorials' },
 *       tags: [{ id: '1', title: 'React', slug: 'react' }],
 *       complexity: 'beginner',
 *       readingTime: 5,
 *       publishedAt: '2025-12-01T10:00:00Z'
 *     }
 *   ]}
 *   locale="fr"
 *   title="Articles Récents"
 * />
 * ```
 */
export async function ArticleGrid({ articles, locale, title, className }: ArticleGridProps) {
  const t = await getTranslations('homepage')
  const sectionTitle = title ?? t('recentArticles')

  // Return null if no articles to prevent rendering empty section
  if (articles.length === 0) {
    return null
  }

  return (
    <section className={cn('space-y-6', className)} aria-labelledby="recent-articles-heading">
      {/* Section Title */}
      <h2 id="recent-articles-heading" className="text-2xl font-bold">
        {sectionTitle}
      </h2>

      {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div
        className={cn('grid gap-4 sm:gap-5 lg:gap-6', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </section>
  )
}
