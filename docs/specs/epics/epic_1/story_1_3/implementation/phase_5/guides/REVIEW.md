# Phase 5 - Code Review Guide

Complete guide for reviewing the Phase 5 implementation.

---

## Review Objective

Validate that the implementation:

- ✅ Adds Next.js build validation to CI pipeline
- ✅ Uses correct `--experimental-build-mode compile` flag
- ✅ Configures environment variables securely
- ✅ Implements caching for build optimization
- ✅ Follows SHA pinning conventions from Phase 1
- ✅ Integrates properly with existing workflow

---

## Review Approach

Phase 5 is split into **2 atomic commits**. You can:

**Option A: Commit-by-commit review** (recommended)

- Easier to digest (10-15 min per commit)
- Progressive validation
- Targeted feedback

**Option B: Global review at once**

- Faster (20-30 min total)
- Immediate overview

**Estimated Total Time**: 20-30 minutes

---

## Commit-by-Commit Review

### Commit 1: Add Next.js Build Step

**Files**: `.github/workflows/quality-gate.yml` (~30 lines)
**Duration**: 10-15 minutes

#### Review Checklist

##### Build Command

- [ ] Uses `pnpm exec next build --experimental-build-mode compile`
- [ ] Does NOT use `pnpm build` (which includes opennextjs-cloudflare)
- [ ] Flag `--experimental-build-mode compile` is present
- [ ] Command runs Next.js build without database dependency

##### Environment Variables

- [ ] `PAYLOAD_SECRET` configured with secrets context
- [ ] Fallback value is at least 32 characters
- [ ] Format: `${{ secrets.PAYLOAD_SECRET || 'fallback-value' }}`
- [ ] No `DATABASE_URI` needed (compile mode)

##### Workflow Structure

- [ ] Step named "Next.js Build (No-DB Mode)"
- [ ] Positioned in LAYER 3 section
- [ ] Comment header: `# LAYER 3: Build Validation`
- [ ] Placeholder step removed or replaced

##### Code Quality

- [ ] YAML indentation correct (2 spaces)
- [ ] Consistent with existing workflow style
- [ ] No hardcoded secrets in workflow

#### Technical Validation

```bash
# Verify build works locally
pnpm exec next build --experimental-build-mode compile

# After merge, trigger workflow
gh workflow run quality-gate.yml
```

**Expected Result**: Build completes successfully with TypeScript validation.

#### Questions to Ask

1. Is `--experimental-build-mode compile` the correct flag for Next.js 15?
2. Does the fallback secret meet Payload's minimum length requirement?
3. Is the step position correct in the workflow (after Type Sync)?

---

### Commit 2: Add Next.js Build Caching

**Files**: `.github/workflows/quality-gate.yml` (~25 lines)
**Duration**: 10 minutes

#### Review Checklist

##### Cache Action

- [ ] SHA-pinned: `actions/cache@5a3ec84eff668545956fd18022155c47e93e2684`
- [ ] Version is v4.2.3 or compatible
- [ ] Consistent with Phase 1 SHA pinning convention

##### Cache Configuration

- [ ] Path is `.next/cache` (NOT `.next/` entirely)
- [ ] Key includes `runner.os`
- [ ] Key includes `hashFiles('pnpm-lock.yaml')`
- [ ] Key includes source file hash pattern

##### Restore Keys

- [ ] restore-keys configured for partial matches
- [ ] Fallback chain: specific → general
- [ ] Format: multi-line YAML with `|`

##### Security

- [ ] No sensitive data in cache keys
- [ ] Cache path doesn't include `.env` files
- [ ] Cache won't leak secrets

#### Technical Validation

```bash
# Trigger workflow twice to test caching
gh workflow run quality-gate.yml
# Wait for completion
gh workflow run quality-gate.yml
# Second run should show cache hit
```

**Expected Result**: Second run shows "Cache hit" and faster build time.

#### Questions to Ask

1. Is the cache key specific enough to invalidate on code changes?
2. Are restore-keys ordered from specific to general?
3. Does caching `.next/cache` vs `.next/` matter?

---

## Global Validation

After reviewing all commits:

### Architecture & Design

- [ ] Build validation is Layer 3 (after Quality, before Identity)
- [ ] Follows defense-in-depth strategy from CI-CD-Security.md
- [ ] No database dependency in CI build

### Code Quality

- [ ] YAML syntax valid throughout
- [ ] Consistent indentation (2 spaces)
- [ ] SHA pins are 40-character hex strings
- [ ] Comments explain purpose

### Testing

- [ ] Local build verified
- [ ] CI workflow triggers successfully
- [ ] Cache behavior verified

### Security

- [ ] No hardcoded secrets
- [ ] Secrets use `${{ secrets.* }}` context
- [ ] Fallback values don't contain real secrets
- [ ] Cache doesn't expose sensitive data

### Performance

- [ ] Cache configured for build optimization
- [ ] hashFiles patterns are efficient
- [ ] restore-keys enable partial cache hits

---

## Feedback Template

Use this template for feedback:

```markdown
## Review Feedback - Phase 5

**Reviewer**: [Name]
**Date**: [Date]
**Commits Reviewed**: 1/2 or 2/2 or "all"

### ✅ Strengths

- [What was done well]
- [Highlight good practices]

### Required Changes

1. **[File/Area]**: [Issue description]
   - **Why**: [Explanation]
   - **Suggestion**: [How to fix]

2. [Repeat for each required change]

### Suggestions (Optional)

- [Nice-to-have improvements]
- [Alternative approaches to consider]

### Verdict

- [ ] ✅ **APPROVED** - Ready to merge
- [ ] **CHANGES REQUESTED** - Needs fixes
- [ ] ❌ **REJECTED** - Major rework needed

### Next Steps

[What should happen next]
```

---

## Review Actions

### If Approved ✅

1. Merge the commits
2. Verify CI workflow runs successfully
3. Update phase status to COMPLETED
4. Update EPIC_TRACKING.md

### If Changes Requested

1. Create detailed feedback (use template)
2. Discuss with developer
3. Re-review after fixes

### If Rejected ❌

1. Document major issues
2. Schedule discussion
3. Plan rework strategy

---

## FAQ

**Q: What if the SHA pin doesn't match?**
A: Verify against the official GitHub releases page. The SHA should match the v4.2.3 release.

**Q: Is caching safe for this workflow?**
A: Yes, `.next/cache` only contains build artifacts, not secrets or source code.

**Q: Should I test the workflow myself?**
A: Yes, trigger the workflow with `gh workflow run quality-gate.yml` to verify it works.

**Q: Can I approve with minor comments?**
A: Yes, mark as approved and note that comments are optional improvements.
