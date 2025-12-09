import type { LucideCategoryIcon } from '@/lib/lucide-icons'

/**
 * Shared type definitions for article components
 *
 * These interfaces are used across ArticleCard, ArticleGrid, FeaturedArticleCard,
 * and page components to ensure type consistency.
 */

/**
 * Category interface for type safety
 * Used in article components to display category information
 */
export interface CategoryData {
  id: string
  title: string
  slug: string
  color?: string
  icon?: LucideCategoryIcon
}

/**
 * Tag interface for type safety
 * Used in article components to display article tags
 */
export interface TagData {
  id: string
  title: string
  slug: string
}

/**
 * Cover image information interface
 * Represents the article's cover image with URL and alt text
 */
export interface CoverImageData {
  url: string
  alt?: string
}

/**
 * Complexity level for articles
 * Represents the difficulty level of an article
 */
export type Complexity = 'beginner' | 'intermediate' | 'advanced'

/**
 * Article interface for type safety
 * Represents the complete article data needed to render article components
 */
export interface ArticleData {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: CoverImageData | null
  category: CategoryData | null
  tags: TagData[]
  complexity: Complexity
  readingTime: number
  publishedAt: string
}
