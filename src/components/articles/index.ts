/**
 * Articles Components Barrel Export
 *
 * Central export point for all article-related components:
 * - CategoryBadge: Display article categories with dynamic styling
 * - ComplexityBadge: Show article complexity levels (beginner/intermediate/advanced)
 * - TagPill: Display and link to article tags
 * - ArticleCard: Complete article preview card with all metadata
 * - FeaturedArticleCard: Hero/featured article display with H1 title
 * - ArticleGrid: Responsive grid container for displaying multiple articles
 * - RelativeDate: Localized relative time display
 * - EmptyState: Fallback component when no articles are published
 * - ArticleHeader: Article page header with metadata (category, title, complexity, reading time, date)
 * - ArticleFooter: Article page footer with tags section
 *
 * Shared types:
 * - ArticleData, CategoryData, TagData, CoverImageData, Complexity: Shared interfaces for article components
 */

// Types
export type {
  ArticleData,
  CategoryData,
  TagData,
  CoverImageData,
  CoverImage,
  Complexity,
} from './types'

// Components
export { CategoryBadge } from './CategoryBadge'
export { ComplexityBadge } from './ComplexityBadge'
export { TagPill } from './TagPill'
export { RelativeDate } from '../RelativeDate'
export { ArticleCard } from './ArticleCard'
export { FeaturedArticleCard } from './FeaturedArticleCard'
export { ArticleGrid } from './ArticleGrid'
export { ArticleHeader } from './ArticleHeader'
export { ArticleFooter } from './ArticleFooter'
export { ArticleHero } from './ArticleHero'
export { EmptyState } from '../EmptyState'
