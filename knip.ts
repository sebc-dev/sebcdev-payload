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
  // Root globs include .mts/.mtsx for vitest.config.mts and future configs
  project: ['src/**/*.{ts,tsx,mts,mtsx,css}', '*.{ts,mts,mtsx,mjs,cjs}'],

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
  //
  // Review Policy:
  // - Each ignore group must have a @knip-review-by: YYYY-MM-DD comment
  // - CI script (scripts/check-knip-reviews.sh) fails if any date is past
  // - Default cadence: 90 days for temporary ignores, 180 days for structural
  // - To update: verify dependency is still needed, then bump the date
  //
  ignoreDependencies: [
    // === Temporary ignores (review every 90 days) ===

    // @testing-library/react - reserved for future component tests
    // @knip-review-by: 2026-03-03
    '@testing-library/react',

    // === Build tooling - structural ignores (review every 180 days) ===
    // These are referenced as config keys/strings, not ES imports

    // PostCSS ecosystem - referenced in postcss.config.mjs as plugin keys
    // @knip-review-by: 2026-06-03
    'postcss',
    'postcss-load-config',

    // ESLint configs - used via compat.extends() string references
    // @knip-review-by: 2026-06-03
    'eslint-config-next',
    'eslint-config-prettier',

    // === Production dependencies not detected in --production mode ===
    // CI runs with --production flag excluding dev config files
    // These are actively used; structural limitation of Knip detection

    // OpenNext - used in open-next.config.ts for Cloudflare deployment
    // @knip-review-by: 2026-06-03
    '@opennextjs/cloudflare',

    // Payload CMS core packages - used in src/payload.config.ts
    // @knip-review-by: 2026-06-03
    '@payloadcms/db-d1-sqlite',
    '@payloadcms/richtext-lexical',
    '@payloadcms/storage-r2',

    // Payload UI - used in src/fields/code/DynamicCodeField.tsx
    // @knip-review-by: 2026-06-03
    '@payloadcms/ui',

    // shadcn/ui dependencies - used in src/components/ui/button.tsx
    // @knip-review-by: 2026-06-03
    '@radix-ui/react-slot',
    'class-variance-authority',

    // Utility libraries - used in src/lib/utils.ts
    // @knip-review-by: 2026-06-03
    'clsx',
    'tailwind-merge',

    // Tailwind CSS - used via @import 'tailwindcss' in src/app/globals.css
    // @knip-review-by: 2026-06-03
    'tailwindcss',

    // dotenv - used in vitest.setup.ts (dev file, but still needed)
    // @knip-review-by: 2026-06-03
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
      // Strip block comments to avoid matching @import/@plugin inside /* ... */
      const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, '')

      // Match @import "pkg" and @plugin "pkg" directives (Tailwind v4 syntax)
      const matches = [...withoutComments.matchAll(/@(?:import|plugin)\s+['"]([^'"]+)['"]/g)]

      // Deduplicate and transform to ES module imports so Knip can track the dependencies
      const uniquePackages = [...new Set(matches.map(([, pkg]) => pkg))]
      return uniquePackages.map((pkg) => `import '${pkg}';`).join('\n')
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
