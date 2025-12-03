import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'

/**
 * Determine if BASE_URL points to a local host.
 * Only start webServer for local URLs (localhost, 127.0.0.1) or when BASE_URL is unset.
 */
function isLocalURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    return hostname === 'localhost' || hostname === '127.0.0.1' || parsed.protocol === 'file:'
  } catch {
    return true // If URL parsing fails, assume local
  }
}

const shouldStartWebServer = !process.env.BASE_URL || isLocalURL(baseURL)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
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
      }
    : undefined,
})
