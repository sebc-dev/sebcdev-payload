import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import './styles.css'

/**
 * Metadata for frontend pages.
 * Basic metadata - full i18n metadata comes in Story 6.x
 */
export const metadata: Metadata = {
  description: 'A Payload CMS blog with i18n support.',
  title: 'sebc.dev',
}

/**
 * Frontend layout for locale-specific routes.
 *
 * This layout:
 * - Applies frontend-specific styles
 * - Wraps content in semantic <main> element
 * - Enables static rendering via setRequestLocale
 */
export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <main>{children}</main>
}
