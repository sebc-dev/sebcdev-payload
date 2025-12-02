import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

/**
 * Create next-intl plugin with server-side request configuration
 *
 * This wraps the entire Next.js config with i18n functionality:
 * - Loads messages for the current locale
 * - Provides useTranslations() hook availability
 * - Enables type-safe message access
 */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for OpenNext/Cloudflare Workers deployment
  output: 'standalone' as const,
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

/**
 * Apply plugins in order:
 * 1. withNextIntl - Adds i18n functionality
 * 2. withPayload - Adds Payload CMS admin panel
 *
 * Order matters: withNextIntl must wrap the config before withPayload
 */
export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
