import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Footer, Header, SkipLink } from '@/components/layout'

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
 * - Wraps content in semantic <main> element with decorative SVG backgrounds
 * - Constrains content width to match header/footer (max-w-6xl)
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
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      {/* Fixed decorative SVGs - behind content, fixed position on scroll */}
      <div
        className="pointer-events-none fixed -top-64 left-0 z-0 hidden h-[1400px] w-[1400px] opacity-[0.10] lg:block"
        style={{ marginLeft: 'calc(50% - 36rem - 700px)' }}
        aria-hidden="true"
      >
        <Image src="/logo_outline_left.svg" alt="" fill style={{ filter: 'invert(1)' }} />
      </div>
      <div
        className="pointer-events-none fixed -top-64 right-0 z-0 hidden h-[1400px] w-[1400px] opacity-[0.10] lg:block"
        style={{ marginRight: 'calc(50% - 36rem - 700px)' }}
        aria-hidden="true"
      >
        <Image src="/logo_outline_right.svg" alt="" fill style={{ filter: 'invert(1)' }} />
      </div>
      <div className="relative z-10 flex-1">
        {/* Main content with constrained width and subtle shadow */}
        <main
          id="main-content"
          className="relative z-10 mx-auto max-w-6xl bg-background px-4 shadow-[0_0_8px_rgba(0,0,0,0.15)]"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
