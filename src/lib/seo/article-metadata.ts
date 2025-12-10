/**
 * Article Metadata Generation
 *
 * Utilities for generating Next.js Metadata for article pages.
 */

import type { Metadata } from 'next'
import type { ArticleSEOData, SiteConfig, OGImage } from './types'

/**
 * Site configuration
 */
export const siteConfig: SiteConfig = {
  name: 'SebCDev',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sebc.dev',
  defaultLocale: 'fr',
  locales: ['fr', 'en'] as const,
  author: {
    name: 'SebCDev',
    url: 'https://sebc.dev',
  },
  logo: {
    url: '/logo.png',
    width: 512,
    height: 512,
  },
}

/**
 * Generate article URL for a given locale
 */
export function getArticleUrl(slug: string, locale: string): string {
  return `${siteConfig.url}/${locale}/articles/${slug}`
}

/**
 * Generate Open Graph image object
 */
function getOGImage(article: ArticleSEOData): OGImage | undefined {
  if (!article.featuredImage?.url) return undefined

  return {
    url: article.featuredImage.url,
    width: article.featuredImage.width,
    height: article.featuredImage.height,
    alt: article.featuredImage.alt || article.title,
  }
}

/**
 * Generate hreflang alternates for multilingual support
 */
function getAlternates(slug: string): Metadata['alternates'] {
  return {
    canonical: getArticleUrl(slug, 'fr'),
    languages: {
      fr: getArticleUrl(slug, 'fr'),
      en: getArticleUrl(slug, 'en'),
      'x-default': getArticleUrl(slug, 'fr'),
    },
  }
}

/**
 * Generate complete metadata for an article page
 */
export function generateArticleMetadata(article: ArticleSEOData): Metadata {
  const title = `${article.title} | ${siteConfig.name}`
  const description = article.excerpt || `Read ${article.title} on ${siteConfig.name}`
  const url = getArticleUrl(article.slug, article.locale)
  const ogImage = getOGImage(article)

  return {
    title,
    description,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.name,

    // Open Graph
    openGraph: {
      type: 'article',
      title: article.title,
      description,
      url,
      siteName: siteConfig.name,
      locale: article.locale === 'fr' ? 'fr_FR' : 'en_US',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.author.name],
      ...(ogImage && { images: [ogImage] }),
    },

    // Twitter Card
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      ...(ogImage && { images: [ogImage.url] }),
    },

    // Alternates (hreflang)
    alternates: getAlternates(article.slug),

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Generate metadata for 404 page
 */
export function generate404Metadata(locale: string): Metadata {
  const title = locale === 'fr' ? 'Article non trouvé' : 'Article not found'
  const description =
    locale === 'fr'
      ? "L'article que vous recherchez n'existe pas."
      : 'The article you are looking for does not exist.'

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    robots: {
      index: false,
      follow: true,
    },
  }
}
