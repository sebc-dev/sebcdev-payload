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
      <div className="relative flex-1 overflow-clip bg-[hsl(0,0%,8%)]">
        {/* Fixed decorative SVGs - behind content, starting just after header */}
        <div
          className="pointer-events-none absolute left-0 top-0 hidden h-[1600px] w-[1600px] opacity-[0.12] lg:block"
          style={{ marginLeft: 'calc(50% - 36rem - 800px)', marginTop: '-300px' }}
          aria-hidden="true"
        >
          <Image src="/logo_outline_left.svg" alt="" fill style={{ filter: 'invert(1)' }} />
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 hidden h-[1600px] w-[1600px] opacity-[0.12] lg:block"
          style={{ marginRight: 'calc(50% - 36rem - 800px)', marginTop: '-300px' }}
          aria-hidden="true"
        >
          <Image src="/logo_outline_right.svg" alt="" fill style={{ filter: 'invert(1)' }} />
        </div>

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
