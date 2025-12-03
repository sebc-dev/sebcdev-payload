'use client'

import { useTranslations } from 'next-intl'

/**
 * SkipLink Component
 *
 * Provides a "skip to main content" link for keyboard users.
 * Visually hidden by default, becomes visible when focused.
 *
 * Accessibility:
 * - First focusable element on page
 * - Allows keyboard users to bypass navigation
 * - Required for WCAG 2.1 AA compliance (2.4.1 Bypass Blocks)
 *
 * @returns Skip link that focuses main content when activated
 */
export function SkipLink() {
  const t = useTranslations('accessibility')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.getElementById('main-content')
    if (main) {
      main.focus()
      main.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t('skipToContent')}
    </a>
  )
}
