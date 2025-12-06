import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { isValidLocale } from './config'

/**
 * Server-side i18n Request Configuration
 *
 * This is called for every request to determine the locale
 * and load the appropriate messages.
 *
 * @see https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (set by middleware)
  let locale = await requestLocale

  // Validate and fallback to default if invalid
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Required for relativeTime formatting
    now: new Date(),
  }
})
