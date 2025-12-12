/**
 * CodeBlock Component
 *
 * Renders syntax-highlighted code blocks using Shiki.
 * Server Component - highlighting happens at build/request time.
 */

import type { CodeNode, LexicalNode, TextNode } from '@/components/richtext/types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '@/components/richtext/shiki-config'
import { LANGUAGE_LABELS } from '@/components/richtext/nodes/CustomCodeBlock'
import { HighlightedCodeBlock } from '@/components/richtext/nodes/HighlightedCodeBlock'
import { logger } from '@/lib/logger'
import { escapeHtml } from '@/components/richtext/escapeHtml'

interface CodeBlockProps {
  node: CodeNode
}

/**
 * Extract plain text from Lexical node children
 * Handles nested text nodes recursively
 */
function extractText(children: LexicalNode[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') {
        return (child as TextNode).text
      }
      if ('children' in child && Array.isArray(child.children)) {
        return extractText(child.children as LexicalNode[])
      }
      if (child.type === 'linebreak') {
        return '\n'
      }
      return ''
    })
    .join('')
}

/**
 * CodeBlock Component
 *
 * Async Server Component that renders highlighted code.
 */
export async function CodeBlock({ node }: CodeBlockProps) {
  const code = extractText(node.children)
  const language = getFallbackLanguage(node.language)

  // Get highlighter and generate HTML with error handling
  let html: string
  try {
    const highlighter = await getHighlighter()
    html = highlighter.codeToHtml(code, {
      lang: language,
      theme: CODE_THEME,
    })
  } catch (error) {
    // Fallback to safely escaped plain text if highlighting fails
    const escapedCode = escapeHtml(code)
    const escapedLanguage = escapeHtml(language)
    html = `<pre data-language="${escapedLanguage}"><code>${escapedCode}</code></pre>`
    logger.error('Failed to highlight code block', {
      language,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // Language display name
  const languageLabel = LANGUAGE_LABELS[language] ?? language.toUpperCase()

  return <HighlightedCodeBlock html={html} languageLabel={languageLabel} />
}
