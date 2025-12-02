import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

/**
 * i18n Routing Configuration
 *
 * Configures how locales are handled in URLs:
 * - localePrefix: 'always' ensures /fr/* and /en/* URLs
 * - This enables SEO-friendly localized URLs
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

// Re-export for convenience
export type { Locale } from './config'
