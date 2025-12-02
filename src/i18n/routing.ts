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
  // Disable automatic cookie - we handle it manually for GDPR compliance
  // Session cookie by default, persistent only on explicit user locale change
  localeCookie: false,
})

/**
 * Middleware matcher configuration
 *
 * Only matches frontend routes, excluding:
 * - /api/* - API routes (Payload and custom endpoints)
 * - /admin/* - Payload admin panel
 * - /_next/* - Next.js internals
 * - Files with extensions (.*\..*)
 *
 * This ensures middleware only processes frontend routes that need locale handling.
 * The matcher pattern uses a negative lookahead regex for efficiency.
 *
 * @public - Exported for reuse in middleware.ts and tests
 * @see middleware.ts - Uses this same pattern
 */
export const middlewareMatcher = [
  // Match all pathnames except those starting with:
  // api/, admin/, _next/ or containing a file extension
  '/((?!api|admin|_next|.*\\..*).*)',
]

/**
 * Re-export Locale type for convenience
 * @public - Public API for consumers of i18n module
 */
export type { Locale } from './config'
