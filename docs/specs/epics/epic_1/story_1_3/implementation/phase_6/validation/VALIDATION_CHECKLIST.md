# Validation Checklist - Phase 6: Architecture Validation

**Phase**: Architecture Validation (dependency-cruiser)
**Purpose**: Final validation before marking phase complete

---

## Pre-Validation Requirements

Before starting validation:

- [ ] All 4 commits have been made
- [ ] All commits are pushed to remote
- [ ] Quality-gate workflow has been triggered
- [ ] Workflow completed (passed or with documented issues)

---

## Section 1: Installation Validation

### 1.1 Package Installation

- [ ] `dependency-cruiser` appears in `package.json` devDependencies
- [ ] Version is >= 16.0.0

```bash
# Verify
cat package.json | grep "dependency-cruiser"
```

### 1.2 npm Scripts

- [ ] `depcruise` script exists and works

```bash
pnpm depcruise
# Expected: Runs without error
```

- [ ] `depcruise:report` script exists and generates file

```bash
pnpm depcruise:report
ls -la depcruise-report.html
# Expected: File exists with size > 0
```

### 1.3 Configuration File

- [ ] `.dependency-cruiser.cjs` exists at project root
- [ ] File is valid JavaScript/CommonJS

```bash
node -e "require('./.dependency-cruiser.cjs')" && echo "Config valid"
```

---

## Section 2: Rule Validation

### 2.1 no-server-in-client Rule

- [ ] Rule is defined in configuration
- [ ] Severity is set to `error`
- [ ] Server component patterns excluded (`page.tsx`, `layout.tsx`, etc.)
- [ ] Targets server-only paths (`collections/`, `payload.config.ts`)

### 2.2 no-circular Rule

- [ ] Rule is defined in configuration
- [ ] Severity is set to `error`
- [ ] Type-only cycles are excluded (`dependencyTypesNot: ['type-only']`)

### 2.3 no-orphans Rule (Optional)

- [ ] Rule is defined in configuration
- [ ] Severity is set to `warn`
- [ ] Test files are excluded from orphan detection

### 2.4 no-deprecated Rule (Optional)

- [ ] Rule is defined in configuration
- [ ] Severity is set to `warn`

---

## Section 3: Exclusion Validation

### 3.1 Required Exclusions

Verify these paths are excluded from analysis:

- [ ] `node_modules`
- [ ] `.next`
- [ ] `.open-next`
- [ ] `src/payload-types.ts`
- [ ] `drizzle/migrations`
- [ ] `coverage`
- [ ] `dist`
- [ ] `build`

```bash
# Verify exclusions in config
grep -A 20 "exclude:" .dependency-cruiser.cjs
```

### 3.2 Cache Configuration

- [ ] Cache is enabled
- [ ] Cache folder is `node_modules/.cache/dependency-cruiser`
- [ ] Cache strategy is `content`

---

## Section 4: Baseline Validation (If Applicable)

If a baseline file was created:

### 4.1 Baseline File

- [ ] `.dependency-cruiser-known-violations.json` exists
- [ ] File is valid JSON
- [ ] `knownViolationsPath` is configured in options

```bash
# Validate JSON
cat .dependency-cruiser-known-violations.json | head -5
```

### 4.2 Baseline Usage

- [ ] Running `pnpm depcruise` passes (violations are baselined)
- [ ] New violations would still be caught

If NO baseline was needed:

- [ ] `.dependency-cruiser-known-violations.json` does NOT exist
- [ ] `pnpm depcruise` passes with zero violations

---

## Section 5: CI Integration Validation

### 5.1 Workflow Step

- [ ] Step exists in `.github/workflows/quality-gate.yml`
- [ ] Step is placed after build validation
- [ ] Step has name: `dependency-cruiser - Architecture Validation`
- [ ] Step writes to `$GITHUB_STEP_SUMMARY`

### 5.2 Workflow Execution

- [ ] Workflow triggered successfully
- [ ] dependency-cruiser step executed
- [ ] Step passed (or failed with expected violations)

### 5.3 GitHub Job Summary

- [ ] Summary shows "Architecture Validation" section
- [ ] Success shows checkmark and positive message
- [ ] Failure would show violations in code block

```markdown
# Expected success output in Summary:
## Architecture Validation

### :white_check_mark: No architectural violations detected

All import boundaries and dependency rules are respected.
```

### 5.4 Quality Gate Summary Update

- [ ] Summary step updated to show Layer 2+
- [ ] Emoji indicates completed status

---

## Section 6: Documentation Validation

### 6.1 CLAUDE.md

- [ ] `depcruise` command documented
- [ ] `depcruise:report` command documented
- [ ] Section is properly formatted

### 6.2 Commit Messages

- [ ] All commits use gitmoji format
- [ ] Commits include co-author line
- [ ] Commit messages are descriptive

---

## Section 7: Functional Validation

### 7.1 Local Execution

Run the full validation locally:

```bash
# Step 1: Run architecture validation
pnpm depcruise
# Expected: Pass (or violations are baselined)

# Step 2: Generate report
pnpm depcruise:report
# Expected: HTML file created

# Step 3: Verify build still works
pnpm build
# Expected: Build passes

# Step 4: Verify lint still works
pnpm lint
# Expected: No new errors
```

### 7.2 Detection Verification

Create a temporary violation to verify detection works:

```bash
# Create violation
echo "import { serverConfig } from './server-only'" > src/temp-violation.tsx

# Run validation
pnpm depcruise 2>&1 | grep -i "violation" || echo "Violation detected correctly"

# Cleanup
rm src/temp-violation.tsx
```

---

## Section 8: Performance Validation

### 8.1 Execution Time

- [ ] `pnpm depcruise` completes in < 30 seconds

```bash
time pnpm depcruise
```

### 8.2 CI Impact

- [ ] Workflow execution time increased by < 30 seconds
- [ ] No timeouts or performance issues

---

## Section 9: Rollback Verification

Verify rollback is possible if needed:

### 9.1 Identify Commits

```bash
# List phase commits
git log --oneline -10 | head -4
```

### 9.2 Document Rollback Command

If rollback needed:

```bash
git revert HEAD~4..HEAD --no-commit
git commit -m "Revert Phase 6: dependency-cruiser integration"
```

---

## Section 10: Final Signoff

### 10.1 Success Criteria

From INDEX.md, verify all success criteria are met:

- [ ] No new architectural violations introduced
- [ ] Circular imports detected (excluding type-only cycles)
- [ ] Server code blocked from client components
- [ ] Report visible in GitHub Actions Job Summary
- [ ] Existing violations baselined (if any)

### 10.2 Acceptance Criteria

From PHASES_PLAN.md:

- [ ] **CA7**: dependency-cruiser pour validation architecture - COMPLETE

### 10.3 Phase Signoff

| Item | Status | Notes |
|------|--------|-------|
| Installation | Pass/Fail | |
| Rules | Pass/Fail | |
| Exclusions | Pass/Fail | |
| Baseline | Pass/Fail/N/A | |
| CI Integration | Pass/Fail | |
| Documentation | Pass/Fail | |
| Performance | Pass/Fail | |

**Phase Status**: [ ] READY TO MARK COMPLETE

---

## Update Tracking Documents

After successful validation:

### 10.4 Update PHASES_PLAN.md

Navigate to `docs/specs/epics/epic_1/story_1_3/implementation/PHASES_PLAN.md` and update:

```markdown
- [x] Phase 6: Architecture Validation (dependency-cruiser) - Status: COMPLETED, Actual duration: Xh, Notes: [summary]
```

### 10.5 Update EPIC_TRACKING.md

Navigate to `docs/specs/epics/epic_1/EPIC_TRACKING.md` and update Story 1.3 Phase 6 status.

---

## Validation Summary

**Validation Date**: _______________

**Validated By**: _______________

**Total Checks**: 50+

**Passed**: ___ / ___

**Failed**: ___ (list issues below)

**Notes**:

---

### Issues Found

| Issue | Severity | Resolution |
|-------|----------|------------|
| | | |

---

**Validation Checklist Created**: 2025-11-29
**Last Updated**: 2025-11-29
