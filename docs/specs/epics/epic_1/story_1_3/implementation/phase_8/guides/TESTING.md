# Phase 8: Testing Guide - Stryker Mutation Testing

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8

---

## 📋 Testing Overview

This guide covers how to test the Stryker mutation testing integration, including local testing, CI testing, and interpreting results.

---

## 🧪 Local Testing

### 1. Validate Configuration (Dry Run)

Before running actual mutations, validate the configuration:

```bash
# Dry run - validates config without running mutations
pnpm stryker:dry
```

**Expected Output**:
```
[2025-12-01 10:00:00] INFO DryRunExecutor Starting initial test run. This may take a while.
[2025-12-01 10:00:05] INFO DryRunExecutor Initial test run succeeded. 42 tests were run.
[2025-12-01 10:00:05] INFO Stryker Done in 5 seconds.
```

### 2. Run on Single File (Quick Test)

Test mutation on a single file for faster feedback:

```bash
# Mutate only one file
npx stryker run --mutate "src/lib/utils.ts"
```

### 3. Full Mutation Run

Run complete mutation testing:

```bash
# Full run with all configured modules
pnpm stryker

# Or with incremental mode (recommended)
pnpm stryker:incremental
```

### 4. View HTML Report

After a run, open the HTML report:

```bash
# macOS
open reports/mutation/mutation-report.html

# Linux
xdg-open reports/mutation/mutation-report.html

# Windows
start reports/mutation/mutation-report.html
```

---

## 🔍 Understanding Mutation Results

### Mutant Statuses

| Status        | Icon | Meaning                              | Action Required           |
| ------------- | ---- | ------------------------------------ | ------------------------- |
| **Killed**    | ✅   | Test caught the mutation             | None - test is effective  |
| **Survived**  | ❌   | Test didn't detect mutation          | Improve test assertions   |
| **Timeout**   | ⏱️   | Test took too long with mutation     | Usually OK, monitor       |
| **NoCoverage**| ⬜   | No test covers this code             | Add test coverage         |
| **RuntimeError** | 💥 | Mutation caused a crash           | Usually OK, may need fix  |
| **Ignored**   | 🔇   | Mutation was explicitly ignored      | None                      |

### Mutation Score Calculation

```
Mutation Score = (Killed + Timeout) / Total Mutants × 100
```

**Thresholds** (configured in `stryker.config.mjs`):
- 🟢 **High** (≥ 80%): Excellent test quality
- 🟡 **Low** (≥ 60%): Acceptable, room for improvement
- 🔴 **Break** (< 50%): Build fails, tests need improvement

### Example: Analyzing a Survived Mutant

**Original Code** (`src/lib/calculator.ts`):
```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

**Mutation** (Arithmetic operator replacement):
```typescript
export function add(a: number, b: number): number {
  return a - b;  // ⚠️ Changed + to -
}
```

**Test** (`tests/unit/calculator.spec.ts`):
```typescript
test('add returns a number', () => {
  const result = add(2, 3);
  expect(typeof result).toBe('number');  // ❌ Doesn't check value!
});
```

**Why it Survived**: The test only checks the type, not the actual value. The mutation goes undetected.

**Fixed Test**:
```typescript
test('add returns correct sum', () => {
  expect(add(2, 3)).toBe(5);  // ✅ Checks actual value
  expect(add(-1, 1)).toBe(0); // ✅ Edge case
  expect(add(0, 0)).toBe(0);  // ✅ Zero case
});
```

---

## 📊 CI Testing

### Trigger Workflow Manually

1. Go to **Actions** tab in GitHub
2. Select **Quality Gate** workflow
3. Click **Run workflow**
4. Check ✅ **Run Stryker mutation testing**
5. Click **Run workflow**

### Monitor Execution

Watch the workflow run for:
- Stryker step execution (~10-15 minutes)
- Job Summary with mutation report link
- Artifact upload completion

### Download Report

1. After workflow completes, go to workflow run page
2. Scroll to **Artifacts** section
3. Download `mutation-report`
4. Extract and open `mutation-report.html`

---

## ✅ Testing Checklist

### Configuration Testing

- [ ] `pnpm stryker:dry` completes without errors
- [ ] Correct files are targeted for mutation:
  ```bash
  npx stryker run --dryRunOnly --logLevel debug 2>&1 | grep "Found"
  ```
- [ ] Excluded files are not mutated (test files, types)

### Local Execution Testing

- [ ] `pnpm stryker` runs and generates report
- [ ] HTML report opens and displays results
- [ ] Mutation score meets threshold (> 50%)
- [ ] Incremental mode works (second run faster)

### CI Execution Testing

- [ ] Workflow input `run_mutation_tests` appears
- [ ] Stryker step runs when enabled
- [ ] Stryker step skips when disabled
- [ ] Artifact is uploaded
- [ ] Job Summary shows mutation info

### Report Validation

- [ ] HTML report is accessible
- [ ] JSON report contains valid data
- [ ] All mutated files appear in report
- [ ] Mutant details are visible

---

## 🔧 Debugging Test Issues

### Issue: Tests Fail Before Mutations

**Symptom**: `Initial test run failed`

**Diagnosis**:
```bash
# Run tests directly to see errors
pnpm test:unit
```

**Solution**: Fix failing tests before running Stryker.

### Issue: No Mutants Generated

**Symptom**: `No mutants generated` or score is 100%

**Diagnosis**:
```bash
# Check what files are being mutated
npx stryker run --dryRunOnly --logLevel debug 2>&1 | grep -i "mutate"
```

**Solutions**:
1. Verify `mutate` patterns match actual files
2. Check files aren't empty or only types
3. Ensure files contain mutable code (not just imports)

### Issue: All Mutants Survive

**Symptom**: 0% mutation score

**Diagnosis**: Tests exist but don't assert behavior.

**Solution**: Improve test assertions to check values, not just types.

### Issue: Many Timeouts

**Symptom**: Most mutants timeout

**Diagnosis**: Tests are slow or mutations cause infinite loops.

**Solutions**:
1. Increase `timeoutMS` in config
2. Increase `timeoutFactor`
3. Check for infinite loop patterns in mutations

---

## 📈 Improving Mutation Score

### Strategies

1. **Add Value Assertions**
   ```typescript
   // Before: Type check only
   expect(typeof result).toBe('number');

   // After: Value check
   expect(result).toBe(expectedValue);
   ```

2. **Test Edge Cases**
   ```typescript
   test('handles zero', () => expect(divide(0, 5)).toBe(0));
   test('handles negative', () => expect(add(-5, 3)).toBe(-2));
   test('handles empty', () => expect(count([])).toBe(0));
   ```

3. **Test Boundaries**
   ```typescript
   test('validates minimum', () => {
     expect(() => setAge(-1)).toThrow();
     expect(setAge(0)).toBe(0);
   });
   ```

4. **Cover All Branches**
   ```typescript
   test('returns early when invalid', () => {
     expect(process(null)).toBeNull();
   });
   test('processes valid input', () => {
     expect(process('valid')).toBe('processed');
   });
   ```

### Common Mutations to Watch

| Mutation Type        | Example                    | How to Catch                |
| -------------------- | -------------------------- | --------------------------- |
| Arithmetic           | `+` → `-`                  | Assert exact values         |
| Conditional          | `>` → `>=`                 | Test boundaries             |
| Boolean              | `true` → `false`           | Test both paths             |
| String               | `"hello"` → `""`           | Assert string content       |
| Array Method         | `.push()` → `.pop()`       | Check array state after     |
| Return Value         | `return x` → `return null` | Check return type & value   |

---

## 📊 Test Coverage Matrix

| Test Area          | Tests Needed | Coverage Goal |
| ------------------ | ------------ | ------------- |
| Utility functions  | Value checks | > 80%         |
| Validators         | Edge cases   | > 90%         |
| Transformers       | All paths    | > 85%         |
| Business logic     | Full coverage| > 75%         |

---

**Testing Guide Created**: 2025-12-01
**Last Updated**: 2025-12-01
