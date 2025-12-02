# Validation Checklist - Phase 1: Tailwind CSS 4 Foundation

**Phase**: 1 of 4
**Purpose**: Final validation before marking phase complete

---

## Instructions

Complete this checklist after all commits are implemented. Every item must pass before proceeding to Phase 2.

**Legend**:
- ⬜ Not checked
- ✅ Passed
- ❌ Failed (requires fix)
- ⏭️ Skipped (with justification)

---

## 1. Implementation Completeness

### 1.1 Files Created

| File | Status | Notes |
|------|--------|-------|
| `postcss.config.mjs` | ⬜ | PostCSS configuration |
| `src/app/globals.css` | ⬜ | Tailwind imports + base |

### 1.2 Files Modified

| File | Status | Notes |
|------|--------|-------|
| `package.json` | ⬜ | Dependencies added |
| `pnpm-lock.yaml` | ⬜ | Lock file updated |
| `src/app/[locale]/layout.tsx` | ⬜ | globals.css import |

### 1.3 Commits Created

| Commit | Status | Notes |
|--------|--------|-------|
| Install Tailwind CSS 4 | ⬜ | Deps + PostCSS config |
| Create globals.css | ⬜ | CSS file |
| Integrate in layout | ⬜ | Import in layout |

---

## 2. Dependency Verification

### 2.1 Package Installation

```bash
# Run these commands and verify output
pnpm list tailwindcss
# Expected: tailwindcss@4.x.x

pnpm list @tailwindcss/postcss
# Expected: @tailwindcss/postcss@4.x.x
```

| Check | Status |
|-------|--------|
| `tailwindcss` version 4.x | ⬜ |
| `@tailwindcss/postcss` version 4.x | ⬜ |
| No peer dependency warnings | ⬜ |

### 2.2 No Unnecessary Dependencies

| Check | Status |
|-------|--------|
| No `autoprefixer` (included in Tailwind v4) | ⬜ |
| No `postcss` (peer dep, auto-installed) | ⬜ |
| No other CSS-related packages added | ⬜ |

---

## 3. Configuration Validation

### 3.1 PostCSS Configuration

```bash
# Validate config loads without error
node -e "import('./postcss.config.mjs')"
```

| Check | Status |
|-------|--------|
| Config file exists | ⬜ |
| Uses ES modules (`export default`) | ⬜ |
| Has `@tailwindcss/postcss` plugin | ⬜ |
| No other plugins (minimal config) | ⬜ |

### 3.2 Global CSS

```bash
# Check Tailwind import
grep '@import "tailwindcss"' src/app/globals.css
```

| Check | Status |
|-------|--------|
| File exists at `src/app/globals.css` | ⬜ |
| Uses `@import "tailwindcss"` (v4 syntax) | ⬜ |
| NOT using `@tailwind base/components/utilities` | ⬜ |
| Has `@layer base` section | ⬜ |
| Has `:focus-visible` styling | ⬜ |

### 3.3 Layout Integration

```bash
# Check import
grep "globals.css" src/app/[locale]/layout.tsx
```

| Check | Status |
|-------|--------|
| Import statement exists | ⬜ |
| Uses path alias `@/app/globals.css` | ⬜ |
| Import is at top of file | ⬜ |

---

## 4. Build Verification

### 4.1 Build Success

```bash
# Clean build
rm -rf .next && pnpm build
```

| Check | Status |
|-------|--------|
| Build completes without errors | ⬜ |
| No CSS compilation errors | ⬜ |
| No PostCSS warnings | ⬜ |
| Build time reasonable (<2 min) | ⬜ |

### 4.2 Lint Check

```bash
pnpm lint
```

| Check | Status |
|-------|--------|
| No linting errors | ⬜ |
| No new warnings introduced | ⬜ |

### 4.3 Type Check

```bash
pnpm exec tsc --noEmit
```

| Check | Status |
|-------|--------|
| No TypeScript errors | ⬜ |

---

## 5. Runtime Verification

### 5.1 Dev Server

```bash
pnpm dev
```

| Check | Status |
|-------|--------|
| Dev server starts | ⬜ |
| No startup errors | ⬜ |
| Hot reload works | ⬜ |

### 5.2 Page Load

| URL | Status | Notes |
|-----|--------|-------|
| `http://localhost:3000/` | ⬜ | Redirects to /fr or /en |
| `http://localhost:3000/fr` | ⬜ | Page loads |
| `http://localhost:3000/en` | ⬜ | Page loads |

### 5.3 Browser Console

| Check | Status |
|-------|--------|
| No CSS-related errors | ⬜ |
| No PostCSS errors | ⬜ |
| No module errors | ⬜ |

---

## 6. Tailwind Functionality

### 6.1 Utility Classes Work

Add temporary test to verify (then remove):

```tsx
// In page.tsx
<div className="bg-blue-500 text-white p-4 rounded m-4">
  Tailwind Test
</div>
```

| Check | Status |
|-------|--------|
| Background color applies | ⬜ |
| Text color applies | ⬜ |
| Padding applies | ⬜ |
| Border radius applies | ⬜ |
| Margin applies | ⬜ |

### 6.2 Base Styles Applied

| Check | Status |
|-------|--------|
| `box-sizing: border-box` on all elements | ⬜ |
| Body margin reset (0) | ⬜ |
| Images responsive by default | ⬜ |
| Focus visible has outline | ⬜ |

---

## 7. Regression Testing

### 7.1 Admin Panel

Navigate to `http://localhost:3000/admin`:

| Check | Status |
|-------|--------|
| Login page renders | ⬜ |
| Payload UI looks normal | ⬜ |
| No style conflicts | ⬜ |
| Admin CSS unchanged | ⬜ |

### 7.2 i18n Functionality

| Check | Status |
|-------|--------|
| Locale detection works | ⬜ |
| `/fr` shows French content | ⬜ |
| `/en` shows English content | ⬜ |
| Cookie persistence works | ⬜ |

### 7.3 Existing Features

| Check | Status |
|-------|--------|
| Homepage renders | ⬜ |
| Links work | ⬜ |
| Images load | ⬜ |

---

## 8. Code Quality

### 8.1 No Dead Code

```bash
pnpm knip
```

| Check | Status |
|-------|--------|
| No unused dependencies | ⬜ |
| No unused exports | ⬜ |

### 8.2 Commit Quality

| Check | Status |
|-------|--------|
| Commits are atomic | ⬜ |
| Commit messages follow convention | ⬜ |
| No unrelated changes | ⬜ |

---

## 9. Documentation

### 9.1 Phase Documentation Complete

| Document | Status |
|----------|--------|
| INDEX.md reviewed | ⬜ |
| IMPLEMENTATION_PLAN.md followed | ⬜ |
| COMMIT_CHECKLIST.md completed | ⬜ |
| ENVIRONMENT_SETUP.md accurate | ⬜ |
| guides/REVIEW.md ready | ⬜ |
| guides/TESTING.md executed | ⬜ |
| This checklist completed | ⬜ |

---

## 10. Final Approval

### Summary

| Category | Passed | Failed | Skipped |
|----------|--------|--------|---------|
| Implementation | /3 | | |
| Dependencies | /3 | | |
| Configuration | /8 | | |
| Build | /4 | | |
| Runtime | /6 | | |
| Tailwind | /6 | | |
| Regression | /7 | | |
| Quality | /3 | | |
| Documentation | /7 | | |
| **Total** | /47 | | |

### Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Implementer | | | ⬜ |
| Reviewer | | | ⬜ |

### Decision

- [ ] **APPROVED**: All checks pass, proceed to Phase 2
- [ ] **BLOCKED**: Critical issues found (list below)
- [ ] **CONDITIONAL**: Minor issues, can proceed with fixes

### Issues Found (if any)

| Issue | Severity | Resolution |
|-------|----------|------------|
| | | |

---

## Post-Validation Actions

### If Approved

1. ✅ Update EPIC_TRACKING.md:
   ```markdown
   | 3.2 | ... | IN PROGRESS | 4 | 1/4 (Phase 2 📋) |
   ```

2. ✅ Update PHASES_PLAN.md:
   ```markdown
   - [x] Phase 1: Tailwind Foundation - ✅ COMPLETED
   ```

3. ✅ Proceed to Phase 2:
   - Generate Phase 2 documentation
   - Or use `/generate-phase-doc Epic 3 Story 3.2 Phase 2`

### If Blocked

1. Document all failing items
2. Create fix commits
3. Re-run validation
4. Do not proceed until all critical items pass

---

**Validation Completed**: _________________ (Date)
**Phase Status**: ⬜ PENDING | ⬜ IN PROGRESS | ⬜ COMPLETED | ⬜ BLOCKED
