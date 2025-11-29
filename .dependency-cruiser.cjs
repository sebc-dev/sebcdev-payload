/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // Rule 1: Block server code in client components
    // Convention: Client components MUST use .client.tsx extension
    {
      name: 'no-server-in-client',
      comment:
        'Client components (.client.tsx) must not import server-only code. ' +
        'Convention: Any file with "use client" directive MUST use .client.tsx extension.',
      severity: 'error',
      from: {
        // Only target explicitly marked client components
        path: '\\.client\\.tsx$',
      },
      to: {
        path: [
          '^src/collections/', // Payload collections (server-only)
          '^src/.*\\.server\\.', // Explicit server files
          'payload\\.config\\.ts$', // Payload config
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

    // Rule 3: No orphan modules
    {
      name: 'no-orphans',
      comment: 'Modules that are not reachable from any entry point',
      severity: 'error',
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
      severity: 'error',
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
        // Exclude Payload migrations
        'src/migrations',
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
