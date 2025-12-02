import '@/app/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { JetBrains_Mono, Nunito_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'

/**
 * Nunito Sans - Primary font for body and headings
 *
 * @see https://fonts.google.com/specimen/Nunito+Sans
 */
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
})

/**
 * JetBrains Mono - Monospace font for code elements
 *
 * @see https://fonts.google.com/specimen/JetBrains+Mono
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

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
 * - Nunito Sans and JetBrains Mono fonts via next/font
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
    <html lang={locale} className={`${nunitoSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
