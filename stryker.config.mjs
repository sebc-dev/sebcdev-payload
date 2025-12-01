/**
 * Stryker Mutation Testing Configuration
 *
 * This configuration targets critical modules in src/lib/, src/utilities/,
 * and src/hooks/ for mutation testing to validate test quality.
 *
 * @see https://stryker-mutator.io/docs/stryker-js/configuration
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
export default {
  // Package manager - avoid implicit npm installs
  packageManager: 'pnpm',

  // Files to mutate (production code only)
  mutate: [
    'src/lib/**/*.ts',
    'src/utilities/**/*.ts',
    'src/hooks/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/payload-types.ts',
  ],

  // Test runner - Vitest integration
  testRunner: 'vitest',

  // Coverage analysis strategy - perTest for optimal performance
  coverageAnalysis: 'perTest',

  // Output reporters
  reporters: ['clear-text', 'progress', 'html', 'json'],

  // HTML report output directory
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },

  // JSON report output
  jsonReporter: {
    fileName: 'reports/mutation/mutation-report.json',
  },

  // Incremental mode for faster subsequent runs
  incremental: true,
  incrementalFile: 'reports/mutation/stryker-incremental.json',

  // Quality thresholds
  thresholds: {
    high: 80, // Green - Excellent coverage
    low: 60, // Yellow - Acceptable coverage
    break: 50, // Fail build if score below this
  },

  // Parallel execution - use available CPU cores
  concurrency_comment: 'Default uses CPU cores - 1, which is optimal for most cases',

  // Timeout configuration
  timeoutMS: 10000,
  timeoutFactor: 1.5,

  // Ignore static mutants for better performance
  ignoreStatic: true,

  // Working directory cleanup
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,

  // Plugins to load
  plugins: ['@stryker-mutator/vitest-runner'],

  // Vitest-specific options
  vitest: {
    configFile: 'vitest.config.mts',
  },
}
