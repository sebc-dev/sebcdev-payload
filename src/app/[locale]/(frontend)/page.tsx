import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import config from '@payload-config'
import { Button } from '@/components/ui/button'
import { FeaturedArticleCard, ArticleGrid, EmptyState } from '@/components/articles'
import type { ArticleData } from '@/components/articles/types'
import type { Article as PayloadArticle } from '@/payload-types'
import type { LucideCategoryIcon } from '@/lib/lucide-icons'
import type { Locale } from '@/i18n/config'
import { logger } from '@/lib/logger'

/**
 * Force dynamic rendering to avoid pre-rendering during build.
 * Required because this page fetches data from Payload which needs
 * PAYLOAD_SECRET at runtime, not available during static build.
 */
export const dynamic = 'force-dynamic'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebc.dev'

/**
 * SEO metadata for the homepage
 * Generates localized titles, descriptions, and hreflang alternates
 */
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    fr: 'Accueil | sebc.dev',
    en: 'Home | sebc.dev',
  }

  const descriptions: Record<string, string> = {
    fr: "Blog technique sur l'IA, l'UX et l'ingenierie logicielle",
    en: 'Technical blog about AI, UX and software engineering',
  }

  const title = titles[locale] || titles.fr
  const description = descriptions[locale] || descriptions.fr

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: 'sebc.dev',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

type PayloadImage = PayloadArticle['featuredImage']
type PayloadCategory = PayloadArticle['category']
type PayloadTag = NonNullable<PayloadArticle['tags']>[number]

/** Extracts cover image from Payload featured image */
function mapCoverImage(featuredImage: PayloadImage): ArticleData['coverImage'] {
  if (typeof featuredImage !== 'object' || featuredImage === null) return null
  const url = typeof featuredImage.url === 'string' ? featuredImage.url.trim() : ''
  if (!url) return null
  return {
    url,
    alt:
      'alt' in featuredImage && typeof featuredImage.alt === 'string'
        ? featuredImage.alt
        : undefined,
  }
}

/** Maps Payload category to component category */
function mapCategory(category: PayloadCategory): ArticleData['category'] {
  if (typeof category !== 'object' || category === null || category.id == null) {
    return { id: '', title: '', slug: '' }
  }
  return {
    id: String(category.id),
    title: 'name' in category ? (category.name as string) : '',
    slug: category.slug || '',
    color: 'color' in category ? (category.color as string) : undefined,
    icon: 'icon' in category ? (category.icon as LucideCategoryIcon) : undefined,
  }
}

/** Maps a single Payload tag to component tag */
function mapTag(tag: PayloadTag): ArticleData['tags'][number] {
  if (typeof tag === 'object' && tag !== null && tag.id != null) {
    return {
      id: String(tag.id),
      title: 'name' in tag ? (tag.name as string) : '',
      slug: tag.slug || '',
    }
  }
  return { id: String(tag), title: '', slug: '' }
}

/**
 * Maps Payload article to component article interface
 */
function mapArticle(payloadArticle: PayloadArticle): ArticleData | null {
  // Guard against malformed data (use == null to allow falsy but valid ids like 0)
  if (!payloadArticle || payloadArticle.id == null) {
    return null
  }

  return {
    id: String(payloadArticle.id),
    title: payloadArticle.title || '',
    slug: payloadArticle.slug || '',
    excerpt: payloadArticle.excerpt || '',
    coverImage: mapCoverImage(payloadArticle.featuredImage),
    category: mapCategory(payloadArticle.category),
    tags: payloadArticle.tags?.map(mapTag).filter((tag) => tag.title && tag.slug) ?? [],
    complexity: (payloadArticle.complexity as ArticleData['complexity']) || 'intermediate',
    readingTime: payloadArticle.readingTime || 0,
    publishedAt: payloadArticle.publishedAt || payloadArticle.createdAt,
  }
}

/**
 * Homepage component with Payload data fetching.
 *
 * Displays:
 * - Featured article card (hero section)
 * - Grid of recent articles
 * - Empty state when no articles
 * - CTA to articles hub
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  const t = await getTranslations('homepage')

  let articles: ArticleData[] = []
  let hasError = false

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch 7 most recent published articles
    const { docs: payloadArticles } = await payload.find({
      collection: 'articles',
      locale,
      limit: 7,
      sort: '-publishedAt',
      where: {
        status: { equals: 'published' },
      },
      depth: 2,
    })

    // Map Payload articles to component articles, filtering out any null/invalid entries
    articles = payloadArticles
      .map(mapArticle)
      .filter((article): article is ArticleData => article !== null)
  } catch (error) {
    hasError = true
    logger.error('Failed to fetch articles for homepage', {
      locale,
      error,
    })
    // Continue with empty articles array to prevent crashes
  }

  // Empty state or error state
  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState headingLevel="h1" variant={hasError ? 'error' : 'empty'} />
      </div>
    )
  }

  // Destructure articles
  const [featuredArticle, ...recentArticles] = articles

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Featured Article */}
      <FeaturedArticleCard article={featuredArticle} locale={locale} />

      {/* Recent Articles Grid */}
      {recentArticles.length > 0 && <ArticleGrid articles={recentArticles} locale={locale} />}

      {/* CTA to Hub */}
      <section className="flex justify-center py-8">
        <Button asChild size="lg" variant="outline">
          <Link href={`/${locale}/articles`}>
            {t('viewAllArticles')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
