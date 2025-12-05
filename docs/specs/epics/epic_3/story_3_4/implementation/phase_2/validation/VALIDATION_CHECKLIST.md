# Phase 2: Validation Checklist

**Phase**: CI E2E Tests
**Status**: NOT VALIDATED

---

## Pre-Validation

### Phase 1 Completion
- [ ] Phase 1 fully completed
- [ ] Unit tests run in CI
- [ ] Integration tests run in CI

### Local Environment
- [ ] Playwright browsers installed
- [ ] `pnpm test:e2e` passes locally
- [ ] playwright.config.ts has webServer configured

---

## Commit Validation

### Commit 1: Install Playwright Browsers
- [ ] Step added after Next.js Build
- [ ] Uses `--with-deps chromium`
- [ ] YAML syntax valid

### Commit 2: E2E Tests Step
- [ ] Step added after Playwright install
- [ ] PAYLOAD_SECRET configured with fallback
- [ ] `timeout-minutes: 10` set

### Commit 3: Artifacts Upload
- [ ] Step added after E2E Tests
- [ ] `if: failure()` condition set
- [ ] Paths include `test-results/` and `playwright-report/`
- [ ] `retention-days: 7` configured
- [ ] Action SHA pinned

### Commit 4: Browser Caching
- [ ] Version extraction step added
- [ ] Cache step added with correct key
- [ ] Install step has `if: cache-hit != 'true'`
- [ ] Cache path is `~/.cache/ms-playwright`

---

## CI Validation

### First Run (No Cache)
- [ ] Playwright version extracted correctly
- [ ] Cache miss reported
- [ ] Browsers install successfully
- [ ] E2E tests execute
- [ ] Tests pass
- [ ] Artifacts not uploaded (tests passed)

### Second Run (With Cache)
- [ ] Cache hit reported
- [ ] Browser install skipped
- [ ] E2E tests execute faster
- [ ] Tests pass

### Failure Scenario
- [ ] Introduce temporary failing test
- [ ] E2E Tests step fails
- [ ] Artifacts uploaded
- [ ] Artifacts downloadable
- [ ] Report viewable

### Performance
- [ ] First run E2E phase < 7 minutes
- [ ] Cached run E2E phase < 5 minutes
- [ ] Total workflow time acceptable (< 15 min)

---

## Documentation Validation

### Files Created
- [ ] `phase_2/INDEX.md` exists
- [ ] `phase_2/IMPLEMENTATION_PLAN.md` exists
- [ ] `phase_2/COMMIT_CHECKLIST.md` exists
- [ ] `phase_2/ENVIRONMENT_SETUP.md` exists
- [ ] `phase_2/guides/REVIEW.md` exists
- [ ] `phase_2/guides/TESTING.md` exists
- [ ] `phase_2/validation/VALIDATION_CHECKLIST.md` exists

---

## Final Checklist

### Code Quality
- [ ] No linting errors
- [ ] YAML properly formatted
- [ ] All actions SHA pinned
- [ ] No hardcoded secrets

### Functionality
- [ ] E2E tests run in CI
- [ ] Browser caching works
- [ ] Artifacts uploaded on failure

### Security
- [ ] PAYLOAD_SECRET uses fallback pattern
- [ ] No sensitive data in artifacts
- [ ] Actions from trusted sources

---

## Sign-off

### Phase 2 Completion
- [ ] All validation checks passed
- [ ] PR approved (if applicable)
- [ ] Ready for Phase 3

**Validated By**: _______________
**Date**: _______________

---

## Notes

_Add any observations or issues encountered during validation:_

---

**Validation Checklist Created**: 2025-12-05
