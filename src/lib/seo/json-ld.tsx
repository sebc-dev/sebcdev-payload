/**
 * JSON-LD Structured Data Generation
 *
 * Generates Schema.org Article structured data for SEO.
 */

import type { ArticleSEOData } from './types'
import { siteConfig, getArticleUrl } from './article-metadata'

/**
 * Schema.org Article type
 */
interface ArticleJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author: {
    '@type': 'Person' | 'Organization'
    name: string
    url?: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
      width: number
      height: number
    }
  }
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  keywords?: string
  articleSection?: string
  inLanguage: string
}

/**
 * Generate JSON-LD for an article
 */
export function generateArticleJsonLd(article: ArticleSEOData): ArticleJsonLd {
  const url = getArticleUrl(article.slug, article.locale)

  const jsonLd: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      ...(siteConfig.logo && {
        logo: {
          '@type': 'ImageObject',
          url: new URL(siteConfig.logo.url, siteConfig.url).toString(),
          width: siteConfig.logo.width,
          height: siteConfig.logo.height,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: article.locale === 'fr' ? 'fr-FR' : 'en-US',
  }

  // Optional fields
  if (article.updatedAt) {
    jsonLd.dateModified = article.updatedAt
  }

  if (article.featuredImage?.url) {
    // Ensure absolute URL for Schema.org compliance
    jsonLd.image = article.featuredImage.url.startsWith('http')
      ? article.featuredImage.url
      : new URL(article.featuredImage.url, siteConfig.url).toString()
  }

  if (article.tags && article.tags.length > 0) {
    jsonLd.keywords = article.tags.map((t) => t.name).join(', ')
  }

  if (article.category) {
    jsonLd.articleSection = article.category.name
  }

  return jsonLd
}

/**
 * Props for ArticleJsonLdScript component
 */
interface ArticleJsonLdScriptProps {
  article: ArticleSEOData
}

/**
 * JSON-LD Script Component
 *
 * Renders the JSON-LD structured data as a script tag.
 */
export function ArticleJsonLdScript({ article }: ArticleJsonLdScriptProps) {
  const jsonLd = generateArticleJsonLd(article)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
