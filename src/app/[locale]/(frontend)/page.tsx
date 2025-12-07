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

/**
 * Force dynamic rendering to avoid pre-rendering during build.
 * Required because this page fetches data from Payload which needs
 * PAYLOAD_SECRET at runtime, not available during static build.
 */
export const dynamic = 'force-dynamic'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

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
      canonical: `https://sebc.dev/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sebc.dev/${locale}`,
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
  if (typeof category !== 'object' || category === null) {
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
  if (typeof tag === 'object' && tag !== null) {
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
function mapArticle(payloadArticle: PayloadArticle): ArticleData {
  return {
    id: String(payloadArticle.id),
    title: payloadArticle.title || '',
    slug: payloadArticle.slug || '',
    excerpt: payloadArticle.excerpt || '',
    coverImage: mapCoverImage(payloadArticle.featuredImage),
    category: mapCategory(payloadArticle.category),
    tags: payloadArticle.tags?.map(mapTag) ?? [],
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
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch 7 most recent published articles
  const { docs: payloadArticles } = (await payload.find({
    collection: 'articles',
    locale,
    limit: 7,
    sort: '-publishedAt',
    where: {
      status: { equals: 'published' },
    },
    depth: 2,
  })) as { docs: PayloadArticle[] }

  // Map Payload articles to component articles
  const articles = payloadArticles.map(mapArticle)

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState />
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
