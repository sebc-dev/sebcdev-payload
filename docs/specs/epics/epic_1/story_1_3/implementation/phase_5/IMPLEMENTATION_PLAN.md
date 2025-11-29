# Phase 5 - Atomic Implementation Plan

**Objective**: Add Next.js build validation to the CI pipeline, ensuring TypeScript compilation and import resolution without database connectivity.

---

## Overview

### Why an Atomic Approach?

The implementation is split into **2 independent commits** to:

✅ **Facilitate review** - Each commit focuses on a single responsibility
✅ **Enable rollback** - If caching causes issues, revert it without losing build step
✅ **Progressive validation** - Build step validates before optimizing with cache
✅ **Clear separation** - Core functionality (build) vs optimization (caching)

### Global Strategy

```
[Commit 1: Build Step]  →  [Commit 2: Caching]
         ↓                        ↓
   Core validation         Performance optimization
   TypeScript OK            Faster CI runs
   Imports resolved         ~50% time reduction
```

---

## The 2 Atomic Commits

### Commit 1: Add Next.js Build Step

**Files**:

- `.github/workflows/quality-gate.yml`

**Size**: ~30 lines modified
**Duration**: 15-20 min (implementation) + 10-15 min (review)

**Content**:

- Add "Next.js Build (No-DB Mode)" step to workflow
- Configure `PAYLOAD_SECRET` environment variable
- Use `next build --experimental-build-mode compile`
- Replace placeholder step with actual build validation
- Position after Knip/Type Sync steps (depends on Phases 3-4)

**Why it's atomic**:

- Single responsibility: adds build validation capability
- No external dependencies beyond existing workflow
- Can be tested independently by triggering workflow

**Technical Validation**:

```bash
# Local validation - run the build command
pnpm exec next build --experimental-build-mode compile

# Expected: Build succeeds without errors
```

**Expected Result**:

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Review Criteria**:

- [ ] Build step uses correct command: `next build --experimental-build-mode compile`
- [ ] PAYLOAD_SECRET env var configured (min 32 chars)
- [ ] Step positioned after Knip and Type Sync steps
- [ ] Placeholder step replaced or removed
- [ ] No hardcoded secrets (uses secrets context)

---

### Commit 2: Add Next.js Build Caching

**Files**:

- `.github/workflows/quality-gate.yml`

**Size**: ~25 lines added
**Duration**: 15-20 min (implementation) + 10 min (review)

**Content**:

- Add `.next/cache` caching step using actions/cache
- Configure cache key based on OS and source files hash
- Add restore-keys for partial cache hits from main branch
- Position cache restore before build, cache save after build

**Why it's atomic**:

- Single responsibility: performance optimization only
- Independent of build logic (can be removed without breaking build)
- Requires Commit 1 to be meaningful

**Technical Validation**:

```bash
# Trigger workflow twice and compare build times
gh workflow run quality-gate.yml
# Wait for completion, then run again
gh workflow run quality-gate.yml

# Second run should show cache hit and faster build
```

**Expected Result**:

- First run: Full build (2-4 min)
- Second run: Cache hit, faster build (~1-2 min)

**Review Criteria**:

- [ ] Cache action SHA-pinned (consistent with Phase 1)
- [ ] Cache key includes `hashFiles` for source files
- [ ] restore-keys configured for partial matches
- [ ] Cache path is `.next/cache`
- [ ] No sensitive data in cache keys

---

## Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand CI-CD-Security.md Section 4.1
2. **Verify prerequisites**: Phases 1-4 completed
3. **Implement Commit 1**: Add build step to workflow
4. **Validate Commit 1**: Run local build + trigger workflow
5. **Review Commit 1**: Self-review against criteria
6. **Commit Commit 1**: Use provided commit message
7. **Implement Commit 2**: Add caching configuration
8. **Validate Commit 2**: Verify cache behavior
9. **Commit Commit 2**: Use provided commit message
10. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After each commit:

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Local build test
pnpm build

# Trigger CI workflow (after pushing)
gh workflow run quality-gate.yml
```

All must pass before moving to next commit.

---

## Commit Metrics

| Commit           | Files | Lines   | Implementation | Review        | Total         |
| ---------------- | ----- | ------- | -------------- | ------------- | ------------- |
| 1. Build Step    | 1     | ~30     | 15-20 min      | 10-15 min     | 25-35 min     |
| 2. Build Caching | 1     | ~25     | 15-20 min      | 10 min        | 25-30 min     |
| **TOTAL**        | **1** | **~55** | **30-40 min**  | **20-25 min** | **50-65 min** |

---

## Atomic Approach Benefits

### For Developers

- **Clear focus**: Build validation first, then optimize
- **Testable**: Each commit validated independently
- **Documented**: Clear commit messages

### For Reviewers

- **Fast review**: 10-15 min per commit
- **Focused**: Single responsibility to check
- **Quality**: Easier to spot issues

### For the Project

- **Rollback-safe**: Caching can be reverted without losing build
- **Historical**: Clear progression in git history
- **Maintainable**: Easy to understand later

---

## Best Practices

### Commit Messages

Format:

```
type(scope): short description (max 50 chars)

- Point 1: detail
- Point 2: detail
- Point 3: justification if needed

Part of Phase 5 - Commit X/2
```

Types: `feat`, `fix`, `refactor`, `chore`, `ci`

### Review Checklist

Before committing:

- [ ] Code follows project style guide
- [ ] Workflow syntax valid (use actionlint if available)
- [ ] SHA pins are correct format (40 hex chars)
- [ ] No console.logs or debug statements
- [ ] Documentation updated if needed

---

## Important Points

### Do's

- ✅ Follow the commit order (build before cache)
- ✅ Validate locally before pushing
- ✅ Test workflow trigger after each commit
- ✅ Use provided commit messages as template

### Don'ts

- ❌ Skip commits or combine them
- ❌ Commit without running local build
- ❌ Add DATABASE_URI (not needed in compile mode)
- ❌ Use unpinned action versions

---

## Dependencies

### Phase Dependencies

This phase depends on:

- **Phase 1**: Workflow foundation exists
- **Phase 3**: Linting must pass before build
- **Phase 4**: Types must be synchronized

### Technical Dependencies

- GitHub Actions runner with Node.js 20
- pnpm package manager
- Next.js 15 with experimental compile mode support

---

## FAQ

**Q: Why only 2 commits?**
A: Phase 5 is simple - just adding a build step and optimizing it. More commits would artificially split trivial changes.

**Q: What if the build fails in CI?**
A: Check that PAYLOAD_SECRET is configured in GitHub Secrets. The value must be at least 32 characters.

**Q: Can I skip the caching commit?**
A: Yes, but builds will be slower. Caching is recommended for efficiency.

**Q: What if I need to debug CI?**
A: Add `continue-on-error: true` temporarily to see full output, then remove before finalizing.
