import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { isValidLocale, defaultLocale } from '@/i18n/config'

/**
 * Middleware for locale detection and routing
 *
 * Detects user's locale preference from:
 * 1. Existing NEXT_LOCALE cookie (returning visitor)
 * 2. Accept-Language header (new visitor)
 * 3. Default locale (fallback)
 *
 * Sets NEXT_LOCALE cookie for persistence across sessions.
 *
 * @see https://next-intl.dev/docs/routing/middleware
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  // If locale is already in the path, proceed without redirecting
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Get locale from cookie (returning visitors)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  let locale = defaultLocale

  // Priority 1: Use cookie if valid (returning visitor's preference)
  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale
  } else {
    // Priority 2: Parse Accept-Language header (new visitor)
    const acceptLanguage = request.headers.get('accept-language') || ''
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()

    if (isValidLocale(preferredLocale)) {
      locale = preferredLocale
    }
  }

  // Redirect to locale-prefixed URL and set cookie
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url),
  )

  // Set NEXT_LOCALE cookie for future requests
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 31536000, // 1 year in seconds
    path: '/',
    sameSite: 'lax',
  })

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
  matcher: [
    // Match all pathnames except those starting with:
    // api/, admin/, _next/ or containing a file extension
    '/((?!api|admin|_next|.*\\..*).*)',
  ],
}
