# Phase 4 - Testing Guide

**Phase**: Dead Code Detection & Type Sync
**Test Types**: Configuration validation, Integration testing

---

## Testing Overview

Phase 4 focuses on static analysis tools that don't have traditional unit tests. Instead, we validate through configuration testing, integration testing, and manual verification.

### Test Categories

| Category              | Purpose                           | Tools          |
| --------------------- | --------------------------------- | -------------- |
| Configuration Testing | Validate tool configs are correct | CLI, manual    |
| Integration Testing   | Verify CI workflow works          | GitHub Actions |
| Regression Testing    | Ensure no false positives         | Manual review  |

---

## Configuration Testing

### Knip Configuration Tests

#### Test 1: Basic Syntax Validation

```bash
# Verify JSON is valid
python3 -c "import json; json.load(open('knip.json'))"
```

**Expected**: No output (valid JSON)
**If fails**: Check for syntax errors in `knip.json`

#### Test 2: Schema Validation

```bash
# Run Knip with debug to verify config is loaded
pnpm exec knip --debug 2>&1 | head -20
```

**Expected**: Shows configuration being loaded
**Look for**: Entry points listed, plugins detected

#### Test 3: Entry Points Detected

```bash
# Run Knip and check entry points are processed
pnpm exec knip --production
```

**Expected**: No errors about missing entry files
**If fails**: Verify paths in `entry` array exist

#### Test 4: No False Positives on Framework Files

```bash
# Run full analysis
pnpm exec knip
```

**Verify the following are NOT reported**:

- [ ] `src/app/**/page.tsx` files
- [ ] `src/app/**/layout.tsx` files
- [ ] `src/app/**/route.ts` files
- [ ] Collection files imported in `payload.config.ts`

#### Test 5: Generated Files Ignored

```bash
# Check that payload-types.ts is not analyzed
pnpm exec knip 2>&1 | grep -c "payload-types"
```

**Expected**: 0 (not mentioned)
**If fails**: Add to `ignore` array

---

### Type Sync Tests

#### Test 1: Type Generation Works

```bash
# Set environment and generate
export PAYLOAD_SECRET="test-secret-at-least-32-characters-long!"
pnpm generate:types:payload
echo "Exit code: $?"
```

**Expected**: Exit code 0, types generated
**If fails**: Check PAYLOAD_SECRET length (≥32 chars)

#### Test 2: Types Are Generated

```bash
# Verify file exists and has content
ls -la src/payload-types.ts
wc -l src/payload-types.ts
```

**Expected**: File exists with >100 lines
**If fails**: Check Payload configuration

#### Test 3: Git Diff Detection Works

```bash
# Modify types file slightly
echo "// test" >> src/payload-types.ts

# Check diff detection
if git diff --exit-code src/payload-types.ts; then
  echo "FAIL: Should have detected changes"
else
  echo "PASS: Changes detected"
fi

# Restore file
git checkout src/payload-types.ts
```

**Expected**: "PASS: Changes detected"

---

## Integration Testing

### Local CI Simulation

Run the full quality gate locally:

```bash
#!/bin/bash
# Local CI simulation for Phase 4

echo "=== Layer 2: Code Quality ==="

echo "Step 1: ESLint..."
pnpm lint || exit 1

echo "Step 2: Prettier..."
pnpm exec prettier --check . || exit 1

echo "Step 3: Knip..."
pnpm exec knip --production || exit 1

echo "Step 4: Type Generation..."
pnpm generate:types:payload || exit 1

echo "Step 5: Type Sync Check..."
if git diff --exit-code src/payload-types.ts; then
  echo "✅ Types synchronized"
else
  echo "❌ Types out of sync"
  exit 1
fi

echo "=== All checks passed! ==="
```

Save as `scripts/local-ci.sh` and run:

```bash
chmod +x scripts/local-ci.sh
./scripts/local-ci.sh
```

### GitHub Actions Integration

#### Test Workflow Syntax

```bash
# Validate YAML
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
```

**Expected**: No output (valid YAML)

#### Test Workflow in CI

1. Push changes to branch
2. Navigate to GitHub Actions
3. Manually trigger Quality Gate workflow
4. Verify all steps pass:
   - [ ] Socket.dev Security Scan
   - [ ] ESLint
   - [ ] Prettier Check
   - [ ] Knip - Dead Code Detection
   - [ ] Generate Payload Types
   - [ ] Verify Type Sync

---

## Regression Testing

### False Positive Detection

After any Knip configuration change, verify no regressions:

#### Test All Page Files

```bash
# Should not report any page.tsx as unused
pnpm exec knip 2>&1 | grep -c "page.tsx"
```

**Expected**: 0

#### Test All Layout Files

```bash
# Should not report any layout.tsx as unused
pnpm exec knip 2>&1 | grep -c "layout.tsx"
```

**Expected**: 0

#### Test Payload Collections

```bash
# List all collection files
find src/collections -name "*.ts" 2>/dev/null

# Run Knip and verify none are reported
pnpm exec knip 2>&1 | grep "collections/"
```

**Expected**: No collections reported as unused

---

## Edge Case Testing

### Test 1: Empty Project

```bash
# Create temporary empty directory
mkdir -p /tmp/knip-test
cd /tmp/knip-test
echo '{}' > package.json
echo '{}' > knip.json

# Should not crash
npx knip 2>&1
```

**Expected**: No errors about missing config

### Test 2: Invalid Entry Point

```bash
# Temporarily add non-existent entry
# Edit knip.json to add "non-existent.ts" to entry
pnpm exec knip 2>&1 | grep "non-existent"
```

**Expected**: Warning about missing entry file

### Test 3: Type Generation Without Secret

```bash
# Unset secret
unset PAYLOAD_SECRET

# Should fail with helpful message
pnpm generate:types:payload 2>&1
```

**Expected**: Error about missing PAYLOAD_SECRET

---

## Performance Testing

### Knip Execution Time

```bash
# Time full analysis
time pnpm exec knip

# Time production analysis
time pnpm exec knip --production
```

**Benchmarks**:

| Mode       | Target Time | Acceptable |
| ---------- | ----------- | ---------- |
| Full       | < 30s       | < 60s      |
| Production | < 15s       | < 30s      |

### Type Generation Time

```bash
time pnpm generate:types:payload
```

**Benchmark**: < 10s for small projects

---

## Test Matrix

### Before Each Commit

| Test                     | Commit 1 | Commit 2 | Commit 3 | Commit 4 |
| ------------------------ | -------- | -------- | -------- | -------- |
| JSON syntax valid        | ✓        | -        | -        | -        |
| Knip runs without errors | ✓        | ✓        | ✓        | ✓        |
| No false positives       | ✓        | ✓        | ✓        | ✓        |
| YAML syntax valid        | -        | ✓        | ✓        | -        |
| Type generation works    | -        | -        | ✓        | ✓        |
| Type sync check works    | -        | -        | ✓        | ✓        |
| Documentation accurate   | -        | -        | -        | ✓        |

### After Phase Complete

| Test                          | Status |
| ----------------------------- | ------ |
| Local CI simulation passes    | [ ]    |
| GitHub Actions workflow green | [ ]    |
| No false positives            | [ ]    |
| Documentation matches config  | [ ]    |

---

## Troubleshooting Test Failures

### Knip Reports False Positives

**Symptom**: Legitimate files reported as unused

**Debug**:

```bash
# Run with debug output
pnpm exec knip --debug 2>&1 | tee knip-debug.log

# Search for the file
grep "filename" knip-debug.log
```

**Fix**: Add file to `entry` or `ignore` in `knip.json`

### Type Generation Fails

**Symptom**: Error during `generate:types:payload`

**Debug**:

```bash
# Check environment
echo $PAYLOAD_SECRET | wc -c  # Should be > 32

# Run with verbose
NODE_DEBUG=* pnpm generate:types:payload 2>&1 | head -50
```

**Fix**: Ensure PAYLOAD_SECRET is set and ≥32 characters

### Workflow Step Fails

**Symptom**: GitHub Actions step fails

**Debug**:

1. Check step logs in GitHub Actions
2. Look for specific error message
3. Reproduce locally with same command

**Fix**: Based on specific error, update config or workflow

---

## Test Coverage Summary

| Component       | Test Type         | Automated | Manual |
| --------------- | ----------------- | --------- | ------ |
| knip.json       | Syntax validation | ✓         | -      |
| knip.json       | Entry points      | -         | ✓      |
| knip.json       | Ignore patterns   | -         | ✓      |
| Type generation | Execution         | ✓         | -      |
| Type sync       | Diff detection    | ✓         | -      |
| Workflow YAML   | Syntax            | ✓         | -      |
| Workflow        | End-to-end        | -         | ✓      |
| Documentation   | Accuracy          | -         | ✓      |

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
