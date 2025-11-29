/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // Rule 1: Block server code in client components
    {
      name: 'no-server-in-client',
      comment: 'Server-only code should not be imported in client components',
      severity: 'error',
      from: {
        path: '^src/app/.*\\.tsx$',
        pathNot: [
          '\\.server\\.tsx$',  // Exclude server components
          'layout\\.tsx$',     // Layouts are server by default
          'page\\.tsx$',       // Pages are server by default (unless 'use client')
          'loading\\.tsx$',    // Loading is server
          'error\\.tsx$',      // Error has its own client boundary
          'not-found\\.tsx$',  // Not found is server
        ],
      },
      to: {
        path: [
          '^src/collections/',  // Payload collections (server-only)
          '^src/.*\\.server\\.',  // Explicit server files
          'payload\\.config\\.ts$',  // Payload config
        ],
      },
    },

    // Rule 2: Detect circular dependencies
    {
      name: 'no-circular',
      comment: 'Circular dependencies lead to maintenance issues and potential runtime errors',
      severity: 'error',
      from: {},
      to: {
        circular: true,
        // Exclude type-only cycles (these are erased at compile time)
        dependencyTypesNot: ['type-only'],
      },
    },

    // Rule 3: No orphan modules (optional, warn only)
    {
      name: 'no-orphans',
      comment: 'Modules that are not reachable from any entry point',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$',           // Type declarations
          '\\.test\\.ts$',        // Test files
          '\\.spec\\.ts$',        // Spec files
          '\\.e2e\\.spec\\.ts$',  // E2E tests
          '__tests__/',          // Test directories
          '__mocks__/',          // Mock directories
          'tests/',              // Test root directory
        ],
      },
      to: {},
    },

    // Rule 4: No deprecated dependencies
    {
      name: 'no-deprecated',
      comment: 'Deprecated modules should be replaced',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: [
        'node_modules',
        '\\.next',
        '\\.open-next',
        'coverage',
        'dist',
        'build',
        // Exclude generated files
        'src/payload-types\\.ts',
        // Exclude migrations (SQL files, not TS)
        'drizzle/migrations',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
    },
    cache: {
      folder: 'node_modules/.cache/dependency-cruiser',
      strategy: 'content',
    },
  },
}
