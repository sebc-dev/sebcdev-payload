/**
 * CodeBlock Component
 *
 * Renders syntax-highlighted code blocks using Shiki.
 * Server Component - highlighting happens at build/request time.
 */

import type { CodeNode, LexicalNode, TextNode } from '../types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '../shiki-config'
import { CopyButton } from '@/components/ui/copy-button'
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
    html = `<pre><code>${escapedCode}</code></pre>`
    logger.error('Failed to highlight code block', {
      language,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  // Language display name
  const languageLabel = language === 'text' ? 'Plain Text' : language.toUpperCase()

  return (
    <div className="group my-6 overflow-hidden rounded-lg border border-border" data-code-container>
      {/* Header with language indicator */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
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
