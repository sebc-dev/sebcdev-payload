# Phase 3 - Validation Checklist

Final validation checklist for Phase 3: App Directory Restructure.

---

## Phase Summary

| Metric | Target | Actual |
|--------|--------|--------|
| Total Commits | 5 | |
| Files Created | 4 | |
| Files Deleted | 3 | |
| Implementation Time | 2-3h | |
| Build Success | Required | |

---

## Pre-Validation Checks

### Git State

- [ ] All 5 commits are pushed
- [ ] No uncommitted changes
- [ ] Branch is up to date with remote

```bash
git status
# Expected: nothing to commit, working tree clean

git log --oneline -5
# Should show 5 Phase 3 commits
```

### Commit Verification

- [ ] Commit 1: `feat(i18n): add [locale] root layout with NextIntlClientProvider`
- [ ] Commit 2: `feat(i18n): add [locale]/(frontend) layout`
- [ ] Commit 3: `feat(i18n): migrate homepage to [locale]/(frontend)`
- [ ] Commit 4: `chore(i18n): move styles.css to [locale]/(frontend)`
- [ ] Commit 5: `chore(i18n): remove old (frontend) directory`

---

## Directory Structure Validation

### Expected Structure

```
src/app/
├── [locale]/
│   ├── layout.tsx              # Root locale layout
│   └── (frontend)/
│       ├── layout.tsx          # Frontend layout
│       ├── page.tsx            # Homepage
│       └── styles.css          # Styles
└── (payload)/                  # Unchanged
    ├── admin/
    ├── api/
    └── layout.tsx
```

### Verification Commands

```bash
# Check [locale] structure
ls -la src/app/[locale]/
```

- [ ] `layout.tsx` exists
- [ ] `(frontend)/` directory exists

```bash
# Check (frontend) structure
ls -la src/app/[locale]/\(frontend\)/
```

- [ ] `layout.tsx` exists
- [ ] `page.tsx` exists
- [ ] `styles.css` exists

```bash
# Check old directory is removed
ls -la src/app/\(frontend\)/
```

- [ ] Directory does not exist (should error)

```bash
# Check (payload) unchanged
ls -la src/app/\(payload\)/
```

- [ ] `admin/` exists
- [ ] `api/` exists
- [ ] `layout.tsx` exists

---

## Code Quality Validation

### TypeScript

```bash
pnpm exec tsc --noEmit
```

- [ ] No TypeScript errors
- [ ] All types resolve correctly

### Linting

```bash
pnpm lint
```

- [ ] No ESLint errors
- [ ] No warnings (or only acceptable ones)

### Build

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] Static pages generated for `/fr` and `/en`
- [ ] No build warnings about i18n routes

---

## Functional Validation

### Route Testing

Start dev server: `pnpm dev`

| Route | Expected | Verified |
|-------|----------|----------|
| `http://localhost:3000/` | Redirects to `/fr` or `/en` | [ ] |
| `http://localhost:3000/fr` | French homepage | [ ] |
| `http://localhost:3000/en` | English homepage | [ ] |
| `http://localhost:3000/admin` | Payload admin panel | [ ] |
| `http://localhost:3000/api/users` | API response (200 or 401) | [ ] |
| `http://localhost:3000/de` | 404 Not Found | [ ] |

### HTML Validation

Using browser DevTools:

| Check | Expected | Verified |
|-------|----------|----------|
| `/fr` → `<html lang>` | `lang="fr"` | [ ] |
| `/en` → `<html lang>` | `lang="en"` | [ ] |
| `/fr` → `<main>` exists | Yes | [ ] |
| `/en` → `<main>` exists | Yes | [ ] |

### Cookie Validation

Using browser DevTools → Application → Cookies:

| Check | Expected | Verified |
|-------|----------|----------|
| `NEXT_LOCALE` cookie exists | After visiting any locale | [ ] |
| Cookie value | `fr` or `en` | [ ] |
| Cookie maxAge | ~1 year | [ ] |

### Style Validation

| Check | Expected | Verified |
|-------|----------|----------|
| Styles load on `/fr` | Yes | [ ] |
| Styles load on `/en` | Yes | [ ] |
| Layout matches original | Yes | [ ] |
| No CSS errors in console | Yes | [ ] |

---

## Security Validation

- [ ] No sensitive data in client bundle
- [ ] Locale parameter is validated before use
- [ ] Invalid locales return 404, not error
- [ ] Admin routes not affected by i18n middleware

---

## Performance Validation

### Static Generation

```bash
pnpm build
# Check output for static pages
```

- [ ] `/fr` page is statically generated
- [ ] `/en` page is statically generated
- [ ] `generateStaticParams` is working

### Bundle Size

```bash
pnpm build
# Check bundle size in output
```

- [ ] Bundle size increase is reasonable (<50KB)
- [ ] No unexpected large dependencies

---

## Acceptance Criteria Validation

From Story 3.1 requirements:

### AC-1: URL Routing

- [ ] URLs `/fr/*` and `/en/*` are functional
- [ ] Page content displays (in correct structure)

### AC-2: Language Detection (Middleware - Phase 2)

- [ ] Root URL `/` redirects based on browser language
- [ ] `NEXT_LOCALE` cookie is set

### AC-3: Language Persistence (Middleware - Phase 2)

- [ ] Returning visitors use cookie preference

### AC-4: HTML Lang Attribute

- [ ] `<html lang="fr">` on French pages
- [ ] `<html lang="en">` on English pages

---

## Regression Testing

### Admin Panel

- [ ] `/admin` accessible
- [ ] Login works
- [ ] Dashboard loads
- [ ] Collections accessible
- [ ] Media uploads work (if applicable)

### API Routes

- [ ] `/api/users` responds
- [ ] `/api/media` responds
- [ ] GraphQL endpoint works (if enabled)

---

## Documentation Check

- [ ] Phase 3 INDEX.md status updated to "COMPLETED"
- [ ] EPIC_TRACKING.md updated with Phase 3 completion
- [ ] Any issues documented

---

## Sign-Off

### Developer Checklist

- [ ] All 5 commits implemented
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Build succeeds
- [ ] All routes tested
- [ ] Admin panel verified
- [ ] Documentation updated

**Developer Sign-Off**: _________________ Date: _________

### Reviewer Checklist

- [ ] Code reviewed per guides/REVIEW.md
- [ ] All review criteria met
- [ ] No blocking issues

**Reviewer Sign-Off**: _________________ Date: _________

### Tech Lead Checklist

- [ ] Validation checklist complete
- [ ] Ready for Phase 4

**Tech Lead Sign-Off**: _________________ Date: _________

---

## Phase 3 Status

- [ ] **COMPLETED** - All validations pass, ready for Phase 4
- [ ] **BLOCKED** - Issues preventing completion (list below)
- [ ] **IN PROGRESS** - Still implementing

### Issues (if any)

| Issue | Severity | Status |
|-------|----------|--------|
| | | |

---

## Next Steps

1. Update INDEX.md status to "COMPLETED"
2. Update EPIC_TRACKING.md with Phase 3 completion
3. Proceed to Phase 4: Validation & E2E Tests

```bash
# Generate Phase 4 documentation
/generate-phase-doc Epic 3 Story 3.1 Phase 4
```
