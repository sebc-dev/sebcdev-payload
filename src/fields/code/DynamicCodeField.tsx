'use client'

import { CodeField, useField } from '@payloadcms/ui'
import type { CodeFieldClientProps } from 'payload'

/**
 * Maps language aliases to Monaco-compatible language identifiers.
 * Monaco uses specific language IDs that may differ from common names.
 */
const MONACO_LANGUAGE_MAP: Record<string, string> = {
  bash: 'shell',
}

/**
 * Converts a language value to its Monaco-compatible identifier.
 */
function toMonacoLanguage(language: string): string {
  return MONACO_LANGUAGE_MAP[language] ?? language
}

/**
 * Custom CodeField component that dynamically updates syntax highlighting
 * based on the sibling 'language' select field value.
 *
 * Uses React key prop to force remount when language changes,
 * ensuring Monaco editor updates its syntax highlighting.
 */
export function DynamicCodeField(props: CodeFieldClientProps) {
  const { path } = props

  // Derive the language field path from the code field path
  // e.g., if code field is "blocks.0.code", language field is "blocks.0.language"
  const languagePath = path.replace(/\.code$/, '.language')

  const { value: languageValue } = useField<string>({ path: languagePath })

  // Use the selected language, falling back to typescript as default
  // Map to Monaco-compatible identifier
  const language = toMonacoLanguage(languageValue || 'typescript')

  return (
    <CodeField
      {...props}
      field={{
        ...props.field,
        admin: {
          ...(props.field.admin ?? {}),
          language,
        },
      }}
      // Key forces React to remount the component when language changes,
      // which is required for Monaco editor to update syntax highlighting
      key={`${path}-${language}`}
    />
  )
}
