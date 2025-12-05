# Phase 1: Environment Setup

**Phase**: CI Unit & Integration Tests

---

## Prerequisites

### Local Development
- Node.js 20+
- pnpm 9+
- Git

### CI Environment (GitHub Actions)
- `ubuntu-latest` runner
- Node.js 20 (via `actions/setup-node`)
- pnpm 9 (via `pnpm/action-setup`)

---

## Required Tools

### Already Configured
- **Vitest**: Test runner (`vitest.config.ts`)
- **pnpm scripts**: `test:unit`, `test:int` dans `package.json`

### Verify Configuration

```bash
# Check test scripts exist
pnpm run --list | grep test

# Expected output:
# test:unit - vitest run --project unit
# test:int - vitest run --project int
# test:e2e - playwright test
# test - vitest run && playwright test
```

---

## Environment Variables

### Required for Integration Tests
| Variable | Source | Description |
|----------|--------|-------------|
| `PAYLOAD_SECRET` | GitHub Secret OR CI fallback | Secret for Payload initialization |

### CI Fallback Mechanism
Le workflow génère automatiquement un secret CI si `PAYLOAD_SECRET` n'est pas configuré :

```yaml
- name: Generate CI Payload Secret
  if: env.HAS_PAYLOAD_SECRET != 'true'
  run: echo "PAYLOAD_SECRET_CI=$(openssl rand -hex 32)" >> "$GITHUB_ENV"
```

---

## Vitest Configuration

### Verify Coverage Configuration

```bash
# Check vitest.config.ts for coverage settings
cat vitest.config.ts | grep -A 10 coverage
```

### Expected Coverage Config
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
    },
  },
})
```

### If Coverage Not Configured
```bash
# Install coverage provider if needed
pnpm add -D @vitest/coverage-v8
```

---

## Local Validation

### Before Making Changes

```bash
# 1. Run unit tests
pnpm test:unit
# Expected: All tests pass

# 2. Run unit tests with coverage
pnpm test:unit --coverage
# Expected: Coverage report generated in ./coverage/

# 3. Verify coverage JSON exists
cat coverage/coverage-summary.json | jq '.total'
# Expected: JSON with lines, statements, functions, branches

# 4. Run integration tests
pnpm test:int
# Expected: All tests pass
```

---

## Workflow File Location

```
.github/
└── workflows/
    └── quality-gate.yml  # File to modify
```

### Current Structure (Before Phase 1)
```yaml
jobs:
  quality-gate:
    steps:
      # Setup...
      # Layer 1: Supply Chain Security...
      # Layer 2: Code Quality
      - name: ESLint
      - name: Prettier Check
      - name: Knip - Dead Code Detection
      - name: Generate Payload Types
      - name: Verify Type Sync
      # Layer 3: Build Validation...
      # Layer 4: Architecture...
```

### Target Structure (After Phase 1)
```yaml
jobs:
  quality-gate:
    steps:
      # Setup...
      # Layer 1: Supply Chain Security...
      # Layer 2: Code Quality
      - name: ESLint
      - name: Prettier Check
      - name: Knip - Dead Code Detection
      - name: Unit Tests          # NEW
      - name: Coverage Summary    # NEW
      - name: Integration Tests   # NEW
      - name: Generate Payload Types
      - name: Verify Type Sync
      # Layer 3: Build Validation...
      # Layer 4: Architecture...
```

---

## Troubleshooting

### Unit Tests Fail in CI
1. Run locally: `pnpm test:unit`
2. Check for environment-specific code
3. Verify no hardcoded paths

### Integration Tests Fail in CI
1. Run locally: `pnpm test:int`
2. Verify PAYLOAD_SECRET is available
3. Check test doesn't require actual database

### Coverage Not Generated
1. Verify `@vitest/coverage-v8` is installed
2. Check vitest.config.ts coverage settings
3. Run with `--coverage` flag

### YAML Syntax Errors
```bash
# Validate YAML locally
npx yaml-lint .github/workflows/quality-gate.yml
```

---

**Setup Guide Created**: 2025-12-05
