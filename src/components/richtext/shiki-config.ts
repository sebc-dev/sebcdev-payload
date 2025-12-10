/**
 * Shiki Syntax Highlighter Configuration
 *
 * Configured for Edge runtime compatibility (Cloudflare Workers).
 * Uses web bundle for minimal bundle size.
 */

import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki/bundle/web'

/**
 * Supported languages for syntax highlighting
 * Limited set from shiki/bundle/web for Edge runtime compatibility
 */
export const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'json',
  'html',
  'css',
  'bash',
  'shell',
  'python',
  'sql',
  'yaml',
  'markdown',
  'graphql',
  'xml',
  'java',
  'c',
  'cpp',
]

/**
 * Theme for syntax highlighting
 * github-dark matches our dark mode Design System
 */
export const CODE_THEME = 'github-dark' as const

/**
 * Language aliases for common alternative names
 */
const LANGUAGE_ALIASES: Readonly<Record<string, BundledLanguage>> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  py: 'python',
  md: 'markdown',
  gql: 'graphql',
}

/**
 * Singleton highlighter instance
 * Cached for performance
 */
let highlighterPromise: Promise<Highlighter> | null = null

/**
 * Get or create the Shiki highlighter instance
 *
 * @returns Cached highlighter instance
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [CODE_THEME],
      langs: SUPPORTED_LANGUAGES,
    })
  }

  try {
    return await highlighterPromise
  } catch (error) {
    // Reset cache on failure to allow retry on next call
    highlighterPromise = null
    throw error
  }
}

/**
 * Check if a language is supported
 *
 * @param lang - Language identifier
 * @returns true if language is supported
 */
export function isSupportedLanguage(lang: string): lang is BundledLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as BundledLanguage)
}

/**
 * Get fallback language for unsupported languages
 *
 * @param lang - Original language
 * @returns Supported language or 'text'
 */
export function getFallbackLanguage(lang: string | undefined): BundledLanguage | 'text' {
  if (!lang) return 'text'
  if (isSupportedLanguage(lang)) return lang

  const aliased = LANGUAGE_ALIASES[lang]
  if (aliased) return aliased

  return 'text'
}
