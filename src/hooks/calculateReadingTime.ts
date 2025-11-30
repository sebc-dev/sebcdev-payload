import type { CollectionBeforeChangeHook } from 'payload'

import { logger } from '@/lib/logger'

/**
 * Calculates reading time based on article content
 *
 * @param data - Article data being created/updated
 * @param context - Hook context for preventing infinite loops
 * @returns Modified article data with calculated readingTime
 *
 * Reading speed: 200 words per minute (average for technical content)
 * Formula: Math.ceil(wordCount / 200)
 *
 * @example
 * // 100 words → 1 minute (rounds up from 0.5)
 * // 200 words → 1 minute
 * // 201 words → 2 minutes
 * // 400 words → 2 minutes
 */
export const calculateReadingTime: CollectionBeforeChangeHook = async ({
  data,
  context,
  operation,
}) => {
  // Prevent infinite loops if hook is called recursively
  if (context?.skipReadingTimeHook) {
    return data
  }

  // Handle missing or null data - return null per Payload conventions
  if (!data) {
    return null
  }

  // Only calculate reading time for published articles
  // Clear reading time for drafts and archived articles
  if (data.status !== 'published') {
    data.readingTime = 0
    return data
  }

  // Handle missing or null content
  if (!data.content) {
    data.readingTime = 0
    return data
  }

  try {
    // Extract plain text from Lexical JSON structure with budget limits
    const { text, stats } = extractTextFromLexical(data.content, {
      enableDiagnostics: true,
    })

    // Calculate word count using Unicode-aware segmentation
    const wordCount = countWords(text)

    // Calculate reading time (200 wpm, round up)
    const readingTime = Math.ceil(wordCount / 200)

    // Log if budget was exhausted (reading time may be underestimated)
    if (stats.budgetExhausted) {
      logger.warn('Reading time calculated with partial content', {
        operation,
        wordCount,
        readingTime,
        nodesProcessed: stats.nodesProcessed,
        charsCollected: stats.charsCollected,
        exhaustionReason: stats.exhaustionReason,
        hook: 'calculateReadingTime',
      })
    }

    // Update data with calculated reading time
    data.readingTime = readingTime

    return data
  } catch (error) {
    // Log error with structured context but don't fail the operation
    logger.error('Error calculating reading time', {
      error: error instanceof Error ? error : new Error(String(error)),
      operation,
      status: data.status,
      hasContent: !!data.content,
      hook: 'calculateReadingTime',
    })
    data.readingTime = 0
    return data
  }
}

/**
 * CJK Unicode property regex to match Han, Hiragana, Katakana, and Hangul characters.
 * Each CJK character is counted as approximately one word since these languages
 * don't use spaces between words.
 */
const CJK_REGEX = /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/gu

/**
 * Counts words in text using Unicode-aware segmentation.
 *
 * Strategy:
 * 1. Try Intl.Segmenter (word granularity) - counts segments where isWordLike is true
 * 2. Fallback: hybrid approach combining whitespace split + CJK character count
 *
 * @param text - The text to count words in
 * @returns Number of words
 */
function countWords(text: string): number {
  const trimmedText = text.trim()
  if (!trimmedText) return 0

  // Try Intl.Segmenter if available (modern browsers, Node 16+, Cloudflare Workers)
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
      let wordCount = 0
      for (const segment of segmenter.segment(trimmedText)) {
        if (segment.isWordLike) {
          wordCount++
        }
      }
      return wordCount
    } catch (error) {
      // Log warning and fall through to fallback
      logger.warn('Intl.Segmenter failed, falling back to hybrid word count', {
        error: error instanceof Error ? error : new Error(String(error)),
        hook: 'countWords',
      })
    }
  }

  // Fallback: hybrid approach for environments without Intl.Segmenter
  // 1. Count whitespace-separated tokens (for space-separated languages)
  // 2. Add CJK characters (each character ≈ one word)

  // Remove CJK characters from text before splitting on whitespace
  const textWithoutCJK = trimmedText.replace(CJK_REGEX, ' ')
  const spaceSeparatedWords = textWithoutCJK.split(/\s+/).filter(Boolean).length

  // Count CJK characters
  const cjkMatches = trimmedText.match(CJK_REGEX)
  const cjkCharCount = cjkMatches ? cjkMatches.length : 0

  return spaceSeparatedWords + cjkCharCount
}

/** Default maximum recursion depth to prevent stack overflow */
const DEFAULT_MAX_DEPTH = 50

/** Default processing budget to prevent Cloudflare Worker CPU overruns */
const DEFAULT_MAX_NODES = 10000
const DEFAULT_MAX_CHARS = 500000

/** Type for Lexical node or array of nodes */
type LexicalNode = Record<string, unknown> | Record<string, unknown>[] | null | undefined

/** Default processing budget to prevent Cloudflare Worker CPU overruns */
const DEFAULT_MAX_NODES = 10000
const DEFAULT_MAX_CHARS = 500000

/** Type for Lexical node or array of nodes */
type LexicalNode = Record<string, unknown> | Record<string, unknown>[] | null | undefined

/** Budget options for limiting processing on large documents */
interface ExtractionBudget {
  /** Maximum number of nodes to process (default: 10000) */
  maxNodes?: number
  /** Maximum characters to collect (default: 500000) */
  maxChars?: number
}

/** Mutable stats object passed through recursion */
interface ExtractionStats {
  /** Number of nodes processed */
  nodesProcessed: number
  /** Number of characters collected */
  charsCollected: number
  /** Maximum depth reached during extraction */
  maxDepthReached: number
  /** Whether processing was terminated due to budget exhaustion */
  budgetExhausted: boolean
  /** Reason for budget exhaustion if applicable */
  exhaustionReason?: 'maxNodes' | 'maxChars' | 'maxDepth'
}

/** Result of text extraction including diagnostics */
interface ExtractionResult {
  /** Extracted plain text */
  text: string
  /** Processing statistics for diagnostics */
  stats: ExtractionStats
}

/**
 * Create initial extraction stats object
 */
function createExtractionStats(): ExtractionStats {
  return {
    nodesProcessed: 0,
    charsCollected: 0,
    maxDepthReached: 0,
    budgetExhausted: false,
  }
}

/**
 * Recursively extract plain text from Lexical JSON structure with budget limits
 *
 * @param node - Lexical node (root, paragraph, heading, list, etc.) or array of nodes
 * @param options - Optional configuration for extraction
 * @returns Extraction result with text and diagnostics
 */
function extractTextFromLexical(
  node: LexicalNode,
  options?: {
    maxDepth?: number
    budget?: ExtractionBudget
    enableDiagnostics?: boolean
  },
): ExtractionResult {
  const maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH
  const maxNodes = options?.budget?.maxNodes ?? DEFAULT_MAX_NODES
  const maxChars = options?.budget?.maxChars ?? DEFAULT_MAX_CHARS
  const stats = createExtractionStats()
  const visited = new WeakSet<object>()

  const text = extractTextRecursive(node, {
    maxDepth,
    maxNodes,
    maxChars,
    currentDepth: 0,
    stats,
    visited,
  })

  // Log diagnostics if enabled and budget was exhausted
  if (options?.enableDiagnostics && stats.budgetExhausted) {
    logger.warn('Text extraction budget exhausted', {
      nodesProcessed: stats.nodesProcessed,
      charsCollected: stats.charsCollected,
      maxDepthReached: stats.maxDepthReached,
      exhaustionReason: stats.exhaustionReason,
      hook: 'extractTextFromLexical',
    })
  }

  return { text, stats }
}

/**
 * Internal recursive extraction with budget tracking
 */
function extractTextRecursive(
  node: LexicalNode,
  context: {
    maxDepth: number
    maxNodes: number
    maxChars: number
    currentDepth: number
    stats: ExtractionStats
    visited: WeakSet<object>
  },
): string {
  const { maxDepth, maxNodes, maxChars, currentDepth, stats, visited } = context

  // Check if budget is already exhausted
  if (stats.budgetExhausted) {
    return ''
  }

  if (!node) return ''

  // Update max depth reached
  if (currentDepth > stats.maxDepthReached) {
    stats.maxDepthReached = currentDepth
  }

  // Check depth budget
  if (currentDepth >= maxDepth) {
    stats.budgetExhausted = true
    stats.exhaustionReason = 'maxDepth'
    return ''
  }

  // Check nodes budget
  if (stats.nodesProcessed >= maxNodes) {
    stats.budgetExhausted = true
    stats.exhaustionReason = 'maxNodes'
    return ''
  }

  // Increment nodes counter
  stats.nodesProcessed++

  // Handle array of nodes (e.g., when root is an array)
  if (Array.isArray(node)) {
    const results: string[] = []
    for (const element of node) {
      if (stats.budgetExhausted) break
      const text = extractTextRecursive(element, {
        ...context,
        currentDepth: currentDepth + 1,
      })
      if (text) results.push(text)
    }
    return results.join(' ')
  }

  // Detect cycles by checking if node was already visited
  if (visited.has(node)) {
    return ''
  }

  // Mark this node as visited
  visited.add(node)

  // Handle text nodes
  if (node.type === 'text') {
    const text = (node.text as string) || ''

    // Check chars budget before adding
    if (stats.charsCollected + text.length > maxChars) {
      // Take only what fits in budget
      const remaining = maxChars - stats.charsCollected
      stats.charsCollected = maxChars
      stats.budgetExhausted = true
      stats.exhaustionReason = 'maxChars'
      return text.slice(0, remaining)
    }

    stats.charsCollected += text.length
    return text
  }

  // Handle nodes with children (paragraphs, headings, lists, etc.)
  if (node.children && Array.isArray(node.children)) {
    const results: string[] = []
    for (const child of node.children as Record<string, unknown>[]) {
      if (stats.budgetExhausted) break
      const text = extractTextRecursive(child, {
        ...context,
        currentDepth: currentDepth + 1,
      })
      if (text) results.push(text)
    }
    return results.join(' ')
  }

  // Handle root node
  if (node.root) {
    return extractTextRecursive(node.root as LexicalNode, {
      ...context,
      currentDepth: currentDepth + 1,
    })
  }

  return ''
}
