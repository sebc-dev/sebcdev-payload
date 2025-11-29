# Phase 5 - Final Validation Checklist

Complete validation checklist before marking Phase 5 as complete.

---

## 1. Commits and Structure

- [ ] Both atomic commits completed
- [ ] Commits follow naming convention (gitmoji + type(scope))
- [ ] Commit order is logical (build → cache)
- [ ] Each commit is focused (single responsibility)
- [ ] Git history is clean

---

## 2. Workflow Configuration

- [ ] Build step added to quality-gate.yml
- [ ] Uses `pnpm exec next build --experimental-build-mode compile`
- [ ] PAYLOAD_SECRET configured with secrets context
- [ ] Fallback secret is at least 32 characters
- [ ] Cache step added before build step
- [ ] Cache action SHA-pinned correctly

**Validation**:

```bash
# Check workflow file
cat .github/workflows/quality-gate.yml | grep -A5 "Next.js Build"
cat .github/workflows/quality-gate.yml | grep -A10 "Cache Next.js"
```

---

## 3. Code Quality

- [ ] YAML syntax is valid
- [ ] Consistent indentation (2 spaces)
- [ ] Comments explain purpose
- [ ] No hardcoded secrets
- [ ] Consistent with Phase 1-4 style

**Validation**:

```bash
# Lint workflow syntax (if actionlint available)
actionlint .github/workflows/quality-gate.yml

# Or validate YAML syntax
python -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
```

---

## 4. Local Build Validation

- [ ] Local build passes
- [ ] TypeScript compilation succeeds
- [ ] All imports resolve
- [ ] No build warnings (or expected ones documented)

**Validation**:

```bash
# Full build
pnpm build

# Or just Next.js compile mode
pnpm exec next build --experimental-build-mode compile
```

---

## 5. Linting and Type Checking

- [ ] ESLint passes
- [ ] Prettier check passes
- [ ] TypeScript check passes

**Validation**:

```bash
# Lint check
pnpm lint

# Prettier check
pnpm exec prettier --check .

# TypeScript check
pnpm exec tsc --noEmit
```

---

## 6. CI Workflow Validation

- [ ] Workflow triggers successfully
- [ ] All previous steps still pass
- [ ] Build step passes
- [ ] Cache step works (no errors)
- [ ] Total workflow time < 10 minutes

**Validation**:

```bash
# Trigger workflow
gh workflow run quality-gate.yml --ref story_1_3

# Check status
gh run list --workflow=quality-gate.yml --limit=1

# View run details
gh run view <run-id>
```

---

## 7. Cache Behavior

- [ ] First run shows cache miss (expected)
- [ ] Second run shows cache hit
- [ ] Build time reduced on cache hit
- [ ] Cache key format is correct

**Validation**:

```bash
# Run workflow twice
gh workflow run quality-gate.yml
# Wait for completion
gh workflow run quality-gate.yml

# Compare run times
gh run list --workflow=quality-gate.yml --limit=2
```

---

## 8. Documentation

- [ ] Phase 5 INDEX.md created
- [ ] IMPLEMENTATION_PLAN.md complete
- [ ] COMMIT_CHECKLIST.md complete
- [ ] ENVIRONMENT_SETUP.md complete
- [ ] guides/REVIEW.md complete
- [ ] guides/TESTING.md complete
- [ ] All commands in docs work

---

## 9. Integration with Previous Phases

- [ ] Phase 1-4 steps still pass
- [ ] No breaking changes to workflow
- [ ] Build step positioned correctly (Layer 3)
- [ ] Workflow order maintained

**Integration Test**:

```bash
# Verify all quality checks pass
pnpm lint
pnpm exec prettier --check .
pnpm exec knip --production
pnpm generate:types:payload
pnpm build
```

---

## 10. Security Validation

- [ ] No sensitive data in cache keys
- [ ] Secrets use `${{ secrets.* }}` context
- [ ] Fallback values don't contain real secrets
- [ ] Cache path doesn't include env files

**Security Review**:

```bash
# Check for hardcoded secrets
grep -r "PAYLOAD_SECRET=" .github/
# Should only show workflow reference, not actual values
```

---

## 11. Code Review

- [ ] Self-review completed (guides/REVIEW.md)
- [ ] Peer review completed (if required)
- [ ] All feedback addressed
- [ ] Changes approved

---

## 12. Final Validation

- [ ] All previous checklist items checked
- [ ] Phase 5 objectives met
- [ ] Build validation working in CI
- [ ] Ready for Phase 6

---

## Validation Commands Summary

Run all these commands before final approval:

```bash
# Install dependencies (if needed)
pnpm install --frozen-lockfile

# Type-checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Prettier
pnpm exec prettier --check .

# Knip
pnpm exec knip --production

# Build
pnpm build

# Trigger CI
gh workflow run quality-gate.yml --ref story_1_3
```

**All must pass with no errors.**

---

## Success Metrics

| Metric        | Target | Actual | Status |
| ------------- | ------ | ------ | ------ |
| Commits       | 2      | -      | ⏳     |
| Local Build   | ✅     | -      | ⏳     |
| CI Build      | ✅     | -      | ⏳     |
| Cache Working | ✅     | -      | ⏳     |
| Workflow Time | <10min | -      | ⏳     |

---

## Final Verdict

Select one:

- [ ] ✅ **APPROVED** - Phase 5 is complete and ready
- [ ] **CHANGES REQUESTED** - Issues to fix:
  - [List issues]
- [ ] ❌ **REJECTED** - Major rework needed:
  - [List major issues]

---

## Next Steps

### If Approved ✅

1. [ ] Update INDEX.md status to ✅ COMPLETED
2. [ ] Update EPIC_TRACKING.md
3. [ ] Merge to main branch
4. [ ] Prepare for Phase 6 (dependency-cruiser)

### If Changes Requested

1. [ ] Address all feedback items
2. [ ] Re-run validation
3. [ ] Request re-review

### If Rejected ❌

1. [ ] Document issues
2. [ ] Plan rework
3. [ ] Schedule review

---

**Validation completed by**: -
**Date**: -
**Notes**: -
