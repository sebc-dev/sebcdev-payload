# Phase 5 - Testing Guide

Complete testing strategy for Phase 5.

---

## Testing Strategy

Phase 5 focuses on CI workflow validation rather than application testing:

1. **Local Validation**: Verify build works locally
2. **Workflow Validation**: Verify CI pipeline runs correctly
3. **Cache Validation**: Verify caching improves performance

**Estimated Testing Time**: 20-30 minutes (including CI wait times)

---

## Local Validation

### Purpose

Ensure the build command works locally before modifying CI.

### Running Local Build

```bash
# Option 1: Full build (includes opennextjs-cloudflare)
pnpm build

# Option 2: Next.js compile mode only (what CI will run)
pnpm exec next build --experimental-build-mode compile

# Option 3: With explicit PAYLOAD_SECRET
PAYLOAD_SECRET="test-secret-that-is-32-chars-long!!" pnpm exec next build --experimental-build-mode compile
```

### Expected Results

```
▲ Next.js 15.x.x

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (X/X)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB   XXX kB
├ ○ /admin                               XXX kB   XXX kB
└ ...

○  (Static)  prerendered as static content
```

### Local Build Checklist

- [ ] Build completes without errors
- [ ] TypeScript validation passes
- [ ] No missing imports
- [ ] Static pages generated successfully
- [ ] No warnings about deprecated features

---

## Workflow Validation

### Purpose

Verify the CI workflow runs correctly after modifications.

### Prerequisites

- [ ] GitHub CLI installed (`gh`)
- [ ] Authenticated to GitHub (`gh auth status`)
- [ ] Changes pushed to branch

### Running Workflow Tests

```bash
# Step 1: Push changes
git push origin story_1_3

# Step 2: Trigger workflow manually
gh workflow run quality-gate.yml --ref story_1_3

# Step 3: Watch workflow progress
gh run list --workflow=quality-gate.yml --limit=1

# Step 4: View detailed logs
gh run view <run-id> --log

# Alternative: View in browser
gh run view <run-id> --web
```

### Expected Results

Workflow should show:

1. ✅ Checkout repository
2. ✅ Setup pnpm
3. ✅ Setup Node.js
4. ✅ Install dependencies
5. ✅ Socket.dev Security Scan
6. ✅ ESLint
7. ✅ Prettier Check
8. ✅ Knip - Dead Code Detection
9. ✅ Generate Payload Types
10. ✅ Verify Type Sync
11. ✅ **Cache Next.js Build** (new)
12. ✅ **Next.js Build (No-DB Mode)** (new)

### Workflow Checklist

- [ ] Workflow triggers successfully
- [ ] All previous steps still pass
- [ ] Cache step runs without errors
- [ ] Build step completes successfully
- [ ] No TypeScript errors in build output
- [ ] Total workflow time is reasonable (<10 min)

---

## Cache Validation

### Purpose

Verify that caching improves build performance on subsequent runs.

### Cache Test Procedure

```bash
# Run 1: Initial build (no cache)
gh workflow run quality-gate.yml --ref story_1_3
# Wait for completion and note build time

# Run 2: Second build (should hit cache)
gh workflow run quality-gate.yml --ref story_1_3
# Compare build time to Run 1
```

### Expected Results

| Run | Cache Status | Build Time |
| --- | ------------ | ---------- |
| 1   | Cache miss   | 2-4 min    |
| 2   | Cache hit    | 1-2 min    |

### Cache Checklist

- [ ] First run shows "Cache not found" or similar
- [ ] Second run shows "Cache hit" or "Cache restored"
- [ ] Build time reduced on second run
- [ ] Cache key appears correct in logs
- [ ] No errors related to cache operations

### Viewing Cache Logs

```bash
# View workflow run with cache details
gh run view <run-id> --log | grep -A5 "Cache"

# Or view in browser for better formatting
gh run view <run-id> --web
```

---

## Error Scenario Testing

### Test: Missing PAYLOAD_SECRET

**Scenario**: What happens if PAYLOAD_SECRET is not set?

**Test**:

```bash
# Local test
unset PAYLOAD_SECRET
pnpm exec next build --experimental-build-mode compile
```

**Expected**: Build should still work with fallback value in workflow.

### Test: TypeScript Error

**Scenario**: What happens if there's a TypeScript error?

**Test**:

```bash
# Temporarily introduce an error
echo "const x: string = 123;" >> src/app/page.tsx
pnpm exec next build --experimental-build-mode compile
# Should fail with TypeScript error
git checkout src/app/page.tsx  # Restore
```

**Expected**: Build fails with clear TypeScript error message.

### Test: Import Error

**Scenario**: What happens if an import is missing?

**Test**:

```bash
# Check that all imports resolve
pnpm exec tsc --noEmit
```

**Expected**: No errors if all imports are valid.

---

## Debugging Tests

### Common Issues

#### Issue: Workflow doesn't trigger

**Debug**:

```bash
# Check workflow file is valid
gh workflow list

# Check if you have permission to trigger
gh workflow run quality-gate.yml --ref story_1_3 2>&1

# Check workflow syntax
actionlint .github/workflows/quality-gate.yml
```

#### Issue: Build fails in CI but works locally

**Debug**:

```bash
# Compare Node versions
node --version  # Local
# Check workflow for Node version

# Compare pnpm versions
pnpm --version  # Local
# Check workflow for pnpm version

# Check if dependencies differ
pnpm install --frozen-lockfile
pnpm build
```

#### Issue: Cache never hits

**Debug**:

```bash
# Check cache key in logs
gh run view <run-id> --log | grep "key:"

# Verify files exist that are being hashed
ls pnpm-lock.yaml
ls src/**/*.ts
```

---

## CI/CD Integration

### Automated Checks

After Phase 5, the quality-gate workflow validates:

1. **Supply Chain**: Socket.dev scan
2. **Code Quality**: ESLint, Prettier, Knip, Type Sync
3. **Build**: Next.js compilation (NEW)

### Required Status Checks

For branch protection (future):

- [ ] quality-gate workflow must pass
- [ ] All steps must succeed

---

## Testing Checklist

Before merging:

- [ ] Local build passes
- [ ] CI workflow triggers successfully
- [ ] All workflow steps pass (green)
- [ ] Cache behavior verified
- [ ] No new warnings or errors
- [ ] Build time is acceptable

---

## Best Practices

### Testing Tips

✅ **Do**:

- Test locally before pushing
- Wait for workflow to complete before next test
- Check logs if something fails
- Note build times for comparison

❌ **Don't**:

- Push without local validation
- Ignore warnings in build output
- Skip cache verification
- Assume CI works if local works

---

## FAQ

**Q: How long should the workflow take?**
A: Approximately 5-8 minutes total, with build step taking 2-4 minutes.

**Q: What if caching doesn't help?**
A: Caching primarily helps with unchanged source files. Small projects may see minimal improvement.

**Q: Should I test on every commit?**
A: Test after Commit 1 (build step) and after Commit 2 (caching). Not needed for documentation-only changes.

**Q: Can I run the workflow on a draft PR?**
A: Yes, use `gh workflow run` with `--ref` pointing to your branch.
