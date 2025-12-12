/**
 * CustomCodeBlock Component
 *
 * Renders syntax-highlighted code blocks from BlocksFeature.
 * Server Component - highlighting happens at build/request time.
 */

import type { BlockNode } from '@/components/richtext/types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '@/components/richtext/shiki-config'
import { HighlightedCodeBlock } from '@/components/richtext/nodes/HighlightedCodeBlock'
import { logger } from '@/lib/logger'
import { escapeHtml } from '@/components/richtext/escapeHtml'

interface CustomCodeBlockProps {
  node: BlockNode
}

/**
 * Human-friendly labels for common programming languages
 */
export const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  php: 'PHP',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  html: 'HTML',
  css: 'CSS',
  graphql: 'GraphQL',
  xml: 'XML',
  json: 'JSON',
  sql: 'SQL',
  yaml: 'YAML',
  markdown: 'Markdown',
  bash: 'Bash',
  text: 'Plain Text',
}

/**
 * CustomCodeBlock Component
 *
 * Async Server Component that renders highlighted code from BlocksFeature blocks.
 */
export async function CustomCodeBlock({ node }: CustomCodeBlockProps) {
  // Guard: ensure this is a code block
  if (node.fields.blockType !== 'code') {
    logger.debug('CustomCodeBlock received non-code block', {
      blockType: node.fields.blockType,
    })
    return null
  }

  const { fields } = node

  // Extract code and language from block fields
  const code = typeof fields.code === 'string' ? fields.code : ''
  const rawLanguage = typeof fields.language === 'string' ? fields.language : 'text'
  const language = getFallbackLanguage(rawLanguage)

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
