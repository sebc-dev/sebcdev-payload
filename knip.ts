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
  // Note: The `!` suffix marks entry points for production mode (--production)
  // Only use `!` for files referenced by string paths that Knip cannot discover via imports
  // @see https://knip.dev/features/production-mode
  entry: [
    // Next.js config (production: required for build)
    'next.config.ts!',

    // OpenNext config for Cloudflare deployment (production: required for Workers build)
    'open-next.config.ts!',

    // Payload CMS config (production: required for CMS runtime)
    'src/payload.config.ts!',

    // Next.js middleware (production: required for routing)
    'src/middleware.ts!',

    // PostCSS config (uses postcss and postcss-load-config) - build only, not production
    'postcss.config.mjs',

    // Stryker mutation testing config - dev only
    'stryker.config.mjs',

    // ESLint flat config - dev only
    'eslint.config.mjs',

    // next-intl request config - referenced by string path in next.config.ts (production)
    // String ref: createNextIntlPlugin('./src/i18n/request.ts')
    'src/i18n/request.ts!',

    // Payload custom field components - referenced by string path in collection configs (production)
    // String ref: Field: '@/fields/code/DynamicCodeField#DynamicCodeField'
    'src/fields/**/*.tsx!',

    // Next.js App Router pages and layouts (production)
    // These are entry points for the frontend that import UI components
    'src/app/**/page.tsx!',
    'src/app/**/layout.tsx!',
  ],

  // Project files to analyze (includes CSS for TailwindCSS v4 compiler)
  // Root globs include .mts/.mtsx for vitest.config.mts and future configs
  // Note: The `!` suffix marks project files for production mode (--production)
  // This ensures Knip follows the import graph from entry points to all dependencies
  project: ['src/**/*.{ts,tsx,mts,mtsx,css}!', '*.{ts,mts,mtsx,mjs,cjs}'],

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

    // === Payload CMS runtime dependencies (review every 180 days) ===
    // These are peer dependencies or loaded by Payload at runtime

    // dotenv - loaded by Payload CLI to read .env files during migrations and generate:types
    // Not imported in app code but required by Payload's internal tooling
    // @knip-review-by: 2026-06-05
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
    // Next.js App Router entry points for production mode
    // These must be explicitly listed with ! suffix for --production flag
    entry: [
      'src/app/**/page.tsx!',
      'src/app/**/layout.tsx!',
      'src/app/**/route.ts!',
      'src/app/**/not-found.tsx!',
    ],
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
