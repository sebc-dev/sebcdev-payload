/**
 * SEO Types
 *
 * Type definitions for SEO metadata generation.
 */

/**
 * Supported locales for SEO
 */
export type SupportedLocale = 'fr' | 'en'

/**
 * Article data needed for SEO metadata
 */
export interface ArticleSEOData {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  updatedAt?: string
  featuredImage?: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  category?: {
    name: string
    slug: string
  } | null
  tags?: Array<{
    name: string
    slug: string
  }>
  locale: SupportedLocale
}

/**
 * Site-wide SEO configuration
 */
export interface SiteConfig {
  name: string
  url: string
  defaultLocale: 'fr' | 'en'
  locales: readonly ['fr', 'en']
  author: {
    name: string
    url?: string
  }
  logo?: {
    url: string
    width: number
    height: number
  }
}

/**
 * Open Graph image configuration
 */
export interface OGImage {
  url: string
  width: number
  height: number
  alt: string
}
