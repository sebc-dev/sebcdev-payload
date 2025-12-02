/**
 * i18n Configuration
 *
 * Defines the supported locales and default locale for the application.
 * This configuration is shared across routing, middleware, and server components.
 */

export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
