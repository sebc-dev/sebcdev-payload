/**
 * Shared Constants
 *
 * Single source of truth for taxonomy values used across the application.
 * These arrays are typed with "as const" to preserve literal types.
 */

/**
 * Article categories (content types)
 */
export const categories = ['news', 'deep-dive', 'tutorial', 'case-study', 'feedback'] as const

/**
 * Article themes (subject areas)
 */
export const themes = ['ai', 'ux', 'engineering'] as const

/**
 * Article difficulty levels
 */
export const levels = ['beginner', 'intermediate', 'advanced'] as const
