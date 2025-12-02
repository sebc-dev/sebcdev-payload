# Phase 4: Validation Checklist

**Phase**: Accessibility Validation & Cleanup
**Purpose**: Final validation before marking phase complete

---

## Pre-Validation Requirements

Before starting validation:

- [ ] All 3 commits implemented
- [ ] All code pushed to branch
- [ ] No pending changes (`git status` clean)

---

## Technical Validation

### Build Verification

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No build warnings related to CSS
- [ ] Build output size acceptable

**Build Metrics**:

| Metric | Target | Actual |
|--------|--------|--------|
| Build success | Yes | |
| TypeScript errors | 0 | |
| CSS bundle size | < 50KB gzip | |

### Linting Verification

```bash
pnpm lint
```

- [ ] No ESLint errors
- [ ] No Prettier errors
- [ ] No new warnings introduced

### Dead Code Check

```bash
pnpm knip
```

- [ ] No unused exports detected
- [ ] No unused dependencies
- [ ] No unused files
- [ ] Clean report

---

## Test Validation

### E2E Tests

```bash
pnpm test:e2e
```

- [ ] All tests pass
- [ ] No flaky tests
- [ ] Test execution time acceptable (< 60s)

**Test Results**:

| Test Suite | Status | Notes |
|------------|--------|-------|
| design-system.e2e.spec.ts | | |
| frontend.e2e.spec.ts | | |

### Design System Tests Specifically

```bash
pnpm test:e2e tests/e2e/design-system.e2e.spec.ts
```

- [ ] Visual validation tests pass
- [ ] Typography tests pass
- [ ] Accessibility tests pass (0 violations)
- [ ] Dark mode tests pass
- [ ] Admin panel tests pass

### Unit/Integration Tests

```bash
pnpm test:unit
pnpm test:int
```

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No regressions

---

## Accessibility Validation

### axe-core Audit

- [ ] FR homepage: 0 WCAG AA violations
- [ ] EN homepage: 0 WCAG AA violations
- [ ] Focus rings visible on all interactive elements

### Manual Accessibility Check

- [ ] Tab navigation works correctly
- [ ] Focus order is logical
- [ ] No keyboard traps
- [ ] Screen reader can read content (manual test optional)

### Contrast Verification

| Element | Target | Verified |
|---------|--------|----------|
| Body text on background | >= 4.5:1 | [ ] |
| Headings on background | >= 4.5:1 | [ ] |
| Primary button text | >= 4.5:1 | [ ] |
| Border visibility | >= 3:1 | [ ] |
| Focus ring visibility | >= 3:1 | [ ] |

**Tools for verification**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools (Accessibility tab)

---

## Visual Validation

### Homepage Check (FR)

```
URL: http://localhost:3000/fr
```

- [ ] Background color is anthracite (#1A1D23)
- [ ] Text color is off-white (#F7FAFC)
- [ ] Heading font is Nunito Sans
- [ ] Code font is JetBrains Mono (if code present)
- [ ] Primary button uses teal accent (#14B8A6)
- [ ] No visual regressions from Phase 3

### Homepage Check (EN)

```
URL: http://localhost:3000/en
```

- [ ] Same visual checks as FR
- [ ] Language switching works correctly
- [ ] No layout shifts

### Admin Panel Check

```
URL: http://localhost:3000/admin
```

- [ ] Admin panel loads without errors
- [ ] Admin styling is NOT affected by our changes
- [ ] Login form works (if applicable)
- [ ] No console errors

---

## Documentation Validation

### CSS Documentation

- [ ] `globals.css` has inline comments
- [ ] Design system name documented
- [ ] Reference to UX_UI_Spec.md included
- [ ] Color variables documented with hex values
- [ ] Usage descriptions provided

### Phase Documentation Complete

- [ ] INDEX.md accurate and up-to-date
- [ ] IMPLEMENTATION_PLAN.md reflects actual implementation
- [ ] COMMIT_CHECKLIST.md completed
- [ ] ENVIRONMENT_SETUP.md verified
- [ ] guides/REVIEW.md ready for PR
- [ ] guides/TESTING.md accurate
- [ ] This checklist completed

---

## Performance Validation

### Lighthouse Audit

```bash
# Run after starting dev server
# Use Chrome DevTools > Lighthouse
```

| Metric | Target | Actual |
|--------|--------|--------|
| Performance | >= 90 | |
| Accessibility | >= 95 | |
| Best Practices | >= 90 | |
| SEO | >= 90 | |

### Bundle Size Check

```bash
# Check CSS bundle
ls -la .next/static/css/
du -sh .next/static/css/
```

- [ ] CSS bundle < 50KB gzipped
- [ ] No unexpected large files

---

## Acceptance Criteria Verification

### Story 3.2 Acceptance Criteria

From `story_3.2.md`:

- [ ] **AC-1**: Tailwind CSS 4 installed and functional (Phase 1)
- [ ] **AC-2**: shadcn/ui installed with dark mode default (Phase 2)
- [ ] **AC-3**: Design tokens configured (Phase 3)
- [ ] **AC-4**: Fonts loaded via next/font (Phase 3)
- [ ] **AC-5**: CSS vanilla migrated to Tailwind (Phase 3)
- [ ] **AC-6**: Homepage displays new colors/typography (Phase 3)
- [ ] **AC-7**: Dark mode active by default (Phase 3)

### Non-Functional Requirements

- [ ] **NFR-1**: WCAG 2.1 AA contrasts validated (Phase 4)
- [ ] **NFR-2**: No admin panel regression (Phase 4)
- [ ] **NFR-3**: CSS bundle < 50KB gzipped (Phase 4)
- [ ] **NFR-4**: Build succeeds (Phase 4)
- [ ] **NFR-5**: Cloudflare Workers compatible (implicit)

---

## Final Sign-Off

### Phase 4 Complete

- [ ] All technical validations pass
- [ ] All tests pass
- [ ] All accessibility requirements met
- [ ] All visual validations pass
- [ ] All documentation complete
- [ ] All acceptance criteria verified

### Ready for PR

- [ ] Branch up-to-date with main
- [ ] All commits follow convention
- [ ] PR description prepared
- [ ] Reviewers identified

### Tracking Updates Required

After phase completion:

1. **Update PHASES_PLAN.md**:
   ```markdown
   - [x] Phase 4: Validation & Cleanup - COMPLETED (date)
   ```

2. **Update EPIC_TRACKING.md**:
   ```markdown
   Story 3.2: Integration Design System
   Status: COMPLETED
   ```

3. **Update story_3.2.md**:
   ```markdown
   Status: COMPLETED
   ```

---

## Validation Summary

| Category | Items | Passed | Failed |
|----------|-------|--------|--------|
| Technical | 6 | | |
| Tests | 8 | | |
| Accessibility | 8 | | |
| Visual | 12 | | |
| Documentation | 8 | | |
| Acceptance Criteria | 12 | | |
| **Total** | **54** | | |

---

## Completion Confirmation

```
Phase 4 Validated By: _______________
Date: _______________
Status: [ ] COMPLETE [ ] INCOMPLETE

Notes:
_____________________________________
_____________________________________
```

---

**Created**: 2025-12-02
**Last Updated**: 2025-12-02
