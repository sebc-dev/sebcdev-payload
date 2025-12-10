/**
 * TOC Data Types
 *
 * Type definitions for Table of Contents extraction and rendering.
 * Used by extractTOCHeadings() and TableOfContents component.
 */

import type { LexicalContent } from '@/components/richtext/types'

/**
 * Represents a single heading entry in the Table of Contents
 */
export interface TOCHeading {
  /** URL-friendly ID generated from heading text (matches Heading.tsx output) */
  id: string
  /** Plain text content of the heading */
  text: string
  /** Heading level - only h2 and h3 are supported for TOC */
  level: 2 | 3
}

/**
 * Array of TOC headings representing the full table of contents
 */
export type TOCData = TOCHeading[]

/**
 * Input type for extraction function
 */
export type TOCExtractionInput = LexicalContent | null | undefined
