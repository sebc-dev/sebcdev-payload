'use client'

import { CodeField, useField } from '@payloadcms/ui'
import type { CodeFieldClientProps } from 'payload'

/**
 * Maps language aliases to Monaco-compatible language identifiers.
 * Monaco uses specific language IDs that may differ from common names.
 */
const MONACO_LANGUAGE_MAP: Record<string, string> = {
  bash: 'shellscript',
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
 *
 * @constraint This component requires the field path to end with ".code".
 * It expects a sibling "language" select field at the same level.
 * Example: path "blocks.0.code" → sibling "blocks.0.language"
 *
 * @throws Error if field path does not end with ".code"
 */
export function DynamicCodeField(props: CodeFieldClientProps) {
  const { path } = props

  // Validate that path ends with ".code" as expected
  if (!path.endsWith('.code')) {
    throw new Error(
      `DynamicCodeField requires field path ending with ".code", got "${path}". ` +
        'This component is designed for use with CodeBlock where a sibling "language" field exists.',
    )
  }

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
