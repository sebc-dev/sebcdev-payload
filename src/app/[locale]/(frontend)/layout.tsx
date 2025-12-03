import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout'

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
 * - Renders Header on all pages (sticky, responsive)
 * - Wraps content in semantic <main> element
 * - Enables static rendering via setRequestLocale
 *
 * Note: params is typed as Promise per Next.js 15 API.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout#params-optional
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

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
