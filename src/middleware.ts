import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'

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

/**
 * Secure cookie flag - only send over HTTPS in production
 */
const isProduction = process.env.NODE_ENV === 'production'

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

  // Extract locale using next-intl's dedicated header (preferred source of truth)
  // Falls back to URL path parsing for robustness
  // Supports both 2-letter (en, fr) and regional locales (en-US, fr-CA)
  const headerLocale = response.headers.get('x-middleware-request-x-next-intl-locale')
  const rewriteUrl = response.headers.get('x-middleware-rewrite')
  const pathname = rewriteUrl ? new URL(rewriteUrl, request.url).pathname : request.nextUrl.pathname
  const [, pathLocale] = pathname.split('/')

  const locale = headerLocale ?? pathLocale

  if (locale && isValidLocale(locale)) {
    // Set cookie with GDPR-compliant behavior
    if (explicitChange) {
      // Explicit user choice: persistent cookie (1 year)
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        maxAge: ONE_YEAR_SECONDS,
        path: '/',
        sameSite: 'lax',
        secure: isProduction,
      })
    } else {
      // Automatic detection: session cookie (no maxAge)
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        path: '/',
        sameSite: 'lax',
        secure: isProduction,
      })
    }

    // Prevent Cloudflare and other CDNs from caching responses with Set-Cookie
    // This ensures the locale cookie is properly delivered to the client
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
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
 * - Paths containing a dot (.*\..*)
 *
 * This ensures middleware only processes frontend routes that need locale handling.
 *
 * @note The dot exclusion pattern filters ANY path containing a dot, not just file
 * extensions. This means routes like /blog/john.doe or /v1.2/changelog will bypass
 * the middleware. This is intentional for this CMS project where content slugs
 * should not contain dots. If you need routes with dots, use a more specific pattern
 * like /[^/]+\\.[^/]+$ to match only the final segment with an extension.
 *
 * @see https://next-intl.dev/docs/routing/middleware#matcher
 */
export const config = {
  // Must be inlined - Next.js requires static analysis of config.matcher
  // Matches all pathnames except: /api/*, /admin/*, /_next/*, paths with dots
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
}
