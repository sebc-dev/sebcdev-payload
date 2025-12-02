import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing, middlewareMatcher } from '@/i18n/routing'

/**
 * Query parameter that indicates an explicit user-initiated locale change.
 * When present, the locale cookie will be set with a 1-year maxAge.
 * Without this flag, the cookie is a session cookie (GDPR compliant).
 */
const EXPLICIT_LOCALE_CHANGE_PARAM = 'setLocale'

/**
 * Cookie name for locale persistence
 */
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

/**
 * One year in seconds for persistent cookie
 */
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

const handleI18nRouting = createMiddleware(routing)

/**
 * Middleware for locale detection and routing
 *
 * Uses next-intl's createMiddleware for RFC-compliant locale negotiation:
 * - Proper Accept-Language parsing with q-value handling
 * - Automatic locale detection, redirects, and rewrites
 * - Alternate links for search engines
 *
 * GDPR-compliant cookie handling:
 * - Session cookie by default (no maxAge)
 * - Persistent cookie (1 year) only on explicit user locale change
 *   (detected via ?setLocale query param or explicit form action)
 *
 * @see https://next-intl.dev/docs/routing/middleware
 */
export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)

  // Detect explicit user-initiated locale change
  const explicitChange = request.nextUrl.searchParams.has(EXPLICIT_LOCALE_CHANGE_PARAM)

  // Extract locale from the URL path (after redirect/rewrite)
  const pathname = response.headers.get('x-middleware-rewrite') || request.nextUrl.pathname
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
  const locale = localeMatch?.[1]

  if (locale) {
    // Set cookie with GDPR-compliant behavior
    if (explicitChange) {
      // Explicit user choice: persistent cookie (1 year)
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        maxAge: ONE_YEAR_SECONDS,
        path: '/',
        sameSite: 'lax',
      })
    } else {
      // Automatic detection: session cookie (no maxAge)
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        path: '/',
        sameSite: 'lax',
      })
    }
  }

  return response
}

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
