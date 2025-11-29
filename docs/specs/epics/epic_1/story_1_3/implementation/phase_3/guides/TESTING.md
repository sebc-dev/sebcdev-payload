# Phase 3 - Testing Guide

Testing strategy for Phase 3 (Code Quality: Linting & Formatting).

---

## Testing Strategy

Phase 3 focuses on **configuration testing** rather than traditional unit/integration tests. The goal is to verify that ESLint and Prettier are correctly configured and work together.

### Test Types

1. **Configuration Validation**: Verify config files parse correctly
2. **Functional Testing**: Run tools and verify they work
3. **Integration Testing**: Verify tools work together without conflicts
4. **CI Testing**: Verify workflow runs successfully

---

## Configuration Validation

### Prettier Configuration

```bash
# Verify config loads without errors
node -e "import('./prettier.config.mjs').then(c => console.log('Prettier config OK:', c.default))"
```

**Expected Output**:

```
Prettier config OK: {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: [ 'prettier-plugin-tailwindcss' ]
}
```

### ESLint Configuration

```bash
# Verify config loads without errors
node -e "import('./eslint.config.mjs').then(c => console.log('ESLint config OK, rules:', c.default.length))"
```

**Expected Output**:

```
ESLint config OK, rules: [number of config objects]
```

### YAML Validation

```bash
# Verify workflow YAML is valid
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml')); print('YAML OK')"
```

**Expected Output**:

```
YAML OK
```

---

## Functional Testing

### Test Prettier

```bash
# Check formatting on entire codebase
pnpm exec prettier --check .

# If issues found, format all files
pnpm format

# Verify no issues remain
pnpm format:check
```

**Expected Result**: `All matched files use Prettier code style!`

### Test Specific File Types

```bash
# Test TypeScript files
pnpm exec prettier --check "src/**/*.{ts,tsx}"

# Test config files
pnpm exec prettier --check "*.{js,mjs,json}"

# Test markdown
pnpm exec prettier --check "**/*.md"
```

### Test ESLint

```bash
# Run lint on entire codebase
pnpm lint

# With verbose output
pnpm exec eslint . --format stylish

# Check specific directory
pnpm exec eslint src/
```

**Expected Result**: No errors (warnings are acceptable)

### Test Specific Rules

```bash
# Test TypeScript rules
pnpm exec eslint src/ --ext .ts,.tsx

# Test with specific rule
pnpm exec eslint src/ --rule '@typescript-eslint/no-explicit-any: error'
```

---

## Integration Testing

### Verify No Conflicts

The most important test: ESLint and Prettier should not conflict.

```bash
# Run both tools
pnpm lint && pnpm format:check
```

**Expected Result**: Both pass without conflicts

### Test Conflict Detection

To verify `eslint-config-prettier` works, temporarily create a conflict:

1. Create test file with semicolon issue:

   ```typescript
   // test-conflict.ts
   const x = 1
   ```

2. Run checks:

   ```bash
   pnpm lint test-conflict.ts
   pnpm exec prettier --check test-conflict.ts
   ```

3. If configured correctly:
   - ESLint should NOT complain about semicolons (disabled by prettier config)
   - Prettier should flag the semicolon (if `semi: false`)

4. Clean up:
   ```bash
   rm test-conflict.ts
   ```

### Test Ignore Patterns

```bash
# Verify generated files are ignored
pnpm exec eslint src/payload-types.ts 2>&1 | grep -i "ignored"
pnpm exec prettier --check src/payload-types.ts 2>&1 | grep -i "ignored"
```

**Expected Result**: Files should be ignored, not linted

---

## Tailwind Plugin Testing

### Test Class Ordering

Create a test component with unordered Tailwind classes:

```typescript
// test-tailwind.tsx
export function Test() {
  return <div className="mt-4 p-4 flex bg-red-500 text-white">Test</div>
}
```

Run Prettier:

```bash
pnpm exec prettier --write test-tailwind.tsx
cat test-tailwind.tsx
```

**Expected Result**: Classes should be reordered to Tailwind's recommended order:

```typescript
export function Test() {
  return <div className="flex bg-red-500 p-4 text-white mt-4">Test</div>
}
```

Clean up:

```bash
rm test-tailwind.tsx
```

---

## CI Testing

### Local Simulation

Simulate what CI will run:

```bash
# Full CI check sequence
pnpm install --frozen-lockfile
pnpm lint --format stylish
pnpm exec prettier --check .
```

**Expected Result**: All commands pass

### Test GitHub Workflow

1. Push changes to branch
2. Go to GitHub Actions
3. Run "Quality Gate" workflow manually
4. Verify:
   - ESLint step passes (green)
   - Prettier Check step passes (green)
   - Annotations appear for any issues

---

## Performance Testing

### ESLint Cache Performance

```bash
# First run (no cache)
time pnpm exec eslint .

# Second run (with cache)
time pnpm exec eslint . --cache --cache-location .eslintcache

# Verify cache exists
ls -la .eslintcache
```

**Expected Result**: Second run should be significantly faster

### Measure Full Check Time

```bash
# Time full check
time (pnpm lint && pnpm format:check)
```

**Expected Result**: < 30 seconds for typical codebase

---

## Regression Testing

### After Configuration Changes

When modifying ESLint or Prettier config:

1. **Before change**: Run full check, note any existing issues
2. **After change**: Run full check, verify no new issues
3. **Compare**: Ensure no regressions

```bash
# Save baseline
pnpm lint 2>&1 > lint-before.txt
pnpm format:check 2>&1 > format-before.txt

# Make changes...

# Compare after
pnpm lint 2>&1 > lint-after.txt
pnpm format:check 2>&1 > format-after.txt

diff lint-before.txt lint-after.txt
diff format-before.txt format-after.txt
```

---

## Test Checklist

### Configuration Tests

- [ ] Prettier config loads without errors
- [ ] ESLint config loads without errors
- [ ] YAML workflow is valid
- [ ] All plugins load correctly

### Functional Tests

- [ ] `pnpm lint` runs without errors
- [ ] `pnpm format:check` runs without errors
- [ ] `pnpm format` correctly formats files
- [ ] ESLint cache works

### Integration Tests

- [ ] No conflicts between ESLint and Prettier
- [ ] Generated files are ignored by both tools
- [ ] Tailwind plugin sorts classes

### CI Tests

- [ ] Workflow runs successfully
- [ ] Both steps complete (ESLint, Prettier)
- [ ] Annotations appear for issues

### Performance Tests

- [ ] ESLint cache improves speed
- [ ] Full check < 30 seconds

---

## Troubleshooting Test Failures

### ESLint Fails

```bash
# Get detailed output
pnpm exec eslint . --format verbose

# Check specific file
pnpm exec eslint src/app/page.tsx --debug
```

### Prettier Fails

```bash
# List files that need formatting
pnpm exec prettier --list-different .

# Check specific file
pnpm exec prettier --check src/app/page.tsx
```

### Cache Issues

```bash
# Clear cache
rm -f .eslintcache

# Rebuild
pnpm exec eslint . --cache --cache-location .eslintcache
```

---

## FAQ

**Q: How do I test a single file?**
A: Use `pnpm exec eslint <file>` or `pnpm exec prettier --check <file>`

**Q: How do I skip tests for generated files?**
A: They should be in ignore patterns. Verify with `--debug` flag.

**Q: What if tests pass locally but fail in CI?**
A: Check Node.js version and ensure `pnpm install --frozen-lockfile` is used.

**Q: How do I test IDE integration?**
A: Open a file with errors, verify they appear in the editor.

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
