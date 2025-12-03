import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

/**
 * i18n Navigation Utilities
 *
 * Provides locale-aware Link and usePathname hooks
 * for use in both server and client components.
 *
 * @see https://next-intl-docs.vercel.app/docs/usage/navigation
 */

const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const { Link, usePathname, useRouter, getPathname } = createNavigation(routing)
