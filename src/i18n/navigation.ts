import { createNavigation } from 'next-intl/navigation'
import { routing } from '@/i18n/routing'

/**
 * i18n Navigation Utilities
 *
 * Provides locale-aware Link and usePathname hooks
 * for use in both server and client components.
 *
 * Reuses the routing configuration from @/i18n/routing.ts to ensure
 * consistent settings (including localeCookie: false for GDPR).
 *
 * @see https://next-intl-docs.vercel.app/docs/usage/navigation
 */

/** @public - Public API from next-intl, exported for potential future use */
export const { Link, usePathname, useRouter, getPathname } = createNavigation(routing)
