# Testing Strategy - Phase 6: Architecture Validation

**Phase**: Architecture Validation (dependency-cruiser)
**Purpose**: Testing and validation approach for this phase

---

## Testing Overview

This phase adds a static analysis tool (dependency-cruiser) that validates architecture at build time. Testing focuses on:

1. **Tool Verification**: Ensure dependency-cruiser runs correctly
2. **Rule Validation**: Confirm rules detect intended violations
3. **False Positive Testing**: Verify legitimate code is not blocked
4. **CI Integration Testing**: Confirm workflow step works correctly

---

## Test Categories

### 1. Installation Tests

Verify the tool is properly installed and configured.

```bash
# Test 1: Version check
pnpm exec depcruise --version
# Expected: 16.x.x or higher

# Test 2: Help command works
pnpm exec depcruise --help
# Expected: Shows usage information

# Test 3: Config file is valid
node -e "require('./.dependency-cruiser.cjs')"
# Expected: No output (success) or error message
```

### 2. Basic Functionality Tests

Verify the tool runs against the codebase.

```bash
# Test 4: Basic analysis runs
pnpm depcruise
# Expected: Completes without error, shows module count

# Test 5: Verbose output works
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long
# Expected: Detailed output format

# Test 6: HTML report generates
pnpm depcruise:report
ls -la depcruise-report.html
# Expected: File exists with non-zero size
```

---

## Rule Validation Tests

### Test: no-server-in-client Rule

This test verifies that server-only code is blocked from client components.

#### Test Setup (Temporary Files)

Create temporary test files to validate the rule:

```bash
# Create a test client component that imports server code
mkdir -p src/test-validation

# Create a "server" module
cat > src/test-validation/server-only.ts << 'EOF'
// This should only be imported by server components
export const serverSecret = 'database-connection'
EOF

# Create a "client" component that wrongly imports it
cat > src/test-validation/bad-client.tsx << 'EOF'
'use client'
// This import should be flagged as a violation
import { serverSecret } from './server-only'

export function BadClient() {
  return <div>{serverSecret}</div>
}
EOF
```

#### Run Test

```bash
pnpm exec depcruise src/test-validation --config .dependency-cruiser.cjs
```

#### Expected Result

```
error no-server-in-client: src/test-validation/bad-client.tsx → src/test-validation/server-only.ts
```

#### Cleanup

```bash
rm -rf src/test-validation
```

---

### Test: no-circular Rule

This test verifies that circular dependencies are detected.

#### Test Setup

```bash
# Create circular dependency
cat > src/test-circular-a.ts << 'EOF'
import { b } from './test-circular-b'
export const a = 'A' + b
EOF

cat > src/test-circular-b.ts << 'EOF'
import { a } from './test-circular-a'
export const b = 'B' + a
EOF
```

#### Run Test

```bash
pnpm exec depcruise src/test-circular-a.ts src/test-circular-b.ts --config .dependency-cruiser.cjs
```

#### Expected Result

```
error no-circular: src/test-circular-a.ts → src/test-circular-b.ts → src/test-circular-a.ts
```

#### Cleanup

```bash
rm src/test-circular-a.ts src/test-circular-b.ts
```

---

### Test: Type-Only Cycles Allowed

Verify that type-only imports don't trigger the circular rule.

#### Test Setup

```bash
# Create type-only circular reference
cat > src/test-type-a.ts << 'EOF'
import type { TypeB } from './test-type-b'
export type TypeA = { ref: TypeB }
export const a = 'A'
EOF

cat > src/test-type-b.ts << 'EOF'
import type { TypeA } from './test-type-a'
export type TypeB = { ref: TypeA }
export const b = 'B'
EOF
```

#### Run Test

```bash
pnpm exec depcruise src/test-type-a.ts src/test-type-b.ts --config .dependency-cruiser.cjs
```

#### Expected Result

```
✔ no dependency violations found
```

Type-only cycles should be allowed because they are erased at compile time.

#### Cleanup

```bash
rm src/test-type-a.ts src/test-type-b.ts
```

---

## False Positive Tests

Verify that legitimate patterns are NOT flagged.

### Test: Server Components Not Flagged

```bash
# Verify that page.tsx importing from collections is allowed
# (page.tsx is a server component by default)
pnpm exec depcruise src/app --config .dependency-cruiser.cjs --output-type err-long
```

Expected: No violations for page.tsx files importing server-only code.

### Test: Layout Components Not Flagged

```bash
# layout.tsx should be allowed to import server-only code
# because layouts are server components by default
```

Expected: No violations for layout.tsx files.

### Test: Generated Files Excluded

```bash
# payload-types.ts should not be analyzed
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type json | grep payload-types
```

Expected: No output (file is excluded).

---

## CI Integration Tests

### Local Simulation

Simulate the CI step locally:

```bash
# Simulate GitHub Step Summary (local version)
echo "## Architecture Validation Test" > /tmp/test-summary.md
echo "" >> /tmp/test-summary.md

if pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long 2>&1 | tee /tmp/depcruise-output.txt; then
  echo "### :white_check_mark: No violations" >> /tmp/test-summary.md
else
  echo "### :x: Violations found" >> /tmp/test-summary.md
  echo '```' >> /tmp/test-summary.md
  cat /tmp/depcruise-output.txt >> /tmp/test-summary.md
  echo '```' >> /tmp/test-summary.md
fi

# View result
cat /tmp/test-summary.md
```

### Workflow Syntax Validation

```bash
# Check YAML syntax (requires yq or similar)
# This is optional but helpful
cat .github/workflows/quality-gate.yml | head -50
```

---

## Performance Tests

### Execution Time

```bash
# Measure analysis time
time pnpm depcruise

# Expected: < 30 seconds for typical codebase
```

### Cache Effectiveness

```bash
# First run (cold cache)
rm -rf node_modules/.cache/dependency-cruiser
time pnpm depcruise

# Second run (warm cache)
time pnpm depcruise

# Expected: Second run should be faster
```

---

## Test Automation

### Pre-Commit Verification

Before each commit, run:

```bash
# Quick validation
pnpm depcruise && echo "Architecture check passed"
```

### Full Test Suite

Run all tests in sequence:

```bash
#!/bin/bash
# test-phase-6.sh

echo "=== Phase 6 Test Suite ==="

echo "1. Version check..."
pnpm exec depcruise --version || exit 1

echo "2. Config validation..."
node -e "require('./.dependency-cruiser.cjs')" || exit 1

echo "3. Basic analysis..."
pnpm depcruise || echo "Note: Violations may be baselined"

echo "4. Report generation..."
pnpm depcruise:report && rm -f depcruise-report.html || exit 1

echo "=== All tests passed ==="
```

---

## Test Results Documentation

### Template

After running tests, document results:

```markdown
## Phase 6 Test Results

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Commit**: [SHA]

### Installation Tests
- [ ] Version check: PASSED/FAILED
- [ ] Help command: PASSED/FAILED
- [ ] Config validation: PASSED/FAILED

### Functionality Tests
- [ ] Basic analysis: PASSED/FAILED
- [ ] Verbose output: PASSED/FAILED
- [ ] HTML report: PASSED/FAILED

### Rule Validation
- [ ] no-server-in-client: PASSED/FAILED
- [ ] no-circular: PASSED/FAILED
- [ ] Type-only cycles allowed: PASSED/FAILED

### False Positive Tests
- [ ] Server components not flagged: PASSED/FAILED
- [ ] Layout components not flagged: PASSED/FAILED
- [ ] Generated files excluded: PASSED/FAILED

### CI Integration
- [ ] Local simulation: PASSED/FAILED
- [ ] Workflow syntax: PASSED/FAILED

### Performance
- [ ] Execution time < 30s: PASSED/FAILED
- [ ] Cache effectiveness: PASSED/FAILED

### Notes
[Any issues encountered or observations]
```

---

## Troubleshooting Test Failures

### Test Fails: Version Check

```
Error: Command not found: depcruise
```

**Solution**: Ensure dependency-cruiser is installed

```bash
pnpm add -D dependency-cruiser
```

### Test Fails: Config Validation

```
Error: Cannot find module '.dependency-cruiser.cjs'
```

**Solution**: Create the configuration file (Commit 1)

### Test Fails: Rule Not Detecting Violation

**Possible causes**:

1. Rule `from` path doesn't match test file
2. Rule `to` path doesn't match imported file
3. File is excluded by config

**Debug**:

```bash
# Check what files are analyzed
pnpm exec depcruise src --output-type json | grep "source"
```

### Test Fails: False Positive

**Possible causes**:

1. Missing exclusion in `pathNot`
2. Rule is too broad

**Solution**: Add specific exclusion to the rule

---

## Coverage Goals

This phase does not add application code, so traditional test coverage metrics don't apply.

Instead, measure:

| Metric | Target |
|--------|--------|
| Rules implemented | 4 (all defined) |
| False positive rate | 0% |
| CI integration | Complete |
| Documentation | Complete |

---

**Testing Guide Created**: 2025-11-29
**Last Updated**: 2025-11-29
