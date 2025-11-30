import type { CollectionBeforeChangeHook } from 'payload'

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
export const calculateReadingTime: CollectionBeforeChangeHook = async ({ data, context }) => {
  // Prevent infinite loops if hook is called recursively
  if (context?.skipReadingTimeHook) {
    return data
  }

  // Handle missing or null content
  if (!data?.content) {
    data.readingTime = 0
    return data
  }

  try {
    // Extract plain text from Lexical JSON structure
    const text = extractTextFromLexical(data.content)

    // Calculate word count (split on whitespace)
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length

    // Calculate reading time (200 wpm, round up)
    const readingTime = Math.ceil(wordCount / 200)

    // Update data with calculated reading time
    data.readingTime = readingTime

    return data
  } catch (error) {
    // Log error but don't fail the operation
    console.error('Error calculating reading time:', error)
    data.readingTime = 0
    return data
  }
}

/** Default maximum recursion depth to prevent stack overflow */
const DEFAULT_MAX_DEPTH = 50

/**
 * Recursively extract plain text from Lexical JSON structure
 *
 * @param node - Lexical node (root, paragraph, heading, list, etc.)
 * @param maxDepth - Maximum recursion depth (default: 50)
 * @param currentDepth - Current recursion depth (internal use)
 * @param visited - WeakSet to track visited nodes for cycle detection (internal use)
 * @returns Plain text content
 */
function extractTextFromLexical(
  node: Record<string, unknown> | null | undefined,
  maxDepth: number = DEFAULT_MAX_DEPTH,
  currentDepth: number = 0,
  visited: WeakSet<object> = new WeakSet(),
): string {
  if (!node) return ''

  // Stop recursion if max depth reached
  if (currentDepth >= maxDepth) {
    return ''
  }

  // Detect cycles by checking if node was already visited
  if (visited.has(node)) {
    return ''
  }

  // Mark this node as visited
  visited.add(node)

  // Handle text nodes
  if (node.type === 'text') {
    return (node.text as string) || ''
  }

  // Handle nodes with children (paragraphs, headings, lists, etc.)
  if (node.children && Array.isArray(node.children)) {
    return (node.children as Record<string, unknown>[])
      .map((child) => extractTextFromLexical(child, maxDepth, currentDepth + 1, visited))
      .join(' ')
  }

  // Handle root node
  if (node.root) {
    return extractTextFromLexical(
      node.root as Record<string, unknown>,
      maxDepth,
      currentDepth + 1,
      visited,
    )
  }

  return ''
}
