# Phase 1 - Final Validation Checklist

**Phase**: Article Page Route & Basic Layout
**Status**: 📋 PENDING VALIDATION

Complete this checklist after all 5 commits are done.

---

## Pre-Validation

Before running validation:

- [ ] All 5 commits completed
- [ ] No uncommitted changes (`git status` clean)
- [ ] On correct branch

---

## 1. Code Quality Gates

### TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] **PASS**: No TypeScript errors

### Linting

```bash
pnpm lint
```

- [ ] **PASS**: No ESLint errors
- [ ] **PASS**: No Prettier errors

### Unit Tests

```bash
pnpm test:unit
```

- [ ] **PASS**: All unit tests pass
- [ ] Coverage: `tests/unit/lib/payload/articles.spec.ts` at 100%

### Build

```bash
pnpm build
```

- [ ] **PASS**: Build completes successfully
- [ ] No build warnings (or only expected ones)

---

## 2. Files Created Verification

### New Files

Check all files exist:

```bash
ls -la src/lib/payload/articles.ts
ls -la src/components/articles/ArticleHeader.tsx
ls -la src/components/articles/ArticleFooter.tsx
ls -la src/app/[locale]/(frontend)/articles/[slug]/page.tsx
ls -la src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx
ls -la tests/unit/lib/payload/articles.spec.ts
```

- [ ] `src/lib/payload/articles.ts` exists
- [ ] `src/components/articles/ArticleHeader.tsx` exists
- [ ] `src/components/articles/ArticleFooter.tsx` exists
- [ ] `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` exists
- [ ] `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx` exists
- [ ] `tests/unit/lib/payload/articles.spec.ts` exists

### Modified Files

```bash
git diff HEAD~5 HEAD --name-only
```

- [ ] `src/components/articles/index.ts` modified (exports added)
- [ ] `messages/fr.json` modified (translations added)
- [ ] `messages/en.json` modified (translations added)

---

## 3. Functional Testing

### Start Development Server

```bash
pnpm dev
```

- [ ] Server starts without errors
- [ ] No console errors on startup

### Article Page (French)

Navigate to: `http://localhost:3000/fr/articles/[valid-slug]`

- [ ] Page loads without errors
- [ ] **Header** displays:
  - [ ] Category badge (clickable)
  - [ ] Article title (h1)
  - [ ] Complexity badge
  - [ ] Reading time (e.g., "5 min de lecture")
  - [ ] Publication date (relative format)
- [ ] **Content** placeholder visible
- [ ] **Footer** displays:
  - [ ] "Mots-clés" label
  - [ ] Tag pills (clickable)

### Article Page (English)

Navigate to: `http://localhost:3000/en/articles/[valid-slug]`

- [ ] Page loads without errors
- [ ] Reading time in English ("5 min read")
- [ ] Tags label in English ("Tags")

### 404 Page (French)

Navigate to: `http://localhost:3000/fr/articles/non-existent-article`

- [ ] 404 page displays (not blank/error)
- [ ] Icon visible (FileQuestion)
- [ ] Title: "Article non trouvé"
- [ ] Description text visible
- [ ] "Retour à l'accueil" button works

### 404 Page (English)

Navigate to: `http://localhost:3000/en/articles/non-existent-article`

- [ ] Title: "Article not found"
- [ ] "Back to home" button text

---

## 4. Responsive Design

Test at these breakpoints:

### Mobile (375px)

- [ ] Header renders correctly
- [ ] Title readable (not cut off)
- [ ] Tags wrap properly
- [ ] No horizontal scrolling

### Tablet (768px)

- [ ] Layout adapts appropriately
- [ ] Typography scales

### Desktop (1280px)

- [ ] Content centered with `max-w-prose`
- [ ] Comfortable reading width

---

## 5. Accessibility Quick Check

### Keyboard Navigation

- [ ] Can tab through interactive elements
- [ ] Category badge focusable
- [ ] Tag pills focusable
- [ ] Back to home button (on 404) focusable

### Screen Reader (Optional)

- [ ] h1 announces article title
- [ ] Landmarks present (header, footer)

### Visual

- [ ] Sufficient color contrast
- [ ] Focus indicators visible

---

## 6. Performance Quick Check

### Network

Open DevTools → Network tab:

- [ ] No failed requests
- [ ] Page loads in < 3 seconds (local)

### Console

Open DevTools → Console:

- [ ] No JavaScript errors
- [ ] No hydration mismatches
- [ ] No React warnings

---

## 7. Git History Verification

### Commit Count

```bash
git log --oneline -5
```

- [ ] 5 commits visible for Phase 1

### Commit Messages

- [ ] All commits have gitmoji prefix (✨)
- [ ] All commits follow conventional format
- [ ] All commits have co-author footer

### Commit Order

```
✨ feat(articles): add article translations and 404 page
✨ feat(articles): add article page route with data fetching
✨ feat(articles): add ArticleFooter component with tags display
✨ feat(articles): add ArticleHeader component with metadata display
✨ feat(articles): add article fetch utilities for slug lookup
```

- [ ] Commits are in correct order (oldest at bottom)

---

## 8. Documentation Update

### EPIC_TRACKING.md

Update `docs/specs/epics/epic_4/EPIC_TRACKING.md`:

- [ ] Story 4.1 Progress: "1/5" (Phase 1 complete)
- [ ] Add status update entry

### PHASES_PLAN.md

Update `docs/specs/epics/epic_4/story_4_1/implementation/PHASES_PLAN.md`:

- [ ] Phase 1 checkbox marked complete
- [ ] Status: ✅ COMPLETED

---

## Validation Summary

### All Gates Pass?

| Gate | Status |
|------|--------|
| TypeScript | [ ] PASS |
| Linting | [ ] PASS |
| Unit Tests | [ ] PASS |
| Build | [ ] PASS |
| Manual Testing (FR) | [ ] PASS |
| Manual Testing (EN) | [ ] PASS |
| 404 Testing | [ ] PASS |
| Responsive | [ ] PASS |
| Accessibility | [ ] PASS |
| Git History | [ ] PASS |

### Phase 1 Complete?

- [ ] **YES** - All validation checks pass

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | | | [ ] |
| Reviewer | | | [ ] |

---

## Next Steps

After validation passes:

1. **Update tracking documents**
   - EPIC_TRACKING.md: Progress "1/5"
   - PHASES_PLAN.md: Phase 1 ✅ COMPLETED

2. **Push to remote**
   ```bash
   git push origin [branch-name]
   ```

3. **Proceed to Phase 2**
   - Generate docs: `/generate-phase-doc Epic 4 Story 4.1 Phase 2`
   - Focus: Lexical Content Rendering

---

## Issues Found During Validation

Document any issues discovered:

| Issue | Severity | Resolution |
|-------|----------|------------|
| (none yet) | | |

---

**Validation Checklist Generated**: 2025-12-09
**Phase**: 1 of 5
**Status**: 📋 PENDING VALIDATION
