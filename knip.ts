/**
 * Knip Configuration
 *
 * This configuration uses TypeScript for better documentation
 * and the ability to add contextual comments for ignored items.
 *
 * @see https://knip.dev/reference/configuration
 * @see docs/guides/gestion-knip.md for project-specific strategies
 */
import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  // Entry points - files that are the roots of the dependency graph
  entry: [
    // Next.js config
    'next.config.ts',

    // OpenNext config for Cloudflare deployment
    'open-next.config.ts',

    // Payload CMS config
    'src/payload.config.ts',

    // Next.js middleware
    'src/middleware.ts',

    // PostCSS config (uses postcss and postcss-load-config)
    'postcss.config.mjs',

    // Stryker mutation testing config
    'stryker.config.mjs',

    // ESLint flat config
    'eslint.config.mjs',

    // next-intl request config - referenced by string in next.config.ts
    'src/i18n/request.ts',

    // Payload custom field components - referenced by string path in collection configs
    'src/fields/**/*.tsx',
  ],

  // Project files to analyze (includes CSS for TailwindCSS v4 compiler)
  project: ['src/**/*.{ts,tsx,css}', '*.{ts,mjs,cjs}'],

  // Files to ignore completely
  ignore: [
    // Generated types
    'src/payload-types.ts',

    // Build artifacts
    'public/**',

    // Payload migrations - managed by Payload CLI
    'src/migrations/**',

    // Drizzle artifacts
    'drizzle/**',
  ],

  // Dependencies to ignore (with explanations)
  ignoreDependencies: [
    // @testing-library/react - used for future component tests
    // TODO: Remove when component tests are added (Sprint X)
    '@testing-library/react',

    // PostCSS ecosystem - used via postcss.config.mjs but not detected
    // because they're referenced as object keys, not imports
    'postcss',
    'postcss-load-config',

    // ESLint configs - used via compat.extends() which Knip doesn't detect
    'eslint-config-next',
    'eslint-config-prettier',

    // === Dependencies used but not detected in --production mode ===
    // CI runs with --production flag which excludes dev config files
    // These are all actively used in production code

    // OpenNext - used in open-next.config.ts for Cloudflare deployment
    '@opennextjs/cloudflare',

    // Payload CMS core packages - used in src/payload.config.ts
    '@payloadcms/db-d1-sqlite',
    '@payloadcms/richtext-lexical',
    '@payloadcms/storage-r2',

    // Payload UI - used in src/fields/code/DynamicCodeField.tsx
    '@payloadcms/ui',

    // shadcn/ui dependencies - used in src/components/ui/button.tsx
    '@radix-ui/react-slot',
    'class-variance-authority',

    // Utility libraries - used in src/lib/utils.ts
    'clsx',
    'tailwind-merge',

    // Tailwind CSS - used via @import 'tailwindcss' in src/app/globals.css
    'tailwindcss',

    // dotenv - used in vitest.setup.ts (dev file, but still needed)
    'dotenv',
  ],

  // Rules configuration - strict on dependencies, warn on code
  rules: {
    // Critical: Catch unused dependencies (affects bundle size and security)
    dependencies: 'error',
    devDependencies: 'error',
    // Warn for unlisted - some JSDoc imports like @stryker-mutator/api/core
    // are subpath exports from parent packages, not separate packages
    unlisted: 'warn',

    // Warning: Code quality issues to review progressively
    files: 'warn',
    exports: 'warn',
    types: 'warn',
  },

  // CSS compiler for TailwindCSS v4 CSS-first syntax
  // Transforms @import 'pkg' and @plugin 'pkg' directives into virtual JS imports
  // @see https://knip.dev/features/compilers
  compilers: {
    css: (text: string): string => {
      // Match @import "pkg" and @plugin "pkg" directives (Tailwind v4 syntax)
      const matches = [...text.matchAll(/@(?:import|plugin)\s+['"]([^'"]+)['"]/g)]

      // Transform to ES module imports so Knip can track the dependencies
      return matches.map(([, match]) => `import '${match}';`).join('\n')
    },
  },

  // Plugin configurations
  next: {
    // Let Next.js plugin auto-detect entries
    entry: [],
  },

  eslint: {
    // ESLint flat config detection
    config: ['eslint.config.mjs'],
  },

  postcss: {
    // PostCSS config detection
    config: ['postcss.config.mjs'],
  },

  vitest: {
    // Vitest config detection
    config: ['vitest.config.mts'],
  },

  stryker: {
    // Stryker config detection
    config: ['stryker.config.mjs'],
  },
}

export default config
