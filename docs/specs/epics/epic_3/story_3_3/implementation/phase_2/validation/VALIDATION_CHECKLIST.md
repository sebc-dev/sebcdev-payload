# Phase 2: Validation Checklist - Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 2 of 5
**Status**: [ ] NOT VALIDATED

Complete this checklist before marking Phase 2 as complete.

---

## Pre-Validation Requirements

Before validating, ensure:

- [ ] All 5 commits are completed
- [ ] Working tree is clean: `git status`
- [ ] All changes are committed

---

## 1. Build & Quality Gates

### 1.1 Build Verification

```bash
pnpm build
```

| Check | Status | Notes |
|-------|--------|-------|
| Build succeeds | [ ] Pass / [ ] Fail | |
| No errors in output | [ ] Pass / [ ] Fail | |
| Build time reasonable | [ ] Pass / [ ] Fail | < 3 minutes |

### 1.2 TypeScript Verification

```bash
pnpm exec tsc --noEmit
```

| Check | Status | Notes |
|-------|--------|-------|
| No type errors | [ ] Pass / [ ] Fail | |
| All imports resolve | [ ] Pass / [ ] Fail | |

### 1.3 Lint Verification

```bash
pnpm lint
```

| Check | Status | Notes |
|-------|--------|-------|
| No lint errors | [ ] Pass / [ ] Fail | |
| No new warnings | [ ] Pass / [ ] Fail | Warnings acceptable |

---

## 2. File Structure Verification

### 2.1 Components Created

```bash
ls -la src/components/layout/
```

| File | Status | Lines (approx) |
|------|--------|----------------|
| `Logo.tsx` | [ ] Exists | ~30 lines |
| `Navigation.tsx` | [ ] Exists | ~100 lines |
| `Header.tsx` | [ ] Exists | ~40 lines |
| `index.ts` | [ ] Exists | ~10 lines |

### 2.2 i18n Keys Added

```bash
cat messages/fr.json | jq '.navigation'
cat messages/en.json | jq '.navigation'
```

| Key | FR | EN |
|-----|----|----|
| `navigation.articles` | [ ] Present | [ ] Present |
| `navigation.categories` | [ ] Present | [ ] Present |
| `navigation.levels` | [ ] Present | [ ] Present |
| `navigation.allCategories` | [ ] Present | [ ] Present |
| `navigation.allLevels` | [ ] Present | [ ] Present |
| `navigation.category.ai` | [ ] Present | [ ] Present |
| `navigation.category.ux` | [ ] Present | [ ] Present |
| `navigation.category.engineering` | [ ] Present | [ ] Present |
| `navigation.level.beginner` | [ ] Present | [ ] Present |
| `navigation.level.intermediate` | [ ] Present | [ ] Present |
| `navigation.level.advanced` | [ ] Present | [ ] Present |

### 2.3 Layout Modified

```bash
grep "Header" src/app/[locale]/\(frontend\)/layout.tsx
```

| Check | Status |
|-------|--------|
| Header imported | [ ] |
| Header rendered | [ ] |

---

## 3. Component Validation

### 3.1 Logo Component

```bash
head -20 src/components/layout/Logo.tsx
```

| Check | Status |
|-------|--------|
| No `"use client"` directive (Server Component) | [ ] |
| Imports `Link` from `@/i18n/routing` | [ ] |
| Uses `cn()` utility | [ ] |
| Exports `Logo` function | [ ] |
| Links to "/" | [ ] |

### 3.2 Navigation Component

```bash
head -30 src/components/layout/Navigation.tsx
```

| Check | Status |
|-------|--------|
| Has `"use client"` directive | [ ] |
| Imports from `next-intl` | [ ] |
| Imports from `@/i18n/routing` | [ ] |
| Imports `DropdownMenu` from Phase 1 | [ ] |
| Uses `useTranslations` hook | [ ] |
| Uses `usePathname` hook | [ ] |
| Has `hidden lg:flex` for responsive | [ ] |

### 3.3 Header Component

```bash
head -30 src/components/layout/Header.tsx
```

| Check | Status |
|-------|--------|
| No `"use client"` directive (Server Component) | [ ] |
| Imports `Logo` | [ ] |
| Imports `Navigation` | [ ] |
| Uses semantic `<header>` element | [ ] |
| Has `sticky top-0` classes | [ ] |
| Has `z-50` for layering | [ ] |
| Uses `container` or max-width | [ ] |

### 3.4 Barrel Export

```bash
cat src/components/layout/index.ts
```

| Check | Status |
|-------|--------|
| Exports `Header` | [ ] |
| Exports `Logo` | [ ] |
| Exports `Navigation` | [ ] |

---

## 4. Functional Testing

### 4.1 Header Visibility

Start dev server:

```bash
pnpm dev
```

| Page | Header Visible | Check |
|------|----------------|-------|
| `http://localhost:3000/fr` | [ ] Yes | |
| `http://localhost:3000/en` | [ ] Yes | |

### 4.2 Logo Functionality

| Test | Expected | Status |
|------|----------|--------|
| Logo displays "sebc.dev" | [ ] Pass | |
| Click logo on `/fr` | Returns to `/fr` | [ ] Pass |
| Click logo on `/en` | Returns to `/en` | [ ] Pass |
| Logo has hover effect | Color changes | [ ] Pass |

### 4.3 Navigation Links

| Test | Expected | Status |
|------|----------|--------|
| "Articles" visible | [ ] Yes | |
| Click "Articles" on `/fr` | Navigate to `/fr/articles` | [ ] Pass |
| Click "Articles" on `/en` | Navigate to `/en/articles` | [ ] Pass |

### 4.4 Categories Dropdown

| Test | Expected | Status |
|------|----------|--------|
| "Catégories" trigger visible | [ ] Yes | |
| Click to open dropdown | Dropdown appears | [ ] Pass |
| "Toutes les catégories" item | [ ] Present | |
| AI category item | [ ] Present | |
| UX category item | [ ] Present | |
| Engineering category item | [ ] Present | |
| Click AI | Navigate to `/articles?category=ai` | [ ] Pass |
| Escape closes dropdown | [ ] Pass | |
| Click outside closes | [ ] Pass | |

### 4.5 Levels Dropdown

| Test | Expected | Status |
|------|----------|--------|
| "Niveaux" trigger visible | [ ] Yes | |
| Click to open dropdown | Dropdown appears | [ ] Pass |
| "Tous les niveaux" item | [ ] Present | |
| Beginner item | [ ] Present | |
| Intermediate item | [ ] Present | |
| Advanced item | [ ] Present | |
| Click Beginner | Navigate to `/articles?complexity=beginner` | [ ] Pass |

### 4.6 Sticky Behavior

| Test | Expected | Status |
|------|----------|--------|
| Scroll down page | Header stays at top | [ ] Pass |
| Header above content | z-index correct | [ ] Pass |
| Background visible | Not transparent | [ ] Pass |

---

## 5. i18n Validation

### 5.1 French Translations

Visit `http://localhost:3000/fr`:

| Element | Expected Text | Status |
|---------|--------------|--------|
| Articles link | "Articles" | [ ] Correct |
| Categories trigger | "Catégories" | [ ] Correct |
| Levels trigger | "Niveaux" | [ ] Correct |
| All categories | "Toutes les catégories" | [ ] Correct |
| AI category | "Intelligence Artificielle" | [ ] Correct |

### 5.2 English Translations

Visit `http://localhost:3000/en`:

| Element | Expected Text | Status |
|---------|--------------|--------|
| Articles link | "Articles" | [ ] Correct |
| Categories trigger | "Categories" | [ ] Correct |
| Levels trigger | "Levels" | [ ] Correct |
| All categories | "All categories" | [ ] Correct |
| AI category | "Artificial Intelligence" | [ ] Correct |

---

## 6. Visual Validation

### 6.1 Desktop Layout (≥1024px)

| Element | Expected | Status |
|---------|----------|--------|
| Logo at left | [ ] Correct | |
| Navigation at right | [ ] Correct | |
| Proper spacing | [ ] Correct | |
| Container centered | [ ] Correct | |

### 6.2 Styling

| Element | Expected | Status |
|---------|----------|--------|
| Header background dark | [ ] Correct | |
| Header has border-bottom | [ ] Correct | |
| Logo white/light color | [ ] Correct | |
| Nav links muted color | [ ] Correct | |
| Hover states work | [ ] Correct | |
| Dropdown styled correctly | [ ] Correct | |

### 6.3 Mobile Hidden (< 1024px)

Set viewport to 375px width:

| Element | Expected | Status |
|---------|----------|--------|
| Logo visible | [ ] Yes | |
| Navigation hidden | [ ] Yes | |
| Dropdowns hidden | [ ] Yes | |

---

## 7. Keyboard Navigation

| Test | Expected | Status |
|------|----------|--------|
| Tab to logo | Focus visible | [ ] Pass |
| Tab to Articles | Focus visible | [ ] Pass |
| Tab to Catégories | Focus visible | [ ] Pass |
| Enter opens dropdown | Dropdown opens | [ ] Pass |
| Arrow down | Navigate items | [ ] Pass |
| Enter selects | Navigation occurs | [ ] Pass |
| Escape closes | Dropdown closes | [ ] Pass |

---

## 8. Regression Testing

### 8.1 Admin Panel

```bash
# Navigate to http://localhost:3000/admin
```

| Check | Status |
|-------|--------|
| Admin login page loads | [ ] Pass |
| No console errors | [ ] Pass |
| Admin panel functional | [ ] Pass |

### 8.2 Phase 1 Components

| Check | Status |
|-------|--------|
| DropdownMenu still works | [ ] Pass |
| Sheet still works | [ ] Pass |
| Button still works | [ ] Pass |

### 8.3 Console Check

| Check | Status |
|-------|--------|
| No JavaScript errors | [ ] Pass |
| No hydration warnings | [ ] Pass |
| No 404 errors | [ ] Pass |

---

## 9. Git History

```bash
git log --oneline -6
```

| Check | Status |
|-------|--------|
| 5 commits for this phase | [ ] |
| Commits follow convention | [ ] |
| No unrelated changes | [ ] |

### Expected Commits (most recent first)

```
feat(layout): integrate Header into frontend layout
feat(layout): add Header component with Logo and Navigation
feat(layout): add Navigation component with dropdowns
feat(i18n): add navigation translation keys
feat(layout): add Logo component
```

---

## 10. Phase Completion Criteria

### 10.1 Success Criteria (from PHASES_PLAN.md)

| Criterion | Status |
|-----------|--------|
| Header visible on all frontend pages | [ ] |
| Logo links to `/[locale]/` | [ ] |
| "Articles" link navigates to `/[locale]/articles` | [ ] |
| Catégories dropdown shows category options | [ ] |
| Niveaux dropdown shows level options | [ ] |
| Header is sticky on scroll | [ ] |
| Styling matches design spec | [ ] |
| Build succeeds | [ ] |

### 10.2 Key Deliverables (from PHASES_PLAN.md)

| Deliverable | Status |
|-------------|--------|
| `src/components/layout/Header.tsx` created | [ ] |
| `src/components/layout/Navigation.tsx` created | [ ] |
| `src/components/layout/index.ts` barrel export | [ ] |
| Navigation i18n keys in `messages/fr.json` and `messages/en.json` | [ ] |
| Header integrated in `src/app/[locale]/(frontend)/layout.tsx` | [ ] |
| Header is sticky with correct styling | [ ] |
| Navigation links functional | [ ] |

---

## 11. Sign-Off

### Validation Summary

| Category | Status |
|----------|--------|
| Build & Quality | [ ] Pass |
| File Structure | [ ] Pass |
| Component Validation | [ ] Pass |
| Functional Testing | [ ] Pass |
| i18n Validation | [ ] Pass |
| Visual Validation | [ ] Pass |
| Keyboard Navigation | [ ] Pass |
| Regression Testing | [ ] Pass |

### Final Checklist

- [ ] All required checks pass
- [ ] No critical issues found
- [ ] Phase ready for review/merge

### Validator Information

- **Validated by**: ________________________
- **Date**: ________________________
- **Notes**: ________________________

---

## 12. Next Steps

After validation:

1. [ ] Mark Phase 2 as complete in PHASES_PLAN.md:
   ```markdown
   - [x] Phase 2: Header & Desktop Navigation - ✅ Completed
   ```

2. [ ] Update EPIC_TRACKING.md if applicable

3. [ ] Proceed to Phase 3: Footer Component
   - Location: `implementation/phase_3/`
   - Completes the layout shell

---

## 13. Rollback Instructions

If validation fails and rollback is needed:

```bash
# Identify commits to revert
git log --oneline -6

# Revert Phase 2 commits (adjust count as needed)
git revert HEAD~5..HEAD --no-commit
git commit -m "revert: Phase 2 Header & Desktop Navigation"

# Or hard reset (destructive - use with caution)
git reset --hard HEAD~5

# Remove created components
rm -rf src/components/layout/

# Revert i18n changes (restore from backup or previous commit)
git checkout HEAD~5 -- messages/fr.json messages/en.json

# Revert layout changes
git checkout HEAD~5 -- src/app/[locale]/\(frontend\)/layout.tsx

# Verify build still works
pnpm build
```

---

## Validation History

| Date | Validator | Result | Notes |
|------|-----------|--------|-------|
| | | | |

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
