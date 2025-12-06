import type { NextConfig } from 'next'
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

const nextConfig: NextConfig = {
  // Required for OpenNext/Cloudflare Workers deployment
  output: 'standalone',
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // Image optimization with Cloudflare R2 support
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
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
