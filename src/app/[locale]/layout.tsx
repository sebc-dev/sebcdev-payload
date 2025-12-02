import '@/app/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'

/**
 * Generate static params for all supported locales.
 * This enables static generation for /fr and /en paths.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Root layout for locale-specific routes.
 *
 * Provides:
 * - NextIntlClientProvider for client-side translations
 * - Dynamic <html lang> attribute
 * - Static rendering support via setRequestLocale
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate the locale parameter
  if (!isValidLocale(locale)) {
    notFound()
  }

  // Enable static rendering for this locale
  setRequestLocale(locale)

  // Load messages for the current locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
