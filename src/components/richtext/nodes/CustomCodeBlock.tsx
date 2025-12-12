/**
 * CustomCodeBlock Component
 *
 * Renders syntax-highlighted code blocks from BlocksFeature.
 * Server Component - highlighting happens at build/request time.
 */

import type { BlockNode } from '@/components/richtext/types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '@/components/richtext/shiki-config'
import { CopyButton } from '@/components/ui/copy-button'
import { logger } from '@/lib/logger'
import { escapeHtml } from '@/components/richtext/escapeHtml'

interface CustomCodeBlockProps {
  node: BlockNode
}

/**
 * Human-friendly labels for common programming languages
 */
const LANGUAGE_LABELS: Record<string, string> = {
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
    html = `<pre data-language="${language}"><code>${escapedCode}</code></pre>`
    logger.error('Failed to highlight code block', {
      language,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // Language display name
  const languageLabel = LANGUAGE_LABELS[language] ?? language.toUpperCase()

  return (
    <div className="group my-6 overflow-hidden rounded-lg border border-border" data-code-container>
      {/* Header with language indicator */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span
          className="font-mono text-xs tracking-wider text-muted-foreground"
          data-testid="codeblock-language"
        >
          {languageLabel}
        </span>
        <CopyButton
          copyFromDOM
          className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
        />
      </div>

      {/* Code content */}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is either from trusted Shiki highlighter (escapes all user content) or fallback-escaped via escapeHtml() */}
      <div
        className="overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:bg-transparent [&_pre]:p-4 [&_code]:!p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
