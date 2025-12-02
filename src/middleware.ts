import createMiddleware from 'next-intl/middleware'
import { routing, middlewareMatcher } from '@/i18n/routing'

/**
 * Middleware for locale detection and routing
 *
 * Uses next-intl's createMiddleware for RFC-compliant locale negotiation:
 * - Proper Accept-Language parsing with q-value handling
 * - Automatic locale detection, redirects, and rewrites
 * - Cookie-based locale persistence (NEXT_LOCALE)
 * - Alternate links for search engines
 *
 * @see https://next-intl.dev/docs/routing/middleware
 */
export default createMiddleware(routing)

/**
 * Middleware matcher configuration
 *
 * Only matches frontend routes, excluding:
 * - /api/* - API routes
 * - /admin/* - Payload admin panel
 * - /_next/* - Next.js internals
 * - Files with extensions (.*\..*)
 *
 * This ensures middleware only processes frontend routes that need locale handling.
 */
export const config = {
  matcher: middlewareMatcher,
}
