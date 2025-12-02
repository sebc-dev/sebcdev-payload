# Validation Checklist - Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Phase**: 3 of 4
**Status**: [ ] NOT STARTED / [ ] IN PROGRESS / [ ] COMPLETE

---

## Overview

Complete this checklist after implementing all 5 commits to validate Phase 3 is ready for review and merge.

**Validator**: _______________
**Date**: _______________

---

## 1. Build Validation

### 1.1 Next.js Build

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No CSS compilation errors
- [ ] No TypeScript errors
- [ ] No missing import errors

**Build Output**:
```
 Build status: [ ] Success / [ ] Failed
 Build time: _____ seconds
 Errors: _____
```

### 1.2 Development Server

```bash
pnpm dev
```

- [ ] Server starts without errors
- [ ] Hot reload works
- [ ] No console errors

### 1.3 Code Quality

```bash
pnpm lint
```

- [ ] ESLint passes
- [ ] No warnings in changed files

```bash
pnpm exec tsc --noEmit
```

- [ ] TypeScript check passes
- [ ] No type errors

```bash
pnpm knip
```

- [ ] No unused exports
- [ ] No dead code detected

---

## 2. CSS Variables Validation

### 2.1 Variable Existence

Check that all required CSS variables are defined:

```bash
grep -E "^[[:space:]]*--" src/app/globals.css
```

- [ ] `--background` defined
- [ ] `--foreground` defined
- [ ] `--card` defined
- [ ] `--card-foreground` defined
- [ ] `--popover` defined
- [ ] `--popover-foreground` defined
- [ ] `--primary` defined
- [ ] `--primary-foreground` defined
- [ ] `--secondary` defined
- [ ] `--secondary-foreground` defined
- [ ] `--muted` defined
- [ ] `--muted-foreground` defined
- [ ] `--accent` defined
- [ ] `--accent-foreground` defined
- [ ] `--destructive` defined
- [ ] `--destructive-foreground` defined
- [ ] `--border` defined
- [ ] `--input` defined
- [ ] `--ring` defined
- [ ] `--radius` defined

### 2.2 HSL Format Validation

Ensure values do NOT have `hsl()` wrapper:

```bash
# Should return empty (no hsl() wrappers)
grep "hsl(" src/app/globals.css | grep -v "/*"
```

- [ ] No `hsl()` wrappers found
- [ ] Values use raw HSL format (e.g., `222 16% 12%`)

### 2.3 Color Value Verification

| Variable | Expected Value | Actual Value | Match |
|----------|---------------|--------------|-------|
| --background | 222 16% 12% | | [ ] |
| --foreground | 210 40% 98% | | [ ] |
| --primary | 174 72% 40% | | [ ] |
| --muted-foreground | 215 14% 65% | | [ ] |
| --destructive | 0 72% 67% | | [ ] |
| --border | 217 19% 27% | | [ ] |
| --ring | 174 72% 40% | | [ ] |

---

## 3. Font Validation

### 3.1 Font Imports

```bash
grep -r "next/font/google" src/app/
```

- [ ] `Nunito_Sans` imported
- [ ] `JetBrains_Mono` imported

### 3.2 Font Configuration

Check `src/app/[locale]/layout.tsx`:

- [ ] Nunito Sans configured with `variable: '--font-sans'`
- [ ] Nunito Sans has weights: 400, 600, 700
- [ ] JetBrains Mono configured with `variable: '--font-mono'`
- [ ] JetBrains Mono has weights: 400, 500
- [ ] Both fonts use `display: 'swap'`

### 3.3 HTML Application

- [ ] Font variables applied to `<html>` element
- [ ] `font-sans` class on `<body>`

### 3.4 Theme Extension

Check `src/app/globals.css`:

- [ ] `@theme` section exists
- [ ] `--font-sans` defined in theme
- [ ] `--font-mono` defined in theme

---

## 4. Visual Validation

### 4.1 Homepage Colors

Open http://localhost:3000/fr in browser:

| Element | Expected Color | Verified |
|---------|---------------|----------|
| Page background | #1A1D23 (dark anthracite) | [ ] |
| Body text | #F7FAFC (off-white) | [ ] |
| Heading text | #F7FAFC (off-white) | [ ] |
| Footer text | #A0AEC0 (muted gray) | [ ] |
| Primary button | #14B8A6 (teal) | [ ] |

### 4.2 Typography

| Element | Expected Font | Verified |
|---------|--------------|----------|
| Body text | Nunito Sans | [ ] |
| Headings | Nunito Sans | [ ] |
| Code elements | JetBrains Mono | [ ] |

### 4.3 Button Variants

| Variant | Displays Correctly |
|---------|-------------------|
| Default (teal bg) | [ ] |
| Secondary (gray bg) | [ ] |
| Outline (border) | [ ] |
| Ghost (transparent) | [ ] |
| Destructive (red bg) | [ ] |
| Link (underline) | [ ] |

### 4.4 Responsive Design

| Viewport | Layout Correct |
|----------|----------------|
| Mobile (375px) | [ ] |
| Tablet (768px) | [ ] |
| Desktop (1024px+) | [ ] |

---

## 5. Accessibility Validation

### 5.1 Focus Indicators

- [ ] Focus ring visible on Tab navigation
- [ ] Focus ring uses teal color (#14B8A6)
- [ ] All interactive elements focusable

### 5.2 Contrast Ratios

| Text | Background | Ratio | WCAG AA |
|------|------------|-------|---------|
| #F7FAFC (white) | #1A1D23 (bg) | 14.5:1 | [ ] Pass |
| #A0AEC0 (muted) | #1A1D23 (bg) | 6.3:1 | [ ] Pass |
| #14B8A6 (primary) | #1A1D23 (bg) | 5.2:1 | [ ] Pass |

### 5.3 Color Scheme

- [ ] `color-scheme: dark` set on html
- [ ] Browser respects dark mode preference

---

## 6. Migration Validation

### 6.1 Tailwind Migration

Check `src/app/[locale]/(frontend)/page.tsx`:

- [ ] No CSS class names from styles.css (`.home`, `.content`, etc.)
- [ ] All styling uses Tailwind utilities
- [ ] Design tokens used (`bg-background`, `text-foreground`, etc.)
- [ ] Responsive breakpoints applied (`sm:`, `lg:`)

### 6.2 Legacy CSS Cleanup

- [ ] `src/app/[locale]/(frontend)/styles.css` deleted
- [ ] No `import './styles.css'` statements
- [ ] No references to styles.css in codebase

```bash
# Should return empty
grep -r "styles.css" src/
```

---

## 7. Integration Validation

### 7.1 Admin Panel

- [ ] Admin panel (/admin) loads correctly
- [ ] Admin styling unchanged
- [ ] No interference from globals.css

### 7.2 Button Component

- [ ] Button component renders correctly
- [ ] All variants work with new theme
- [ ] Hover/focus states work

### 7.3 i18n

- [ ] Both /fr and /en routes work
- [ ] No styling differences between locales

---

## 8. Git Validation

### 8.1 Commit History

```bash
git log --oneline -5
```

- [ ] 5 commits from Phase 3
- [ ] Commit messages follow convention
- [ ] Each commit is atomic (one responsibility)

**Expected Commits**:
1. [ ] feat(design-system): add CSS variables for Anthracite & Vert Canard theme
2. [ ] feat(typography): configure Nunito Sans as primary font
3. [ ] feat(typography): add JetBrains Mono for code elements
4. [ ] refactor(homepage): migrate from CSS to Tailwind utilities
5. [ ] chore(cleanup): delete legacy styles.css

### 8.2 Files Changed

| File | Status | Verified |
|------|--------|----------|
| src/app/globals.css | Modified | [ ] |
| src/app/[locale]/layout.tsx | Modified | [ ] |
| src/app/[locale]/(frontend)/layout.tsx | Modified | [ ] |
| src/app/[locale]/(frontend)/page.tsx | Modified | [ ] |
| src/app/[locale]/(frontend)/styles.css | Deleted | [ ] |

---

## 9. Documentation Validation

### 9.1 Phase Documentation

- [ ] INDEX.md accurate
- [ ] IMPLEMENTATION_PLAN.md followed
- [ ] COMMIT_CHECKLIST.md used

### 9.2 Epic Tracking

Update `docs/specs/epics/epic_3/EPIC_TRACKING.md`:

- [ ] Phase 3 marked as complete
- [ ] Completion date recorded
- [ ] Any deviations noted

---

## 10. Final Checks

### 10.1 Browser Console

- [ ] No JavaScript errors
- [ ] No CSS errors
- [ ] No 404 errors

### 10.2 Network Tab

- [ ] Fonts load successfully (200 status)
- [ ] No failed requests

### 10.3 Performance

```bash
pnpm build
```

- [ ] CSS bundle reasonable size
- [ ] No unnecessary font weights loaded

---

## Validation Summary

### Pass/Fail Status

| Section | Status |
|---------|--------|
| 1. Build Validation | [ ] Pass / [ ] Fail |
| 2. CSS Variables | [ ] Pass / [ ] Fail |
| 3. Font Validation | [ ] Pass / [ ] Fail |
| 4. Visual Validation | [ ] Pass / [ ] Fail |
| 5. Accessibility | [ ] Pass / [ ] Fail |
| 6. Migration Validation | [ ] Pass / [ ] Fail |
| 7. Integration | [ ] Pass / [ ] Fail |
| 8. Git Validation | [ ] Pass / [ ] Fail |
| 9. Documentation | [ ] Pass / [ ] Fail |
| 10. Final Checks | [ ] Pass / [ ] Fail |

### Overall Phase Status

- [ ] **PHASE 3 COMPLETE** - All checks pass
- [ ] **PHASE 3 INCOMPLETE** - Issues remain

### Issues Found

List any issues discovered:

1. _______________
2. _______________
3. _______________

### Remediation Required

- [ ] No remediation needed
- [ ] Minor fixes required (list below)
- [ ] Major issues - phase incomplete

**Fixes Needed**:
1. _______________
2. _______________

---

## Sign-Off

**Validation Completed By**: _______________
**Date**: _______________
**Phase Status**: [ ] APPROVED / [ ] NEEDS WORK

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Next Steps

After validation:

1. [ ] Create Pull Request
2. [ ] Request code review
3. [ ] Address review feedback
4. [ ] Merge to main
5. [ ] Update EPIC_TRACKING.md
6. [ ] Proceed to Phase 4
