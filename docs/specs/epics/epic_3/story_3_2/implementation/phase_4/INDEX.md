# Phase 4: Accessibility Validation & Cleanup

**Story**: 3.2 - Integration Design System (Dark Mode)
**Epic**: 3 - Frontend Core & Design System
**Phase**: 4 of 4
**Status**: Not Started

---

## Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy | Start here for implementation |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit validation | During each commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide | During PR review |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | Writing/running tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | Before marking complete |

---

## Phase Overview

### Objective

Validate accessibility compliance (WCAG 2.1 AA), create E2E visual tests for the design system, verify the admin panel has no regressions, and clean up any dead code.

### Scope

| In Scope | Out of Scope |
|----------|--------------|
| WCAG 2.1 AA contrast audit | Light mode support |
| E2E visual tests with Playwright | New component development |
| axe-core accessibility validation | Performance optimization |
| Admin panel regression check | Animation system |
| Dead code cleanup (Knip) | Full test coverage of all components |
| Documentation of design tokens | Mobile-specific testing |

### Key Deliverables

- [ ] All text contrasts >= 4.5:1 (WCAG AA)
- [ ] All UI element contrasts >= 3:1 (WCAG AA)
- [ ] E2E test for design system validation
- [ ] Existing E2E tests updated for new styles
- [ ] Admin panel verified working
- [ ] No dead code detected by Knip
- [ ] Inline documentation of design tokens

---

## Atomic Commit Strategy

This phase is broken into **3 atomic commits**:

| # | Commit | Est. Time | Risk |
|---|--------|-----------|------|
| 1 | Add design system E2E tests with axe-core | 45 min | Low |
| 2 | Update existing E2E tests for new styles | 30 min | Low |
| 3 | Final cleanup and documentation | 20 min | Low |

**Total Estimated Time**: 1.5-2 hours

---

## Dependencies

### Prerequisites (Must Complete First)

- [x] Phase 1: Tailwind CSS 4 Foundation
- [x] Phase 2: shadcn/ui & Utility Functions
- [x] Phase 3: Design Tokens & Visual Migration

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Playwright | ^1.56.0 | E2E testing framework |
| @axe-core/playwright | ^4.x | Accessibility testing |
| Knip | ^5.x | Dead code detection |

---

## Files Affected

### Files to Create (~1)

| File | Purpose |
|------|---------|
| `tests/e2e/design-system.e2e.spec.ts` | Design system visual & a11y tests |

### Files to Modify (~2)

| File | Changes |
|------|---------|
| `tests/e2e/frontend.e2e.spec.ts` | Update visual assertions for new styles |
| `src/app/globals.css` | Add inline documentation comments |

---

## Risk Assessment

### Low Risk Phase

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Contrast issues found | Delay | Low | Already validated in Phase 3 |
| E2E test flakiness | CI failures | Low | Use stable selectors |
| Admin panel regression | Major | Very Low | Isolated styling |

### Rollback Strategy

Each commit is atomic and can be reverted individually:

```bash
# Revert specific commit if issues
git revert <commit-hash>

# Or revert entire phase
git revert HEAD~3..HEAD
```

---

## Success Criteria

### Technical Criteria

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm test:e2e` passes (all tests green)
- [ ] `pnpm knip` reports no dead code

### Accessibility Criteria

- [ ] Lighthouse Accessibility score >= 95
- [ ] axe-core reports 0 violations
- [ ] Text contrast ratio >= 4.5:1 (WCAG AA)
- [ ] UI element contrast ratio >= 3:1 (WCAG AA)
- [ ] Focus rings visible on all interactive elements

### Validation Criteria

- [ ] Admin panel (`/admin`) loads without errors
- [ ] Admin panel styling unaffected
- [ ] CSS bundle size < 50KB gzipped
- [ ] All E2E tests pass in CI

---

## Implementation Workflow

```
1. Setup Environment
   |-- Read ENVIRONMENT_SETUP.md
   |-- Verify Phases 1-3 complete
   |-- Ensure dev server works

2. Implement Commits
   |-- Follow IMPLEMENTATION_PLAN.md
   |-- Use COMMIT_CHECKLIST.md for each commit

3. Test & Review
   |-- Run tests per guides/TESTING.md
   |-- Self-review via guides/REVIEW.md

4. Final Validation
   |-- Complete validation/VALIDATION_CHECKLIST.md
   |-- Update EPIC_TRACKING.md
   |-- Update PHASES_PLAN.md status
```

---

## Related Documents

### Story Documentation
- [Story 3.2 Specification](../../story_3.2.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Previous Phases
- [Phase 1: Tailwind Foundation](../phase_1/INDEX.md)
- [Phase 2: shadcn/ui Setup](../phase_2/INDEX.md)
- [Phase 3: Design Tokens & Migration](../phase_3/INDEX.md)

### Epic Documentation
- [EPIC_TRACKING.md](../../../EPIC_TRACKING.md)

### Design References
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Section 7: Design System

### External References
- [Playwright Documentation](https://playwright.dev/)
- [axe-core Documentation](https://www.deque.com/axe/)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Knip Documentation](https://knip.dev/)

---

**Phase Created**: 2025-12-02
**Last Updated**: 2025-12-02
**Created by**: phase-doc-generator skill
