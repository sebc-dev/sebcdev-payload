/**
 * Article Page
 *
 * Dynamic route for displaying a single article.
 * Server Component with Payload Local API fetching.
 *
 * Route: /[locale]/articles/[slug]
 * Example: /fr/articles/mon-premier-article
 */

import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getArticleBySlug } from '@/lib/payload/articles'
import { ArticleHeader, ArticleFooter, ArticleHero } from '@/components/articles'
import type { ArticleData, CoverImage } from '@/components/articles/types'
import type { Article as PayloadArticle, Category, Tag, Media } from '@/payload-types'
import type { LucideCategoryIcon } from '@/lib/lucide-icons'
import type { Locale } from '@/i18n/config'
import { RichText, isLexicalContent } from '@/components/richtext'

/**
 * Force dynamic rendering.
 * Required because we fetch from Payload which needs runtime env vars.
 */
export const dynamic = 'force-dynamic'

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Type guard for populated Category
 */
function isPopulatedCategory(category: number | Category | null | undefined): category is Category {
  return typeof category === 'object' && category !== null && 'name' in category
}

/**
 * Type guard for populated Tag
 */
function isPopulatedTag(tag: number | Tag): tag is Tag {
  return typeof tag === 'object' && tag !== null && 'name' in tag
}

/**
 * Type guard for populated Media
 */
function isPopulatedMedia(media: number | Media | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

/**
 * Map Payload article to component ArticleData
 */
function mapPayloadToArticleData(
  article: PayloadArticle,
): ArticleData & { heroCoverImage: CoverImage | null } {
  // Map category
  const category = isPopulatedCategory(article.category)
    ? {
        id: String(article.category.id),
        title: article.category.name,
        slug: article.category.slug,
        color: article.category.color ?? undefined,
        icon: (article.category.icon as LucideCategoryIcon) ?? undefined,
      }
    : null

  // Map tags
  const tags =
    article.tags
      ?.filter(isPopulatedTag)
      .map((tag) => ({
        id: String(tag.id),
        title: tag.name,
        slug: tag.slug,
      }))
      .filter((tag) => tag.title && tag.slug) ?? []

  // Map featured image for hero (with full metadata)
  // Only create CoverImage if URL is non-empty to avoid next/image errors
  const heroCoverImage: CoverImage | null =
    isPopulatedMedia(article.featuredImage) && article.featuredImage.url
      ? {
          url: article.featuredImage.url,
          alt: article.featuredImage.alt ?? '',
          width: article.featuredImage.width ?? 1200,
          height: article.featuredImage.height ?? 630,
          blurDataURL: undefined, // Payload doesn't generate blur by default
        }
      : null

  // Map cover image for card display (simplified)
  // Only create if URL is non-empty
  const coverImage =
    isPopulatedMedia(article.featuredImage) && article.featuredImage.url
      ? {
          url: article.featuredImage.url,
          alt: article.featuredImage.alt ?? '',
        }
      : null

  return {
    id: String(article.id),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? '',
    coverImage,
    heroCoverImage,
    category,
    tags,
    complexity: article.complexity,
    readingTime: article.readingTime ?? 0,
    publishedAt: article.publishedAt ?? article.createdAt,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)
  const t = await getTranslations('article')

  // Fetch article by slug
  const { article: payloadArticle } = await getArticleBySlug(slug, locale)

  // Handle not found
  if (!payloadArticle) {
    notFound()
  }

  // Map to component data
  const article = mapPayloadToArticleData(payloadArticle)

  return (
    <article className="container mx-auto px-4 py-8 max-w-prose">
      {/* Hero: Featured Image */}
      {article.heroCoverImage && (
        <ArticleHero image={article.heroCoverImage} title={article.title} />
      )}

      {/* Header: Title, Category, Metadata */}
      <ArticleHeader article={article} locale={locale} />

      {/* Content - Rendered via RichText serializer */}
      <div className="py-8">
        {isLexicalContent(payloadArticle.content) ? (
          <RichText content={payloadArticle.content} />
        ) : (
          <p className="text-muted-foreground italic">{t('contentUnavailable')}</p>
        )}
      </div>

      {/* Footer: Tags */}
      <ArticleFooter tags={article.tags} locale={locale} />
    </article>
  )
}
