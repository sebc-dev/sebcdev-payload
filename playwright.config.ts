import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

const DEFAULT_BASE_URL = 'http://localhost:3000'

/**
 * Normalize and validate BASE_URL.
 * - Trims whitespace, treats empty strings as undefined
 * - Validates URL is parseable, falls back to default if not
 * - Rejects file:// URLs (incompatible with Playwright's HTTP health checks)
 */
function getBaseURL(): string {
  const rawBaseURL = process.env.BASE_URL?.trim()
  if (!rawBaseURL) {
    return DEFAULT_BASE_URL
  }

  try {
    const parsed = new URL(rawBaseURL)

    // file:// URLs are incompatible with Playwright's webServer health checks
    if (parsed.protocol === 'file:') {
      console.warn(
        `[Playwright Config] BASE_URL "${rawBaseURL}" uses file:// protocol which is incompatible with Playwright webServer. Use http:// or https://. Falling back to ${DEFAULT_BASE_URL}.`,
      )
      return DEFAULT_BASE_URL
    }

    return rawBaseURL
  } catch (error) {
    console.warn(
      `[Playwright Config] Invalid BASE_URL "${rawBaseURL}": ${error instanceof Error ? error.message : String(error)}. Falling back to ${DEFAULT_BASE_URL}.`,
    )
    return DEFAULT_BASE_URL
  }
}

const baseURL = getBaseURL()
// Track if user provided a valid custom URL (for webServer decision)
const hasCustomBaseURL = process.env.BASE_URL?.trim() && baseURL !== DEFAULT_BASE_URL

/**
 * Determine if BASE_URL points to a local host.
 * Only start webServer for local URLs or when BASE_URL is unset.
 *
 * Recognized as local:
 * - localhost, 127.0.0.0/8 range, 0.0.0.0, ::1 (IPv6 loopback)
 * - Hostnames ending with .local (mDNS/Bonjour)
 *
 * Note: file:// is excluded - it's rejected earlier in getBaseURL()
 */
function isLocalURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Normalize hostname: lowercase
    // Note: URL.hostname already excludes IPv6 brackets per WHATWG URL spec
    const hostname = parsed.hostname.toLowerCase()

    return (
      hostname === 'localhost' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.startsWith('127.') ||
      hostname.endsWith('.local')
    )
  } catch (error) {
    // Log warning for debugging invalid URLs, then fallback to local
    console.warn(
      `[Playwright Config] Invalid URL "${url}": ${error instanceof Error ? error.message : String(error)}. Assuming local.`,
    )
    return true
  }
}

const shouldStartWebServer = !hasCustomBaseURL || isLocalURL(baseURL)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Limit workers to avoid overwhelming the dev server. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  /* Only start local dev server when targeting localhost */
  webServer: shouldStartWebServer
    ? {
        command: 'pnpm dev',
        reuseExistingServer: true,
        url: baseURL,
        // In CI, Next.js cold start can be slow (especially first compile)
        timeout: process.env.CI ? 120000 : 60000,
      }
    : undefined,
})
