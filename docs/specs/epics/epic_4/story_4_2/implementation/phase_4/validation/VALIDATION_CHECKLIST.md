# Phase 4: Validation Checklist

**Phase**: Integration & E2E Testing
**Status**: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED

---

## Pre-Validation

Before running validation:

- [ ] All 5 commits completed
- [ ] All commits pushed to remote
- [ ] Dev server starts without errors
- [ ] Build completes successfully

---

## 1. Code Quality Validation

### 1.1 TypeScript

```bash
pnpm exec tsc --noEmit
```

- [ ] No type errors
- [ ] No implicit `any` warnings
- [ ] All imports resolve correctly

### 1.2 Linting

```bash
pnpm lint
```

- [ ] No ESLint errors
- [ ] No ESLint warnings (or justified)
- [ ] Prettier formatting correct

### 1.3 Build

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No build warnings
- [ ] Output size reasonable

---

## 2. Functional Validation

### 2.1 Desktop (≥1024px viewport)

**Test URL**: `http://localhost:3000/fr/articles/[your-article-slug]`

#### Reading Progress Bar

- [ ] Progress bar visible at top of viewport
- [ ] Bar is fixed position (stays visible on scroll)
- [ ] Progress starts at ~0% at page top
- [ ] Progress updates smoothly while scrolling
- [ ] Progress reaches ~100% at article end
- [ ] Bar height is 3px (as designed)
- [ ] Bar color matches primary color (#14B8A6)

#### Table of Contents (Desktop)

- [ ] TOC sidebar visible on right side
- [ ] TOC has title "Table des matières"
- [ ] TOC lists all h2/h3 headings from article
- [ ] h3 headings indented under h2
- [ ] Clicking TOC link scrolls to section
- [ ] Scroll is smooth (not instant jump)
- [ ] Active section highlighted in TOC
- [ ] Highlight updates as user scrolls
- [ ] TOC is sticky (follows scroll)

#### Layout

- [ ] Content centered in middle column
- [ ] Content width ~65ch (readable)
- [ ] TOC width ~200px
- [ ] Appropriate spacing between columns
- [ ] No horizontal overflow

### 2.2 Tablet (768px - 1023px)

- [ ] Desktop TOC sidebar hidden
- [ ] MobileTOC button visible
- [ ] Content takes full width
- [ ] All other functionality works

### 2.3 Mobile (375px viewport)

**Test URL**: Same, use DevTools responsive mode

#### Mobile TOC

- [ ] Floating button visible (bottom-right)
- [ ] Button has correct icon (List)
- [ ] Button size appropriate (48x48px)
- [ ] Clicking button opens Sheet modal
- [ ] Sheet slides in from right
- [ ] Sheet has title "Table des matières"
- [ ] Sheet lists all headings
- [ ] Clicking link scrolls to section
- [ ] Sheet auto-closes after navigation
- [ ] Overlay covers background
- [ ] Close button (X) works

#### Progress Bar (Mobile)

- [ ] Progress bar visible at top
- [ ] Updates correctly on scroll
- [ ] No interference with TOC button

---

## 3. Accessibility Validation

### 3.1 Keyboard Navigation

- [ ] Tab to TOC links works
- [ ] Enter activates focused link
- [ ] Focus visible on active element
- [ ] Tab order logical
- [ ] Mobile Sheet traps focus

### 3.2 Screen Reader

**Test with VoiceOver (macOS) or NVDA (Windows)**

- [ ] TOC announced as navigation landmark
- [ ] TOC title announced
- [ ] Links announced with text
- [ ] Active section announced (aria-current)
- [ ] Progress bar announced as progressbar
- [ ] Progress value announced
- [ ] Mobile button has accessible name

### 3.3 ARIA Attributes

#### Progress Bar

- [ ] `role="progressbar"` present
- [ ] `aria-valuenow` updates with progress
- [ ] `aria-valuemin="0"` present
- [ ] `aria-valuemax="100"` present
- [ ] `aria-label` descriptive

#### TOC Navigation

- [ ] `<nav>` element used
- [ ] `aria-label` on nav
- [ ] `aria-current="true"` on active link
- [ ] `role="list"` on ul (for Safari)

### 3.4 axe-core

```bash
pnpm test:e2e --grep "accessibility"
```

- [ ] 0 critical violations
- [ ] 0 serious violations
- [ ] Review moderate/minor (fix if reasonable)

### 3.5 Reduced Motion

**Test**: Enable "Reduce motion" in OS settings

- [ ] Progress bar still updates (no animation)
- [ ] TOC scroll still works (instant, not smooth)
- [ ] No janky transitions

---

## 4. Performance Validation

### 4.1 Lighthouse

Run Lighthouse on article page:

```bash
# Chrome DevTools > Lighthouse > Generate report
```

**Targets**:
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90

### 4.2 Core Web Vitals

- [ ] **CLS < 0.1** (no layout shift on load)
- [ ] **LCP** acceptable (no regression)
- [ ] **FID/INP** acceptable (responsive interactions)

### 4.3 Scroll Performance

- [ ] No jank during scroll
- [ ] Progress bar updates smoothly
- [ ] TOC highlighting responsive
- [ ] No dropped frames

### 4.4 Memory

- [ ] No memory leaks (check DevTools Memory)
- [ ] Event listeners cleaned up
- [ ] No growing heap on scroll

---

## 5. Test Validation

### 5.1 Unit Tests

```bash
pnpm test:unit
```

- [ ] All existing tests pass
- [ ] No regressions from integration

### 5.2 E2E Tests

```bash
pnpm test:e2e
```

- [ ] `toc-navigation.e2e.spec.ts` - All pass
- [ ] `reading-progress.e2e.spec.ts` - All pass
- [ ] No flaky tests

### 5.3 Test Coverage

- [ ] TOC desktop tests: 4+ pass
- [ ] TOC mobile tests: 4+ pass
- [ ] Progress tests: 4+ pass
- [ ] Accessibility tests: 2+ pass

---

## 6. Integration Validation

### 6.1 Component Integration

- [ ] `ArticleLayout` renders correctly
- [ ] `ReadingProgressBar` receives correct ref
- [ ] `TableOfContents` receives correct headings
- [ ] `MobileTOC` receives correct headings
- [ ] All i18n translations work

### 6.2 Data Flow

- [ ] Headings extracted server-side (no hydration mismatch)
- [ ] Empty headings array handled (no TOC shown)
- [ ] Long articles (10+ headings) work
- [ ] Short articles (1-2 headings) work
- [ ] Articles without headings work (no TOC)

### 6.3 Edge Cases

- [ ] Article with only h2 headings
- [ ] Article with only h3 headings
- [ ] Article with deeply nested content
- [ ] Very long heading text (truncation?)
- [ ] Special characters in headings
- [ ] Duplicate heading text

---

## 7. Cross-Browser Validation

### 7.1 Chrome (Primary)

- [ ] All features work
- [ ] No console errors

### 7.2 Firefox

- [ ] All features work
- [ ] Smooth scroll works
- [ ] Sheet modal works

### 7.3 Safari

- [ ] All features work
- [ ] Intersection Observer works
- [ ] Sheet modal works

### 7.4 Mobile Safari (iOS)

- [ ] Touch interactions work
- [ ] Sheet swipe-to-close works (if supported)
- [ ] Progress bar visible

---

## 8. Translations Validation

### 8.1 French (fr)

- [ ] "Table des matières" displayed
- [ ] "Ouvrir la table des matières" (button label)
- [ ] "Progression de lecture" (progress label)

### 8.2 English (en)

- [ ] "Table of Contents" displayed
- [ ] "Open table of contents" (button label)
- [ ] "Reading progress" (progress label)

### 8.3 Missing Keys

- [ ] No missing translation warnings in console
- [ ] No fallback text visible

---

## 9. Documentation Validation

### 9.1 Code Documentation

- [ ] `ArticleLayout` has JSDoc
- [ ] Props interfaces documented
- [ ] Usage examples in comments

### 9.2 Phase Documentation

- [ ] INDEX.md complete and accurate
- [ ] IMPLEMENTATION_PLAN.md matches actual implementation
- [ ] COMMIT_CHECKLIST.md all items checked
- [ ] Test files match TESTING.md strategy

---

## 10. Final Checklist

### Before PR

- [ ] All sections above validated
- [ ] No blocking issues remaining
- [ ] Screenshots captured (if needed)
- [ ] PR description prepared

### PR Requirements

- [ ] Title follows convention: `feat(article): integrate TOC and progress bar`
- [ ] Description includes:
  - Summary of changes
  - Test plan
  - Screenshots (desktop + mobile)
- [ ] Linked to Story 4.2

### Sign-off

**Validated by**: _______________

**Date**: _______________

**Notes**:

---

---

## Validation Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Code Quality | [ ] Pass | |
| Functional (Desktop) | [ ] Pass | |
| Functional (Mobile) | [ ] Pass | |
| Accessibility | [ ] Pass | |
| Performance | [ ] Pass | |
| Tests | [ ] Pass | |
| Integration | [ ] Pass | |
| Cross-Browser | [ ] Pass | |
| Translations | [ ] Pass | |
| Documentation | [ ] Pass | |

**Overall Status**: [ ] READY FOR MERGE

---

## Issues Found

| # | Issue | Severity | Status | Resolution |
|---|-------|----------|--------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

**Phase 4 Validation Complete**: [ ]

**Next Steps**:
1. Create PR
2. Request review
3. Address feedback
4. Merge to main
5. Update EPIC_TRACKING.md
