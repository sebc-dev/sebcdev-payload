/**
 * TOC Module
 *
 * Utilities for Table of Contents extraction and generation.
 *
 * @example
 * import { extractTOCHeadings, slugify } from '@/lib/toc'
 *
 * const headings = extractTOCHeadings(article.content)
 */

// Types
export type { TOCHeading, TOCData, TOCExtractionInput } from './types'

// Utilities
export { slugify } from './slugify'
export { extractTOCHeadings } from './extract-headings'
