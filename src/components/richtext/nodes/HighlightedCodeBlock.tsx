/**
 * HighlightedCodeBlock Component
 *
 * Shared presentational component for rendering syntax-highlighted code blocks.
 * Used by both CodeBlock (Lexical) and CustomCodeBlock (BlocksFeature).
 */

import { CopyButton } from '@/components/ui/copy-button'

interface HighlightedCodeBlockProps {
  /** Pre-rendered HTML from Shiki or fallback */
  html: string
  /** Human-friendly language label to display */
  languageLabel: string
}

/**
 * Renders a syntax-highlighted code block with language indicator and copy button.
 *
 * @param html - Pre-rendered HTML (must be safely escaped)
 * @param languageLabel - Display label for the language (e.g., "TypeScript", "Python")
 */
export function HighlightedCodeBlock({ html, languageLabel }: HighlightedCodeBlockProps) {
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
