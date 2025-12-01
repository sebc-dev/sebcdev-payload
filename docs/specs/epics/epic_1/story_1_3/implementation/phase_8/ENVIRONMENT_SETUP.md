# Phase 8: Environment Setup - Stryker Mutation Testing

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8

---

## 📋 Prerequisites

### System Requirements

| Requirement | Minimum | Recommended | Current |
| ----------- | ------- | ----------- | ------- |
| Node.js     | 18.x    | 20.x        | ___     |
| pnpm        | 8.x     | 9.x         | ___     |
| RAM         | 4GB     | 8GB+        | ___     |
| CPU Cores   | 2       | 4+          | ___     |

### Verification Commands

```bash
# Check Node.js version
node --version  # Expected: v20.x.x

# Check pnpm version
pnpm --version  # Expected: 9.x.x

# Check available memory
free -h  # Linux
sysctl hw.memsize  # macOS
```

---

## 🔧 Local Environment Setup

### Step 1: Verify Existing Test Infrastructure

Before installing Stryker, ensure Vitest is properly configured:

```bash
# Run existing unit tests
pnpm test:unit

# Verify vitest.config.mts exists
ls -la vitest.config.mts
```

**Expected**: Tests pass successfully.

### Step 2: Install Stryker Dependencies

```bash
# Install Stryker core and Vitest runner
pnpm add -D @stryker-mutator/core @stryker-mutator/vitest-runner

# Verify installation
pnpm list @stryker-mutator/core @stryker-mutator/vitest-runner
```

**Expected Output**:
```
devDependencies:
@stryker-mutator/core 8.7.1
@stryker-mutator/vitest-runner 8.7.1
```

### Step 3: Create Reports Directory

```bash
# Create directory for mutation reports
mkdir -p reports/mutation

# Add .gitkeep to track empty directory
touch reports/mutation/.gitkeep
```

### Step 4: Verify Configuration

```bash
# Dry run to validate config (after creating stryker.config.mjs)
pnpm stryker:dry
```

**Expected**: "Stryker done without errors" message.

---

## 📁 Configuration Files

### stryker.config.mjs

Create at project root:

```javascript
// stryker.config.mjs
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'pnpm',
  testRunner: 'vitest',
  mutate: [
    'src/lib/**/*.ts',
    'src/utilities/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/payload-types.ts',
  ],
  coverageAnalysis: 'perTest',
  reporters: ['html', 'clear-text', 'progress', 'json'],
  htmlReporter: {
    fileName: 'reports/mutation/mutation-report.html',
  },
  jsonReporter: {
    fileName: 'reports/mutation/mutation-report.json',
  },
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  concurrency: 4,
  timeoutMS: 10000,
  timeoutFactor: 1.5,
  incremental: true,
  incrementalFile: 'reports/mutation/stryker-incremental.json',
  ignoreStatic: true,
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,
  vitest: {
    configFile: 'vitest.config.mts',
  },
  plugins: ['@stryker-mutator/vitest-runner'],
  checkers: [],
};
```

### .gitignore Additions

Add to existing `.gitignore`:

```gitignore
# Stryker mutation testing
.stryker-tmp/
reports/mutation/*.html
reports/mutation/*.json
!reports/mutation/.gitkeep
```

### package.json Scripts

Add to `scripts` section:

```json
{
  "scripts": {
    "stryker": "stryker run",
    "stryker:incremental": "stryker run --incremental",
    "stryker:dry": "stryker run --dryRunOnly"
  }
}
```

---

## 🖥️ CI Environment Setup

### GitHub Actions Environment

The CI environment uses Ubuntu runners with the following setup:

```yaml
# In .github/workflows/quality-gate.yml
runs-on: ubuntu-latest

steps:
  - uses: actions/checkout@v4
  - uses: pnpm/action-setup@v4
    with:
      version: 9
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'pnpm'
```

### Environment Variables

No special environment variables required for Stryker.

### Cache Configuration

```yaml
- name: Cache Stryker Incremental Results
  if: ${{ github.event.inputs.run_mutation_tests == 'true' }}
  uses: actions/cache@v4
  with:
    path: reports/mutation/stryker-incremental.json
    key: stryker-${{ runner.os }}-${{ hashFiles('src/lib/**/*.ts', 'src/utilities/**/*.ts') }}
    restore-keys: |
      stryker-${{ runner.os }}-
```

---

## ✅ Environment Verification Checklist

Run these checks to verify your environment is ready:

```bash
# 1. Node.js version
node --version  # Should be 20.x

# 2. pnpm version
pnpm --version  # Should be 9.x

# 3. Stryker installed
pnpm list @stryker-mutator/core  # Should show version

# 4. Vitest config exists
ls vitest.config.mts  # Should exist

# 5. Tests pass
pnpm test:unit  # Should pass

# 6. Stryker config valid
pnpm stryker:dry  # Should complete without errors

# 7. Reports directory exists
ls -la reports/mutation/  # Should show .gitkeep
```

### Checklist

- [ ] Node.js 20.x installed
- [ ] pnpm 9.x installed
- [ ] @stryker-mutator/core installed
- [ ] @stryker-mutator/vitest-runner installed
- [ ] vitest.config.mts exists
- [ ] Unit tests pass
- [ ] stryker.config.mjs created
- [ ] reports/mutation/ directory exists
- [ ] .gitignore updated
- [ ] pnpm stryker:dry succeeds

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "Cannot find module '@stryker-mutator/vitest-runner'"

**Solution**:
```bash
pnpm add -D @stryker-mutator/vitest-runner
pnpm install
```

#### Issue: "No tests found to run"

**Cause**: Stryker can't find tests or vitest config.

**Solution**:
```javascript
// In stryker.config.mjs
vitest: {
  configFile: 'vitest.config.mts',  // Ensure correct path
}
```

#### Issue: "Timeout: Test timed out after 10000ms"

**Cause**: Tests take too long with mutations.

**Solution**:
```javascript
// In stryker.config.mjs
timeoutMS: 30000,      // Increase timeout
timeoutFactor: 2.5,    // Increase factor
```

#### Issue: "Out of memory"

**Cause**: Too many concurrent test runners.

**Solution**:
```javascript
// In stryker.config.mjs
concurrency: 2,            // Reduce parallelism
maxTestRunnerReuse: 10,    // More frequent cleanup
```

#### Issue: "No mutants generated"

**Cause**: Mutate patterns don't match any files.

**Solution**:
```bash
# Debug: List files that would be mutated
npx stryker run --dryRunOnly --logLevel debug 2>&1 | grep -i "mutate"
```

---

## 📊 Performance Optimization

### For Faster Local Runs

```javascript
// stryker.config.mjs optimizations
{
  // Use incremental mode
  incremental: true,

  // Only mutate changed files (if supported)
  coverageAnalysis: 'perTest',

  // Limit concurrency on low-memory machines
  concurrency: 2,

  // Ignore static initializations
  ignoreStatic: true,
}
```

### For Faster CI Runs

1. **Use cache** for incremental results
2. **Limit scope** to critical modules only
3. **Run optionally** via workflow_dispatch input

---

**Environment Setup Created**: 2025-12-01
**Last Updated**: 2025-12-01
