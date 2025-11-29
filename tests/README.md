# Tests

This directory contains the test suites for the project.

## Structure

```
tests/
├── unit/          # Unit tests for pure functions and utilities
├── int/           # Integration tests with Payload API
└── e2e/           # End-to-end tests with Playwright
```

## Test Types

### Unit Tests (`tests/unit/**/*.spec.ts`)

- **Purpose**: Test isolated functions and utilities without external dependencies
- **Framework**: Vitest
- **Environment**: jsdom
- **Run with**: `pnpm test:unit`
- **Characteristics**:
  - Fast execution
  - No database or network calls
  - Pure functions and business logic
  - Example: validation functions, formatters, calculators

### Integration Tests (`tests/int/**/*.int.spec.ts`)

- **Purpose**: Test interactions with Payload CMS API
- **Framework**: Vitest
- **Environment**: jsdom
- **Run with**: `pnpm test:int`
- **Characteristics**:
  - Access Payload via `getPayload()`
  - Test collection operations (CRUD)
  - Database interactions
  - Example: collection hooks, authentication flows

### E2E Tests (`tests/e2e/**/*.e2e.spec.ts`)

- **Purpose**: Test complete user workflows through the browser
- **Framework**: Playwright
- **Environment**: Chromium browser
- **Run with**: `pnpm test:e2e`
- **Characteristics**:
  - Full browser automation
  - Dev server starts automatically
  - Real user interactions
  - Example: form submissions, page navigation, accessibility checks

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit        # Unit tests only
pnpm test:int         # Integration tests only
pnpm test:e2e         # E2E tests only

# Watch mode (development)
pnpm exec vitest tests/unit  # Watch unit tests
```

## Writing Tests

### Naming Conventions

- Unit tests: `*.spec.ts`
- Integration tests: `*.int.spec.ts`
- E2E tests: `*.e2e.spec.ts`

### Import Paths

Use TypeScript path aliases for cleaner imports:

```typescript
import { validateTaxonomySlug } from '@/lib/slugify'
import type { CollectionConfig } from 'payload'
```

### Best Practices

1. **Unit tests**: Keep tests isolated, mock external dependencies
2. **Integration tests**: Use test database, clean up after tests
3. **E2E tests**: Test critical user paths, avoid flaky selectors
4. **All tests**: Use descriptive test names, follow AAA pattern (Arrange, Act, Assert)
