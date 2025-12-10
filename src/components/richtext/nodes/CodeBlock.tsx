/**
 * CodeBlock Component
 *
 * Renders syntax-highlighted code blocks using Shiki.
 * Server Component - highlighting happens at build/request time.
 */

import type { CodeNode, LexicalNode, TextNode } from '../types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '../shiki-config'

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

  // Get highlighter and generate HTML
  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: CODE_THEME,
  })

  // Language display name
  const languageLabel = language === 'text' ? 'Plain Text' : language.toUpperCase()

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      {/* Header with language indicator */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {languageLabel}
        </span>
        {/* CopyButton will be added in Commit 4 */}
      </div>

      {/* Code content */}
      <div
        className="overflow-x-auto text-sm [&>pre]:m-0 [&>pre]:bg-transparent [&>pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
