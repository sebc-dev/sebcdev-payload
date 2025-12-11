# Validation Checklist - Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Phase**: 1 of 3
**Validation Date**: _____________

---

## Overview

This checklist validates that Phase 1 has been completed successfully. Run through all items before marking the phase as complete.

---

## Pre-Validation Requirements

- [ ] All 3 commits are complete
- [ ] No uncommitted changes: `git status` shows clean
- [ ] On correct branch: `feature/story-4.3-phase-1`

---

## Section 1: Build & Compilation

### 1.1 TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] **PASS**: No TypeScript errors
- [ ] **PASS**: No TypeScript warnings related to Live Preview

### 1.2 ESLint

```bash
pnpm lint
```

- [ ] **PASS**: No ESLint errors
- [ ] **PASS**: No new ESLint warnings introduced

### 1.3 Build Success

```bash
pnpm build
```

- [ ] **PASS**: Build completes without errors
- [ ] **PASS**: Build output shows all pages generated

---

## Section 2: Package Installation

### 2.1 Package Presence

```bash
pnpm list @payloadcms/live-preview-react
```

- [ ] **PASS**: Package is listed in output
- [ ] **PASS**: Version is 3.x.x (compatible with Payload 3.65.x)

### 2.2 Dependency Health

```bash
pnpm audit
```

- [ ] **PASS**: No high-severity vulnerabilities
- [ ] **PASS**: No critical-severity vulnerabilities

### 2.3 Package Files

```bash
ls -la node_modules/@payloadcms/live-preview-react
```

- [ ] **PASS**: Directory exists
- [ ] **PASS**: Contains dist folder and package.json

---

## Section 3: Collection Configuration

### 3.1 Config Syntax

Open `src/collections/Articles.ts` and verify:

- [ ] **PASS**: `livePreview` object exists in `admin` section
- [ ] **PASS**: `url` function is defined
- [ ] **PASS**: `breakpoints` array is defined with 3 items

### 3.2 URL Function

Verify the URL function logic:

```typescript
url: ({ data, locale }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const previewLocale = locale || 'fr'
  const slug = data?.slug || ''
  if (!slug) return ''
  return `${baseUrl}/${previewLocale}/articles/${slug}`
}
```

- [ ] **PASS**: Uses environment variable with fallback
- [ ] **PASS**: Handles missing locale with fallback to 'fr'
- [ ] **PASS**: Returns empty string when slug is missing
- [ ] **PASS**: URL format is `/{locale}/articles/{slug}`

### 3.3 Breakpoints

Verify breakpoints configuration:

| Breakpoint | Expected Width | Expected Height |
|------------|----------------|-----------------|
| Mobile | 375 | 667 |
| Tablet | 768 | 1024 |
| Desktop | 1440 | 900 |

- [ ] **PASS**: Mobile breakpoint correct
- [ ] **PASS**: Tablet breakpoint correct
- [ ] **PASS**: Desktop breakpoint correct

---

## Section 4: Environment Variables

### 4.1 Documentation

```bash
grep "NEXT_PUBLIC_SERVER_URL" .env.example
```

- [ ] **PASS**: Variable documented in `.env.example`
- [ ] **PASS**: Includes descriptive comment

### 4.2 Local Configuration

```bash
grep "NEXT_PUBLIC_SERVER_URL" .env
```

- [ ] **PASS**: Variable set in `.env`
- [ ] **PASS**: Value is `http://localhost:3000` for dev

### 4.3 Git Status

```bash
git status | grep ".env$"
```

- [ ] **PASS**: `.env` is NOT staged/committed (in .gitignore)
- [ ] **PASS**: Only `.env.example` is tracked

---

## Section 5: Admin Panel Verification

### 5.1 Server Startup

```bash
pnpm dev
```

- [ ] **PASS**: Server starts on port 3000
- [ ] **PASS**: No errors in console

### 5.2 Admin Access

Navigate to: `http://localhost:3000/admin`

- [ ] **PASS**: Admin panel loads
- [ ] **PASS**: Login works (if required)
- [ ] **PASS**: Articles collection is accessible

### 5.3 Live Preview Panel

1. Go to `/admin/collections/articles`
2. Click on an article with a slug

- [ ] **PASS**: Edit page loads
- [ ] **PASS**: Split view layout visible
- [ ] **PASS**: Preview panel on right side
- [ ] **PASS**: Form fields on left side

### 5.4 Preview URL

In browser DevTools, inspect the preview iframe:

- [ ] **PASS**: iframe element exists
- [ ] **PASS**: `src` attribute has correct format
- [ ] **PASS**: URL includes locale (e.g., `/fr/`)
- [ ] **PASS**: URL includes article slug

### 5.5 Breakpoint Selector

In the preview panel toolbar:

- [ ] **PASS**: Breakpoint buttons visible
- [ ] **PASS**: "Mobile" button works
- [ ] **PASS**: "Tablet" button works
- [ ] **PASS**: "Desktop" button works
- [ ] **PASS**: Preview iframe resizes accordingly

---

## Section 6: Regression Verification

### 6.1 Existing Tests

```bash
pnpm test:unit
```

- [ ] **PASS**: All unit tests pass
- [ ] **PASS**: No test regressions

### 6.2 Article CRUD

In admin panel:

- [ ] **PASS**: Can create new article
- [ ] **PASS**: Can edit existing article
- [ ] **PASS**: Can delete article
- [ ] **PASS**: Can save article

### 6.3 Article Fields

- [ ] **PASS**: Title field works
- [ ] **PASS**: Content field works
- [ ] **PASS**: Slug field works
- [ ] **PASS**: Status field works
- [ ] **PASS**: Other fields unchanged

### 6.4 Frontend (if applicable)

Navigate to an article page (e.g., `/fr/articles/test-article`):

- [ ] **PASS**: Article page renders
- [ ] **PASS**: No visual regressions
- [ ] **PASS**: No console errors

---

## Section 7: Git History

### 7.1 Commit History

```bash
git log --oneline -3
```

Expected (most recent first):
1. `:wrench: chore(env): add NEXT_PUBLIC_SERVER_URL for Live Preview`
2. `:sparkles: feat(articles): add Live Preview configuration`
3. `:package: feat(deps): install @payloadcms/live-preview-react`

- [ ] **PASS**: 3 commits present
- [ ] **PASS**: Gitmoji format correct
- [ ] **PASS**: Commit messages descriptive

### 7.2 Commit Content

```bash
git show --stat HEAD~2..HEAD
```

- [ ] **PASS**: Commit 1 changes: `package.json`, `pnpm-lock.yaml`
- [ ] **PASS**: Commit 2 changes: `src/collections/Articles.ts`
- [ ] **PASS**: Commit 3 changes: `.env.example`

---

## Section 8: Acceptance Criteria

### Story 4.3 Criteria Covered

| ID | Criterion | Status |
|----|-----------|--------|
| **TA1** | Installation du package `@payloadcms/live-preview-react` | [ ] PASS |
| **TA2** | Configuration de `livePreview.url` dans la collection Articles | [ ] PASS |

---

## Validation Summary

### Results

| Section | Pass | Fail | Total |
|---------|------|------|-------|
| Build & Compilation | | | 4 |
| Package Installation | | | 5 |
| Collection Configuration | | | 9 |
| Environment Variables | | | 5 |
| Admin Panel Verification | | | 11 |
| Regression Verification | | | 8 |
| Git History | | | 5 |
| Acceptance Criteria | | | 2 |
| **TOTAL** | | | **49** |

### Phase Status

- [ ] **PHASE 1 COMPLETE** - All items pass

---

## Sign-Off

### Validated By

- **Name**: _________________________
- **Date**: _________________________
- **Notes**: _________________________

### Issues Found

| Issue | Severity | Resolution |
|-------|----------|------------|
| | | |

### Next Steps

After validation passes:

1. [ ] Push branch to remote: `git push origin feature/story-4.3-phase-1`
2. [ ] Update EPIC_TRACKING.md: Story 4.3 Progress → `1/3`
3. [ ] Proceed to Phase 2: RefreshRouteOnSave Component

---

**Checklist Created**: 2025-12-11
**Checklist Version**: 1.0
