import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.spec.{ts,tsx}', 'tests/int/**/*.int.spec.ts'],
    // Use node environment for integration tests (no DOM needed, avoids jsdom TextEncoder issues)
    environmentMatchGlobs: [['tests/int/**/*.int.spec.ts', 'node']],
    // Run integration tests sequentially to avoid D1 SQLite lock issues
    fileParallelism: false,
    // Coverage configuration for included tests (unit and integration)
    coverage: {
      provider: 'v8',
      reporter: ['json-summary', 'text'],
      reportOnFailure: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.stories.tsx', 'src/**/index.ts'],
    },
  },
})
