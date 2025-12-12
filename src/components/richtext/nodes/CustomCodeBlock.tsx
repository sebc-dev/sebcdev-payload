/**
 * CustomCodeBlock Component
 *
 * Renders syntax-highlighted code blocks from BlocksFeature.
 * Server Component - highlighting happens at build/request time.
 */

import type { BlockNode } from '../types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '../shiki-config'
import { CopyButton } from '@/components/ui/copy-button'

interface CustomCodeBlockProps {
  node: BlockNode
}

/**
 * CustomCodeBlock Component
 *
 * Async Server Component that renders highlighted code from BlocksFeature blocks.
 */
export async function CustomCodeBlock({ node }: CustomCodeBlockProps) {
  const { fields } = node

  // Extract code and language from block fields
  const code = typeof fields.code === 'string' ? fields.code : ''
  const rawLanguage = typeof fields.language === 'string' ? fields.language : 'text'
  const language = getFallbackLanguage(rawLanguage)

  // Get highlighter and generate HTML
  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: CODE_THEME,
  })

  // Language display name
  const languageLabel = language === 'text' ? 'Plain Text' : language.toUpperCase()

  return (
    <div className="group my-6 overflow-hidden rounded-lg border border-border">
      {/* Header with language indicator */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
          data-testid="codeblock-language"
        >
          {languageLabel}
        </span>
        <CopyButton text={code} className="opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Code content */}
      {/*
       * SECURITY: dangerouslySetInnerHTML is safe here because Shiki's codeToHtml()
       * escapes all code content by default, treating it as text rather than markup.
       * Characters like <, >, &, and quotes are converted to HTML entities.
       * See: https://shiki.style/guide/install#codetohtml
       */}
      <div
        className="overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:bg-transparent [&_pre]:p-4 [&_code]:!p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
