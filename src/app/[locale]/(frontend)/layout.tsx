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
 * Decorative SVG positioning constants
 *
 * These values position the background logo SVGs so their inner edge
 * aligns with the content area edge (max-w-6xl = 72rem = 1152px).
 *
 * Formula: margin = 50% - (content-half-width) - (logo-width)
 * - 50% centers the reference point
 * - Subtract half of max-w-6xl (36rem) to reach content edge
 * - Subtract logo width to position logo outside content area
 */
const SVG_POSITION = {
  /** Half of max-w-6xl (72rem / 2 = 36rem) - distance from center to content edge */
  CONTENT_HALF_WIDTH: '36rem',
  /** Logo width for lg-xl breakpoints (1400px) */
  LOGO_WIDTH_LG: '700px',
  /** Logo width for 2xl+ breakpoints (1700px) */
  LOGO_WIDTH_2XL: '850px',
} as const

/** Computed margin for lg-xl logos: positions logo edge at content edge */
const marginLg = `calc(50% - ${SVG_POSITION.CONTENT_HALF_WIDTH} - ${SVG_POSITION.LOGO_WIDTH_LG})`
/** Computed margin for 2xl+ logos: positions logo edge at content edge */
const margin2xl = `calc(50% - ${SVG_POSITION.CONTENT_HALF_WIDTH} - ${SVG_POSITION.LOGO_WIDTH_2XL})`

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
      {/* Left logo - lg to xl (1400px) */}
      <div
        className="pointer-events-none fixed -top-64 left-0 z-0 hidden h-[1400px] w-[1400px] opacity-[0.10] lg:block 2xl:hidden"
        style={{ marginLeft: marginLg }}
        aria-hidden="true"
      >
        <Image src="/logo_outline_left.svg" alt="" fill style={{ filter: 'invert(1)' }} />
      </div>
      {/* Left logo - 2xl+ (1700px) */}
      <div
        className="pointer-events-none fixed -top-64 left-0 z-0 hidden h-[1700px] w-[1700px] opacity-[0.10] 2xl:block"
        style={{ marginLeft: margin2xl }}
        aria-hidden="true"
      >
        <Image src="/logo_outline_left.svg" alt="" fill style={{ filter: 'invert(1)' }} />
      </div>

      {/* Right logo - lg to xl (1400px) */}
      <div
        className="pointer-events-none fixed -top-64 right-0 z-0 hidden h-[1400px] w-[1400px] opacity-[0.10] lg:block 2xl:hidden"
        style={{ marginRight: marginLg }}
        aria-hidden="true"
      >
        <Image src="/logo_outline_right.svg" alt="" fill style={{ filter: 'invert(1)' }} />
      </div>
      {/* Right logo - 2xl+ (1700px) */}
      <div
        className="pointer-events-none fixed -top-64 right-0 z-0 hidden h-[1700px] w-[1700px] opacity-[0.10] 2xl:block"
        style={{ marginRight: margin2xl }}
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
